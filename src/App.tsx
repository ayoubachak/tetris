import React, { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import Game from './components/Game';
import MainMenu from './components/MainMenu';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'menu' | 'game'>('menu');

  return (
    <GameProvider>
      <div className="min-h-screen bg-slate-900 text-white">
        {currentView === 'menu' ? (
          <MainMenu onStartGame={() => setCurrentView('game')} />
        ) : (
          <div className="flex flex-col min-h-screen">
            <header className="py-4 px-6 bg-gray-800 shadow-lg">
              <div className="flex justify-between items-center max-w-screen-lg mx-auto">
                <h1 className="text-2xl font-bold">
                  <span className="text-tetris-i">T</span>
                  <span className="text-tetris-j">E</span>
                  <span className="text-tetris-l">T</span>
                  <span className="text-tetris-o">R</span>
                  <span className="text-tetris-s">I</span>
                  <span className="text-tetris-t">S</span>
                </h1>
                <button 
                  onClick={() => setCurrentView('menu')} 
                  className="btn btn-secondary"
                >
                  Main Menu
                </button>
              </div>
            </header>

            <main className="flex-grow py-6">
              <Game />
            </main>

            <footer className="py-4 text-center text-gray-500 text-sm">
              <p>Tetris © 2024 | Arrow keys to move, Space to hard drop</p>
            </footer>
          </div>
        )}
      </div>
    </GameProvider>
  );
};

export default App;
