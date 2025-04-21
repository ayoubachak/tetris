import { Grid, Tetromino,  Position, GameState, GameSettings } from '../types/tetris.types';
import TetrominoService from './tetromino.service';

// Constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Scoring system
const SCORE_VALUES = {
  SOFT_DROP: 1,
  HARD_DROP: 2,
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
};

/**
 * Service to handle the game logic
 */
export const GameService = {
  /**
   * Create an empty game board
   */
  createEmptyGrid(): Grid {
    return Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill(null)
    );
  },
  
  /**
   * Create initial game state
   */
  createInitialState(settings: GameSettings): GameState {
    const grid = this.createEmptyGrid();
    const currentPiece = TetrominoService.createTetromino();
    const nextPiece = TetrominoService.createTetromino();
    
    return {
      grid,
      currentPiece,
      nextPiece,
      score: 0,
      level: settings.startLevel,
      linesCleared: 0,
      gameOver: false,
      isPaused: false,
    };
  },
  
  /**
   * Project a tetromino onto the grid without permanently placing it
   */
  projectTetrominoOnGrid(
    grid: Grid, 
    tetromino: Tetromino, 
    isGhost = false
  ): Grid {
    // Create a copy of the grid to avoid modifying the original
    const newGrid = grid.map(row => [...row]);
    
    // Loop through each cell of the tetromino shape
    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x]) {
          const newY = tetromino.position.y + y;
          const newX = tetromino.position.x + x;
          
          // Skip cells that would be above the grid (during spawn)
          if (newY < 0) continue;
          
          // Place the cell on the grid if it's within bounds
          if (
            newY >= 0 && 
            newY < newGrid.length && 
            newX >= 0 && 
            newX < newGrid[0].length
          ) {
            // Set the cell value (with ghost flag if this is a ghost piece)
            newGrid[newY][newX] = { 
              type: tetromino.type,
              ...(isGhost && { ghost: true })
            };
          }
        }
      }
    }
    
    return newGrid;
  },
  
  /**
   * Add ghost piece to the grid
   */
  addGhostPiece(grid: Grid, tetromino: Tetromino): Grid {
    if (!tetromino) return grid;
    
    // Calculate ghost position
    const ghostPosition = TetrominoService.getGhostPosition(tetromino, grid);
    
    // Skip rendering ghost if it's at the same position as the current piece
    if (ghostPosition.y === tetromino.position.y) {
      return grid.map(row => [...row]);
    }
    
    // Create ghost tetromino
    const ghostTetromino = {
      ...tetromino,
      position: ghostPosition,
    };
    
    // Create a copy of the grid without modifying the original
    let gridCopy = grid.map(row => [...row]);
    
    // Project the ghost onto the grid
    return this.projectTetrominoOnGrid(gridCopy, ghostTetromino, true);
  },
  
  /**
   * Merge a tetromino permanently onto the grid
   */
  mergeTetrominoWithGrid(grid: Grid, tetromino: Tetromino): Grid {
    return this.projectTetrominoOnGrid(grid, tetromino);
  },
  
  /**
   * Check for and clear completed lines
   */
  clearLines(grid: Grid): { newGrid: Grid, linesCleared: number } {
    let linesCleared = 0;
    
    // Find filled rows
    const newGrid = grid.filter(row => {
      const isRowFilled = row.every(cell => cell !== null);
      if (isRowFilled) {
        linesCleared++;
        return false;
      }
      return true;
    });
    
    // Add new empty rows at the top
    while (newGrid.length < BOARD_HEIGHT) {
      newGrid.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    return { newGrid, linesCleared };
  },
  
  /**
   * Calculate score based on lines cleared and drop type
   */
  calculateScore(linesCleared: number, level: number): number {
    let score = 0;
    
    switch (linesCleared) {
      case 1:
        score = SCORE_VALUES.SINGLE;
        break;
      case 2:
        score = SCORE_VALUES.DOUBLE;
        break;
      case 3:
        score = SCORE_VALUES.TRIPLE;
        break;
      case 4:
        score = SCORE_VALUES.TETRIS;
        break;
    }
    
    // Multiply score by level
    return score * level;
  },
  
  /**
   * Calculate level based on lines cleared
   */
  calculateLevel(linesCleared: number, startLevel: number): number {
    // Level up every 10 lines cleared
    return startLevel + Math.floor(linesCleared / 10);
  },
  
  /**
   * Calculate drop speed based on level
   */
  calculateDropSpeed(level: number, baseSpeed: number): number {
    // Formula: baseSpeed * (0.8 - ((level - 1) * 0.007))^(level - 1)
    return baseSpeed * Math.pow(0.8 - ((level - 1) * 0.007), level - 1);
  },
  
  /**
   * Check if the game is over
   */
  isGameOver(grid: Grid): boolean {
    // Game is over if there are any blocks in the top row
    return grid[0].some(cell => cell !== null);
  },
  
  /**
   * Move tetromino left
   */
  moveLeft(state: GameState): GameState {
    const { currentPiece, grid } = state;
    
    if (!currentPiece) return state;
    
    const newPosition: Position = {
      ...currentPiece.position,
      x: currentPiece.position.x - 1,
    };
    
    const newTetromino: Tetromino = {
      ...currentPiece,
      position: newPosition,
    };
    
    // Check if the new position is valid
    if (TetrominoService.isValidPosition(newTetromino, grid)) {
      return { ...state, currentPiece: newTetromino };
    }
    
    return state;
  },
  
  /**
   * Move tetromino right
   */
  moveRight(state: GameState): GameState {
    const { currentPiece, grid } = state;
    
    if (!currentPiece) return state;
    
    const newPosition: Position = {
      ...currentPiece.position,
      x: currentPiece.position.x + 1,
    };
    
    const newTetromino: Tetromino = {
      ...currentPiece,
      position: newPosition,
    };
    
    // Check if the new position is valid
    if (TetrominoService.isValidPosition(newTetromino, grid)) {
      return { ...state, currentPiece: newTetromino };
    }
    
    return state;
  },
  
  /**
   * Rotate tetromino
   */
  rotate(state: GameState): GameState {
    const { currentPiece, grid } = state;
    
    if (!currentPiece) return state;
    
    const rotatedTetromino = TetrominoService.rotateTetromino(currentPiece);
    
    // Use wall kick to try to fit the rotated piece if it doesn't fit
    if (TetrominoService.isValidPosition(rotatedTetromino, grid)) {
      return { ...state, currentPiece: rotatedTetromino };
    }
    
    // Try to kick off the wall
    const kicks = [
      { x: -1, y: 0 }, // Try left
      { x: 1, y: 0 },  // Try right
      { x: 0, y: -1 }, // Try up
      { x: -2, y: 0 }, // Try 2 left
      { x: 2, y: 0 },  // Try 2 right
    ];
    
    for (const kick of kicks) {
      const kickedTetromino = {
        ...rotatedTetromino,
        position: {
          x: rotatedTetromino.position.x + kick.x,
          y: rotatedTetromino.position.y + kick.y,
        },
      };
      
      if (TetrominoService.isValidPosition(kickedTetromino, grid)) {
        return { ...state, currentPiece: kickedTetromino };
      }
    }
    
    return state;
  },
  
  /**
   * Move tetromino down (soft drop)
   */
  moveDown(state: GameState): GameState {
    const { currentPiece, grid, score } = state;
    
    if (!currentPiece) return state;
    
    const newPosition: Position = {
      ...currentPiece.position,
      y: currentPiece.position.y + 1,
    };
    
    const newTetromino: Tetromino = {
      ...currentPiece,
      position: newPosition,
    };
    
    // Check if the new position is valid
    if (TetrominoService.isValidPosition(newTetromino, grid)) {
      // Add points for soft drop
      return { 
        ...state, 
        currentPiece: newTetromino,
        score: score + SCORE_VALUES.SOFT_DROP
      };
    }
    
    // If can't move down, lock the piece and generate a new one
    return this.lockPiece(state);
  },
  
  /**
   * Hard drop the tetromino
   */
  hardDrop(state: GameState): GameState {
    const { currentPiece, grid, score } = state;
    
    if (!currentPiece) return state;
    
    // Find the lowest valid position
    let dropDistance = 0;
    let newY = currentPiece.position.y;
    
    while (TetrominoService.isValidPosition(
      { ...currentPiece, position: { ...currentPiece.position, y: newY + 1 } },
      grid
    )) {
      newY++;
      dropDistance++;
    }
    
    // Update position and score
    const droppedTetromino = {
      ...currentPiece,
      position: { ...currentPiece.position, y: newY },
    };
    
    // Award points for hard drop
    const newScore = score + (dropDistance * SCORE_VALUES.HARD_DROP);
    
    // Lock the piece and move to next
    return this.lockPiece({
      ...state,
      currentPiece: droppedTetromino,
      score: newScore,
    });
  },
  
  /**
   * Lock the current piece and generate a new one
   */
  lockPiece(state: GameState): GameState {
    const { currentPiece, grid, nextPiece, score, level, linesCleared } = state;
    
    if (!currentPiece) return state;
    
    // Merge the current piece with the grid
    const newGrid = this.mergeTetrominoWithGrid(grid, currentPiece);
    
    // Check for and clear completed lines
    const { newGrid: clearedGrid, linesCleared: newLinesCleared } = this.clearLines(newGrid);
    
    // Calculate score for cleared lines
    const linesScore = this.calculateScore(newLinesCleared, level);
    const newScore = score + linesScore;
    
    // Calculate new total lines cleared
    const totalLinesCleared = linesCleared + newLinesCleared;
    
    // Calculate new level
    const newLevel = this.calculateLevel(totalLinesCleared, level);
    
    // Generate next piece
    const newCurrentPiece = nextPiece;
    const newNextPiece = TetrominoService.createTetromino();
    
    // Check if game is over
    const gameOver = this.isGameOver(clearedGrid);
    
    return {
      ...state,
      grid: clearedGrid,
      currentPiece: newCurrentPiece,
      nextPiece: newNextPiece,
      score: newScore,
      level: newLevel,
      linesCleared: totalLinesCleared,
      gameOver,
    };
  },
};

export default GameService; 