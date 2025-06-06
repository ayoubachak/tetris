import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { GameState, GameAction, GameSettings, AISettings } from '../types/tetris.types';
import GameService from '../services/game.service';
import StorageService from '../services/storage.service';
import AIService from '../services/ai.service';
import tetrisSound from '../assets/sound/tetris.mp3';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  renderGrid: (showGhost: boolean) => React.ReactElement;
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  playMusic: () => void;
  updateAISettings: (aiSettings: Partial<AISettings>) => void;
  toggleAI: (enabled: boolean) => void;
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
      return {
        ...GameService.createInitialState(action.settings),
        isAIActive: state.isAIActive
      };
      
    case 'TOGGLE_AI':
      return { ...state, isAIActive: action.enabled };
      
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
  const [settings, setSettings] = useState<GameSettings>(
    StorageService.getSettings()
  );
  
  // Initialize game state
  const [state, dispatch] = useReducer(
    gameReducer,
    {
      ...GameService.createInitialState(settings),
      isAIActive: false,
    }
  );
  
  // AI move delay timer ref
  const aiMoveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Update game settings
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      StorageService.saveSettings(updated);
      return updated;
    });
  }, []);
  
  // Update AI settings specifically
  const updateAISettings = useCallback((aiSettings: Partial<AISettings>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        ai: {
          ...prev.ai,
          ...aiSettings
        }
      };
      StorageService.saveSettings(updated);
      return updated;
    });
  }, []);
  
  // Toggle AI
  const toggleAI = useCallback((enabled: boolean) => {
    dispatch({ type: 'TOGGLE_AI', enabled });
  }, []);
  
  // AI Logic
  useEffect(() => {
    // Only run if AI is active and game is not over or paused
    if (state.isAIActive && !state.gameOver && !state.isPaused) {
      // Clear any existing timer
      if (aiMoveTimer.current) {
        clearTimeout(aiMoveTimer.current);
      }
      
      aiMoveTimer.current = setTimeout(() => {
        // Calculate best move
        const bestMove = AIService.getBestMove(state, settings.ai);
        
        if (bestMove) {
          // Execute the next action for the current move
          const action = AIService.executeMove(state, bestMove);
          dispatch(action);
        }
      }, settings.ai.moveDelay);
    }
    
    return () => {
      if (aiMoveTimer.current) {
        clearTimeout(aiMoveTimer.current);
      }
    };
  }, [state, settings.ai]);
  
  // Apply theme class on root element
  useEffect(() => {
    const root = document.documentElement;
    // Remove any previous theme classes
    ['theme-space','theme-desert','theme-nature','theme-city','theme-sea'].forEach(c => root.classList.remove(c));
    // Add current theme class
    root.classList.add(`theme-${settings.theme}`);
  }, [settings.theme]);

  // Background music setup
  const audioRef = useRef<HTMLAudioElement>(new Audio(tetrisSound));
  useEffect(() => {
    audioRef.current.loop = true;
  }, []);
  // Update volume when settings change
  useEffect(() => {
    audioRef.current.volume = settings.volume;
  }, [settings.volume]);
  // Play/pause music depending on game state
  useEffect(() => {
    if (!state.gameOver && !state.isPaused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [state.gameOver, state.isPaused]);

  // Handle keyboard input
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Ensure audio is unlocked by user interaction
      audioRef.current.play().catch(() => {});
      if (state.gameOver) return;
      
      // Don't handle keyboard events if AI is active
      if (state.isAIActive) return;
      
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
  }, [state.gameOver, state.isPaused, state.isAIActive, settings]);
  
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
              borderStyle: cell && cell.ghost ? 'dashed' : 'solid',
              opacity: cell && cell.ghost ? 0.7 : 1
            };

            return (
              <div
                key={`${y}-${x}`}
                className={`w-full aspect-square ${cellClasses.join(' ')}`}
                style={depthStyle}
                data-piece-type={cell ? cell.type.toLowerCase() : 'empty'}
                data-is-ghost={cell && cell.ghost ? 'true' : 'false'}
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
        playMusic: () => { audioRef.current.play().catch(() => {}); },
        updateAISettings,
        toggleAI
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