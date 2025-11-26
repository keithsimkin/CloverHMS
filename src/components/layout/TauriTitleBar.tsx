/**
 * Custom Tauri Title Bar Component
 * Provides a styled title bar for the Tauri desktop app
 */

import { useEffect, useState } from 'react';
import { MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Square2StackIcon } from '@heroicons/react/24/solid';

export function TauriTitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    // Check if running in Tauri
    setIsTauri(window.__TAURI__ !== undefined);
  }, []);

  // Don't render if not in Tauri
  if (!isTauri) return null;

  const handleMinimize = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    await getCurrentWindow().minimize();
  };

  const handleMaximize = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const window = getCurrentWindow();
    const maximized = await window.isMaximized();
    
    if (maximized) {
      await window.unmaximize();
      setIsMaximized(false);
    } else {
      await window.maximize();
      setIsMaximized(true);
    }
  };

  const handleClose = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    await getCurrentWindow().close();
  };

  return (
    <div
      data-tauri-drag-region
      className="fixed top-0 left-0 right-0 h-8 bg-background border-b border-border flex items-center justify-between px-3 select-none z-50"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* App Title */}
      <div 
        data-tauri-drag-region 
        className="flex items-center gap-2 text-xs font-medium text-foreground tracking-wide"
      >
        <span>CLOVER HMS</span>
      </div>

      {/* Window Controls */}
      <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {/* Minimize */}
        <button
          onClick={handleMinimize}
          className="h-8 w-12 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Minimize"
        >
          <MinusIcon className="h-3.5 w-3.5 text-foreground" strokeWidth={2} />
        </button>

        {/* Maximize/Restore */}
        <button
          onClick={handleMaximize}
          className="h-8 w-12 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
        >
          <Square2StackIcon className="h-3 w-3 text-foreground" />
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          className="h-8 w-12 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
