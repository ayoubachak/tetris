import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import HighScores from './HighScores';
import Settings from './Settings';

type MenuView = 'main' | 'highScores' | 'settings';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const { dispatch, settings, updateSettings } = useGame();
  const [view, setView] = useState<MenuView>('main');
  const [startLevel, setStartLevel] = useState(settings.startLevel);
  const [showGhost, setShowGhost] = useState(settings.showGhostPiece);
  
  // Add stars to the background
  useEffect(() => {
    const container = document.querySelector('.game-container');
    if (container) {
      // Remove any existing stars
      document.querySelectorAll('.star').forEach(star => star.remove());
      
      // Add random stars
      for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(star);
      }
    }
  }, [view]);
  
  const handleStartGame = () => {
    // Update settings with selected options
    updateSettings({
      startLevel,
      showGhostPiece: showGhost
    });
    
    // Start a new game with these settings
    dispatch({
      type: 'NEW_GAME',
      settings: {
        ...settings,
        startLevel,
        showGhostPiece: showGhost
      }
    });
    
    // Switch to game view
    onStartGame();
  };
  
  // Render the main menu screen
  if (view === 'main') {
    return (
      <div className="game-container h-screen flex items-center justify-center">
        <div className="game-card max-w-md w-full p-8">
          <h1 className="text-5xl font-bold text-center mb-12">
            <span className="text-tetris-i hover:animate-bounce inline-block transition-transform">T</span>
            <span className="text-tetris-j hover:animate-bounce inline-block transition-transform" style={{ animationDelay: '0.1s' }}>E</span>
            <span className="text-tetris-l hover:animate-bounce inline-block transition-transform" style={{ animationDelay: '0.2s' }}>T</span>
            <span className="text-tetris-o hover:animate-bounce inline-block transition-transform" style={{ animationDelay: '0.3s' }}>R</span>
            <span className="text-tetris-s hover:animate-bounce inline-block transition-transform" style={{ animationDelay: '0.4s' }}>I</span>
            <span className="text-tetris-t hover:animate-bounce inline-block transition-transform" style={{ animationDelay: '0.5s' }}>S</span>
            <span className="text-tetris-z hover:animate-bounce inline-block transition-transform" style={{ animationDelay: '0.6s' }}>!</span>
          </h1>
          
          <div className="mb-8 transform transition-all duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold mb-3">GAME OPTIONS</h2>
            <div className="flex flex-col gap-6 p-4 bg-gray-900/90 rounded shadow-inner">
              <div>
                <label className="block text-sm text-gray-400 mb-2">STARTING LEVEL (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={startLevel}
                  onChange={(e) => setStartLevel(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="text-right text-lg text-blue-400 font-bold mt-2">{startLevel}</div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ghostPiece"
                  checked={showGhost}
                  onChange={() => setShowGhost(!showGhost)}
                  className="mr-3 accent-blue-500 w-5 h-5"
                />
                <label htmlFor="ghostPiece" className="cursor-pointer select-none">SHOW GHOST PIECE</label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleStartGame} 
              className="btn btn-primary w-full transform transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
              START GAME
            </button>
            <button 
              onClick={() => setView('highScores')} 
              className="btn btn-secondary w-full transform transition-all duration-300 hover:scale-105"
            >
              HIGH SCORES
            </button>
            <button 
              onClick={() => setView('settings')} 
              className="btn btn-secondary w-full transform transition-all duration-300 hover:scale-105"
            >
              SETTINGS
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render other views
  if (view === 'highScores') {
    return <HighScores onBack={() => setView('main')} />;
  }
  
  if (view === 'settings') {
    return <Settings onBack={() => setView('main')} />;
  }
  
  return null;
};

export default MainMenu; 