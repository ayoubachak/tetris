import { describe, it, expect, beforeEach } from 'vitest';
import TetrominoService from '../tetromino.service';
import { Tetromino } from '../../types/tetris.types';
import GameService from '../game.service';

describe('TetrominoService', () => {
  let emptyGrid: ReturnType<typeof GameService.createEmptyGrid>;
  
  beforeEach(() => {
    // Create a fresh empty grid for each test
    emptyGrid = GameService.createEmptyGrid();
  });

  describe('createTetromino', () => {
    it('should create a tetromino with the specified type', () => {
      const piece = TetrominoService.createTetromino('I');
      
      expect(piece.type).toBe('I');
      expect(piece.position).toEqual({ x: 3, y: -1 }); // I piece starts higher
      expect(piece.rotation).toBe(0);
      expect(piece.shape).toBeDefined();
      expect(Array.isArray(piece.shape)).toBe(true);
    });
    
    it('should create a random tetromino when no type is specified', () => {
      const piece = TetrominoService.createTetromino();
      
      // Type should be one of the valid tetromino types
      expect(['I', 'O', 'T', 'S', 'Z', 'J', 'L']).toContain(piece.type);
      expect(piece.position).toBeDefined();
      expect(piece.rotation).toBe(0);
      expect(piece.shape).toBeDefined();
    });
    
    it('should position O pieces correctly', () => {
      const piece = TetrominoService.createTetromino('O');
      
      expect(piece.position).toEqual({ x: 3, y: 0 }); // O piece starts at normal height
    });
  });
  
  describe('rotateTetromino', () => {
    it('should rotate a tetromino clockwise', () => {
      const piece = TetrominoService.createTetromino('T');
      const originalShape = [...piece.shape];
      
      const rotated = TetrominoService.rotateTetromino(piece);
      
      expect(rotated.rotation).toBe(1);
      expect(rotated.shape).not.toEqual(originalShape);
    });
    
    it('should rotate a tetromino counter-clockwise when direction is -1', () => {
      const piece = TetrominoService.createTetromino('T');
      const rotatedClockwise = TetrominoService.rotateTetromino(piece, 1);
      const rotatedCounterClockwise = TetrominoService.rotateTetromino(rotatedClockwise, -1);
      
      expect(rotatedCounterClockwise.rotation).toBe(0);
      expect(rotatedCounterClockwise.shape).toEqual(piece.shape);
    });
    
    it('should handle full rotation cycles', () => {
      let piece = TetrominoService.createTetromino('J');
      const originalShape = [...piece.shape];
      
      // Rotate 4 times to complete a full cycle
      for (let i = 0; i < 4; i++) {
        piece = TetrominoService.rotateTetromino(piece);
      }
      
      expect(piece.rotation).toBe(0);
      expect(piece.shape).toEqual(originalShape);
    });
    
    it('should not change the O piece shape when rotated', () => {
      const piece = TetrominoService.createTetromino('O');
      const originalShape = [...piece.shape];
      
      const rotated = TetrominoService.rotateTetromino(piece);
      
      expect(rotated.rotation).toBe(1);
      expect(rotated.shape).toEqual(originalShape);
    });
  });
  
  describe('isValidPosition', () => {
    it('should return true for a valid position on an empty grid', () => {
      const piece = TetrominoService.createTetromino('T');
      
      // Position the piece in the middle of the grid
      const positionedPiece: Tetromino = {
        ...piece,
        position: { x: 3, y: 5 }
      };
      
      expect(TetrominoService.isValidPosition(positionedPiece, emptyGrid)).toBe(true);
    });
    
    it('should return false when tetromino is outside the grid boundaries', () => {
      const piece = TetrominoService.createTetromino('I');
      
      // Position the piece outside the left boundary
      const outOfBoundsPiece: Tetromino = {
        ...piece,
        position: { x: -2, y: 5 }
      };
      
      expect(TetrominoService.isValidPosition(outOfBoundsPiece, emptyGrid)).toBe(false);
    });
    
    it('should return false when tetromino overlaps with existing blocks', () => {
      const piece = TetrominoService.createTetromino('T');
      
      // Add a block to the grid where the tetromino would be placed
      emptyGrid[5][3] = { type: 'I' };
      
      // Position the piece over the existing block
      const overlappingPiece: Tetromino = {
        ...piece,
        position: { x: 2, y: 4 }
      };
      
      expect(TetrominoService.isValidPosition(overlappingPiece, emptyGrid)).toBe(false);
    });
    
    it('should allow blocks above the grid', () => {
      const piece = TetrominoService.createTetromino('I');
      
      // Position the piece partially above the grid
      const partiallyAboveGridPiece: Tetromino = {
        ...piece,
        position: { x: 3, y: -1 }
      };
      
      expect(TetrominoService.isValidPosition(partiallyAboveGridPiece, emptyGrid)).toBe(true);
    });
  });
  
  describe('getGhostPosition', () => {
    it('should calculate the correct ghost position on an empty grid', () => {
      const piece = TetrominoService.createTetromino('T');
      
      // Position the piece at the top
      const positionedPiece: Tetromino = {
        ...piece,
        position: { x: 3, y: 0 }
      };
      
      const ghostPosition = TetrominoService.getGhostPosition(positionedPiece, emptyGrid);
      
      // Ghost should be at the bottom of the grid (adjusted for the piece height)
      expect(ghostPosition.y).toBe(17); // 20 (grid height) - 3 (T piece height)
      expect(ghostPosition.x).toBe(3);  // Same x position
    });
    
    it('should stop at obstacles when calculating ghost position', () => {
      const piece = TetrominoService.createTetromino('I');
      
      // Position the piece at the top
      const positionedPiece: Tetromino = {
        ...piece,
        position: { x: 3, y: 0 }
      };
      
      // Add a block in the way
      emptyGrid[10][3] = { type: 'O' };
      emptyGrid[10][4] = { type: 'O' };
      emptyGrid[10][5] = { type: 'O' };
      emptyGrid[10][6] = { type: 'O' };
      
      const ghostPosition = TetrominoService.getGhostPosition(positionedPiece, emptyGrid);
      
      // Ghost should stop just above the obstacles
      expect(ghostPosition.y).toBe(8); // 10 (obstacle row) - 2 (height adjustment for I piece)
      expect(ghostPosition.x).toBe(3); // Same x position
    });
  });
}); 