import React, { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import NextPiece from './NextPiece';
import MobileControls from './MobileControls';

const Game: React.FC = () => {
  const { state, dispatch, renderGrid, settings } = useGame();
  const { score, level, linesCleared, gameOver, isPaused, nextPiece } = state;

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

  return (
    <div className="game-container relative pb-24 md:pb-0">
      {/* Desktop layout - 3 column grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {/* Left side - score and controls (desktop only) */}
        <div className="flex flex-col justify-between gap-6">
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
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fade-in">
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
          </div>
        </div>
      </div>
      
      {/* Mobile & Tablet layout */}
      <div className="lg:hidden pb-40">
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
              <button
                onClick={handleRestart}
                className="btn btn-primary btn-sm"
                aria-label="Restart Game"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Controls */}
        <MobileControls onPause={handlePauseResume} isPaused={isPaused} />
      </div>
    </div>
  );
};

export default Game;