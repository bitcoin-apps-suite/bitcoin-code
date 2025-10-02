import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import AppBuilder from './components/AppBuilder';
import ProofOfConceptBar from './components/ProofOfConceptBar';
import CleanTaskbar from './components/CleanTaskbar';
import Dock from './components/Dock';
import DevSidebar from './components/OSDevSidebar';
import { Code2, Package, Zap, Globe, Shield, Rocket } from 'lucide-react';

function App() {
  const [showBuilder, setShowBuilder] = useState(false);

  const HomePage = () => (
    <div className="homepage">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <Code2 className="logo-icon" />
            <h1>Bitcoin Code</h1>
          </div>
          <nav className="nav-menu">
            <a href="#features">Features</a>
            <a href="#templates">Templates</a>
            <a href="#docs">Documentation</a>
            <button 
              className="start-building-btn"
              onClick={() => setShowBuilder(true)}
            >
              Start Building
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">
              Build Decentralized Apps on Bitcoin
            </h2>
            <p className="hero-subtitle">
              A powerful, open-source platform for creating blockchain applications
              with integrated BSV wallet support and smart contract capabilities.
            </p>
            <div className="hero-actions">
              <button 
                className="cta-button primary"
                onClick={() => setShowBuilder(true)}
              >
                <Rocket /> Launch Code Editor
              </button>
              <button className="cta-button secondary">
                <Globe /> View Examples
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-preview">
              <div className="code-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <pre className="code-content">
{`// Build with Bitcoin Code
const app = new BitcoinCode({
  network: 'mainnet',
  wallet: 'handcash'
});

app.createTransaction({
  to: recipient,
  amount: 0.001,
  data: metadata
});`}
              </pre>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <h3 className="section-title">Platform Features</h3>
          <div className="features-grid">
            <FeatureCard
              icon={<Code2 />}
              title="In-Browser IDE"
              description="Write, test, and deploy your apps directly in the browser with our powerful CodeMirror-based editor."
            />
            <FeatureCard
              icon={<Package />}
              title="Open Source Libraries"
              description="Access a curated collection of open-source libraries. Add any npm package via CDN with one click."
            />
            <FeatureCard
              icon={<Zap />}
              title="Live Preview"
              description="See your changes instantly with hot-reload preview. Test your app in real-time as you code."
            />
            <FeatureCard
              icon={<Shield />}
              title="BSV Integration"
              description="Built-in support for Bitcoin SV wallets, transactions, and smart contracts."
            />
            <FeatureCard
              icon={<Globe />}
              title="Deploy Anywhere"
              description="Export your app as standalone HTML or deploy to IPFS, GitHub Pages, or your own server."
            />
            <FeatureCard
              icon={<Rocket />}
              title="Template Library"
              description="Start with pre-built templates for DeFi, NFTs, games, and more. Customize to your needs."
            />
          </div>
        </section>

        <section className="library-section">
          <h3 className="section-title">Integrated Libraries</h3>
          <p className="section-subtitle">
            Build powerful applications with these pre-integrated open-source libraries
          </p>
          <div className="libraries-showcase">
            <LibraryCard name="React" version="18.2.0" description="UI Components" />
            <LibraryCard name="Vue.js" version="3.3.4" description="Progressive Framework" />
            <LibraryCard name="Three.js" version="0.155.0" description="3D Graphics" />
            <LibraryCard name="BSV SDK" version="1.7.6" description="Blockchain Integration" />
            <LibraryCard name="HandCash" version="0.0.4" description="Wallet Connect" />
            <LibraryCard name="Chart.js" version="4.3.0" description="Data Visualization" />
          </div>
          <div className="library-cta">
            <p>Can't find what you need? Add any library from npm or CDN!</p>
            <button className="add-library-btn">
              <Package /> Browse Library Catalog
            </button>
          </div>
        </section>

        <section id="templates" className="templates-section">
          <h3 className="section-title">Start with a Template</h3>
          <div className="templates-grid">
            <TemplateCard 
              title="DeFi Dashboard"
              description="Track and manage your Bitcoin assets"
              tags={['Finance', 'Charts', 'Wallet']}
            />
            <TemplateCard 
              title="NFT Marketplace"
              description="Create and trade digital collectibles"
              tags={['NFT', 'Commerce', 'IPFS']}
            />
            <TemplateCard 
              title="P2P Chat App"
              description="Encrypted messaging on the blockchain"
              tags={['Social', 'Encryption', 'Real-time']}
            />
            <TemplateCard 
              title="Blockchain Game"
              description="Build games with on-chain logic"
              tags={['Gaming', 'Three.js', 'Smart Contracts']}
            />
          </div>
        </section>

        <section className="getting-started">
          <h3 className="section-title">Getting Started</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Choose a Template</h4>
              <p>Start with a template or begin from scratch</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Add Libraries</h4>
              <p>Import any open-source library you need</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Write Your Code</h4>
              <p>Build with HTML, CSS, and JavaScript</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Deploy</h4>
              <p>Export or deploy your app instantly</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Bitcoin Code</h4>
            <p>Open-source platform for building decentralized applications</p>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#api">API Reference</a></li>
              <li><a href="#examples">Examples</a></li>
              <li><a href="https://github.com/bitcoin-apps-suite/bitcoin-app">GitHub</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li><a href="#discord">Discord</a></li>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#forum">Forum</a></li>
              <li><a href="#contribute">Contribute</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Bitcoin Code. Open BSV License</p>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="App">
      <ProofOfConceptBar />
      <CleanTaskbar 
        isAuthenticated={false}
        currentUser={null}
        onLogout={() => console.log('Logout')}
        onNewProject={() => console.log('New project')}
        onSaveProject={() => console.log('Save project')}
        onOpenLibraryModal={() => console.log('Open library modal')}
      />
      <div className="app-container" style={{ display: 'flex', flex: 1, position: 'relative', marginTop: '72px' }}>
        <DevSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {showBuilder ? (
            <>
              <button 
                className="back-to-home"
                onClick={() => setShowBuilder(false)}
                style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 100 }}
              >
                ← Back to Home
              </button>
              <AppBuilder />
            </>
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          )}
        </div>
      </div>
      <Dock />
    </div>
  );
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

const LibraryCard: React.FC<{
  name: string;
  version: string;
  description: string;
}> = ({ name, version, description }) => (
  <div className="library-card">
    <div className="library-info">
      <span className="library-name">{name}</span>
      <span className="library-version">v{version}</span>
    </div>
    <span className="library-description">{description}</span>
  </div>
);

const TemplateCard: React.FC<{
  title: string;
  description: string;
  tags: string[];
}> = ({ title, description, tags }) => (
  <div className="template-card">
    <h4>{title}</h4>
    <p>{description}</p>
    <div className="template-tags">
      {tags.map(tag => (
        <span key={tag} className="tag">{tag}</span>
      ))}
    </div>
  </div>
);

export default App;