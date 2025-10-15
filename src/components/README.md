# Bitcoin Dock

Universal dock components for all Bitcoin apps. This package provides both large and minimal dock implementations with seamless switching capabilities.

## Components

### Dock.tsx
Full macOS-style dock with:
- All Bitcoin apps with rainbow color theming
- Status bar with Bitcoin Corp, Trust, Apps Store links
- Live clock and system status indicators
- Hover effects and tooltips
- Icon theme switching support

### MinimalDock.tsx
Compact taskbar-style dock with:
- All Bitcoin apps in minimal view
- Quick access status bar
- Rainbow colored icons
- Expandable to full dock

### DockManager.tsx
Smart switcher that:
- Manages dock style state (large/minimal)
- Persists user preference in localStorage
- Handles real-time switching via events
- Provides seamless UX

## Usage

```tsx
import DockManager from './components/DockManager';

export default function App() {
  return (
    <div>
      {/* Your app content */}
      <DockManager />
    </div>
  );
}
```

## Integration

To integrate into a new Bitcoin app:

1. Copy the components folder into your app
2. Set your app as `current: true` in the dockApps array
3. Import and use DockManager in your layout
4. Ensure you have lucide-react and react-icons/md installed

## Features

- **Bitcoin OS Ecosystem**: Access to all 20+ Bitcoin apps
- **Responsive Design**: Works on desktop and mobile
- **Theme Support**: Icon theme switching capabilities  
- **Status Integration**: WiFi, battery, clock, and special links
- **Performance Optimized**: Only active dock loads at runtime
- **State Persistence**: Remembers user's preferred dock style

## Dependencies

- lucide-react
- react-icons (specifically react-icons/md)
- React 18+

Built for the Bitcoin OS ecosystem - enabling seamless navigation between all Bitcoin applications.