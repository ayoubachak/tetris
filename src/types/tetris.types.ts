/**
 * Tetris Game Type Definitions
 */

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Cell = null | {
  type: TetrominoType;
  ghost?: boolean;
};

export type Grid = Cell[][];

export type Position = {
  x: number;
  y: number;
};

export type Tetromino = {
  type: TetrominoType;
  position: Position;
  rotation: number;
  shape: number[][];
};

export type GameState = {
  grid: Grid;
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  isPaused: boolean;
  isAIActive?: boolean;
};

export type HighScore = {
  score: number;
  level: number;
  linesCleared: number;
  date: string;
};

export type AISettings = {
  enabled: boolean;
  moveDelay: number; // Delay between AI moves in ms
  linesClearedWeight: number; // Weight for valuing cleared lines
  holesWeight: number; // Weight for penalizing holes
  heightWeight: number; // Weight for penalizing height
  bumpinessWeight: number; // Weight for penalizing bumpiness
};

export type AIMove = {
  rotation: number; // Number of rotations to apply
  targetX: number; // Target x position
  hardDrop: boolean; // Whether to use hard drop or soft drop
};

export type GameSettings = {
  startLevel: number;
  showGhostPiece: boolean;
  dropSpeed: number;
  enableShadow: boolean;
  theme: 'space' | 'desert' | 'nature' | 'city' | 'sea';
  volume: number; // 0.0 - 1.0 music volume
  controls: {
    moveLeft: string;
    moveRight: string;
    rotate: string;
    softDrop: string;
    hardDrop: string;
    pause: string;
  };
  ai: AISettings;
};

export type GameAction =
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'ROTATE' }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'TICK' }
  | { type: 'GAME_OVER' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESTART', settings: GameSettings }
  | { type: 'NEW_GAME', settings: GameSettings }
  | { type: 'TOGGLE_AI', enabled: boolean };