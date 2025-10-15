/**
 * 🏛️ CONTRACT CREATION WIZARD
 * 
 * Revolutionary UI for creating tokenized developer contracts
 * This is where developers join the tokenized ecosystem!
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Coins, 
  Shield, 
  Clock, 
  Star, 
  Globe,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  GitBranch,
  Target
} from 'lucide-react';
import { DeveloperContract, developerContractService } from '../services/DeveloperContractService';
import { tokenAllocationManager } from '../services/TokenAllocationManager';
import './ContractWizard.css';

interface ContractWizardProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onContractCreated: (contract: DeveloperContract) => void;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

const ContractWizard: React.FC<ContractWizardProps> = ({
  isOpen,
  onClose,
  projectId,
  onContractCreated
}) => {
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    // Developer info
    developerId: '',
    fullName: '',
    email: '',
    githubUsername: '',
    portfolioUrl: '',
    timezone: '',
    
    // Contract type
    contractType: 'task-based' as 'full-time' | 'part-time' | 'task-based' | 'revenue-share',
    
    // Skills & experience
    skills: [] as string[],
    experience: 'intermediate' as 'beginner' | 'intermediate' | 'senior' | 'expert',
    
    // Token preferences
    tokenAllocation: {
      baseTokens: 1000000,           // 1M base tokens
      performanceMultiplier: 1.5,    // Up to 1.5x for performance
      preferredMilestones: 5,        // Preferred number of milestones
    },
    
    // Payment preferences
    paymentCurrency: 'BCODE' as 'BSV' | 'USD' | 'BCODE',
    hourlyRate: 50,
    revenueSharePercentage: 15,
    
    // Work preferences
    hoursPerWeek: 40,
    availabilityStart: '',
    projectDuration: 'ongoing' as 'short-term' | 'medium-term' | 'long-term' | 'ongoing',
    
    // Legal preferences
    jurisdiction: 'US',
    ipAssignment: true,
    confidentialityAgreement: true,
    
    // Quality commitments
    codeQualityThreshold: 85,
    testCoverageCommitment: 90,
    documentationCommitment: true,
    communicationFrequency: 'daily' as 'daily' | 'weekly' | 'bi-weekly'
  });
  
  const steps: WizardStep[] = [
    {
      id: 'developer-info',
      title: 'Developer Profile',
      description: 'Tell us about yourself and your development background',
      icon: <User />,
      completed: false
    },
    {
      id: 'contract-type',
      title: 'Contract Structure',
      description: 'Choose your preferred working arrangement and compensation',
      icon: <Briefcase />,
      completed: false
    },
    {
      id: 'token-allocation',
      title: 'Token Rewards',
      description: 'Configure your $BCODE token allocation and performance incentives',
      icon: <Coins />,
      completed: false
    },
    {
      id: 'quality-standards',
      title: 'Quality Standards',
      description: 'Set your quality commitments and performance metrics',
      icon: <Star />,
      completed: false
    },
    {
      id: 'legal-terms',
      title: 'Legal Framework',
      description: 'Configure legal terms and compliance requirements',
      icon: <Shield />,
      completed: false
    },
    {
      id: 'review-sign',
      title: 'Review & Sign',
      description: 'Review your contract and sign on the blockchain',
      icon: <CheckCircle />,
      completed: false
    }
  ];
  
  if (!isOpen) return null;
  
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create the contract
      const contract = await developerContractService.createContract({
        developerId: formData.developerId,
        projectId: projectId || 'general-development',
        contractType: formData.contractType,
        
        tokenAllocation: {
          baseTokens: formData.tokenAllocation.baseTokens,
          performanceMultiplier: formData.tokenAllocation.performanceMultiplier,
          milestoneTokens: Array(formData.tokenAllocation.preferredMilestones).fill(
            formData.tokenAllocation.baseTokens / formData.tokenAllocation.preferredMilestones
          ),
          totalPossibleTokens: formData.tokenAllocation.baseTokens * formData.tokenAllocation.performanceMultiplier
        },
        
        paymentTerms: {
          currency: formData.paymentCurrency,
          rate: formData.hourlyRate,
          milestonePayments: [],
          revenueSharePercentage: formData.revenueSharePercentage
        },
        
        performanceMetrics: {
          codeQualityThreshold: formData.codeQualityThreshold,
          commitFrequency: formData.hoursPerWeek / 8, // Commits per week
          testCoverage: formData.testCoverageCommitment,
          documentationRequired: formData.documentationCommitment
        },
        
        legal: {
          jurisdiction: formData.jurisdiction,
          ipAssignment: formData.ipAssignment,
          nonCompeteClause: false,
          confidentialityRequired: formData.confidentialityAgreement,
          terminationNotice: 14 // 2 weeks notice
        },
        
        startDate: Date.now(),
        milestones: [], // Will be populated later
        
        integrations: {
          githubRepo: formData.githubUsername ? `https://github.com/${formData.githubUsername}` : undefined
        }
      });
      
      onContractCreated(contract);
      onClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contract');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (currentStepData.id) {
      case 'developer-info':
        return (
          <div className="wizard-step">
            <div className="step-header">
              <User className="step-icon" />
              <div>
                <h3>Developer Profile</h3>
                <p>Help us understand your background and expertise</p>
              </div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Developer ID *</label>
                <input
                  type="text"
                  value={formData.developerId}
                  onChange={(e) => setFormData({...formData, developerId: e.target.value})}
                  placeholder="unique-developer-id"
                  required
                />
                <small>This will be your unique identifier in the system</small>
              </div>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>GitHub Username</label>
                <input
                  type="text"
                  value={formData.githubUsername}
                  onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                  placeholder="johndoe"
                />
              </div>
              
              <div className="form-group">
                <label>Portfolio URL</label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                  placeholder="https://portfolio.com"
                />
              </div>
              
              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                >
                  <option value="">Select timezone</option>
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern (EST)</option>
                  <option value="PST">Pacific (PST)</option>
                  <option value="CET">Central European (CET)</option>
                  <option value="JST">Japan (JST)</option>
                </select>
              </div>
            </div>
            
            <div className="experience-section">
              <h4>Experience Level</h4>
              <div className="experience-options">
                {['beginner', 'intermediate', 'senior', 'expert'].map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`experience-btn ${formData.experience === level ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, experience: level as any})}
                  >
                    <div className="level-title">{level.charAt(0).toUpperCase() + level.slice(1)}</div>
                    <div className="level-desc">
                      {level === 'beginner' && '< 2 years'}
                      {level === 'intermediate' && '2-5 years'}
                      {level === 'senior' && '5-10 years'}
                      {level === 'expert' && '10+ years'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'contract-type':
        return (
          <div className="wizard-step">
            <div className="step-header">
              <Briefcase className="step-icon" />
              <div>
                <h3>Contract Structure</h3>
                <p>Choose how you want to work and get compensated</p>
              </div>
            </div>
            
            <div className="contract-types">
              {[
                {
                  type: 'task-based',
                  title: 'Task-Based',
                  description: 'Get paid per completed task or issue',
                  icon: <Target />,
                  features: ['Flexible schedule', 'Task-specific rewards', 'Performance bonuses']
                },
                {
                  type: 'part-time',
                  title: 'Part-Time',
                  description: 'Regular part-time hours with steady income',
                  icon: <Clock />,
                  features: ['20-30 hours/week', 'Regular payments', 'Token bonuses']
                },
                {
                  type: 'full-time',
                  title: 'Full-Time',
                  description: 'Full-time commitment with maximum rewards',
                  icon: <Zap />,
                  features: ['40+ hours/week', 'Full benefits', 'Maximum token allocation']
                },
                {
                  type: 'revenue-share',
                  title: 'Revenue Share',
                  description: 'Get paid based on app revenue performance',
                  icon: <Coins />,
                  features: ['Performance-based', 'High upside potential', 'Equity-like rewards']
                }
              ].map(contractType => (
                <div
                  key={contractType.type}
                  className={`contract-type-card ${formData.contractType === contractType.type ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, contractType: contractType.type as any})}
                >
                  <div className="contract-icon">{contractType.icon}</div>
                  <h4>{contractType.title}</h4>
                  <p>{contractType.description}</p>
                  <ul>
                    {contractType.features.map(feature => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {formData.contractType !== 'revenue-share' && (
              <div className="form-group">
                <label>Hourly Rate (USD)</label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                  min="10"
                  max="500"
                />
                <small>Your base hourly rate in USD</small>
              </div>
            )}
            
            {formData.contractType === 'revenue-share' && (
              <div className="form-group">
                <label>Revenue Share Percentage</label>
                <input
                  type="number"
                  value={formData.revenueSharePercentage}
                  onChange={(e) => setFormData({...formData, revenueSharePercentage: Number(e.target.value)})}
                  min="1"
                  max="50"
                />
                <small>Percentage of app revenue you'll receive</small>
              </div>
            )}
          </div>
        );
        
      case 'token-allocation':
        return (
          <div className="wizard-step">
            <div className="step-header">
              <Coins className="step-icon" />
              <div>
                <h3>Token Rewards Configuration</h3>
                <p>Set up your $BCODE token allocation and performance incentives</p>
              </div>
            </div>
            
            <div className="token-preview">
              <div className="token-stats">
                <div className="stat">
                  <div className="stat-value">{formData.tokenAllocation.baseTokens.toLocaleString()}</div>
                  <div className="stat-label">Base Tokens</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{formData.tokenAllocation.performanceMultiplier}x</div>
                  <div className="stat-label">Max Multiplier</div>
                </div>
                <div className="stat">
                  <div className="stat-value">
                    {(formData.tokenAllocation.baseTokens * formData.tokenAllocation.performanceMultiplier).toLocaleString()}
                  </div>
                  <div className="stat-label">Max Possible</div>
                </div>
              </div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Base Token Allocation</label>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={formData.tokenAllocation.baseTokens}
                  onChange={(e) => setFormData({
                    ...formData, 
                    tokenAllocation: {
                      ...formData.tokenAllocation,
                      baseTokens: Number(e.target.value)
                    }
                  })}
                />
                <div className="range-labels">
                  <span>100K</span>
                  <span>{formData.tokenAllocation.baseTokens.toLocaleString()}</span>
                  <span>10M</span>
                </div>
                <small>Base tokens you'll receive for contract completion</small>
              </div>
              
              <div className="form-group">
                <label>Performance Multiplier</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={formData.tokenAllocation.performanceMultiplier}
                  onChange={(e) => setFormData({
                    ...formData,
                    tokenAllocation: {
                      ...formData.tokenAllocation,
                      performanceMultiplier: Number(e.target.value)
                    }
                  })}
                />
                <div className="range-labels">
                  <span>1.0x</span>
                  <span>{formData.tokenAllocation.performanceMultiplier}x</span>
                  <span>3.0x</span>
                </div>
                <small>Maximum multiplier for exceptional performance</small>
              </div>
              
              <div className="form-group">
                <label>Preferred Payment Currency</label>
                <select
                  value={formData.paymentCurrency}
                  onChange={(e) => setFormData({...formData, paymentCurrency: e.target.value as any})}
                >
                  <option value="BCODE">$BCODE Tokens</option>
                  <option value="BSV">Bitcoin SV</option>
                  <option value="USD">US Dollars</option>
                </select>
                <small>Your preferred currency for payments</small>
              </div>
            </div>
            
            <div className="token-benefits">
              <h4>🎯 Token Benefits</h4>
              <ul>
                <li><CheckCircle size={16} /> <strong>Revenue Sharing:</strong> Earn dividends from app revenues</li>
                <li><CheckCircle size={16} /> <strong>Governance Rights:</strong> Vote on platform decisions</li>
                <li><CheckCircle size={16} /> <strong>Trading:</strong> Trade tokens on integrated exchange</li>
                <li><CheckCircle size={16} /> <strong>Performance Bonuses:</strong> Extra tokens for quality work</li>
                <li><CheckCircle size={16} /> <strong>Vesting Protection:</strong> Tokens vest over time for stability</li>
              </ul>
            </div>
          </div>
        );
        
      case 'quality-standards':
        return (
          <div className="wizard-step">
            <div className="step-header">
              <Star className="step-icon" />
              <div>
                <h3>Quality Standards & Commitments</h3>
                <p>Set your quality benchmarks and performance commitments</p>
              </div>
            </div>
            
            <div className="quality-metrics">
              <div className="metric-group">
                <label>Code Quality Threshold</label>
                <div className="metric-slider">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formData.codeQualityThreshold}
                    onChange={(e) => setFormData({...formData, codeQualityThreshold: Number(e.target.value)})}
                  />
                  <div className="metric-display">
                    <span className="metric-value">{formData.codeQualityThreshold}%</span>
                    <span className="metric-grade">
                      {formData.codeQualityThreshold >= 90 ? 'A+' : 
                       formData.codeQualityThreshold >= 80 ? 'A' :
                       formData.codeQualityThreshold >= 70 ? 'B' : 'C'}
                    </span>
                  </div>
                </div>
                <small>Minimum code quality score for token rewards</small>
              </div>
              
              <div className="metric-group">
                <label>Test Coverage Commitment</label>
                <div className="metric-slider">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.testCoverageCommitment}
                    onChange={(e) => setFormData({...formData, testCoverageCommitment: Number(e.target.value)})}
                  />
                  <div className="metric-display">
                    <span className="metric-value">{formData.testCoverageCommitment}%</span>
                    <span className="metric-status">
                      {formData.testCoverageCommitment >= 90 ? '🏆 Excellent' :
                       formData.testCoverageCommitment >= 70 ? '✅ Good' :
                       formData.testCoverageCommitment >= 50 ? '⚠️ Basic' : '❌ Poor'}
                    </span>
                  </div>
                </div>
                <small>Test coverage percentage you commit to maintaining</small>
              </div>
              
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.documentationCommitment}
                    onChange={(e) => setFormData({...formData, documentationCommitment: e.target.checked})}
                  />
                  <CheckCircle className={`checkbox-icon ${formData.documentationCommitment ? 'checked' : ''}`} />
                  Documentation Commitment
                </label>
                <small>I commit to providing comprehensive code documentation</small>
              </div>
              
              <div className="form-group">
                <label>Communication Frequency</label>
                <select
                  value={formData.communicationFrequency}
                  onChange={(e) => setFormData({...formData, communicationFrequency: e.target.value as any})}
                >
                  <option value="daily">Daily Updates</option>
                  <option value="weekly">Weekly Reports</option>
                  <option value="bi-weekly">Bi-weekly Check-ins</option>
                </select>
                <small>How often you'll provide progress updates</small>
              </div>
            </div>
            
            <div className="quality-preview">
              <h4>📊 Your Quality Profile</h4>
              <div className="quality-bars">
                <div className="quality-bar">
                  <span>Code Quality</span>
                  <div className="bar">
                    <div className="fill" style={{width: `${formData.codeQualityThreshold}%`}}></div>
                  </div>
                  <span>{formData.codeQualityThreshold}%</span>
                </div>
                <div className="quality-bar">
                  <span>Test Coverage</span>
                  <div className="bar">
                    <div className="fill" style={{width: `${formData.testCoverageCommitment}%`}}></div>
                  </div>
                  <span>{formData.testCoverageCommitment}%</span>
                </div>
                <div className="quality-bar">
                  <span>Documentation</span>
                  <div className="bar">
                    <div className="fill" style={{width: formData.documentationCommitment ? '100%' : '0%'}}></div>
                  </div>
                  <span>{formData.documentationCommitment ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'legal-terms':
        return (
          <div className="wizard-step">
            <div className="step-header">
              <Shield className="step-icon" />
              <div>
                <h3>Legal Framework & Compliance</h3>
                <p>Configure legal terms and jurisdictional preferences</p>
              </div>
            </div>
            
            <div className="legal-options">
              <div className="form-group">
                <label>Jurisdiction</label>
                <select
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
                >
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="EU">European Union</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="SG">Singapore</option>
                  <option value="CH">Switzerland</option>
                </select>
                <small>Legal jurisdiction for contract enforcement</small>
              </div>
              
              <div className="legal-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.ipAssignment}
                    onChange={(e) => setFormData({...formData, ipAssignment: e.target.checked})}
                  />
                  <CheckCircle className={`checkbox-icon ${formData.ipAssignment ? 'checked' : ''}`} />
                  IP Assignment Agreement
                </label>
                <small>Assign intellectual property rights to the project</small>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.confidentialityAgreement}
                    onChange={(e) => setFormData({...formData, confidentialityAgreement: e.target.checked})}
                  />
                  <CheckCircle className={`checkbox-icon ${formData.confidentialityAgreement ? 'checked' : ''}`} />
                  Confidentiality Agreement
                </label>
                <small>Agree to maintain confidentiality of project information</small>
              </div>
            </div>
            
            <div className="legal-summary">
              <h4>⚖️ Legal Summary</h4>
              <div className="summary-items">
                <div className="summary-item">
                  <MapPin size={16} />
                  <span>Jurisdiction: {formData.jurisdiction}</span>
                </div>
                <div className="summary-item">
                  <Shield size={16} />
                  <span>IP Assignment: {formData.ipAssignment ? 'Included' : 'Not included'}</span>
                </div>
                <div className="summary-item">
                  <FileText size={16} />
                  <span>Confidentiality: {formData.confidentialityAgreement ? 'Required' : 'Not required'}</span>
                </div>
                <div className="summary-item">
                  <Clock size={16} />
                  <span>Termination Notice: 14 days</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'review-sign':
        return (
          <div className="wizard-step">
            <div className="step-header">
              <CheckCircle className="step-icon" />
              <div>
                <h3>Review & Sign Contract</h3>
                <p>Review all terms and sign your contract on the blockchain</p>
              </div>
            </div>
            
            <div className="contract-summary">
              <div className="summary-section">
                <h4>👤 Developer Information</h4>
                <div className="summary-grid">
                  <span>Name:</span><span>{formData.fullName}</span>
                  <span>Email:</span><span>{formData.email}</span>
                  <span>GitHub:</span><span>{formData.githubUsername || 'Not provided'}</span>
                  <span>Experience:</span><span>{formData.experience}</span>
                </div>
              </div>
              
              <div className="summary-section">
                <h4>💼 Contract Terms</h4>
                <div className="summary-grid">
                  <span>Type:</span><span>{formData.contractType}</span>
                  <span>Rate:</span><span>${formData.hourlyRate}/hour</span>
                  <span>Currency:</span><span>{formData.paymentCurrency}</span>
                  <span>Revenue Share:</span><span>{formData.revenueSharePercentage}%</span>
                </div>
              </div>
              
              <div className="summary-section">
                <h4>💎 Token Allocation</h4>
                <div className="token-summary">
                  <div className="token-item">
                    <Coins />
                    <div>
                      <strong>{formData.tokenAllocation.baseTokens.toLocaleString()} $BCODE</strong>
                      <small>Base allocation</small>
                    </div>
                  </div>
                  <div className="token-item">
                    <Star />
                    <div>
                      <strong>{formData.tokenAllocation.performanceMultiplier}x multiplier</strong>
                      <small>Performance bonus</small>
                    </div>
                  </div>
                  <div className="token-item">
                    <Zap />
                    <div>
                      <strong>{(formData.tokenAllocation.baseTokens * formData.tokenAllocation.performanceMultiplier).toLocaleString()} $BCODE</strong>
                      <small>Maximum possible</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="summary-section">
                <h4>⭐ Quality Standards</h4>
                <div className="summary-grid">
                  <span>Code Quality:</span><span>{formData.codeQualityThreshold}%</span>
                  <span>Test Coverage:</span><span>{formData.testCoverageCommitment}%</span>
                  <span>Documentation:</span><span>{formData.documentationCommitment ? 'Required' : 'Optional'}</span>
                  <span>Communication:</span><span>{formData.communicationFrequency}</span>
                </div>
              </div>
            </div>
            
            <div className="blockchain-signing">
              <div className="signing-info">
                <h4>🔐 Blockchain Signature</h4>
                <p>Your contract will be signed and stored on the Bitcoin SV blockchain for immutable verification.</p>
                <ul>
                  <li>Contract hash will be permanently recorded</li>
                  <li>Terms cannot be altered without consent</li>
                  <li>Timestamp provides legal proof</li>
                  <li>Independent verification possible</li>
                </ul>
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}
          </div>
        );
        
      default:
        return <div>Step not found</div>;
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="contract-wizard">
        <div className="wizard-header">
          <h2>🏛️ Create Developer Contract</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {/* Progress Steps */}
        <div className="wizard-progress">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {index < currentStep ? <CheckCircle size={16} /> : step.icon}
              </div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Step Content */}
        <div className="wizard-content">
          {renderStep()}
        </div>
        
        {/* Navigation */}
        <div className="wizard-navigation">
          <button
            className="nav-btn secondary"
            onClick={prevStep}
            disabled={isFirstStep}
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          
          <div className="step-indicator">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          {!isLastStep ? (
            <button
              className="nav-btn primary"
              onClick={nextStep}
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="nav-btn primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Signing Contract...' : 'Sign on Blockchain'}
              <GitBranch size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractWizard;