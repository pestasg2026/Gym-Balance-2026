
import { BalanceConfig } from './types';

export const BALANCE_ACTIVITIES: BalanceConfig[] = [
  {
    id: 'one-point',
    title: 'One Point Balance',
    description: 'Balance on one limb and hold your pose.',
    icon: '🦶',
    poses: [
      { text: "Pose 1: Balance on one leg for 3s. Any position." },
      { text: "Pose 2: Try a DIFFERENT leg or arm position for 3s." },
      { text: "Pose 3: Final variation! Change your base or arm height." }
    ]
  },
  {
    id: 'two-point',
    title: 'Two Point Balance',
    description: 'Balance using two contact points.',
    icon: '👐',
    poses: [
      { text: "Pose 1: Balance on TWO POINTS for 3s." },
      { text: "Pose 2: Change limbs! (e.g., opposite hand and foot)." },
      { text: "Pose 3: Final challenge! Find a new way to balance on two points." }
    ]
  },
  {
    id: 'three-point',
    title: 'Three Point Balance',
    description: 'Balance on any three limbs for control and stability.',
    icon: '🤸',
    poses: [
      { text: "Pose 1: Balance on EXACTLY THREE POINTS for 3s." },
      { text: "Pose 2: Swap one limb! Keep your core tight." },
      { text: "Pose 3: Final three-point hold. Stay perfectly still." }
    ]
  },
  {
    id: 'four-point',
    title: 'Four Point Balance',
    description: 'Balance using any four parts — hands, knees, or feet.',
    icon: '💪',
    poses: [
      { text: "Pose 1: Standard four-point balance (hands and feet)." },
      { text: "Pose 2: Lower to knees or elbows for a new variant." },
      { text: "Pose 3: Reach one limb out slightly while maintaining 4 points." }
    ]
  },
  {
    id: 'airplane',
    title: 'Airplane Pose',
    description: 'Lean forward and stretch your arms for perfect control.',
    icon: '✈️',
    poses: [
      { text: "Tilt forward, lift leg back, and extend arms." },
      { text: "Try it again on your OTHER leg for symmetry." },
      { text: "Final Airplane: Hold with your eyes focused on a spot." }
    ]
  },
  {
    id: 'flamingo',
    title: 'Flamingo Stand',
    description: 'Stand tall on one leg with grace and balance.',
    icon: '🦩',
    poses: [
      { text: "Lift one leg, knee at 90 degrees, and stand tall." },
      { text: "Switch legs! Maintain high posture and tight core." },
      { text: "Final Flamingo: Reach arms up while holding the leg lift." }
    ]
  },
  {
    id: 'knee-hug',
    title: 'Knee Hug Balance',
    description: 'Lift one knee up and hug it close while maintaining stability.',
    icon: '🧍‍♀️',
    poses: [
      { text: "Lift one knee up and hug it close to your chest." },
      { text: "Switch legs! Keep your standing knee slightly soft." },
      { text: "Final Hug: Hold steady with a deep breath and flat back." }
    ]
  }
];
