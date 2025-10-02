import React, { useState, useRef, useEffect } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { 
  Play, 
  Download, 
  Package, 
  Code2, 
  FileCode,
  FolderOpen
} from 'lucide-react';
import './AppBuilder.css';

interface AppFile {
  name: string;
  type: 'html' | 'css' | 'js';
  content: string;
}

interface Library {
  name: string;
  version: string;
  url: string;
  description: string;
}

const AppBuilder: React.FC = () => {
  const [files, setFiles] = useState<AppFile[]>([
    {
      name: 'index.html',
      type: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Bitcoin Code App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <h1>Welcome to Bitcoin Code</h1>
        <p>Start building your decentralized application!</p>
        <button id="connectBtn">Connect Wallet</button>
    </div>
    <script src="app.js"></script>
</body>
</html>`
    },
    {
      name: 'style.css',
      type: 'css',
      content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

#app {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 1rem;
}

button:hover {
    background: #5a67d8;
}`
    },
    {
      name: 'app.js',
      type: 'js',
      content: `// Bitcoin Code - Main Application Logic
console.log('Bitcoin Code initialized!');

// Connect wallet functionality
document.getElementById('connectBtn').addEventListener('click', async () => {
    console.log('Connecting to wallet...');
    
    // Add your wallet connection logic here
    // For example, HandCash or other BSV wallet integration
    
    alert('Wallet connection coming soon! This is where you would integrate BSV wallets.');
});

// Example: Load BSV library when available
if (window.bsv) {
    console.log('BSV library loaded:', window.bsv);
}

// Your app logic goes here
class BitcoinApp {
    constructor() {
        this.isConnected = false;
        this.userAddress = null;
    }
    
    async connect() {
        // Implement wallet connection
        console.log('Connecting...');
    }
    
    async sendTransaction(amount, recipient) {
        // Implement BSV transaction
        console.log('Sending transaction...');
    }
}

const app = new BitcoinApp();`
    }
  ]);

  const [activeFile, setActiveFile] = useState<AppFile>(files[0]);
  const [libraries, setLibraries] = useState<Library[]>([
    {
      name: 'BSV SDK',
      version: '1.7.6',
      url: 'https://unpkg.com/@bsv/sdk@1.7.6/dist/bsv.browser.min.js',
      description: 'Bitcoin SV SDK for blockchain interactions'
    }
  ]);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current && !editorViewRef.current) {
      const startState = EditorState.create({
        doc: activeFile.content,
        extensions: [
          basicSetup,
          activeFile.type === 'js' ? javascript() : 
          activeFile.type === 'html' ? html() : 
          css(),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              setFiles(prev => prev.map(f => 
                f.name === activeFile.name 
                  ? { ...f, content: newContent }
                  : f
              ));
            }
          })
        ]
      });

      editorViewRef.current = new EditorView({
        state: startState,
        parent: editorRef.current
      });
    }

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, [activeFile]);

  const runApp = () => {
    const htmlFile = files.find(f => f.type === 'html');
    const cssFile = files.find(f => f.type === 'css');
    const jsFile = files.find(f => f.type === 'js');

    if (!htmlFile) return;

    // Inject CSS and JS into HTML
    let finalHtml = htmlFile.content;
    
    // Add libraries
    const libraryScripts = libraries.map(lib => 
      `<script src="${lib.url}"></script>`
    ).join('\n');
    
    finalHtml = finalHtml.replace('</head>', `${libraryScripts}\n</head>`);
    
    // Inject CSS
    if (cssFile) {
      finalHtml = finalHtml.replace(
        '<link rel="stylesheet" href="style.css">',
        `<style>${cssFile.content}</style>`
      );
    }
    
    // Inject JS
    if (jsFile) {
      finalHtml = finalHtml.replace(
        '<script src="app.js"></script>',
        `<script>${jsFile.content}</script>`
      );
    }

    const blob = new Blob([finalHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setShowPreview(true);
  };

  const addLibrary = (lib: Library) => {
    setLibraries(prev => [...prev, lib]);
    setShowLibraryModal(false);
  };

  const exportApp = () => {
    const zip = {
      'index.html': files.find(f => f.name === 'index.html')?.content || '',
      'style.css': files.find(f => f.name === 'style.css')?.content || '',
      'app.js': files.find(f => f.name === 'app.js')?.content || '',
      'libraries.json': JSON.stringify(libraries, null, 2)
    };

    // For now, just download as a JSON file
    const blob = new Blob([JSON.stringify(zip, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bitcoin-app-export.json';
    a.click();
  };

  return (
    <div className="app-builder">
      <div className="builder-header">
        <div className="builder-title">
          <Code2 className="icon" />
          <h2>Bitcoin Code</h2>
        </div>
        <div className="builder-actions">
          <button onClick={() => setShowLibraryModal(true)} className="action-btn">
            <Package /> Add Library
          </button>
          <button onClick={runApp} className="action-btn primary">
            <Play /> Run App
          </button>
          <button onClick={exportApp} className="action-btn">
            <Download /> Export
          </button>
        </div>
      </div>

      <div className="builder-content">
        <div className="files-sidebar">
          <div className="files-header">
            <FolderOpen className="icon" />
            <span>Project Files</span>
          </div>
          {files.map(file => (
            <div 
              key={file.name}
              className={`file-item ${activeFile.name === file.name ? 'active' : ''}`}
              onClick={() => setActiveFile(file)}
            >
              <FileCode className="file-icon" />
              <span>{file.name}</span>
            </div>
          ))}
        </div>

        <div className="code-editor">
          <div className="editor-header">
            <span className="file-name">{activeFile.name}</span>
            <span className={`file-type ${activeFile.type}`}>{activeFile.type.toUpperCase()}</span>
          </div>
          <div ref={editorRef} className="editor-container" />
        </div>

        {showPreview && (
          <div className="preview-panel">
            <div className="preview-header">
              <span>Live Preview</span>
              <button onClick={() => setShowPreview(false)} className="close-btn">×</button>
            </div>
            <iframe 
              src={previewUrl} 
              title="App Preview"
              className="preview-iframe"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>

      {showLibraryModal && (
        <LibraryModal 
          onClose={() => setShowLibraryModal(false)}
          onAdd={addLibrary}
          existingLibraries={libraries}
        />
      )}
    </div>
  );
};

const LibraryModal: React.FC<{
  onClose: () => void;
  onAdd: (lib: Library) => void;
  existingLibraries: Library[];
}> = ({ onClose, onAdd, existingLibraries }) => {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const popularLibraries = [
    { 
      name: 'React', 
      version: '18.2.0', 
      url: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
      description: 'A JavaScript library for building user interfaces'
    },
    { 
      name: 'Vue.js', 
      version: '3.3.4', 
      url: 'https://unpkg.com/vue@3.3.4/dist/vue.global.js',
      description: 'The Progressive JavaScript Framework'
    },
    { 
      name: 'Three.js', 
      version: '0.155.0', 
      url: 'https://unpkg.com/three@0.155.0/build/three.min.js',
      description: '3D graphics library'
    },
    { 
      name: 'Chart.js', 
      version: '4.3.0', 
      url: 'https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js',
      description: 'Simple yet flexible JavaScript charting'
    },
    { 
      name: 'HandCash SDK', 
      version: '0.0.4', 
      url: 'https://unpkg.com/@handcash/handcash-sdk@0.0.4/dist/browser.js',
      description: 'HandCash wallet integration for BSV'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && url) {
      onAdd({ name, version, url, description });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Open Source Library</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-content">
          <div className="popular-libraries">
            <h4>Popular Libraries</h4>
            <div className="library-grid">
              {popularLibraries.map(lib => (
                <div 
                  key={lib.name}
                  className="library-card"
                  onClick={() => {
                    if (!existingLibraries.find(l => l.name === lib.name)) {
                      onAdd(lib);
                    }
                  }}
                >
                  <div className="library-name">{lib.name}</div>
                  <div className="library-version">v{lib.version}</div>
                  <div className="library-desc">{lib.description}</div>
                  {existingLibraries.find(l => l.name === lib.name) && (
                    <div className="library-added">Already Added</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="custom-library">
            <h4>Add Custom Library</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Library Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Version (optional)"
                value={version}
                onChange={e => setVersion(e.target.value)}
              />
              <input
                type="url"
                placeholder="CDN URL"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <button type="submit" className="submit-btn">Add Library</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBuilder;