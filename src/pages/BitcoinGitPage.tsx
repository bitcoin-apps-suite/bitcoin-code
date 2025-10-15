import React, { useState } from 'react';
import { ExternalLink, GitBranch, Shield, Zap, Database, Clock, Users, Code2, ArrowRight, Star, GitCommit, Hash, Layers } from 'lucide-react';
import './BitcoinGitPage.css';

const BitcoinGitPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'integration' | 'roadmap'>('overview');

  const features = [
    {
      icon: <Shield className="feature-icon" />,
      title: "BSV Blockchain Integration",
      description: "Every commit is automatically timestamped and verified on the Bitcoin SV blockchain, creating an immutable record of code evolution.",
      technical: "SHA-256 hashing with BSV transaction verification"
    },
    {
      icon: <GitCommit className="feature-icon" />,
      title: "Cryptographic Commit Verification",
      description: "All commits are cryptographically signed and verified through blockchain consensus, ensuring code integrity and authenticity.",
      technical: "ECDSA signatures with blockchain consensus validation"
    },
    {
      icon: <Database className="feature-icon" />,
      title: "Decentralized Repository Storage",
      description: "Repository data is distributed across the BSV network, eliminating single points of failure and ensuring permanent accessibility.",
      technical: "IPFS-like storage with BSV data availability layer"
    },
    {
      icon: <Clock className="feature-icon" />,
      title: "Immutable History",
      description: "Git history becomes tamper-proof through blockchain anchoring, providing absolute certainty about when code changes occurred.",
      technical: "Merkle tree proofs anchored to BSV blockchain"
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Micropayment Integration",
      description: "Developers can receive instant microtransactions for contributions, commits, and code reviews directly through the Git workflow.",
      technical: "BSV micropayments with sub-satoshi precision"
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Decentralized Collaboration",
      description: "True peer-to-peer collaboration without centralized authorities, powered by Bitcoin's consensus mechanism.",
      technical: "P2P networking with Bitcoin consensus governance"
    }
  ];

  const architectureComponents = [
    {
      name: "Git Core Engine",
      description: "Native Git functionality with BSV extensions",
      status: "active",
      integration: "Deep C integration with libgit2"
    },
    {
      name: "BSV Node Interface",
      description: "Direct connection to Bitcoin SV network",
      status: "active", 
      integration: "Native BSV SDK integration"
    },
    {
      name: "Blockchain Timestamping",
      description: "Automatic commit verification and timestamping",
      status: "active",
      integration: "SHA-256 anchoring with Merkle proofs"
    },
    {
      name: "Decentralized Storage",
      description: "Distributed repository hosting",
      status: "development",
      integration: "IPFS-compatible with BSV data layer"
    },
    {
      name: "Micropayment Gateway",
      description: "Developer compensation system",
      status: "development",
      integration: "HandCash Connect API"
    },
    {
      name: "P2P Network Layer",
      description: "Decentralized collaboration protocol",
      status: "planning",
      integration: "BitTorrent-style with Bitcoin consensus"
    }
  ];

  const comparisonData = [
    { feature: "Centralized Control", traditional: "GitHub/GitLab servers", bitcoinGit: "Decentralized Bitcoin network" },
    { feature: "Data Integrity", traditional: "Server-side validation", bitcoinGit: "Blockchain cryptographic proof" },
    { feature: "History Tampering", traditional: "Possible by admins", bitcoinGit: "Impossible - immutable blockchain" },
    { feature: "Developer Payments", traditional: "Manual/third-party", bitcoinGit: "Automatic micropayments" },
    { feature: "Censorship Resistance", traditional: "Vulnerable to takedown", bitcoinGit: "Fully censorship-resistant" },
    { feature: "Global Accessibility", traditional: "Server dependent", bitcoinGit: "Always available via blockchain" }
  ];

  const roadmapPhases = [
    {
      phase: "Phase 1: Foundation",
      status: "current",
      items: [
        "Core Git + BSV integration",
        "Basic commit timestamping",
        "Cryptographic verification",
        "Local repository management"
      ]
    },
    {
      phase: "Phase 2: Network",
      status: "development", 
      items: [
        "Decentralized storage layer",
        "P2P repository synchronization",
        "Distributed collaboration tools",
        "Network consensus mechanisms"
      ]
    },
    {
      phase: "Phase 3: Economy",
      status: "planning",
      items: [
        "Micropayment integration", 
        "Developer compensation system",
        "Code contribution rewards",
        "Token-based governance"
      ]
    },
    {
      phase: "Phase 4: Platform",
      status: "future",
      items: [
        "Bitcoin-GitHub alternative",
        "Decentralized CI/CD",
        "Smart contract deployment",
        "Global developer network"
      ]
    }
  ];

  return (
    <div className="bitcoin-git-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-header">
            <GitBranch className="hero-icon" />
            <h1>Bitcoin Git</h1>
            <span className="version-badge">v0.1.0-alpha</span>
          </div>
          <h2 className="hero-title">
            The Future of Version Control
          </h2>
          <p className="hero-subtitle">
            Git + Bitcoin SV = Truly decentralized, immutable, and incentivized code collaboration. 
            Every commit verified on the blockchain, every contribution rewarded.
          </p>
          <div className="hero-actions">
            <a 
              href="https://github.com/bitcoin-apps-suite/bitcoin-git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button primary"
            >
              <Code2 /> View Repository
              <ExternalLink size={16} />
            </a>
            <button className="cta-button secondary">
              <GitBranch /> Download Alpha
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>∞</strong>
              <span>Commits Verified</span>
            </div>
            <div className="stat">
              <strong>100%</strong>
              <span>Immutable History</span>
            </div>
            <div className="stat">
              <strong>0ms</strong>
              <span>Payment Latency</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="terminal-demo">
            <div className="terminal-header">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
              <span className="terminal-title">bitcoin-git</span>
            </div>
            <div className="terminal-content">
              <div className="terminal-line">
                <span className="prompt">$</span> git commit -m "Add blockchain integration"
              </div>
              <div className="terminal-line success">
                <span>✅ Commit signed with BSV key</span>
              </div>
              <div className="terminal-line success">
                <span>🔗 Timestamped on block #847291</span>
              </div>
              <div className="terminal-line success">
                <span>💰 0.001 BSV earned for contribution</span>
              </div>
              <div className="terminal-line">
                <span className="hash">Hash: 2d7e8f9a1b3c4d5e6f7g8h9i0j1k2l3m</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="content-section">
        <div className="tab-navigation">
          {(['overview', 'architecture', 'integration', 'roadmap'] as const).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="tab-panel">
              <div className="section-header">
                <h3>What is Bitcoin Git?</h3>
                <p>Bitcoin Git represents the evolution of version control - a fusion of Git's powerful revision management with Bitcoin SV's immutable blockchain technology. It creates a truly decentralized development environment where code integrity is guaranteed and developer contributions are automatically rewarded.</p>
              </div>

              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    {feature.icon}
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                    <div className="technical-note">
                      <Code2 size={14} />
                      <span>{feature.technical}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="comparison-section">
                <h4>Traditional Git vs Bitcoin Git</h4>
                <div className="comparison-table">
                  <div className="comparison-header">
                    <div>Feature</div>
                    <div>Traditional Git</div>
                    <div>Bitcoin Git</div>
                  </div>
                  {comparisonData.map((row, index) => (
                    <div key={index} className="comparison-row">
                      <div className="feature-name">{row.feature}</div>
                      <div className="traditional">{row.traditional}</div>
                      <div className="bitcoin-git">{row.bitcoinGit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="tab-panel">
              <div className="section-header">
                <h3>System Architecture</h3>
                <p>Bitcoin Git is built on a hybrid architecture that seamlessly integrates Git's core functionality with Bitcoin SV's blockchain infrastructure, creating a robust, decentralized version control system.</p>
              </div>

              <div className="architecture-diagram">
                <div className="architecture-layer">
                  <h4>Application Layer</h4>
                  <div className="layer-components">
                    <div className="component">Bitcoin Code IDE</div>
                    <div className="component">Command Line Tools</div>
                    <div className="component">Web Interface</div>
                  </div>
                </div>
                <div className="architecture-layer">
                  <h4>Bitcoin Git Core</h4>
                  <div className="layer-components">
                    <div className="component">Git Engine</div>
                    <div className="component">BSV Integration</div>
                    <div className="component">Crypto Verification</div>
                  </div>
                </div>
                <div className="architecture-layer">
                  <h4>Network Layer</h4>
                  <div className="layer-components">
                    <div className="component">P2P Protocol</div>
                    <div className="component">BSV Network</div>
                    <div className="component">IPFS Storage</div>
                  </div>
                </div>
              </div>

              <div className="components-grid">
                {architectureComponents.map((component, index) => (
                  <div key={index} className="component-card">
                    <div className="component-header">
                      <h4>{component.name}</h4>
                      <span className={`status-badge ${component.status}`}>
                        {component.status}
                      </span>
                    </div>
                    <p>{component.description}</p>
                    <div className="integration-note">
                      <Layers size={14} />
                      <span>{component.integration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'integration' && (
            <div className="tab-panel">
              <div className="section-header">
                <h3>Bitcoin Code Integration</h3>
                <p>Bitcoin Git is deeply integrated with Bitcoin Code, providing a seamless development experience where version control and blockchain verification work together transparently.</p>
              </div>

              <div className="integration-flow">
                <div className="flow-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Code in Bitcoin Code</h4>
                    <p>Write and edit code in the Bitcoin Code IDE with full syntax highlighting and IntelliSense</p>
                  </div>
                  <ArrowRight className="flow-arrow" />
                </div>
                <div className="flow-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Commit with Bitcoin Git</h4>
                    <p>Use integrated Git commands that automatically include BSV verification</p>
                  </div>
                  <ArrowRight className="flow-arrow" />
                </div>
                <div className="flow-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Blockchain Timestamp</h4>
                    <p>Every commit is instantly timestamped and verified on the BSV blockchain</p>
                  </div>
                  <ArrowRight className="flow-arrow" />
                </div>
                <div className="flow-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Earn Rewards</h4>
                    <p>Receive automatic micropayments for quality contributions and commits</p>
                  </div>
                </div>
              </div>

              <div className="integration-features">
                <div className="integration-card">
                  <Hash className="integration-icon" />
                  <h4>Seamless Git Commands</h4>
                  <p>All standard Git commands work exactly as expected, with blockchain verification happening transparently in the background.</p>
                  <div className="code-example">
                    <code>git commit -m "Feature update"</code>
                    <span className="code-comment"># Automatically verified on BSV</span>
                  </div>
                </div>
                <div className="integration-card">
                  <Star className="integration-icon" />
                  <h4>Real-time Verification</h4>
                  <p>See blockchain confirmation status directly in the Bitcoin Code interface, with real-time updates as transactions confirm.</p>
                </div>
                <div className="integration-card">
                  <Shield className="integration-icon" />
                  <h4>Cryptographic Integrity</h4>
                  <p>Every line of code is cryptographically secured, with tamper-evident histories that can be independently verified.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="tab-panel">
              <div className="section-header">
                <h3>Development Roadmap</h3>
                <p>Bitcoin Git is being developed in phases, with each phase building upon the previous to create a complete decentralized development ecosystem.</p>
              </div>

              <div className="roadmap-timeline">
                {roadmapPhases.map((phase, index) => (
                  <div key={index} className={`roadmap-phase ${phase.status}`}>
                    <div className="phase-header">
                      <div className="phase-indicator">
                        <span className="phase-number">{index + 1}</span>
                      </div>
                      <div className="phase-info">
                        <h4>{phase.phase}</h4>
                        <span className={`phase-status ${phase.status}`}>
                          {phase.status === 'current' ? 'In Progress' : 
                           phase.status === 'development' ? 'Development' :
                           phase.status === 'planning' ? 'Planning' : 'Future'}
                        </span>
                      </div>
                    </div>
                    <ul className="phase-items">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="future-vision">
                <h4>The Ultimate Goal: Decentralized GitHub</h4>
                <p>Bitcoin Git is the foundation for creating a completely decentralized alternative to GitHub - a platform where developers maintain full control over their code, contributions are automatically rewarded, and censorship is impossible.</p>
                <div className="vision-features">
                  <div className="vision-item">
                    <Shield />
                    <span>100% Censorship Resistant</span>
                  </div>
                  <div className="vision-item">
                    <Users />
                    <span>Global Developer Network</span>
                  </div>
                  <div className="vision-item">
                    <Zap />
                    <span>Instant Micropayments</span>
                  </div>
                  <div className="vision-item">
                    <Database />
                    <span>Permanent Code Storage</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h3>Ready to Experience the Future?</h3>
          <p>Join the revolution in version control. Bitcoin Git is currently in alpha - perfect for early adopters and developers who want to shape the future of decentralized development.</p>
          <div className="cta-buttons">
            <a 
              href="https://github.com/bitcoin-apps-suite/bitcoin-git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button primary large"
            >
              <GitBranch /> Get Started
              <ExternalLink size={18} />
            </a>
            <button className="cta-button secondary large">
              <Users /> Join Community
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BitcoinGitPage;