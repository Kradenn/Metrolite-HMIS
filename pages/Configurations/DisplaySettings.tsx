
import React, { useState } from 'react';
import { useTheme, Theme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

const DisplaySettings: React.FC = () => {
  const { activeTheme, setTheme, availableThemes, installTheme } = useTheme();
  const { notify } = useNotification();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [newThemeJson, setNewThemeJson] = useState('');

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    notify('success', 'Theme Updated', `System theme has been changed to ${themeId}.`);
  };

  const handleInstallTheme = () => {
    try {
      const theme = JSON.parse(newThemeJson) as Theme;
      if (!theme.id || !theme.colors) throw new Error('Invalid theme format');
      installTheme(theme);
      setShowInstallModal(false);
      setNewThemeJson('');
      notify('success', 'Theme Installed', `New theme "${theme.name}" is now available.`);
    } catch (e) {
      notify('error', 'Installation Failed', 'The theme JSON format is invalid.');
    }
  };

  return (
    <div className="animate-bottom space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 border-l-blue-600">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-blue-100 dark:border-blue-800">
            <i className="fa fa-palette"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Display & Theme Settings</h2>
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mt-1">Personalize your system interface</p>
          </div>
        </div>
        <button 
          onClick={() => setShowInstallModal(true)}
          className="bg-slate-800 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg"
        >
          <i className="fa fa-plus mr-2"></i> Install New Theme
        </button>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {availableThemes.map((theme) => (
          <div 
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`group relative flex flex-col rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${
              activeTheme.id === theme.id 
                ? 'border-blue-600 bg-white dark:bg-slate-900 shadow-xl scale-[1.02]' 
                : 'border-transparent bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            {/* Theme Preview */}
            <div className="h-32 w-full relative" style={{ backgroundColor: theme.colors.background }}>
              <div className="absolute top-4 left-4 w-2/3 h-4 rounded" style={{ backgroundColor: theme.colors.primary }}></div>
              <div className="absolute top-10 left-4 w-1/2 h-3 rounded opacity-50" style={{ backgroundColor: theme.colors.secondary }}></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl shadow-lg" style={{ backgroundColor: theme.colors.surface }}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-6 h-1 rounded" style={{ backgroundColor: theme.colors.primary }}></div>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{theme.name}</h5>
                {activeTheme.id === theme.id && (
                  <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Active</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {theme.description || 'A beautiful theme for your workspace.'}
              </p>
              
              <div className="mt-4 flex items-center space-x-2">
                {Object.values(theme.colors).slice(0, 5).map((color, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border border-black/5" style={{ backgroundColor: color }}></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 shadow-2xl w-full max-w-lg rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Install Theme Module</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paste theme configuration JSON</p>
              </div>
              <button onClick={() => setShowInstallModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-400">
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <textarea 
                value={newThemeJson}
                onChange={(e) => setNewThemeJson(e.target.value)}
                placeholder='{ "id": "my-theme", "name": "My Theme", "colors": { ... } }'
                className="w-full h-48 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              ></textarea>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowInstallModal(false)}
                  className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleInstallTheme}
                  className="px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                >
                  Install Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplaySettings;
