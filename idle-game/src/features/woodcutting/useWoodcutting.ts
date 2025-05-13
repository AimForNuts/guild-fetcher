import { useState, useEffect, useCallback } from 'react';

const TICK_INTERVAL = 5000; // 5 seconds
const MAX_LEVEL = 20;
const XP_PER_LEVEL = 50;

type LogType = 'basic' | 'advanced';

interface WoodcuttingState {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  isCutting: boolean;
  unlockedAdvanced: boolean;
  selectedLog: LogType;
}

export const useWoodcutting = () => {
  const [state, setState] = useState<WoodcuttingState>({
    level: 1,
    currentXp: 0,
    xpToNextLevel: XP_PER_LEVEL,
    isCutting: false,
    unlockedAdvanced: false,
    selectedLog: 'basic'
  });

  const [showMaxLevelMessage, setShowMaxLevelMessage] = useState(false);
  const [progress, setProgress] = useState(0);

  const getXpForLogType = (logType: LogType) => {
    return logType === 'basic' ? 10 : 20;
  };

  const updateXp = useCallback(() => {
    if (state.level >= MAX_LEVEL) {
      setState(prev => ({ ...prev, isCutting: false }));
      setShowMaxLevelMessage(true);
      return;
    }

    const xpGain = getXpForLogType(state.selectedLog);
    const newXp = state.currentXp + xpGain;
    
    if (newXp >= state.xpToNextLevel) {
      // Level up
      const newLevel = state.level + 1;
      setState(prev => ({
        ...prev,
        level: newLevel,
        currentXp: newXp - prev.xpToNextLevel,
        xpToNextLevel: XP_PER_LEVEL * newLevel,
        unlockedAdvanced: newLevel >= 10 || prev.unlockedAdvanced
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentXp: newXp
      }));
    }
  }, [state]);

  useEffect(() => {
    let progressInterval: number;
    let xpInterval: number;

    if (state.isCutting && state.level < MAX_LEVEL) {
      // Progress bar update
      let currentProgress = 0;
      progressInterval = window.setInterval(() => {
        currentProgress = (currentProgress + 1) % 100;
        setProgress(currentProgress);
        if (currentProgress === 99) {
          updateXp();
        }
      }, TICK_INTERVAL / 100);
    } else {
      setProgress(0);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (xpInterval) clearInterval(xpInterval);
    };
  }, [state.isCutting, state.level, updateXp]);

  const toggleCutting = () => {
    setState(prev => ({ ...prev, isCutting: !prev.isCutting }));
  };

  const selectLog = (logType: LogType) => {
    if (logType === 'advanced' && !state.unlockedAdvanced) {
      return;
    }
    setState(prev => ({ ...prev, selectedLog: logType }));
  };

  return {
    state,
    progress,
    toggleCutting,
    selectLog,
    showMaxLevelMessage,
    setShowMaxLevelMessage
  };
}; 