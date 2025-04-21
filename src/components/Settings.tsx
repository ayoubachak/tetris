import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { GameSettings } from '../types/tetris.types';
import StorageService from '../services/storage.service';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { settings, updateSettings } = useGame();
  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings });
  const [listeningForKey, setListeningForKey] = useState<keyof GameSettings['controls'] | null>(null);
  
  const handleDropSpeedChange = (value: number) => {
    setLocalSettings({
      ...localSettings,
      dropSpeed: value,
    });
  };
  
  const handleThemeChange = (theme: "space" | "desert" | "nature" | "city" | "sea") => {
    setLocalSettings({
      ...localSettings,
      theme,
    });
  };
  
  const handleToggleSetting = (key: keyof GameSettings) => {
    setLocalSettings({
      ...localSettings,
      [key]: !localSettings[key],
    });
  };
  
  const startListeningForKey = (control: keyof GameSettings['controls']) => {
    setListeningForKey(control);
  };
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (listeningForKey) {
      event.preventDefault();
      
      // Update the control key binding
      setLocalSettings({
        ...localSettings,
        controls: {
          ...localSettings.controls,
          [listeningForKey]: event.code,
        },
      });
      
      setListeningForKey(null);
    }
  };
  
  const handleSave = () => {
    updateSettings(localSettings);
    onBack();
  };
  
  const handleReset = () => {
    StorageService.resetSettings();
    setLocalSettings(StorageService.getSettings());
  };
  
  // Listen for key presses when remapping controls
  useEffect(() => {
    if (listeningForKey) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [listeningForKey, localSettings]);
  
  return (
    <div className="game-container h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Settings</h1>
        
        {/* Game Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Game Settings</h2>
          <div className="space-y-4 p-4 bg-gray-900 rounded">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Drop Speed (x{localSettings.dropSpeed.toFixed(1)})
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={localSettings.dropSpeed}
                onChange={(e) => handleDropSpeedChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ghostPiece"
                checked={localSettings.showGhostPiece}
                onChange={() => handleToggleSetting('showGhostPiece')}
                className="mr-2"
              />
              <label htmlFor="ghostPiece">Show ghost piece</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableShadow"
                checked={localSettings.enableShadow}
                onChange={() => handleToggleSetting('enableShadow')}
                className="mr-2"
              />
              <label htmlFor="enableShadow">Enable block shadows</label>
            </div>
            
            <div className="flex flex-col gap-1">
              <label htmlFor="themeSelect" className="block text-sm text-gray-400">Theme</label>
              <select
                id="themeSelect"
                value={localSettings.theme}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  theme: e.target.value as GameSettings['theme'],
                })}
                className="w-full bg-gray-700 text-white p-2 rounded"
              >
                <option value="space">Space</option>
                <option value="desert">Desert</option>
                <option value="nature">Nature</option>
                <option value="city">City</option>
                <option value="sea">Sea</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-1">
                Music Volume ({Math.round(localSettings.volume * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={localSettings.volume}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    volume: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        {/* Control Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Controls</h2>
          <div className="space-y-2 p-4 bg-gray-900 rounded">
            {Object.entries(localSettings.controls).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <button
                  onClick={() => startListeningForKey(key as keyof GameSettings['controls'])}
                  className={`px-3 py-1 min-w-[100px] text-center rounded ${
                    listeningForKey === key ? 'bg-blue-600 animate-pulse' : 'bg-gray-700'
                  }`}
                >
                  {listeningForKey === key ? 'Press a key...' : value}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between gap-4">
          <button onClick={handleReset} className="btn btn-secondary">
            Reset to Default
          </button>
          <div className="space-x-2">
            <button onClick={onBack} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;