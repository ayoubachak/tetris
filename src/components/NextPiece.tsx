import React from 'react';
import { Tetromino } from '../types/tetris.types';

interface NextPieceProps {
  piece: Tetromino;
}

const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
  // Determine grid size based on the tetromino type
  const gridSize = piece.type === 'I' || piece.type === 'O' ? 4 : 3;
  
  // Create a grid to display the piece
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  
  // Center position offset (for display purposes)
  const offsetX = piece.type === 'I' ? 0 : piece.type === 'O' ? 1 : 0;
  const offsetY = piece.type === 'I' ? 1 : piece.type === 'O' ? 1 : 0;
  
  // Fill the grid with the piece shape
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newY = y + offsetY;
        const newX = x + offsetX;
        
        if (newY >= 0 && newY < gridSize && newX >= 0 && newX < gridSize) {
          grid[newY][newX] = piece.type;
        }
      }
    }
  }
  
  return (
    <div className="bg-gray-900 p-3 rounded-md shadow-inner">
      <div 
        className={`grid gap-1 ${gridSize === 4 ? 'grid-cols-4' : 'grid-cols-3'} mx-auto w-28 h-28`}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            // Determine the class based on the cell type
            const pieceClass = cell ? `tetris-${cell.toLowerCase()}` : 'bg-gray-900/70';
            
            return (
              <div
                key={`${y}-${x}`}
                className={`
                  w-full pb-[100%] relative rounded-sm
                  ${pieceClass}
                  ${cell ? 'shadow-md animate-glow' : ''}
                `}
                style={{
                  animationDelay: `${(x + y) * 0.1}s`,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default NextPiece; 