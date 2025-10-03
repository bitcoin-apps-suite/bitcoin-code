import React, { useState, useEffect } from 'react';
import './CreateOfferPage.css';

const CreateOfferPage: React.FC = () => {
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    hourlyRate: '',
    availability: 'part-time',
    experience: 'intermediate',
    portfolio: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Service offer created:', formData);
    alert('Service offer created successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="App">
      <div className={`create-offer-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="create-offer-container">
          {/* Hero Section */}
          <section className="create-offer-hero">
            <h1>Create <span style={{color: '#22c55e'}}>Service Offer</span></h1>
            <p className="create-offer-tagline">
              Showcase your development skills and attract clients in the Bitcoin Code marketplace
            </p>
            <div className="create-offer-badge">DEVELOPERS</div>
          </section>

          {/* Form Section */}
          <section className="offer-form-section">
            <div className="form-container">
              <form onSubmit={handleSubmit} className="offer-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Service Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Full-Stack Bitcoin dApp Development"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your services, what you can build, and your approach..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="skills">Skills & Technologies *</label>
                    <input
                      type="text"
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="React, TypeScript, BSV, Smart Contracts, etc."
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hourlyRate">Hourly Rate (BSV) *</label>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      placeholder="0.001"
                      step="0.0001"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                    >
                      <option value="full-time">Full-time (40+ hrs/week)</option>
                      <option value="part-time">Part-time (20-40 hrs/week)</option>
                      <option value="contract">Contract basis</option>
                      <option value="weekends">Weekends only</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experience">Experience Level</label>
                    <select
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                    >
                      <option value="junior">Junior (0-2 years)</option>
                      <option value="intermediate">Intermediate (2-5 years)</option>
                      <option value="senior">Senior (5+ years)</option>
                      <option value="expert">Expert (10+ years)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="portfolio">Portfolio URL</label>
                    <input
                      type="url"
                      id="portfolio"
                      value={formData.portfolio}
                      onChange={(e) => handleInputChange('portfolio', e.target.value)}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact">Contact Information *</label>
                    <input
                      type="text"
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      placeholder="Email, HandCash handle, or Telegram"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Create Service Offer
                  </button>
                  <button type="button" className="preview-btn">
                    Preview Offer
                  </button>
                </div>
              </form>
            </div>

            {/* Tips Section */}
            <div className="tips-section">
              <h3>Tips for a Great Service Offer</h3>
              <ul className="tips-list">
                <li>✅ Be specific about what you can build</li>
                <li>✅ Include your strongest technical skills</li>
                <li>✅ Set competitive but fair rates</li>
                <li>✅ Showcase your best portfolio pieces</li>
                <li>✅ Respond quickly to client inquiries</li>
                <li>✅ Deliver high-quality work on time</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreateOfferPage;