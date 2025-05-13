import React from 'react';
import { useWoodcutting } from './useWoodcutting';
import Notifications, { NotificationType } from '../../components/Notifications/Notifications';
import './Woodcutting.css';

const Woodcutting: React.FC = () => {
  const { state, progress, toggleCutting, selectLog, showMaxLevelMessage, setShowMaxLevelMessage } = useWoodcutting();

  const notifications = showMaxLevelMessage ? [{
    id: 'max-level',
    message: 'Action could not be completed',
    type: 'error' as NotificationType
  }] : [];

  return (
    <div className="woodcutting-tab">
      <h1>Woodcutting</h1>
      
      <div className="woodcutting-content">
        <div className="info-section">
          <div className="logs-section">
            <h3>Available Logs</h3>
            <div className="log-options">
              <div 
                className={`log-option ${state.selectedLog === 'basic' ? 'selected' : ''}`}
                onClick={() => selectLog('basic')}
              >
                <h4>Basic Log</h4>
                <p>Always available</p>
                <span className="xp-info">+10 XP</span>
              </div>
              
              <div 
                className={`log-option ${state.selectedLog === 'advanced' ? 'selected' : ''} ${!state.unlockedAdvanced ? 'locked' : ''}`}
                onClick={() => selectLog('advanced')}
              >
                <h4>Advanced Log</h4>
                <p>Unlocked at level 10</p>
                <span className="xp-info">+20 XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <button 
            className={`cut-button ${state.isCutting ? 'active' : ''}`}
            onClick={toggleCutting}
          >
            {state.isCutting ? 'Stop Cutting' : 'Start Cutting'}
          </button>
          <div className="level-info">
            <h2>Level {state.level}</h2>
            <p>XP: {state.currentXp} / {state.xpToNextLevel}</p>
          </div>
        </div>
      </div>

      <Notifications 
        notifications={notifications}
        onDismiss={() => setShowMaxLevelMessage(false)}
      />
    </div>
  );
};

export default Woodcutting; 