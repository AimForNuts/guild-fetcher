export interface WoodcuttingState {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  isCutting: boolean;
  unlockedAdvanced: boolean;
}

export type LogType = 'basic' | 'advanced';

export const XP_PER_LEVEL = 50;
export const MAX_LEVEL = 10;
export const XP_PER_TICK = 100;
export const TICK_INTERVAL = 1000; // 5 seconds in milliseconds
export const ADVANCED_LOG_UNLOCK_LEVEL = 10; 