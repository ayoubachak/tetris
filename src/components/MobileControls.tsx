import React from 'react';
import { useGame } from '../contexts/GameContext';

const MobileControls: React.FC = () => {
  const { dispatch, state } = useGame();
  
  // Handle button presses
  const handleMoveLeft = () => {
    if (!state.gameOver && !state.isPaused) {
      dispatch({ type: 'MOVE_LEFT' });
    }
  };
  
  const handleMoveRight = () => {
    if (!state.gameOver && !state.isPaused) {
      dispatch({ type: 'MOVE_RIGHT' });
    }
  };
  
  const handleRotate = () => {
    if (!state.gameOver && !state.isPaused) {
      dispatch({ type: 'ROTATE' });
    }
  };
  
  const handleSoftDrop = () => {
    if (!state.gameOver && !state.isPaused) {
      dispatch({ type: 'SOFT_DROP' });
    }
  };
  
  const handleHardDrop = () => {
    if (!state.gameOver && !state.isPaused) {
      dispatch({ type: 'HARD_DROP' });
    }
  };
  
  const handlePause = () => {
    if (state.isPaused) {
      dispatch({ type: 'RESUME' });
    } else {
      dispatch({ type: 'PAUSE' });
    }
  };
  
  return (
    <div className="mobile-controls">
      <div className="flex gap-2">
        <button 
          className="control-btn control-btn-left"
          onTouchStart={handleMoveLeft}
          onClick={handleMoveLeft}
          aria-label="Move Left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          className="control-btn control-btn-down"
          onTouchStart={handleSoftDrop}
          onClick={handleSoftDrop}
          aria-label="Soft Drop"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          className="control-btn control-btn-rotate"
          onTouchStart={handleRotate}
          onClick={handleRotate}
          aria-label="Rotate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          className="control-btn control-btn-right"
          onTouchStart={handleMoveRight}
          onClick={handleMoveRight}
          aria-label="Move Right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex gap-2 ml-4">
        <button 
          className="control-btn control-btn-space"
          onTouchStart={handleHardDrop}
          onClick={handleHardDrop}
          aria-label="Hard Drop"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path fillRule="evenodd" d="M12 1.5a.75.75 0 0 1 .75.75V7.5h-1.5V2.25A.75.75 0 0 1 12 1.5ZM11.25 7.5v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          className="control-btn"
          onClick={handlePause}
          aria-label="Pause/Resume"
        >
          {state.isPaused ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileControls; 