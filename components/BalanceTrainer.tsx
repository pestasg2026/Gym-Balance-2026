
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BALANCE_ACTIVITIES } from '../constants';
import { BalanceType, TrainerStage } from '../types';
import AICoach from './AICoach';

const BalanceTrainer: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const activity = BALANCE_ACTIVITIES.find(a => a.id === type);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<TrainerStage>(TrainerStage.IDLE);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [instruction, setInstruction] = useState('Press Start to begin.');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showSuccessGlow, setShowSuccessGlow] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showStrengthAdvice, setShowStrengthAdvice] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const poseStartTimeRef = useRef<number | null>(null);
  const prevLandmarksRef = useRef<any[] | null>(null);
  const usedSupportSetsRef = useRef<string[]>([]);
  const cameraRef = useRef<any>(null);
  const poseModelRef = useRef<any>(null);

  const resetTimer = () => { 
    startTimeRef.current = null;
    setHoldProgress(0);
  };

  // 10-second timeout checker for redirection to Strength Lab
  useEffect(() => {
    let interval: number;
    if (stage === TrainerStage.RUNNING && !showSuccessGlow) {
      interval = window.setInterval(() => {
        if (poseStartTimeRef.current) {
          const timeElapsed = Date.now() - poseStartTimeRef.current;
          
          if (timeElapsed > 7000 && timeElapsed <= 10000) {
            setShowStrengthAdvice(true);
          }

          if (timeElapsed > 10000) {
            setFeedback("NEED MORE STRENGTH?");
            setStage(TrainerStage.PAUSED);
            
            setTimeout(() => {
              navigate('/strength');
            }, 1500);
          }
        }
      }, 500);
    } else {
      setShowStrengthAdvice(false);
    }
    return () => clearInterval(interval);
  }, [stage, showSuccessGlow, navigate]);

  // Auto-return to main screen after completion
  useEffect(() => {
    if (stage === TrainerStage.DONE) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 6000); // Shortened to 6s for better flow
      return () => clearTimeout(timer);
    }
  }, [stage, navigate]);

  const detectStillness = (landmarks: any[]) => {
    if (!prevLandmarksRef.current) {
      prevLandmarksRef.current = landmarks.map(l => ({ x: l.x, y: l.y }));
      return true;
    }
    let totalMove = 0;
    for (let i = 0; i < landmarks.length; i++) {
      const dx = landmarks[i].x - prevLandmarksRef.current[i].x;
      const dy = landmarks[i].y - prevLandmarksRef.current[i].y;
      totalMove += Math.sqrt(dx * dx + dy * dy);
    }
    prevLandmarksRef.current = landmarks.map(l => ({ x: l.x, y: l.y }));
    return totalMove < 0.15;
  };

  const getPoints = (lm: any) => ({
    LW: lm[15], RW: lm[16], LF: lm[31], RF: lm[32],
    LK: lm[25], RK: lm[26], LH: lm[23], RH: lm[24]
  });

  const checkPose = (lm: any, activityId: BalanceType): { ok: boolean; supports?: string[] } => {
    const pts = getPoints(lm);
    if (!pts.LF || !pts.RF) return { ok: false };

    switch (activityId) {
      case 'one-point': {
        const diff = Math.abs(pts.LF.y - pts.RF.y);
        return { ok: diff > 0.08 };
      }
      case 'two-point': {
        const supportPts = [pts.LW, pts.RW, pts.LF, pts.RF].filter(p => p).sort((a, b) => b.y - a.y);
        if (supportPts.length < 2) return { ok: false };
        const twoLow = Math.abs(supportPts[0].y - supportPts[1].y) < 0.08;
        const othersHigh = supportPts.length > 2 ? (supportPts[0].y - supportPts[2].y) > 0.10 : true;
        return { ok: twoLow && othersHigh };
      }
      case 'three-point': {
        const supportPts = [
            { id: 'LW', p: pts.LW }, { id: 'RW', p: pts.RW },
            { id: 'LF', p: pts.LF }, { id: 'RF', p: pts.RF }
        ].sort((a, b) => b.p.y - a.p.y);
        const threeLow = Math.abs(supportPts[0].p.y - supportPts[2].p.y) < 0.08;
        const fourthHigh = (supportPts[0].p.y - supportPts[3].p.y) > 0.10;
        if (threeLow && fourthHigh) {
          const supports = [supportPts[0].id, supportPts[1].id, supportPts[2].id].sort();
          return { ok: true, supports };
        }
        return { ok: false };
      }
      case 'airplane': {
        const head = lm[0];
        const isHorizontal = Math.abs(head.y - pts.LF.y) < 0.25;
        const tY = (pts.LH.y + pts.RH.y) / 2;
        return { ok: isHorizontal && Math.abs(head.y - tY) < 0.2 };
      }
      case 'flamingo': {
        const diff = Math.abs(pts.LF.y - pts.RF.y);
        return { ok: diff > 0.12 };
      }
      case 'knee-hug': {
        const liftLegKnee = pts.LF.y < pts.RF.y ? pts.LK : pts.RK;
        const liftLegHip = pts.LF.y < pts.RF.y ? pts.LH : pts.RH;
        return { ok: liftLegKnee.y < liftLegHip.y };
      }
      default:
        return { ok: true };
    }
  };

  const onResults = useCallback((results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (results.image) {
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    }

    if (!results.poseLandmarks) {
      setFeedback("Step into view");
      resetTimer();
      ctx.restore();
      return;
    }

    // @ts-ignore
    window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#3d7cff', lineWidth: 4 });
    // @ts-ignore
    window.drawLandmarks(ctx, results.poseLandmarks, { color: '#ffffff', radius: 2 });

    if (stage === TrainerStage.DONE || stage === TrainerStage.PAUSED) {
      ctx.restore();
      return;
    }

    const lm = results.poseLandmarks;
    const det = checkPose(lm, type as BalanceType);

    if (!det.ok) {
      resetTimer();
      setFeedback("Finding Pose...");
      ctx.restore();
      return;
    }

    if (!detectStillness(lm)) {
      setFeedback('STILLNESS REQUIRED');
      resetTimer();
      ctx.restore();
      return;
    }

    if (!startTimeRef.current) startTimeRef.current = Date.now();
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const progressPercent = Math.min((elapsed / 3) * 100, 100);
    setHoldProgress(progressPercent);

    if (elapsed >= 3) {
      const nextPoseIndex = currentPoseIndex + 1;
      if (activity && nextPoseIndex < activity.poses.length) {
        setStage(TrainerStage.PAUSED);
        setFeedback('MASTERED! TRY POSE ' + (nextPoseIndex + 1));
        setShowSuccessGlow(true);
        setTimeout(() => {
          setCurrentPoseIndex(nextPoseIndex);
          setInstruction(activity.poses[nextPoseIndex].text);
          setStage(TrainerStage.RUNNING);
          setShowSuccessGlow(false);
          setFeedback(null);
          resetTimer();
          poseStartTimeRef.current = Date.now(); 
        }, 2000);
      } else {
        setStage(TrainerStage.DONE);
        setFeedback('ALL POSES CLEARED!');
        setShowSuccessGlow(true);
      }
    } else {
      setFeedback(`HOLDING... ${Math.ceil(3 - elapsed)}s`);
    }
    ctx.restore();
  }, [stage, currentPoseIndex, activity, type]);

  const startExercise = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setStage(TrainerStage.RUNNING);
    resetTimer();
    poseStartTimeRef.current = Date.now();
    usedSupportSetsRef.current = [];
    setCurrentPoseIndex(0);

    if (!poseModelRef.current) {
      // @ts-ignore
      const pose = new window.Pose({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });
      pose.onResults(onResults);
      poseModelRef.current = pose;
    }

    if (!cameraRef.current) {
      // @ts-ignore
      cameraRef.current = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (poseModelRef.current) {
            await poseModelRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720
      });
      await cameraRef.current.start();
    }
  };

  const resetExercise = () => {
    setStage(TrainerStage.IDLE);
    setFeedback(null);
    setCurrentPoseIndex(0);
    resetTimer();
    poseStartTimeRef.current = null;
    setShowSuccessGlow(false);
    if (activity) setInstruction(activity.poses[0].text);
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
  };

  if (!activity) return <div className="p-12 text-center">Activity not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className={`relative aspect-video bg-[#050505] rounded-3xl overflow-hidden border-4 transition-all duration-700 ${showSuccessGlow ? 'border-[#2cbb5d] shadow-[0_0_80px_rgba(44,187,93,0.3)]' : 'border-[#1d2230]'}`}>
            <video ref={videoRef} className="hidden" playsInline muted></video>
            <canvas ref={canvasRef} className="w-full h-full object-cover grayscale-[0.2]"></canvas>
            
            {stage === TrainerStage.RUNNING && (
              <div className="absolute top-6 left-6 pointer-events-none">
                 <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className="text-[#3d7cff] font-bold mr-2">LIVE</span>
                    <span className="text-white/80 text-xs uppercase tracking-tighter">Pose Feedback</span>
                 </div>
              </div>
            )}

            {stage === TrainerStage.IDLE && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl z-20">
                <div className="text-center max-w-md px-8 mb-8">
                  <h2 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tighter">Master 3 Poses</h2>
                  <p className="text-[#a7afc0] text-lg">Position yourself in frame and hold each pose for 3 seconds.</p>
                </div>
                <button
                  onClick={startExercise}
                  className="group relative bg-[#3d7cff] text-white px-12 py-5 rounded-2xl font-black text-2xl shadow-[0_10px_40px_rgba(61,124,255,0.4)] transition-all hover:scale-105 active:scale-95"
                >
                  START SESSION
                </button>
              </div>
            )}

            {feedback && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 w-full px-4">
                <p className={`text-5xl lg:text-7xl font-black tracking-tighter italic uppercase text-center drop-shadow-[0_5px_15px_rgba(0,0,0,1)] ${feedback.includes('CLEARED') || feedback.includes('MASTERED') ? 'text-[#2cbb5d] animate-bounce' : feedback.includes('STRENGTH') || feedback.includes('STRUGGLE') ? 'text-[#ff4b4b] animate-pulse' : 'text-white/90 animate-pulse'}`}>
                  {feedback}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-[#111319] p-4 rounded-2xl border border-[#1d2230]">
            <button onClick={resetExercise} className="bg-[#222] text-white/80 px-6 py-3 rounded-xl font-bold hover:bg-[#333] transition-colors">
              RESET SESSION
            </button>
            <div className="h-8 w-[1px] bg-[#1d2230] mx-2 hidden sm:block"></div>
            <Link to="/" className="text-[#a7afc0] hover:text-white font-medium px-4">Dashboard</Link>
            <Link to="/strength" className="text-[#9254ff] hover:text-[#b085ff] font-medium px-4">Strength Training</Link>
          </div>
        </div>

        <div className="w-full xl:w-[400px] space-y-6">
          <div className="bg-[#111319] border border-[#1d2230] rounded-2xl p-8 relative overflow-hidden">
            <h3 className="text-[#3d7cff] text-xs font-black uppercase tracking-[0.2em] mb-4">Target Instruction</h3>
            <p className="text-2xl font-black leading-tight text-white italic">{instruction}</p>
            
            {showStrengthAdvice && (
              <div className="mt-6 p-4 bg-[#ff4b4b]/10 border border-[#ff4b4b]/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-500">
                <p className="text-[#ff4b4b] text-xs font-black uppercase tracking-widest mb-2">Stability Alert</p>
                <p className="text-sm text-white/90 leading-relaxed font-bold">
                  Struggling to hold? Let's build your base. Proposing Strength Lab session...
                </p>
                <p className="text-[10px] text-white/40 mt-2 uppercase">Moving to Lab in 1.5s</p>
              </div>
            )}

            <div className="mt-8 relative flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-[#1d2230] stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#3d7cff] stroke-current transition-all duration-300" strokeWidth="3" strokeDasharray={`${holdProgress}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                  {Math.round(holdProgress)}%
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Current Pose Hold</p>
                <div className="h-1 bg-[#1d2230] rounded-full overflow-hidden">
                   <div className="h-full bg-[#3d7cff] transition-all duration-300" style={{ width: `${holdProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111319] border border-[#1d2230] rounded-2xl p-8">
             <div className="flex justify-between items-end mb-6">
                <h3 className="text-[#a7afc0] text-xs font-black uppercase tracking-[0.2em]">Mastery Goal</h3>
                <span className="text-[#3d7cff] font-black text-xl">{currentPoseIndex + (stage === TrainerStage.DONE ? 1 : 0)} / 3</span>
             </div>
             <div className="flex gap-2 h-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${i < currentPoseIndex ? 'bg-[#2cbb5d]' : (i === currentPoseIndex && stage === TrainerStage.RUNNING) ? 'bg-[#3d7cff] animate-pulse' : 'bg-[#1d2230]'}`}></div>
                ))}
             </div>
          </div>

          <AICoach activityTitle={activity.title} isComplete={stage === TrainerStage.DONE} />

          {stage === TrainerStage.DONE && (
            <div className="bg-[#2cbb5d]/10 border border-[#2cbb5d]/30 rounded-2xl p-6 text-center animate-bounce">
               <p className="text-[#2cbb5d] font-black italic uppercase tracking-tighter">ALL 3 POSES ACCOMPLISHED!</p>
               <p className="text-xs text-[#a7afc0] mt-2">Returning to dashboard in 6s...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceTrainer;
