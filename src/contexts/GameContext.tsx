import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, GameAction, GameSettings } from '../types/tetris.types';
import GameService from '../services/game.service';
import StorageService from '../services/storage.service';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  renderGrid: (showGhost: boolean) => React.ReactElement;
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
}

// Create the context with undefined as default value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Game reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE_LEFT':
      if (state.gameOver || state.isPaused) return state;
      return GameService.moveLeft(state);
      
    case 'MOVE_RIGHT':
      if (state.gameOver || state.isPaused) return state;
      return GameService.moveRight(state);
      
    case 'ROTATE':
      if (state.gameOver || state.isPaused) return state;
      return GameService.rotate(state);
      
    case 'SOFT_DROP':
      if (state.gameOver || state.isPaused) return state;
      return GameService.moveDown(state);
      
    case 'HARD_DROP':
      if (state.gameOver || state.isPaused) return state;
      return GameService.hardDrop(state);
      
    case 'TICK':
      if (state.gameOver || state.isPaused) return state;
      return GameService.moveDown(state);
      
    case 'GAME_OVER':
      // Save the score
      if (!state.gameOver) {
        StorageService.saveHighScore(
          state.score,
          state.level,
          state.linesCleared
        );
      }
      return { ...state, gameOver: true };
      
    case 'PAUSE':
      return { ...state, isPaused: true };
      
    case 'RESUME':
      return { ...state, isPaused: false };
      
    case 'RESTART':
    case 'NEW_GAME':
      return GameService.createInitialState(action.settings);
      
    default:
      return state;
  }
}

interface GameProviderProps {
  children: React.ReactNode;
}

// Provider component for the game context
export function GameProvider({ children }: GameProviderProps) {
  // Get settings from storage
  const [settings, setSettings] = React.useState<GameSettings>(
    StorageService.getSettings()
  );
  
  // Initialize game state
  const [state, dispatch] = useReducer(
    gameReducer,
    GameService.createInitialState(settings)
  );
  
  // Update game settings
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      StorageService.saveSettings(updated);
      return updated;
    });
  }, []);
  
  // Apply theme class on root element
  useEffect(() => {
    const root = document.documentElement;
    // Remove any previous theme classes
    ['theme-space','theme-desert','theme-nature','theme-city','theme-sea'].forEach(c => root.classList.remove(c));
    // Add current theme class
    root.classList.add(`theme-${settings.theme}`);
  }, [settings.theme]);

  // Handle keyboard input
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (state.gameOver) return;
      
      const { controls } = settings;
      
      switch (event.code) {
        case controls.moveLeft:
          dispatch({ type: 'MOVE_LEFT' });
          break;
        case controls.moveRight:
          dispatch({ type: 'MOVE_RIGHT' });
          break;
        case controls.rotate:
          dispatch({ type: 'ROTATE' });
          break;
        case controls.softDrop:
          dispatch({ type: 'SOFT_DROP' });
          break;
        case controls.hardDrop:
          dispatch({ type: 'HARD_DROP' });
          break;
        case controls.pause:
          if (state.isPaused) {
            dispatch({ type: 'RESUME' });
          } else {
            dispatch({ type: 'PAUSE' });
          }
          break;
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.gameOver, state.isPaused, settings]);
  
  // Game loop
  useEffect(() => {
    if (state.gameOver || state.isPaused) return;
    
    // Calculate drop interval based on level
    const dropSpeed = GameService.calculateDropSpeed(state.level, settings.dropSpeed);
    const interval = Math.max(100, 1000 - (state.level - 1) * 100 * dropSpeed);
    
    const gameLoop = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, interval);
    
    return () => {
      clearInterval(gameLoop);
    };
  }, [state.level, state.gameOver, state.isPaused, settings.dropSpeed]);
  
  // Check for game over
  useEffect(() => {
    if (state.gameOver) {
      // Record high score
      StorageService.saveHighScore(
        state.score,
        state.level,
        state.linesCleared
      );
    }
  }, [state.gameOver, state.score, state.level, state.linesCleared]);
  
  // Render the game grid with current piece and optionally ghost piece
  const renderGrid = useCallback((showGhost: boolean) => {
    // Start from the empty grid
    let baseGrid = state.grid.map(row => [...row]);
    // Add ghost piece under the current piece if enabled
    if (state.currentPiece && showGhost && !state.gameOver) {
      baseGrid = GameService.addGhostPiece(state.grid, state.currentPiece);
    }
    // Project the real tetromino on top
    const displayGrid = state.currentPiece
      ? GameService.projectTetrominoOnGrid(baseGrid, state.currentPiece)
      : baseGrid;

    // Group the current piece's cells to animate them together
    const currentPieceCells = new Set<string>();
    if (state.currentPiece) {
      state.currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const gridY = state.currentPiece!.position.y + y;
            const gridX = state.currentPiece!.position.x + x;
            currentPieceCells.add(`${gridY}-${gridX}`);
          }
        });
      });
    }
    
    // Render the grid
    return (
      <div className="game-grid bg-gray-900 grid-cols-10">
        {displayGrid.map((row, y) =>
          row.map((cell, x) => {
            // Determine cell classes based on state
            const cellClasses = [];
            const cellPos = `${y}-${x}`;
            const isActivePiece = currentPieceCells.has(cellPos);
            
            if (cell) {
              // Add the primary tetromino class
              cellClasses.push(`tetris-${cell.type.toLowerCase()}`);
              
              // Add ghost class if it's a ghost piece
              if (cell.ghost) {
                cellClasses.push('tetris-ghost');
                
                // Also add a special class for fallback color
                cellClasses.push(`ghost-${cell.type.toLowerCase()}`);
              }
              
              // Add animation classes for active pieces - synchronized
              if (isActivePiece) {
                cellClasses.push('animate-fall-together');
              }
            } else {
              cellClasses.push('bg-gray-900');
            }

            // Create subtle effects based on position
            const depthStyle = {
              animationDelay: isActivePiece ? '0s' : '0s', // Same delay for all active pieces
              boxShadow: cell && !cell.ghost ? `inset 0 0 5px rgba(255, 255, 255, 0.3)` : '',
              // Add dashed border for ghost pieces
              borderStyle: cell && cell.ghost ? 'dashed' : 'solid'
            };

            return (
              <div
                key={`${y}-${x}`}
                className={`w-full aspect-square ${cellClasses.join(' ')}`}
                style={depthStyle}
                data-piece-type={cell ? cell.type.toLowerCase() : 'empty'}
              />
            );
          })
        )}
      </div>
    );
  }, [state.grid, state.currentPiece, state.gameOver]);
  
  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        renderGrid,
        settings,
        updateSettings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Export the context for use in testing/mocking
export { GameContext };