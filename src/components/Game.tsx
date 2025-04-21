import React, { useEffect, useState } from 'react';
import { useGame } from '../contexts/GameContext';
import NextPiece from './NextPiece';
import MobileControls from './MobileControls';

const Game: React.FC = () => {
  const { state, dispatch, renderGrid, settings, updateAISettings, toggleAI } = useGame();
  const { score, level, linesCleared, gameOver, isPaused, nextPiece, isAIActive } = state;
  const [showAIControls, setShowAIControls] = useState(false);

  const handleRestart = () => {
    dispatch({ type: 'RESTART', settings });
  };

  const handlePauseResume = () => {
    if (isPaused) {
      dispatch({ type: 'RESUME' });
    } else {
      dispatch({ type: 'PAUSE' });
    }
  };

  const handleToggleAI = () => {
    toggleAI(!isAIActive);
  };

  const handleAISettingChange = (setting: string, value: number) => {
    updateAISettings({ [setting]: value });
  };

  // Add stars to the background
  useEffect(() => {
    const container = document.querySelector('.game-container');
    if (container) {
      // Remove any existing stars
      document.querySelectorAll('.star').forEach(star => star.remove());
      
      // Add random stars
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(star);
      }
    }
  }, []);

  // Prevent arrow key scrolling
  useEffect(() => {
    const preventArrowScroll = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', preventArrowScroll);
    return () => window.removeEventListener('keydown', preventArrowScroll);
  }, []);

  // AI Controls Panel
  const renderAIControls = () => {
    return (
      <div className="game-card mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">AI Controls</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">AI {isAIActive ? 'On' : 'Off'}</span>
            <button 
              onClick={handleToggleAI}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAIActive ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAIActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Move Delay ({settings.ai.moveDelay}ms)
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={settings.ai.moveDelay}
              onChange={(e) => handleAISettingChange('moveDelay', Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Lines Cleared Weight ({settings.ai.linesClearedWeight.toFixed(1)})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.ai.linesClearedWeight}
              onChange={(e) => handleAISettingChange('linesClearedWeight', Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Holes Weight ({settings.ai.holesWeight.toFixed(1)})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.ai.holesWeight}
              onChange={(e) => handleAISettingChange('holesWeight', Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Height Weight ({settings.ai.heightWeight.toFixed(1)})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.ai.heightWeight}
              onChange={(e) => handleAISettingChange('heightWeight', Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Bumpiness Weight ({settings.ai.bumpinessWeight.toFixed(1)})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.ai.bumpinessWeight}
              onChange={(e) => handleAISettingChange('bumpinessWeight', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="game-container relative pb-24 md:pb-0">
      {/* Desktop layout - 3 column grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {/* Left side - score and controls (desktop only) */}
        <div className="flex flex-col justify-between gap-6">
          <div>
            {isAIActive && renderAIControls()}
            
            <div className="game-card">
              <h2 className="text-xl font-bold mb-4 text-white">Controls</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Move Left:</div>
                <div className="font-medium">←</div>
                <div className="text-gray-400">Move Right:</div>
                <div className="font-medium">→</div>
                <div className="text-gray-400">Rotate:</div>
                <div className="font-medium">↑</div>
                <div className="text-gray-400">Soft Drop:</div>
                <div className="font-medium">↓</div>
                <div className="text-gray-400">Hard Drop:</div>
                <div className="font-medium">Space</div>
                <div className="text-gray-400">Pause:</div>
                <div className="font-medium">Esc</div>
              </div>
            </div>
          </div>

          <div className="game-card">
            <h2 className="text-xl font-bold mb-2 text-white">Next Piece</h2>
            <div className="transform transition-transform duration-300 animate-float">
              {nextPiece && <NextPiece piece={nextPiece} />}
            </div>
          </div>
        </div>

        {/* Center - game board */}
        <div className="flex items-center justify-center">
          <div className="relative transform transition-transform duration-500">
            <div className="tetris-board-container">
              {renderGrid(settings.showGhostPiece)}
            </div>
            
            {(gameOver || isPaused) && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fade-in z-50">
                <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-blue-500/50">
                  <h2 className="text-2xl font-bold mb-4">
                    {gameOver ? 'GAME OVER' : 'PAUSED'}
                  </h2>
                  {gameOver ? (
                    <button
                      onClick={handleRestart}
                      className="btn btn-primary w-full"
                    >
                      PLAY AGAIN
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseResume}
                      className="btn btn-primary w-full"
                    >
                      RESUME
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - stats (desktop only) */}
        <div className="game-card h-fit">
          <h2 className="text-xl font-bold mb-4 text-white">STATS</h2>
          <div className="grid grid-cols-2 gap-y-6 my-4">
            <div className="text-gray-400">SCORE:</div>
            <div className="font-bold text-right text-white">{score}</div>
            <div className="text-gray-400">LEVEL:</div>
            <div className="font-bold text-right text-white animate-pulse">{level}</div>
            <div className="text-gray-400">LINES:</div>
            <div className="font-bold text-right text-white">{linesCleared}</div>
            {isAIActive && (
              <>
                <div className="text-gray-400">AI:</div>
                <div className="font-bold text-right text-green-400">ACTIVE</div>
              </>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handlePauseResume}
              className="btn btn-secondary"
              disabled={gameOver}
            >
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
            <button
              onClick={handleRestart}
              className="btn btn-primary"
            >
              RESTART
            </button>
            
            {isAIActive && (
              <button
                onClick={handleToggleAI}
                className="btn btn-secondary col-span-2 mt-2"
              >
                Turn AI Off
              </button>
            )}
            
            {!isAIActive && (
              <button
                onClick={handleToggleAI}
                className="btn btn-secondary col-span-2 mt-2"
              >
                Turn AI On
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile & Tablet layout */}
      <div className="lg:hidden pb-40">
        {isAIActive && (
          <div className="mb-4 mx-2">
            <button
              onClick={() => setShowAIControls(!showAIControls)}
              className="btn btn-secondary w-full mb-2"
            >
              {showAIControls ? 'Hide AI Controls' : 'Show AI Controls'}
            </button>
            
            {showAIControls && renderAIControls()}
          </div>
        )}
        
        <div className="mobile-game-layout mb-2">
          {/* Left Stats */}
          <div className="mobile-side-panel">
            <div className="flex flex-col items-center">
              <div className="text-center mb-1">
                <div className="text-xs font-bold text-gray-400">LEVEL</div>
                <div className="font-bold text-xl animate-pulse">{level}</div>
              </div>
              <div className="text-center mb-1">
                <div className="text-xs font-bold text-gray-400">SCORE</div>
                <div className="font-bold text-lg">{score}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-400">LINES</div>
                <div className="font-bold text-lg">{linesCleared}</div>
              </div>
              {isAIActive && (
                <div className="text-center mt-1">
                  <div className="text-xs font-bold text-green-400">AI</div>
                </div>
              )}
            </div>
          </div>

          {/* Game Board */}
          <div className="mobile-board-container">
            <div className="relative tetris-board-container">
              {renderGrid(settings.showGhostPiece)}
              
              {(gameOver || isPaused) && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fade-in z-50">
                  <div className="text-center p-4 bg-gray-800 rounded-lg shadow-lg transform transition-all duration-300 border-2 border-blue-500/50">
                    <h2 className="text-xl font-bold mb-3">
                      {gameOver ? 'GAME OVER' : 'PAUSED'}
                    </h2>
                    {gameOver ? (
                      <button
                        onClick={handleRestart}
                        className="btn btn-primary w-full"
                      >
                        PLAY AGAIN
                      </button>
                    ) : (
                      <button
                        onClick={handlePauseResume}
                        className="btn btn-primary w-full"
                      >
                        RESUME
                      </button>
                    )}
                    
                    {isAIActive && !gameOver && (
                      <button
                        onClick={handleToggleAI}
                        className="btn btn-secondary w-full mt-2"
                      >
                        Turn AI Off
                      </button>
                    )}
                    
                    {!isAIActive && !gameOver && (
                      <button
                        onClick={handleToggleAI}
                        className="btn btn-secondary w-full mt-2"
                      >
                        Turn AI On
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Next Piece */}
          <div className="mobile-side-panel">
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold mb-1 text-center text-gray-400">NEXT</div>
              <div className="transform scale-75 origin-center mb-2">
                {nextPiece && <NextPiece piece={nextPiece} isMobile={true} />}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRestart}
                  className="btn btn-primary btn-sm"
                  aria-label="Restart Game"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                  </svg>
                </button>
                {isAIActive ? (
                  <button
                    onClick={handleToggleAI}
                    className="btn btn-secondary btn-sm bg-green-600"
                    aria-label="Turn AI Off"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.75 4.5A2.25 2.25 0 0 0 16.5 2.25h-9A2.25 2.25 0 0 0 5.25 4.5v15A2.25 2.25 0 0 0 7.5 21.75h9a2.25 2.25 0 0 0 2.25-2.25v-15Z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleToggleAI}
                    className="btn btn-secondary btn-sm"
                    aria-label="Turn AI On"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Controls */}
        {!isAIActive && (
          <MobileControls onPause={handlePauseResume} isPaused={isPaused} />
        )}
      </div>
    </div>
  );
};

export default Game;