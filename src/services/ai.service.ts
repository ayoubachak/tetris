import { GameState, Grid, Tetromino, AISettings, AIMove } from '../types/tetris.types';
import GameService from './game.service';
import TetrominoService from './tetromino.service';

/**
 * Service to handle AI player operations
 */
export const AIService = {
  /**
   * Evaluates a move based on various heuristics
   */
  evaluateMove(state: GameState, aiSettings: AISettings): number {
    const { grid, score } = state;
    
    // Count holes (empty cells with filled cells above them)
    const holes = this.countHoles(grid);
    
    // Measure the height of the highest column
    const maxHeight = this.getMaxHeight(grid);
    
    // Calculate the "bumpiness" or the sum of height differences between adjacent columns
    const bumpiness = this.getBumpiness(grid);
    
    // Count complete lines
    const completeLines = this.countCompleteLines(grid);
    
    // Calculate a score based on the heuristics and AI settings
    return score
      + (completeLines * aiSettings.linesClearedWeight)
      - (holes * aiSettings.holesWeight)
      - (maxHeight * aiSettings.heightWeight)
      - (bumpiness * aiSettings.bumpinessWeight);
  },

  /**
   * Count holes in the grid (empty cells with filled cells above them)
   */
  countHoles(grid: Grid): number {
    let holes = 0;
    const gridWidth = grid[0].length;
    
    for (let x = 0; x < gridWidth; x++) {
      let blockFound = false;
      for (let y = 0; y < grid.length; y++) {
        if (grid[y][x] !== null) {
          blockFound = true;
        } else if (blockFound) {
          holes++;
        }
      }
    }
    
    return holes;
  },

  /**
   * Get the height of the highest column
   */
  getMaxHeight(grid: Grid): number {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    let maxHeight = 0;
    
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        if (grid[y][x] !== null) {
          maxHeight = Math.max(maxHeight, gridHeight - y);
          break;
        }
      }
    }
    
    return maxHeight;
  },

  /**
   * Calculate the "bumpiness" - sum of differences between adjacent column heights
   */
  getBumpiness(grid: Grid): number {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    const heights = [];
    
    // Get the height of each column
    for (let x = 0; x < gridWidth; x++) {
      let height = gridHeight;
      for (let y = 0; y < gridHeight; y++) {
        if (grid[y][x] !== null) {
          height = y;
          break;
        }
      }
      heights.push(gridHeight - height);
    }
    
    // Calculate the sum of absolute differences between adjacent columns
    let bumpiness = 0;
    for (let i = 0; i < heights.length - 1; i++) {
      bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }
    
    return bumpiness;
  },

  /**
   * Count the number of complete lines in the grid
   */
  countCompleteLines(grid: Grid): number {
    let completeLines = 0;
    
    for (let y = 0; y < grid.length; y++) {
      if (grid[y].every(cell => cell !== null)) {
        completeLines++;
      }
    }
    
    return completeLines;
  },

  /**
   * Get the best move for the current state
   */
  getBestMove(state: GameState, aiSettings: AISettings): AIMove | null {
    if (!state.currentPiece) return null;
    
    const originalPiece = state.currentPiece;
    const originalGrid = state.grid;
    
    let bestScore = -Infinity;
    let bestMove: AIMove | null = null;
    
    // Try all possible rotations and positions
    for (let rotation = 0; rotation < 4; rotation++) {
      // Create a rotated piece
      let rotatedPiece = originalPiece;
      for (let r = 0; r < rotation; r++) {
        rotatedPiece = TetrominoService.rotateTetromino(rotatedPiece);
      }
      
      // Try all possible x positions
      const gridWidth = originalGrid[0].length;
      const pieceWidth = rotatedPiece.shape[0].length;
      
      for (let x = -1; x < gridWidth - pieceWidth + 2; x++) {
        // Create a piece at this position
        const testPiece: Tetromino = {
          ...rotatedPiece,
          position: { x, y: originalPiece.position.y }
        };
        
        // Skip invalid positions
        if (!TetrominoService.isValidPosition(testPiece, originalGrid)) continue;
        
        // Drop the piece to the bottom
        const dropPosition = TetrominoService.getGhostPosition(testPiece, originalGrid);
        const droppedPiece: Tetromino = {
          ...testPiece,
          position: dropPosition
        };
        
        // Create a new state with the piece dropped
        const newGrid = GameService.mergeTetrominoWithGrid(originalGrid, droppedPiece);
        const { newGrid: clearedGrid, linesCleared } = GameService.clearLines(newGrid);
        
        const testState: GameState = {
          ...state,
          grid: clearedGrid,
          score: state.score + (linesCleared * 100 * state.level), // Simple scoring approximation
          linesCleared: state.linesCleared + linesCleared
        };
        
        // Evaluate this move
        const score = this.evaluateMove(testState, aiSettings);
        
        // Update best move if this is better
        if (score > bestScore) {
          bestScore = score;
          bestMove = {
            rotation,
            targetX: x,
            hardDrop: true
          };
        }
      }
    }
    
    return bestMove;
  },

  /**
   * Execute a move step by step
   */
  executeMove(state: GameState, move: AIMove): GameAction {
    if (!state.currentPiece) return { type: 'TICK' };
    
    // First, handle rotation if needed
    if (move.rotation > 0) {
      return { type: 'ROTATE' };
    }
    
    // Then, move left or right to target X position
    const currentX = state.currentPiece.position.x;
    
    if (currentX < move.targetX) {
      return { type: 'MOVE_RIGHT' };
    } else if (currentX > move.targetX) {
      return { type: 'MOVE_LEFT' };
    }
    
    // Finally, drop the piece
    return move.hardDrop ? { type: 'HARD_DROP' } : { type: 'SOFT_DROP' };
  }
};

// The GameAction type used by the AI
type GameAction = 
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'ROTATE' }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'TICK' };

export default AIService; 