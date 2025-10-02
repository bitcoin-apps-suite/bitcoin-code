import React, { useState, useRef, useEffect } from 'react';

interface MenuItem {
  label?: string;
  action?: () => void;
  href?: string;
  divider?: boolean;
  shortcut?: string;
}

interface MenuData {
  label: string;
  items: MenuItem[];
}

interface TaskbarProps {
  isAuthenticated?: boolean;
  currentUser?: any;
  onLogout?: () => void;
  onNewProject?: () => void;
  onSaveProject?: () => void;
  onOpenLibraryModal?: () => void;
}

const CleanTaskbar: React.FC<TaskbarProps> = ({ 
  isAuthenticated = false, 
  currentUser, 
  onLogout,
  onNewProject,
  onSaveProject,
  onOpenLibraryModal
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showBitcoinSuite, setShowBitcoinSuite] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menus: MenuData[] = [
    {
      label: 'Bitcoin Code',
      items: [
        { label: 'Home', action: () => {
          window.location.href = '/';
        }},
        { divider: true },
        { label: 'About Bitcoin Code', action: () => alert('Bitcoin Code v1.0\n\nBuild decentralized applications on Bitcoin SV\n\n© 2025 The Bitcoin Corporation LTD\nAll rights reserved') },
        { label: 'Features', action: () => {
          const event = new CustomEvent('showFeaturesPage');
          window.dispatchEvent(event);
        }},
        { divider: true },
        { label: 'Preferences...', shortcut: '⌘,', action: () => console.log('Preferences') },
        { divider: true },
        { label: isAuthenticated ? 'Sign Out' : 'Sign In', shortcut: '⌘Q', action: isAuthenticated ? onLogout : () => console.log('Sign in') }
      ]
    },
    {
      label: 'File',
      items: [
        { label: 'New Project', shortcut: '⌘N', action: onNewProject || (() => console.log('New')) },
        { label: 'Open...', shortcut: '⌘O', action: () => console.log('Open') },
        { label: 'Open Recent', action: () => console.log('Recent') },
        { divider: true },
        { label: 'Close', shortcut: '⌘W', action: () => console.log('Close') },
        { label: 'Save', shortcut: '⌘S', action: onSaveProject || (() => console.log('Save')) },
        { label: 'Save As...', shortcut: '⇧⌘S', action: () => console.log('Save As') },
        { divider: true },
        { label: 'Export as HTML', action: () => console.log('Export HTML') },
        { label: 'Export as ZIP', action: () => console.log('Export ZIP') },
        { label: 'Deploy to IPFS', action: () => console.log('Deploy IPFS') }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', action: () => document.execCommand('undo') },
        { label: 'Redo', shortcut: '⇧⌘Z', action: () => document.execCommand('redo') },
        { divider: true },
        { label: 'Cut', shortcut: '⌘X', action: () => document.execCommand('cut') },
        { label: 'Copy', shortcut: '⌘C', action: () => document.execCommand('copy') },
        { label: 'Paste', shortcut: '⌘V', action: () => document.execCommand('paste') },
        { label: 'Select All', shortcut: '⌘A', action: () => document.execCommand('selectAll') },
        { divider: true },
        { label: 'Find...', shortcut: '⌘F', action: () => console.log('Find') }
      ]
    },
    {
      label: 'Libraries',
      items: [
        { label: 'Add Library...', shortcut: '⌘L', action: onOpenLibraryModal },
        { label: 'Manage Libraries', action: () => console.log('Manage libraries') },
        { divider: true },
        { label: 'React', href: 'https://react.dev' },
        { label: 'Vue.js', href: 'https://vuejs.org' },
        { label: 'Three.js', href: 'https://threejs.org' },
        { label: 'Chart.js', href: 'https://chartjs.org' },
        { divider: true },
        { label: 'BSV SDK', href: 'https://docs.bsvblockchain.org' },
        { label: 'HandCash SDK', href: 'https://docs.handcash.io' }
      ]
    },
    {
      label: 'Blockchain',
      items: [
        { label: 'Connect Wallet', action: () => console.log('Connect wallet') },
        { label: 'Deploy Contract', action: () => console.log('Deploy contract') },
        { divider: true },
        { label: 'Create NFT', action: () => console.log('Create NFT') },
        { label: 'Mint Tokens', action: () => console.log('Mint tokens') },
        { divider: true },
        { label: 'View on Explorer', href: 'https://whatsonchain.com' }
      ]
    },
    {
      label: 'Templates',
      items: [
        { label: 'DeFi Dashboard', action: () => console.log('Load DeFi template') },
        { label: 'NFT Marketplace', action: () => console.log('Load NFT template') },
        { label: 'P2P Chat', action: () => console.log('Load chat template') },
        { label: 'Blockchain Game', action: () => console.log('Load game template') },
        { divider: true },
        { label: 'Blank Project', action: () => console.log('New blank project') }
      ]
    },
    {
      label: 'Developers',
      items: [
        { label: 'API Documentation', href: '/docs/api' },
        { label: 'Component Library', href: '/docs/components' },
        { divider: true },
        { label: 'GitHub Repository', href: 'https://github.com/bitcoin-apps-suite/bitcoin-app' },
        { label: '$BAPP Token', action: () => window.location.href = '/token' },
        { divider: true },
        { label: 'Developer Console', shortcut: '⌥⌘I', action: () => console.log('Open console') }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Toggle Sidebar', shortcut: '⌥⌘S', action: () => console.log('Toggle sidebar') },
        { label: 'Toggle Preview', shortcut: '⌥⌘P', action: () => console.log('Toggle preview') },
        { divider: true },
        { label: 'Enter Full Screen', shortcut: '⌃⌘F', action: () => document.documentElement.requestFullscreen() },
        { divider: true },
        { label: 'Zoom In', shortcut: '⌘+', action: () => (document.body.style as any).zoom = '110%' },
        { label: 'Zoom Out', shortcut: '⌘-', action: () => (document.body.style as any).zoom = '90%' },
        { label: 'Actual Size', shortcut: '⌘0', action: () => (document.body.style as any).zoom = '100%' }
      ]
    },
    {
      label: 'Window',
      items: [
        { label: 'Minimize', shortcut: '⌘M', action: () => console.log('Minimize') },
        { label: 'Zoom', action: () => console.log('Zoom') },
        { divider: true },
        { label: 'Bring All to Front', action: () => console.log('Bring to front') }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Getting Started', href: '/docs/getting-started' },
        { label: 'Bitcoin Code Help', shortcut: '⌘?', action: () => alert('Bitcoin Code v1.0\n\nBuild and deploy decentralized apps on Bitcoin') },
        { label: 'Keyboard Shortcuts', shortcut: '⌘/', action: () => console.log('Show shortcuts') },
        { divider: true },
        { label: 'Report an Issue', href: 'https://github.com/bitcoin-apps-suite/bitcoin-app/issues' },
        { label: 'Contact Support', href: 'https://twitter.com/bitcoin_app' }
      ]
    }
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setShowBitcoinSuite(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={menuRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '32px',
        background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)',
        borderBottom: '1px solid #1a1a1a',
        fontSize: '13px',
        fontWeight: '500',
        color: '#ffffff',
        userSelect: 'none',
        position: 'fixed',
        top: isMobile ? (window.innerWidth <= 480 ? '68px' : '72px') : '40px',
        left: 0,
        right: 0,
        zIndex: 10000
      }}
    >
      {/* Bitcoin Logo */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => {
            setShowBitcoinSuite(!showBitcoinSuite);
            setActiveMenu(null);
          }}
          style={{
            padding: '0 20px 0 18px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #ff6b6b, #f97316, #feca57, #48dbfb, #0abde3, #a55eea, #fd79a8)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 3s ease-in-out infinite',
            display: 'flex',
            alignItems: 'center',
            height: '32px',
            backgroundColor: showBitcoinSuite ? 'rgba(255, 149, 0, 0.1)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease'
          }}
          title="Bitcoin Suite Apps"
        >
          ₿
        </button>

        {/* Bitcoin Suite Dropdown */}
        {showBitcoinSuite && (
          <div style={{
            position: 'absolute',
            top: '32px',
            left: 0,
            minWidth: '280px',
            background: '#1a1a1a',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            padding: '8px 0',
            zIndex: 1000
          }}>
            <button
              style={{
                width: '100%',
                padding: '8px 16px',
                fontSize: '12px',
                color: '#ff9500',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '4px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: '600',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 149, 0, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Bitcoin Code (Current)
            </button>
            
            <a
              href="https://bitcoin-writer.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#ff9500', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Writer
            </a>

            <a
              href="https://bitcoin-drive.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#22c55e', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Drive
            </a>

            <a
              href="https://bitcoin-spreadsheet.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#3b82f6', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Spreadsheet
            </a>

            <a
              href="https://bitcoin-wallet-sable.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#eab308', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Wallet
            </a>

            <a
              href="https://bitcoin-email.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#ef4444', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Email
            </a>

            <a
              href="https://bitcoin-music.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#a855f7', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Music
            </a>

            <a
              href="https://bitcoin-calendar.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#d946ef', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Calendar
            </a>

            <a
              href="https://bitcoin-exchange-iota.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#10b981', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Exchange
            </a>

            <a
              href="https://bitcoin-search.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#2563eb', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Search
            </a>

            <a
              href="https://bitcoin-jobs.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#22d3ee', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Jobs
            </a>

            <a
              href="https://bitcoin-video-nine.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#22c55e', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Video
            </a>

            <a
              href="https://bitcoin-paint.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#ef4444', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Paint
            </a>
          </div>
        )}
      </div>

      {/* Menu Items - Desktop */}
      <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', height: '100%' }}>
        {menus.map((menu) => (
          <div key={menu.label} style={{ position: 'relative' }}>
            <button
              onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
              onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
              style={{
                padding: '0 12px',
                height: '24px',
                background: activeMenu === menu.label ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.15s ease'
              }}
            >
              {menu.label}
            </button>

            {/* Dropdown Menu */}
            {activeMenu === menu.label && (
              <div style={{
                position: 'absolute',
                top: '32px',
                left: 0,
                minWidth: '200px',
                background: '#1a1a1a',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                padding: '4px 0',
                zIndex: 9999,
                overflow: 'hidden'
              }}>
                {menu.items.map((item, index) => (
                  item.divider ? (
                    <div 
                      key={index}
                      style={{
                        height: '1px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        margin: '4px 0'
                      }}
                    />
                  ) : item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 12px',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 149, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span style={{ opacity: 0.6, fontSize: '12px' }}>{item.shortcut}</span>
                      )}
                    </a>
                  ) : (
                    <button
                      key={index}
                      onClick={() => {
                        item.action?.();
                        setActiveMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: '4px 12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 149, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span style={{ opacity: 0.6, fontSize: '12px' }}>{item.shortcut}</span>
                      )}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Menu Button */}
      {isMobile && (
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{
              padding: '6px 12px',
              background: showMobileMenu ? 'rgba(255, 149, 0, 0.1)' : 'transparent',
              border: '1px solid rgba(255, 149, 0, 0.3)',
              borderRadius: '4px',
              color: '#ff9500',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ☰ Menu
          </button>
        </div>
      )}
      
      {/* Right side - Status */}
      <div style={{
        marginLeft: isMobile ? '0' : 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingRight: '16px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        <span>{isAuthenticated && currentUser ? (currentUser.handle || 'Connected') : 'Not Connected'}</span>
        <span style={{ color: isAuthenticated ? '#00ff88' : '#ff4444' }}>●</span>
      </div>
    </div>
  );
};

export default CleanTaskbar;