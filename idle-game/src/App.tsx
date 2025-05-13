import { useState } from 'react'
import './App.css'
import Character from './features/character/Character'
import Woodcutting from './features/woodcutting/Woodcutting'
import { TabType } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('character')

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Idle Game</h2>
        <nav>
          <button 
            className={activeTab === 'character' ? 'active' : ''}
            onClick={() => setActiveTab('character')}
          >
            Character
          </button>
          <button 
            className={activeTab === 'woodcutting' ? 'active' : ''}
            onClick={() => setActiveTab('woodcutting')}
          >
            Woodcutting
          </button>
        </nav>
      </div>
      <div className="main-content">
        {activeTab === 'character' && <Character />}
        {activeTab === 'woodcutting' && <Woodcutting />}
      </div>
    </div>
  )
}

export default App
