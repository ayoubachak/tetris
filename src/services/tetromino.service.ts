import { Tetromino, TetrominoType, Position, Grid } from '../types/tetris.types';

/**
 * Tetromino shapes represented as matrices
 * where 1 represents a filled cell and 0 an empty one
 */
const SHAPES = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  O: [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
};

/**
 * Bag system for tetromino generation
 * Ensures all 7 pieces appear once before repeating
 */
class TetriminoBag {
  private bag: TetrominoType[] = [];
  
  constructor() {
    this.refill();
  }
  
  private refill(): void {
    // Fill the bag with one of each piece type
    this.bag = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    
    // Shuffle the bag (Fisher-Yates algorithm)
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }
  
  next(): TetrominoType {
    if (this.bag.length === 0) {
      this.refill();
    }
    
    return this.bag.pop()!;
  }
}

/**
 * Service to handle tetromino operations
 */
export const TetrominoService = {
  bag: new TetriminoBag(),
  
  /**
   * Create a new tetromino
   */
  createTetromino(type?: TetrominoType): Tetromino {
    const tetrominoType = type || this.bag.next();
    
    // Calculate the starting position based on the tetromino type
    const position: Position = { 
      x: 3, // Center position
      y: tetrominoType === 'I' ? -1 : 0 // Start higher for I piece
    };
    
    return {
      type: tetrominoType,
      position,
      rotation: 0,
      shape: SHAPES[tetrominoType][0],
    };
  },
  
  /**
   * Rotate a tetromino
   */
  rotateTetromino(tetromino: Tetromino, direction: 1 | -1 = 1): Tetromino {
    const newRotation = (tetromino.rotation + direction + 4) % 4;
    return {
      ...tetromino,
      rotation: newRotation,
      shape: SHAPES[tetromino.type][newRotation],
    };
  },
  
  /**
   * Check if a tetromino can be placed at a specific position
   */
  isValidPosition(tetromino: Tetromino, grid: Grid): boolean {
    const { shape, position } = tetromino;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          // Check if position is outside the grid
          if (
            newX < 0 || 
            newX >= grid[0].length ||
            newY >= grid.length
          ) {
            return false;
          }
          
          // Ignore collision check for rows above the grid
          if (newY < 0) {
            continue;
          }
          
          // Check if position is already occupied
          if (grid[newY][newX]) {
            return false;
          }
        }
      }
    }
    
    return true;
  },
  
  /**
   * Calculate the ghost piece position (preview of where piece will land)
   */
  getGhostPosition(tetromino: Tetromino, grid: Grid): Position {
    // Create a proper deep clone of the tetromino to avoid reference issues
    const ghostPiece = {
      ...tetromino,
      shape: tetromino.shape.map(row => [...row]),
      position: { ...tetromino.position }
    };
    
    let newY = tetromino.position.y;
    
    // Drop the ghost piece until it hits something
    while (this.isValidPosition(
      { ...ghostPiece, position: { ...ghostPiece.position, y: newY + 1 } }, 
      grid
    )) {
      newY++;
    }
    
    return { ...tetromino.position, y: newY };
  }
};

export default TetrominoService; 