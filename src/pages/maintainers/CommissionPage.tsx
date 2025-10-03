import React, { useState, useEffect } from 'react';
import './CommissionPage.css';

const CommissionPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    // Listen for storage changes to detect sidebar collapse state
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    // Check for sidebar state changes via polling
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

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    requirements: '',
    budget: '',
    timeline: '',
    techStack: '',
    projectType: 'web-app',
    priority: 'medium',
    contact: '',
    company: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Development project commissioned:', projectData);
    alert('Project commission created successfully! We\'ll match you with qualified developers.');
  };

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="App">
      <div className={`commission-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="commission-container">
          {/* Hero Section */}
          <section className="commission-hero">
            <h1>Commission <span style={{color: '#22c55e'}}>Development</span></h1>
            <p className="commission-tagline">
              Hire expert developers to build your Bitcoin applications and smart contracts
            </p>
            <div className="commission-badge">MAINTAINERS</div>
          </section>

          {/* Form Section */}
          <section className="commission-form-section">
            <div className="form-container">
              <form onSubmit={handleSubmit} className="commission-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Project Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={projectData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Bitcoin DeFi Trading Platform"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company/Organization</label>
                    <input
                      type="text"
                      id="company"
                      value={projectData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="description">Project Description *</label>
                    <textarea
                      id="description"
                      value={projectData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your project goals, target users, and key features..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="requirements">Technical Requirements *</label>
                    <textarea
                      id="requirements"
                      value={projectData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      placeholder="List specific features, integrations, and technical specifications..."
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="techStack">Preferred Tech Stack</label>
                    <input
                      type="text"
                      id="techStack"
                      value={projectData.techStack}
                      onChange={(e) => handleInputChange('techStack', e.target.value)}
                      placeholder="React, TypeScript, BSV SDK, HandCash, etc."
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="projectType">Project Type</label>
                    <select
                      id="projectType"
                      value={projectData.projectType}
                      onChange={(e) => handleInputChange('projectType', e.target.value)}
                    >
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="smart-contracts">Smart Contracts</option>
                      <option value="defi-platform">DeFi Platform</option>
                      <option value="nft-marketplace">NFT Marketplace</option>
                      <option value="api-backend">API/Backend</option>
                      <option value="blockchain-integration">Blockchain Integration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="budget">Budget Range (BSV) *</label>
                    <select
                      id="budget"
                      value={projectData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      required
                    >
                      <option value="">Select budget range</option>
                      <option value="0.1-0.5">0.1 - 0.5 BSV</option>
                      <option value="0.5-1">0.5 - 1 BSV</option>
                      <option value="1-5">1 - 5 BSV</option>
                      <option value="5-10">5 - 10 BSV</option>
                      <option value="10-25">10 - 25 BSV</option>
                      <option value="25+">25+ BSV (Enterprise)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="timeline">Timeline *</label>
                    <select
                      id="timeline"
                      value={projectData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      required
                    >
                      <option value="">Select timeline</option>
                      <option value="1-week">1 week</option>
                      <option value="2-weeks">2 weeks</option>
                      <option value="1-month">1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="6-months+">6+ months</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="priority">Priority Level</label>
                    <select
                      id="priority"
                      value={projectData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                    >
                      <option value="low">Low - Standard timeline</option>
                      <option value="medium">Medium - Moderate urgency</option>
                      <option value="high">High - Fast delivery needed</option>
                      <option value="critical">Critical - Rush job</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact">Contact Information *</label>
                    <input
                      type="text"
                      id="contact"
                      value={projectData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      placeholder="Email, Telegram, or HandCash handle"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Commission Project
                  </button>
                  <button type="button" className="draft-btn">
                    Save as Draft
                  </button>
                </div>
              </form>
            </div>

            {/* Info Section */}
            <div className="info-section">
              <h3>How It Works</h3>
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Submit Project</h4>
                    <p>Describe your requirements and budget</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Get Matched</h4>
                    <p>We match you with qualified developers</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Review Proposals</h4>
                    <p>Compare developers and their proposals</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Start Development</h4>
                    <p>Work with your chosen developer</p>
                  </div>
                </div>
              </div>

              <div className="benefits">
                <h4>Why Commission Through Bitcoin Code?</h4>
                <ul className="benefits-list">
                  <li>✅ Vetted Bitcoin developers</li>
                  <li>✅ Escrow payment protection</li>
                  <li>✅ Milestone-based payments</li>
                  <li>✅ Code quality assurance</li>
                  <li>✅ Project management support</li>
                  <li>✅ 24/7 customer support</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CommissionPage;