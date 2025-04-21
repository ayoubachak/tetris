import { describe, it, expect } from 'vitest';
import GameService from '../game.service';
import { GameSettings } from '../../types/tetris.types';

const defaultSettings: GameSettings = {
  startLevel: 1,
  showGhostPiece: true,
  dropSpeed: 1.0,
  enableShadow: true,
  theme: 'dark',
  controls: {
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    rotate: 'ArrowUp',
    softDrop: 'ArrowDown',
    hardDrop: 'Space',
    pause: 'Escape',
  },
};

describe('GameService', () => {
  describe('createEmptyGrid', () => {
    it('should create an empty grid with the correct dimensions', () => {
      const grid = GameService.createEmptyGrid();
      
      // Grid should have 20 rows
      expect(grid.length).toBe(20);
      
      // Each row should have 10 cells
      grid.forEach(row => {
        expect(row.length).toBe(10);
        // Each cell should be null
        row.forEach(cell => {
          expect(cell).toBeNull();
        });
      });
    });
  });
  
  describe('createInitialState', () => {
    it('should create an initial game state with the correct properties', () => {
      const state = GameService.createInitialState(defaultSettings);
      
      expect(state).toHaveProperty('grid');
      expect(state).toHaveProperty('currentPiece');
      expect(state).toHaveProperty('nextPiece');
      expect(state).toHaveProperty('score', 0);
      expect(state).toHaveProperty('level', defaultSettings.startLevel);
      expect(state).toHaveProperty('linesCleared', 0);
      expect(state).toHaveProperty('gameOver', false);
      expect(state).toHaveProperty('isPaused', false);
    });
  });
  
  describe('clearLines', () => {
    it('should clear completed lines and return the number of lines cleared', () => {
      // Create a grid with one complete line (the bottom row)
      const grid = GameService.createEmptyGrid();
      
      // Fill the last row with blocks
      grid[grid.length - 1] = Array(10).fill({ type: 'I' });
      
      const result = GameService.clearLines(grid);
      
      expect(result.linesCleared).toBe(1);
      expect(result.newGrid[result.newGrid.length - 1].every(cell => cell === null)).toBe(true);
      expect(result.newGrid[0].every(cell => cell === null)).toBe(true);
    });
    
    it('should clear multiple completed lines', () => {
      // Create a grid with two complete lines
      const grid = GameService.createEmptyGrid();
      
      // Fill the last two rows with blocks
      grid[grid.length - 1] = Array(10).fill({ type: 'I' });
      grid[grid.length - 2] = Array(10).fill({ type: 'I' });
      
      const result = GameService.clearLines(grid);
      
      expect(result.linesCleared).toBe(2);
      expect(result.newGrid[result.newGrid.length - 1].every(cell => cell === null)).toBe(true);
      expect(result.newGrid[result.newGrid.length - 2].every(cell => cell === null)).toBe(true);
    });
    
    it('should not clear incomplete lines', () => {
      // Create a grid with one incomplete line
      const grid = GameService.createEmptyGrid();
      
      // Fill part of the last row with blocks
      grid[grid.length - 1] = Array(9).fill({ type: 'I' }).concat([null]);
      
      const result = GameService.clearLines(grid);
      
      expect(result.linesCleared).toBe(0);
      
      // The incomplete row should still have 9 blocks
      expect(result.newGrid[result.newGrid.length - 1].filter(cell => cell !== null).length).toBe(9);
    });
  });
  
  describe('calculateScore', () => {
    it('should calculate score correctly for different line clears and levels', () => {
      // Single line at level 1
      expect(GameService.calculateScore(1, 1)).toBe(100);
      
      // Double line at level 1
      expect(GameService.calculateScore(2, 1)).toBe(300);
      
      // Triple line at level 1
      expect(GameService.calculateScore(3, 1)).toBe(500);
      
      // Tetris (4 lines) at level 1
      expect(GameService.calculateScore(4, 1)).toBe(800);
      
      // Single line at level 2
      expect(GameService.calculateScore(1, 2)).toBe(200);
      
      // Tetris at level 5
      expect(GameService.calculateScore(4, 5)).toBe(4000);
    });
  });
  
  describe('calculateLevel', () => {
    it('should increase level for every 10 lines cleared', () => {
      expect(GameService.calculateLevel(0, 1)).toBe(1);
      expect(GameService.calculateLevel(9, 1)).toBe(1);
      expect(GameService.calculateLevel(10, 1)).toBe(2);
      expect(GameService.calculateLevel(19, 1)).toBe(2);
      expect(GameService.calculateLevel(20, 1)).toBe(3);
      expect(GameService.calculateLevel(99, 1)).toBe(10);
    });
    
    it('should respect the starting level', () => {
      expect(GameService.calculateLevel(0, 5)).toBe(5);
      expect(GameService.calculateLevel(10, 5)).toBe(6);
      expect(GameService.calculateLevel(20, 5)).toBe(7);
    });
  });
  
  describe('isGameOver', () => {
    it('should detect game over when blocks reach the top row', () => {
      // Create a grid with a block in the top row
      const grid = GameService.createEmptyGrid();
      grid[0][4] = { type: 'I' };
      
      expect(GameService.isGameOver(grid)).toBe(true);
    });
    
    it('should not trigger game over when no blocks in the top row', () => {
      // Create a grid with no blocks in the top row
      const grid = GameService.createEmptyGrid();
      grid[1][4] = { type: 'I' }; // Block in the second row
      
      expect(GameService.isGameOver(grid)).toBe(false);
    });
  });
}); 