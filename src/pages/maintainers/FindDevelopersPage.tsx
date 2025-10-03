import React, { useState, useEffect } from 'react';
import './FindDevelopersPage.css';

interface Developer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  title: string;
  experience: string;
  hourlyRate: string;
  availability: string;
  skills: string[];
  rating: number;
  completedProjects: number;
  languages: string[];
  timezone: string;
  responseTime: string;
  portfolio: string;
  contact: string;
}

const FindDevelopersPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

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

  // Mock developers data
  const developers: Developer[] = [
    {
      id: '1',
      name: 'Alex Chen',
      username: 'alexchen_dev',
      avatar: '👨‍💻',
      title: 'Full-Stack Bitcoin Developer',
      experience: 'Senior (5+ years)',
      hourlyRate: '0.002 BSV/hr',
      availability: 'Available',
      skills: ['React', 'TypeScript', 'BSV SDK', 'Smart Contracts', 'HandCash'],
      rating: 4.9,
      completedProjects: 24,
      languages: ['English', 'Mandarin'],
      timezone: 'UTC+8',
      responseTime: '< 2 hours',
      portfolio: 'https://github.com/alexchen',
      contact: 'alex@bitcoindev.com'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      username: 'sarah_builds',
      avatar: '👩‍💻',
      title: 'Blockchain Frontend Specialist',
      experience: 'Senior (4+ years)',
      hourlyRate: '0.0015 BSV/hr',
      availability: 'Available',
      skills: ['Vue.js', 'React', 'BSV', 'DeFi', 'Web3'],
      rating: 4.8,
      completedProjects: 18,
      languages: ['English', 'Spanish'],
      timezone: 'UTC-5',
      responseTime: '< 1 hour',
      portfolio: 'https://sarahbuilds.dev',
      contact: '$sarahbuilds'
    },
    {
      id: '3',
      name: 'Marcus Williams',
      username: 'marcus_smart',
      avatar: '🧑‍💻',
      title: 'Smart Contract Developer',
      experience: 'Expert (8+ years)',
      hourlyRate: '0.003 BSV/hr',
      availability: 'Busy',
      skills: ['Solidity', 'BSV Script', 'Security Auditing', 'DeFi', 'Ordinals'],
      rating: 5.0,
      completedProjects: 42,
      languages: ['English'],
      timezone: 'UTC+0',
      responseTime: '< 4 hours',
      portfolio: 'https://github.com/marcussmart',
      contact: 'marcus@smartcontracts.io'
    }
  ];

  const filteredDevelopers = developers.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dev.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = !skillFilter || dev.skills.some(skill => 
      skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    const matchesAvailability = !availabilityFilter || dev.availability === availabilityFilter;
    
    return matchesSearch && matchesSkill && matchesAvailability;
  });

  const handleContactDeveloper = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setShowContactModal(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ));
  };

  return (
    <div className="App">
      <div className={`find-developers-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="find-developers-container">
          {/* Hero Section */}
          <section className="find-developers-hero">
            <h1>Find <span style={{color: '#3b82f6'}}>Developers</span></h1>
            <p className="find-developers-tagline">
              Connect with expert Bitcoin developers ready to build your next project
            </p>
            <div className="find-developers-badge">MAINTAINERS</div>
          </section>

          {/* Search and Filters */}
          <section className="search-section">
            <div className="search-controls">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search developers by name, skills, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-group">
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Skills</option>
                  <option value="React">React</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="BSV">BSV</option>
                  <option value="Smart Contracts">Smart Contracts</option>
                  <option value="DeFi">DeFi</option>
                </select>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Availability</option>
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </section>

          {/* Developers Grid */}
          <section className="developers-grid">
            {filteredDevelopers.map(developer => (
              <div key={developer.id} className={`developer-card ${developer.availability.toLowerCase()}`}>
                <div className="developer-header">
                  <div className="developer-avatar">{developer.avatar}</div>
                  <div className="developer-info">
                    <h3>{developer.name}</h3>
                    <p className="developer-username">@{developer.username}</p>
                    <p className="developer-title">{developer.title}</p>
                  </div>
                  <div className={`availability-badge ${developer.availability.toLowerCase()}`}>
                    {developer.availability}
                  </div>
                </div>

                <div className="developer-stats">
                  <div className="stat">
                    <span className="stat-value">{developer.rating}</span>
                    <div className="rating-stars">
                      {renderStars(Math.floor(developer.rating))}
                    </div>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{developer.completedProjects}</span>
                    <span className="stat-label">Projects</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{developer.responseTime}</span>
                    <span className="stat-label">Response</span>
                  </div>
                </div>

                <div className="developer-details">
                  <div className="detail-row">
                    <span className="detail-label">Experience:</span>
                    <span className="detail-value">{developer.experience}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Rate:</span>
                    <span className="detail-value">{developer.hourlyRate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Timezone:</span>
                    <span className="detail-value">{developer.timezone}</span>
                  </div>
                </div>

                <div className="developer-skills">
                  {developer.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                  {developer.skills.length > 4 && (
                    <span className="skill-tag more">+{developer.skills.length - 4} more</span>
                  )}
                </div>

                <div className="developer-actions">
                  <button 
                    className="contact-btn"
                    onClick={() => handleContactDeveloper(developer)}
                  >
                    Contact Developer
                  </button>
                  <a 
                    href={developer.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-btn"
                  >
                    View Portfolio
                  </a>
                </div>
              </div>
            ))}
          </section>

          {/* Contact Modal */}
          {showContactModal && selectedDeveloper && (
            <div className="contact-modal" onClick={() => setShowContactModal(false)}>
              <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="close-button" 
                  onClick={() => setShowContactModal(false)}
                >×</button>
                
                <h2>Contact {selectedDeveloper.name}</h2>
                
                <div className="contact-info">
                  <div className="contact-method">
                    <h4>Email</h4>
                    <p>{selectedDeveloper.contact}</p>
                  </div>
                  <div className="contact-method">
                    <h4>Portfolio</h4>
                    <a href={selectedDeveloper.portfolio} target="_blank" rel="noopener noreferrer">
                      {selectedDeveloper.portfolio}
                    </a>
                  </div>
                </div>

                <div className="quick-hire">
                  <h4>Quick Hire</h4>
                  <p>Send a project brief directly to {selectedDeveloper.name}</p>
                  <textarea
                    placeholder="Describe your project requirements..."
                    rows={4}
                    className="project-brief"
                  />
                  <button className="send-brief-btn">
                    Send Project Brief
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDevelopersPage;