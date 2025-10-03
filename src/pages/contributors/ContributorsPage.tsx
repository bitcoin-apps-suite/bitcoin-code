import React, { useState, useEffect } from 'react';
import './ContributorsPage.css';

const ContributorsPage: React.FC = () => {
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

  const contributors = [
    {
      id: 1,
      name: "Alex Chen",
      handle: "@alexchen",
      avatar: "👨‍💻",
      contributions: 127,
      earned: "2.5 BSV",
      specialty: "Frontend Development",
      joinDate: "2024-01-15",
      topProject: "DeFi Dashboard"
    },
    {
      id: 2,
      name: "Sarah Johnson", 
      handle: "@sarahj",
      avatar: "👩‍💻",
      contributions: 89,
      earned: "1.8 BSV",
      specialty: "Smart Contracts",
      joinDate: "2024-02-20",
      topProject: "Wallet Integration"
    },
    {
      id: 3,
      name: "Marcus Williams",
      handle: "@marcusw",
      avatar: "🧑‍💻",
      contributions: 156,
      earned: "3.2 BSV",
      specialty: "Backend Development",
      joinDate: "2023-12-10",
      topProject: "API Framework"
    }
  ];

  return (
    <div className="App">
      <div className={`contributors-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contributors-container">
          <section className="contributors-hero">
            <h1>Community <span style={{color: '#22c55e'}}>Contributors</span></h1>
            <p className="contributors-tagline">
              Meet the amazing developers building the future of Bitcoin Code
            </p>
            <div className="contributors-badge">CONTRIBUTORS</div>
          </section>

          <section className="contributors-stats">
            <div className="stat-card">
              <h3>Total Contributors</h3>
              <div className="stat-value">42</div>
            </div>
            <div className="stat-card">
              <h3>Total Contributions</h3>
              <div className="stat-value">1,247</div>
            </div>
            <div className="stat-card">
              <h3>Rewards Distributed</h3>
              <div className="stat-value">15.7 BSV</div>
            </div>
            <div className="stat-card">
              <h3>Active Projects</h3>
              <div className="stat-value">28</div>
            </div>
          </section>

          <section className="contributors-grid">
            {contributors.map(contributor => (
              <div key={contributor.id} className="contributor-card">
                <div className="contributor-header">
                  <div className="contributor-avatar">{contributor.avatar}</div>
                  <div className="contributor-info">
                    <h3>{contributor.name}</h3>
                    <p className="contributor-handle">{contributor.handle}</p>
                    <p className="contributor-specialty">{contributor.specialty}</p>
                  </div>
                </div>

                <div className="contributor-stats">
                  <div className="stat">
                    <span className="stat-label">Contributions</span>
                    <span className="stat-value">{contributor.contributions}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Earned</span>
                    <span className="stat-value">{contributor.earned}</span>
                  </div>
                </div>

                <div className="contributor-details">
                  <div className="detail-row">
                    <span className="detail-label">Joined:</span>
                    <span className="detail-value">
                      {new Date(contributor.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Top Project:</span>
                    <span className="detail-value">{contributor.topProject}</span>
                  </div>
                </div>

                <button className="view-profile-btn">
                  View Profile
                </button>
              </div>
            ))}
          </section>

          <section className="join-contributors">
            <h2>Become a Contributor</h2>
            <p>Join our community and start earning $BCODE tokens for your contributions</p>
            <div className="contribution-ways">
              <div className="way">
                <h4>Code Contributions</h4>
                <p>Submit pull requests and bug fixes</p>
              </div>
              <div className="way">
                <h4>Documentation</h4>
                <p>Help improve our guides and tutorials</p>
              </div>
              <div className="way">
                <h4>Community Support</h4>
                <p>Help other developers in our forums</p>
              </div>
            </div>
            <div className="cta-buttons">
              <button className="join-btn">
                Start Contributing
              </button>
              <a href="/contributors/tasks" className="tasks-btn">
                View Open Tasks
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContributorsPage;