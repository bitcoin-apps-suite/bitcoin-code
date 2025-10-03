import React, { useState, useEffect } from 'react';
import './TemplatesPage.css';

const TemplatesPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  const templates = [
    {
      id: 1,
      title: "DeFi Trading Platform",
      description: "Complete decentralized exchange with wallet integration",
      category: "defi",
      language: "TypeScript",
      framework: "React",
      features: ["Wallet Connect", "Token Swaps", "Liquidity Pools"],
      downloads: 1250,
      rating: 4.8
    },
    {
      id: 2,
      title: "NFT Marketplace",
      description: "Full-featured NFT marketplace with minting and trading",
      category: "nft",
      language: "JavaScript",
      framework: "Vue.js",
      features: ["NFT Minting", "Auction System", "Royalties"],
      downloads: 890,
      rating: 4.6
    },
    {
      id: 3,
      title: "Smart Contract Wallet",
      description: "Multi-signature wallet with advanced security features",
      category: "wallet",
      language: "TypeScript",
      framework: "React",
      features: ["Multi-sig", "Hardware Support", "DApp Browser"],
      downloads: 650,
      rating: 4.9
    },
    {
      id: 4,
      title: "Blockchain Game",
      description: "Web3 game with on-chain assets and rewards",
      category: "gaming",
      language: "JavaScript",
      framework: "Three.js",
      features: ["3D Graphics", "Token Rewards", "Leaderboards"],
      downloads: 420,
      rating: 4.5
    }
  ];

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'defi', label: 'DeFi' },
    { value: 'nft', label: 'NFT' },
    { value: 'wallet', label: 'Wallets' },
    { value: 'gaming', label: 'Gaming' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="App">
      <div className={`templates-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="templates-container">
          <section className="templates-hero">
            <h1>Code <span style={{color: '#22c55e'}}>Templates</span></h1>
            <p className="templates-tagline">
              Jump-start your development with professional, tested code templates
            </p>
            <div className="templates-badge">DEVELOPERS</div>
          </section>

          <section className="templates-filters">
            <div className="filter-controls">
              <h3>Filter by Category</h3>
              <div className="category-buttons">
                {categories.map(category => (
                  <button
                    key={category.value}
                    className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="templates-grid">
            {filteredTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <h3>{template.title}</h3>
                  <div className="template-rating">
                    ⭐ {template.rating}
                  </div>
                </div>
                
                <p className="template-description">{template.description}</p>
                
                <div className="template-tech">
                  <span className="tech-item">{template.language}</span>
                  <span className="tech-item">{template.framework}</span>
                </div>
                
                <div className="template-features">
                  {template.features.map(feature => (
                    <span key={feature} className="feature-tag">{feature}</span>
                  ))}
                </div>
                
                <div className="template-stats">
                  <span className="downloads">
                    📥 {template.downloads.toLocaleString()} downloads
                  </span>
                </div>
                
                <div className="template-actions">
                  <button className="preview-btn">
                    👁️ Preview
                  </button>
                  <button className="use-template-btn">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section className="template-creation">
            <h2>Create Your Own Template</h2>
            <p>Share your code with the community and earn $BCODE tokens</p>
            <div className="creation-benefits">
              <div className="benefit">
                <h4>Earn Tokens</h4>
                <p>Get rewarded for every download of your template</p>
              </div>
              <div className="benefit">
                <h4>Build Reputation</h4>
                <p>Establish yourself as a trusted developer in the community</p>
              </div>
              <div className="benefit">
                <h4>Help Others</h4>
                <p>Speed up development for other builders</p>
              </div>
            </div>
            <button className="submit-template-btn">
              Submit Your Template
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;