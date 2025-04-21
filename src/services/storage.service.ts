import { HighScore, GameSettings } from '../types/tetris.types';

const STORAGE_KEYS = {
  HIGH_SCORES: 'tetris_high_scores',
  SETTINGS: 'tetris_settings',
};

// Default game settings
const DEFAULT_SETTINGS: GameSettings = {
  startLevel: 1,
  showGhostPiece: true,
  dropSpeed: 1.0,
  enableShadow: true,
  theme: 'space',
  volume: 0.5,
  controls: {
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    rotate: 'ArrowUp',
    softDrop: 'ArrowDown',
    hardDrop: 'Space',
    pause: 'Escape',
  },
  ai: {
    enabled: false,
    moveDelay: 300,
    linesClearedWeight: 0.8,
    holesWeight: 0.7,
    heightWeight: 0.3,
    bumpinessWeight: 0.2
  }
};

/**
 * Service to handle localStorage operations
 */
export const StorageService = {
  /**
   * Get all high scores from localStorage
   */
  getHighScores(): HighScore[] {
    try {
      const highScores = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
      return highScores ? JSON.parse(highScores) : [];
    } catch (error) {
      console.error('Error retrieving high scores:', error);
      return [];
    }
  },
  
  /**
   * Save a new high score to localStorage
   */
  saveHighScore(score: number, level: number, linesCleared: number): void {
    try {
      const highScores = this.getHighScores();
      const newHighScore: HighScore = {
        score,
        level,
        linesCleared,
        date: new Date().toISOString(),
      };
      
      // Add the new score and sort by highest score
      highScores.push(newHighScore);
      highScores.sort((a, b) => b.score - a.score);
      
      // Keep only the top 10 scores
      const topScores = highScores.slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(topScores));
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  },
  
  /**
   * Get user settings from localStorage
   */
  getSettings(): GameSettings {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!settings) {
        return DEFAULT_SETTINGS;
      }
      
      // Merge saved settings with default settings to ensure all properties exist
      return { ...DEFAULT_SETTINGS, ...JSON.parse(settings) };
    } catch (error) {
      console.error('Error retrieving settings:', error);
      return DEFAULT_SETTINGS;
    }
  },
  
  /**
   * Save user settings to localStorage
   */
  saveSettings(settings: Partial<GameSettings>): void {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },
  
  /**
   * Reset settings to default values
   */
  resetSettings(): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  },
  
  /**
   * Clear all high scores
   */
  clearHighScores(): void {
    localStorage.removeItem(STORAGE_KEYS.HIGH_SCORES);
  },
};

export default StorageService;