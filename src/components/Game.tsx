import React, { useEffect, useState } from 'react';
import { useGame } from '../contexts/GameContext';
import NextPiece from './NextPiece';
import MobileControls from './MobileControls';

const Game: React.FC = () => {
  const { state, dispatch, renderGrid, settings, updateAISettings, toggleAI } = useGame();
  const { score, level, linesCleared, gameOver, isPaused, nextPiece, isAIActive } = state;
  const [showAIControls, setShowAIControls] = useState(false);
  const [leftTabActive, setLeftTabActive] = useState<'controls' | 'ai'>('controls');

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
    // If we're turning on AI, switch to the AI tab on desktop
    if (!isAIActive) {
      setLeftTabActive('ai');
    }
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
      <div className="w-full">
        {!isAIActive && (
          <button
            onClick={handleToggleAI}
            className="btn btn-primary w-full mb-4 text-sm"
          >
            Enable AI Player
          </button>
        )}
        
        {isAIActive && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">AI Controls</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">AI On</span>
                <button 
                  onClick={handleToggleAI}
                  className="relative inline-flex h-5 w-10 items-center rounded-full bg-green-600"
                >
                  <span className="inline-block h-3 w-3 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Move Delay</span>
                  <span>{settings.ai.moveDelay}ms</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={settings.ai.moveDelay}
                  onChange={(e) => handleAISettingChange('moveDelay', Number(e.target.value))}
                  className="w-full h-2"
                />
              </div>
              
              <div>
                <label className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Lines Cleared</span>
                  <span>{settings.ai.linesClearedWeight.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.ai.linesClearedWeight}
                  onChange={(e) => handleAISettingChange('linesClearedWeight', Number(e.target.value))}
                  className="w-full h-2"
                />
              </div>
              
              <div>
                <label className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Holes Penalty</span>
                  <span>{settings.ai.holesWeight.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.ai.holesWeight}
                  onChange={(e) => handleAISettingChange('holesWeight', Number(e.target.value))}
                  className="w-full h-2"
                />
              </div>
              
              <div>
                <label className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Height Penalty</span>
                  <span>{settings.ai.heightWeight.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.ai.heightWeight}
                  onChange={(e) => handleAISettingChange('heightWeight', Number(e.target.value))}
                  className="w-full h-2"
                />
              </div>
              
              <div>
                <label className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Bumpiness Penalty</span>
                  <span>{settings.ai.bumpinessWeight.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.ai.bumpinessWeight}
                  onChange={(e) => handleAISettingChange('bumpinessWeight', Number(e.target.value))}
                  className="w-full h-2"
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderControls = () => {
    return (
      <div className="w-full">
        <h2 className="text-lg font-bold mb-3 text-white">Controls</h2>
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
    );
  };

  return (
    <div className="game-container relative pb-24 md:pb-0">
      {/* Desktop layout - 3 column grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 items-center">
        {/* Left side - tabbed interface for controls/AI */}
        <div className="flex flex-col justify-between h-auto max-h-full overflow-hidden">
          <div className="game-card flex flex-col h-auto max-h-full">
            {/* Tab Selector */}
            <div className="flex mb-4 border-b border-gray-700">
              <button
                onClick={() => setLeftTabActive('controls')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  leftTabActive === 'controls'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Controls
              </button>
              <button
                onClick={() => setLeftTabActive('ai')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  leftTabActive === 'ai'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                AI Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-grow overflow-auto">
              {leftTabActive === 'controls' ? renderControls() : renderAIControls()}
            </div>
          </div>

          <div className="game-card mt-4">
            <h2 className="text-lg font-bold mb-2 text-white">Next Piece</h2>
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
            
            <button
              onClick={handleToggleAI}
              className={`btn col-span-2 mt-2 ${isAIActive ? 'btn-secondary' : 'btn-primary bg-green-600 hover:bg-green-700'}`}
            >
              {isAIActive ? 'Turn AI Off' : 'Turn AI On'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile & Tablet layout */}
      <div className="lg:hidden flex flex-col pb-40 items-center">
        {/* Mobile Stats Row at top */}
        <div className="w-full flex justify-between px-2 mb-2 bg-gray-800/80 py-2 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xs font-bold text-gray-400">LEVEL</div>
              <div className="font-bold text-lg">{level}</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-gray-400">SCORE</div>
              <div className="font-bold text-lg">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-gray-400">LINES</div>
              <div className="font-bold text-lg">{linesCleared}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-center flex flex-col items-center">
              <div className="text-xs font-bold mb-1 text-gray-400">NEXT</div>
              <div className="transform scale-75 origin-center">
                {nextPiece && <NextPiece piece={nextPiece} isMobile={true} />}
              </div>
            </div>
            
            {isAIActive && (
              <div className="flex items-center justify-center px-2">
                <div className="rounded-full bg-green-600 h-3 w-3 mr-1"></div>
                <span className="text-xs text-gray-200">AI</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Game Board */}
        <div className="relative w-full flex justify-center">
          <div className="tetris-board-container">
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
                  
                  <button
                    onClick={handleToggleAI}
                    className={`btn w-full mt-2 ${isAIActive ? 'btn-secondary' : 'btn-primary bg-green-600'}`}
                  >
                    {isAIActive ? 'Turn AI Off' : 'Turn AI On'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Game Controls */}
        <div className="w-full mt-2 px-2 flex justify-between">
          <button
            onClick={handleRestart}
            className="btn btn-primary btn-sm"
            aria-label="Restart Game"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={handlePauseResume}
            className="btn btn-secondary btn-sm"
            disabled={gameOver}
          >
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
          
          <button
            onClick={handleToggleAI}
            className={`btn btn-sm ${isAIActive ? 'btn-secondary bg-green-600' : 'btn-primary bg-green-600'}`}
          >
            {isAIActive ? 'AI: ON' : 'AI: OFF'}
          </button>
        </div>
        
        {/* AI Controls Panel (Collapsible) */}
        {isAIActive && (
          <div className="w-full px-2 mt-2">
            <button
              onClick={() => setShowAIControls(!showAIControls)}
              className="btn btn-secondary w-full mb-2 text-sm"
            >
              {showAIControls ? 'Hide AI Controls' : 'Show AI Controls'}
            </button>
            
            {showAIControls && (
              <div className="game-card w-full p-3">
                <div className="space-y-2">
                  <div>
                    <label className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Speed</span>
                      <span>{settings.ai.moveDelay}ms</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="50"
                      value={settings.ai.moveDelay}
                      onChange={(e) => handleAISettingChange('moveDelay', Number(e.target.value))}
                      className="w-full h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="flex justify-between text-xs text-gray-400">
                        <span>Lines</span>
                        <span>{settings.ai.linesClearedWeight.toFixed(1)}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={settings.ai.linesClearedWeight}
                        onChange={(e) => handleAISettingChange('linesClearedWeight', Number(e.target.value))}
                        className="w-full h-2"
                      />
                    </div>
                    <div>
                      <label className="flex justify-between text-xs text-gray-400">
                        <span>Holes</span>
                        <span>{settings.ai.holesWeight.toFixed(1)}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={settings.ai.holesWeight}
                        onChange={(e) => handleAISettingChange('holesWeight', Number(e.target.value))}
                        className="w-full h-2"
                      />
                    </div>
                    <div>
                      <label className="flex justify-between text-xs text-gray-400">
                        <span>Height</span>
                        <span>{settings.ai.heightWeight.toFixed(1)}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={settings.ai.heightWeight}
                        onChange={(e) => handleAISettingChange('heightWeight', Number(e.target.value))}
                        className="w-full h-2"
                      />
                    </div>
                    <div>
                      <label className="flex justify-between text-xs text-gray-400">
                        <span>Bumps</span>
                        <span>{settings.ai.bumpinessWeight.toFixed(1)}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={settings.ai.bumpinessWeight}
                        onChange={(e) => handleAISettingChange('bumpinessWeight', Number(e.target.value))}
                        className="w-full h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Mobile Controls */}
        {!isAIActive && (
          <MobileControls onPause={handlePauseResume} isPaused={isPaused} />
        )}
      </div>
    </div>
  );
};

export default Game;