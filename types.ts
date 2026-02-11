
export type BalanceType = 'one-point' | 'two-point' | 'three-point' | 'four-point' | 'airplane' | 'flamingo' | 'knee-hug';

export interface PoseDefinition {
  text: string;
  image?: string;
}

export interface BalanceConfig {
  id: BalanceType;
  title: string;
  description: string;
  icon: string;
  poses: PoseDefinition[];
}

export enum TrainerStage {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  DONE = 'done'
}
