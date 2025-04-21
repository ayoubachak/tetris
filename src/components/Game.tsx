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
    <div className="game-container relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - score and controls (desktop only) */}
        <div className="hidden lg:flex flex-col justify-between gap-6">
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
        <div className="lg:col-span-1 flex items-center justify-center">
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
        <div className="hidden lg:block game-card h-fit">
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
      
      {/* Mobile Controls - only visible on small screens */}
      <MobileControls />
    </div>
  );
};

export default Game;