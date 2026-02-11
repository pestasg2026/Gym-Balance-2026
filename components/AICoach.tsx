
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AICoachProps {
  activityTitle: string;
  isComplete: boolean;
}

const AICoach: React.FC<AICoachProps> = ({ activityTitle, isComplete }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getCoachFeedback = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an elite gymnastics coach. The athlete just completed a "${activityTitle}" balance session. 
        Provide a short (2-3 sentences), professional, and highly encouraging summary. 
        Focus on technical tips like core engagement, breathing, and visual focus (drilling). 
        Make it sound like a real coach in a gym.`,
        config: {
          temperature: 0.8,
          topP: 0.95,
        }
      });

      setFeedback(response.text || "Fantastic work today! Your stability is showing real improvement. Keep focusing on that core tension.");
    } catch (error) {
      console.error("AI Coach Error:", error);
      setFeedback("Great session! You're showing consistent progress in your balance and form. Remember to breathe through the holds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isComplete) {
      getCoachFeedback();
    }
  }, [isComplete]);

  if (!isComplete) return null;

  return (
    <div className="mt-6 bg-gradient-to-br from-[#1a1c23] to-[#111319] border border-[#3d7cff]/30 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#3d7cff] p-2 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.95-.684l2.647-8.223a1 1 0 00-.95-1.307H5.34a1 1 0 00-.95 1.307l2.647 8.223a1 1 0 00.95.684z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">Coach's Corner</h3>
      </div>
      
      {loading ? (
        <div className="flex space-x-2 py-4">
          <div className="w-2 h-2 bg-[#3d7cff] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#3d7cff] rounded-full animate-bounce [animation-delay:-.15s]"></div>
          <div className="w-2 h-2 bg-[#3d7cff] rounded-full animate-bounce [animation-delay:-.3s]"></div>
        </div>
      ) : (
        <p className="text-[#a7afc0] leading-relaxed italic text-sm">
          "{feedback}"
        </p>
      )}
      
      <div className="mt-4 pt-4 border-t border-[#1d2230] flex justify-between items-center">
        <span className="text-[10px] text-[#444] uppercase font-bold tracking-widest">Powered by Gemini Pro Vision</span>
        <button 
          onClick={getCoachFeedback}
          className="text-xs text-[#3d7cff] hover:underline"
        >
          Refresh Analysis
        </button>
      </div>
    </div>
  );
};

export default AICoach;
