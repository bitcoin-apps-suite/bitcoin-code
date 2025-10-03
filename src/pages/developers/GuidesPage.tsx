import React, { useState, useEffect } from 'react';
import './GuidesPage.css';

const GuidesPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  const guides = [
    {
      id: 1,
      title: "Getting Started with Bitcoin Code",
      description: "Learn the basics of developing on Bitcoin SV using our IDE",
      level: "Beginner",
      duration: "30 min",
      tags: ["Getting Started", "BSV", "Basics"]
    },
    {
      id: 2,
      title: "Smart Contract Development",
      description: "Build and deploy smart contracts on Bitcoin SV",
      level: "Intermediate", 
      duration: "45 min",
      tags: ["Smart Contracts", "BSV Script", "Blockchain"]
    },
    {
      id: 3,
      title: "Wallet Integration Guide",
      description: "Integrate HandCash and other BSV wallets into your apps",
      level: "Intermediate",
      duration: "60 min", 
      tags: ["Wallets", "HandCash", "Integration"]
    },
    {
      id: 4,
      title: "NFT Development on BSV",
      description: "Create and trade NFTs using Bitcoin SV protocols",
      level: "Advanced",
      duration: "90 min",
      tags: ["NFTs", "Tokens", "Blockchain"]
    }
  ];

  return (
    <div className="App">
      <div className={`guides-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="guides-container">
          <section className="guides-hero">
            <h1>Development <span style={{color: '#22c55e'}}>Guides</span></h1>
            <p className="guides-tagline">
              Learn to build powerful applications on Bitcoin SV with our comprehensive guides
            </p>
            <div className="guides-badge">DEVELOPERS</div>
          </section>

          <section className="guides-grid">
            {guides.map(guide => (
              <div key={guide.id} className="guide-card">
                <div className="guide-header">
                  <h3>{guide.title}</h3>
                  <div className="guide-meta">
                    <span className={`level-badge ${guide.level.toLowerCase()}`}>
                      {guide.level}
                    </span>
                    <span className="duration">{guide.duration}</span>
                  </div>
                </div>
                <p className="guide-description">{guide.description}</p>
                <div className="guide-tags">
                  {guide.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <button className="start-guide-btn">
                  Start Guide →
                </button>
              </div>
            ))}
          </section>

          <section className="quick-start">
            <h2>Quick Start Resources</h2>
            <div className="resources-grid">
              <div className="resource-item">
                <h4>API Documentation</h4>
                <p>Complete reference for all Bitcoin Code APIs</p>
                <a href="/api" className="resource-link">View Docs</a>
              </div>
              <div className="resource-item">
                <h4>Code Templates</h4>
                <p>Pre-built templates to get you started quickly</p>
                <a href="/developers/templates" className="resource-link">Browse Templates</a>
              </div>
              <div className="resource-item">
                <h4>Community Projects</h4>
                <p>Explore open source projects from the community</p>
                <a href="/contributors/projects" className="resource-link">View Projects</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;