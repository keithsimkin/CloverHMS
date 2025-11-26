/**
 * Tauri Type Definitions
 * Extends the Window interface to include Tauri-specific properties
 */

interface Window {
  __TAURI__?: {
    invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
  };
}
