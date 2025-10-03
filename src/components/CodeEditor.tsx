import React, { useState, useRef } from 'react';
import { 
  FileText, 
  FolderOpen, 
  Search, 
  GitBranch, 
  Terminal, 
  Settings,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Save,
  Copy,
  Play,
  Bug,
  Package,
  Code2,
  Bot,
  Coins
} from 'lucide-react';
import AIChatSidebar from './AIChatSidebar';
import MonacoCodeEditor from './MonacoCodeEditor';
import './CodeEditor.css';
import './AIChatSidebar.css';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

const CodeEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('welcome');
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'welcome',
      name: 'Welcome',
      path: 'Welcome',
      content: `// Welcome to Bitcoin Code
// The professional IDE for Bitcoin development

function main() {
  const bitcoin = new BitcoinSDK({
    network: 'mainnet',
    wallet: 'integrated'
  });
  
  // Start building your decentralized app
  const app = bitcoin.createApp({
    name: 'My Bitcoin App',
    version: '1.0.0'
  });
  
  return app.deploy();
}`,
      language: 'javascript',
      isDirty: false
    }
  ]);
  
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [aiChatWidth, setAiChatWidth] = useState(400);
  const [terminalHeight, setTerminalHeight] = useState(300);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showAiChat, setShowAiChat] = useState(true);
  const [activePanel, setActivePanel] = useState<'explorer' | 'search' | 'git' | 'debug'>('explorer');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components']));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [cursorPosition] = useState({ line: 1, column: 1 });
  const [isResizing, setIsResizing] = useState<'sidebar' | 'terminal' | 'aichat' | null>(null);

  // Sample file structure
  const fileTree: FileNode = {
    name: 'bitcoin-app',
    type: 'folder',
    path: '/',
    children: [
      {
        name: 'src',
        type: 'folder',
        path: '/src',
        children: [
          {
            name: 'index.js',
            type: 'file',
            path: '/src/index.js',
            content: `import { BitcoinSDK } from '@bitcoin/sdk';
import { createWallet } from './wallet';
import { initializeApp } from './app';

// Initialize Bitcoin SDK
const bitcoin = new BitcoinSDK({
  network: process.env.BITCOIN_NETWORK || 'mainnet',
  apiKey: process.env.BITCOIN_API_KEY
});

// Create wallet instance
const wallet = createWallet(bitcoin);

// Initialize application
initializeApp(bitcoin, wallet);`,
            language: 'javascript'
          },
          {
            name: 'wallet.js',
            type: 'file',
            path: '/src/wallet.js',
            content: `export function createWallet(sdk) {
  return sdk.wallet.create({
    type: 'HD',
    network: 'mainnet'
  });
}`,
            language: 'javascript'
          },
          {
            name: 'app.js',
            type: 'file',
            path: '/src/app.js',
            content: `export function initializeApp(sdk, wallet) {
  // App initialization logic
  console.log('Bitcoin app initialized');
}`,
            language: 'javascript'
          },
          {
            name: 'components',
            type: 'folder',
            path: '/src/components',
            children: [
              {
                name: 'Transaction.jsx',
                type: 'file',
                path: '/src/components/Transaction.jsx',
                content: `import React from 'react';

export const Transaction = ({ tx }) => {
  return (
    <div className="transaction">
      <h3>Transaction: {tx.id}</h3>
      <p>Amount: {tx.amount} BTC</p>
      <p>Status: {tx.status}</p>
    </div>
  );
};`,
                language: 'javascript'
              }
            ]
          }
        ]
      },
      {
        name: 'package.json',
        type: 'file',
        path: '/package.json',
        content: `{
  "name": "bitcoin-app",
  "version": "1.0.0",
  "description": "Bitcoin application built with Bitcoin Code",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "@bitcoin/sdk": "^2.0.0",
    "react": "^18.2.0"
  }
}`,
        language: 'json'
      },
      {
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        content: `# Bitcoin App

Built with Bitcoin Code - The professional IDE for Bitcoin development.

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## Features

- Bitcoin wallet integration
- Smart contract deployment
- Real-time transaction monitoring
- Decentralized storage

## License

MIT`,
        language: 'markdown'
      }
    ]
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const openFile = (file: FileNode) => {
    if (file.type === 'file') {
      const existingTab = tabs.find(t => t.path === file.path);
      if (existingTab) {
        setActiveTab(existingTab.id);
      } else {
        const newTab: Tab = {
          id: `tab-${Date.now()}`,
          name: file.name,
          path: file.path,
          content: file.content || '',
          language: file.language || 'text',
          isDirty: false
        };
        setTabs([...tabs, newTab]);
        setActiveTab(newTab.id);
      }
      setSelectedFile(file.path);
    }
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const updateTabContent = (content: string) => {
    setTabs(tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, content, isDirty: true }
        : tab
    ));
  };

  const renderFileTree = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;

    if (node.type === 'folder') {
      return (
        <div key={node.path}>
          <div 
            className={`file-tree-item ${isSelected ? 'selected' : ''}`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => toggleFolder(node.path)}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <FolderOpen size={14} />
            <span>{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map(child => renderFileTree(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div 
        key={node.path}
        className={`file-tree-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 24}px` }}
        onClick={() => openFile(node)}
      >
        <FileText size={14} />
        <span>{node.name}</span>
      </div>
    );
  };

  const activeTabContent = tabs.find(t => t.id === activeTab);

  return (
    <div className="code-editor">
      {/* Header Bar */}
      <div className="code-editor-header">
        <div className="header-logo">
          <Code2 size={20} />
          <span className="app-title">Bitcoin Code</span>
        </div>
        <div className="header-nav">
          <button 
            className="nav-btn active"
            onClick={() => window.location.href = '/'}
          >
            <Code2 size={16} />
            Code Editor
          </button>
          <button 
            className="nav-btn"
            onClick={() => window.location.href = '/exchange'}
          >
            <Coins size={16} />
            NFT Exchange
          </button>
        </div>
      </div>
      
      {/* Main Editor Container */}
      <div className="code-editor-main">
        {/* Activity Bar */}
        <div className="activity-bar">
        <button 
          className={`activity-item ${activePanel === 'explorer' ? 'active' : ''}`}
          onClick={() => setActivePanel('explorer')}
          title="Explorer"
        >
          <FolderOpen size={20} />
        </button>
        <button 
          className={`activity-item ${activePanel === 'search' ? 'active' : ''}`}
          onClick={() => setActivePanel('search')}
          title="Search"
        >
          <Search size={20} />
        </button>
        <button 
          className={`activity-item ${activePanel === 'git' ? 'active' : ''}`}
          onClick={() => setActivePanel('git')}
          title="Source Control"
        >
          <GitBranch size={20} />
        </button>
        <button 
          className={`activity-item ${activePanel === 'debug' ? 'active' : ''}`}
          onClick={() => setActivePanel('debug')}
          title="Debug"
        >
          <Bug size={20} />
        </button>
        <div className="activity-spacer" />
        <button 
          className={`activity-item ${showAiChat ? 'active' : ''}`}
          onClick={() => setShowAiChat(!showAiChat)}
          title="AI Assistant"
        >
          <Bot size={20} />
        </button>
        <button className="activity-item" title="Settings">
          <Settings size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <div className="sidebar" style={{ width: `${sidebarWidth}px` }}>
        <div className="sidebar-header">
          <h3>{activePanel === 'explorer' ? 'EXPLORER' : activePanel.toUpperCase()}</h3>
        </div>
        {activePanel === 'explorer' && (
          <div className="file-tree">
            {renderFileTree(fileTree)}
          </div>
        )}
        {activePanel === 'search' && (
          <div className="search-panel">
            <input 
              type="text" 
              placeholder="Search files..."
              className="search-input"
            />
          </div>
        )}
        {activePanel === 'git' && (
          <div className="git-panel">
            <div className="git-status">
              <GitBranch size={14} />
              <span>main</span>
            </div>
            <div className="git-changes">
              <p>No changes</p>
            </div>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="editor-area">
        {/* Tabs */}
        <div className="editor-tabs">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              className={`editor-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FileText size={14} />
              <span>{tab.name}</span>
              {tab.isDirty && <span className="dirty-indicator">●</span>}
              <button 
                className="tab-close"
                onClick={(e) => closeTab(tab.id, e)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button className="new-tab-btn" title="New File">
            <Plus size={16} />
          </button>
        </div>

        {/* Editor */}
        {activeTabContent && (
          <div className="editor-content">
            <div className="editor-toolbar">
              <button className="toolbar-btn" title="Save">
                <Save size={16} />
              </button>
              <button className="toolbar-btn" title="Copy">
                <Copy size={16} />
              </button>
              <button className="toolbar-btn" title="Run">
                <Play size={16} />
              </button>
              <button className="toolbar-btn" title="Debug">
                <Bug size={16} />
              </button>
              <button className="toolbar-btn" title="Build">
                <Package size={16} />
              </button>
              <button 
                className={`toolbar-btn ${showTerminal ? 'active' : ''}`}
                onClick={() => setShowTerminal(!showTerminal)}
                title="Toggle Terminal"
              >
                <Terminal size={16} />
              </button>
            </div>
            <div className="editor-with-terminal">
              <div className="code-area" style={{ 
                height: showTerminal ? `calc(100% - ${terminalHeight}px)` : '100%' 
              }}>
                <MonacoCodeEditor
                  tab={activeTabContent}
                  onContentChange={updateTabContent}
                />
              </div>
              
              {/* Terminal */}
              {showTerminal && (
                <div className="terminal-panel" style={{ height: `${terminalHeight}px` }}>
                  <div className="terminal-header">
                    <span>TERMINAL</span>
                    <button onClick={() => setShowTerminal(false)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="terminal-content">
                    <div className="terminal-line">
                      <span className="terminal-prompt">bitcoin-code $</span>
                      <span className="terminal-output"> npm start</span>
                    </div>
                    <div className="terminal-line">
                      <span className="terminal-output">Starting Bitcoin development server...</span>
                    </div>
                    <div className="terminal-line">
                      <span className="terminal-success">✓ Server running on http://localhost:3010</span>
                    </div>
                    <div className="terminal-line">
                      <span className="terminal-success">✓ Bitcoin network connected</span>
                    </div>
                    <div className="terminal-line">
                      <span className="terminal-prompt">bitcoin-code $</span>
                      <input className="terminal-input" type="text" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-left">
            <span className="status-item">
              <GitBranch size={12} /> main
            </span>
            <span className="status-item">UTF-8</span>
            <span className="status-item">JavaScript</span>
          </div>
          <div className="status-right">
            <span className="status-item">Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
            <span className="status-item">Spaces: 2</span>
          </div>
        </div>
      </div>
      
      {/* AI Chat Sidebar - Right Side */}
      {showAiChat && (
        <AIChatSidebar 
          width={aiChatWidth}
          onResize={setAiChatWidth}
        />
      )}
      </div>
    </div>
  );
};

export default CodeEditor;