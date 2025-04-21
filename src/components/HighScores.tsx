import React from 'react';
import StorageService from '../services/storage.service';
import { HighScore } from '../types/tetris.types';

interface HighScoresProps {
  onBack: () => void;
}

const HighScores: React.FC<HighScoresProps> = ({ onBack }) => {
  const highScores = StorageService.getHighScores();
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="game-container h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6">High Scores</h1>
        
        {highScores.length > 0 ? (
          <div className="mb-6 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 rounded-tl-md">#</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Lines</th>
                  <th className="p-3 rounded-tr-md">Date</th>
                </tr>
              </thead>
              <tbody>
                {highScores.map((score: HighScore, index: number) => (
                  <tr 
                    key={index} 
                    className={`${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}`}
                  >
                    <td className="p-3 font-medium">{index + 1}</td>
                    <td className="p-3 font-bold">{score.score}</td>
                    <td className="p-3">{score.level}</td>
                    <td className="p-3">{score.linesCleared}</td>
                    <td className="p-3 text-gray-400">{formatDate(score.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-900 rounded mb-6">
            <p className="text-gray-400">No high scores yet. Play a game to set a record!</p>
          </div>
        )}
        
        <div className="flex justify-between gap-4">
          <button
            onClick={() => StorageService.clearHighScores()}
            className="btn btn-secondary"
            disabled={highScores.length === 0}
          >
            Clear Scores
          </button>
          <button onClick={onBack} className="btn btn-primary">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighScores; 