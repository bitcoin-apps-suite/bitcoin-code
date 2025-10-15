// Bitcoin Dock - Universal dock components for Bitcoin OS ecosystem
export { default as Dock } from './components/Dock';
export { default as MinimalDock } from './components/MinimalDock';
export { default as DockManager } from './components/DockManager';

// Types
export interface DockProps {
  currentApp?: string;
}

export interface MinimalDockProps {
  currentApp?: string;
}

export interface DockManagerProps {
  currentApp?: string;
}

// Icon themes
export { getThemedIcon, getCurrentTheme } from './lib/icon-themes';
export { getCompleteThemedIcon } from './lib/icon-mappings-complete';