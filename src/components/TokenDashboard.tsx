/**
 * 💎 TOKEN DASHBOARD & ANALYTICS
 * 
 * Real-time developer token balance, performance metrics, and earnings tracking
 * Integrates with DeveloperContractService and TokenAllocationManager
 */

import React, { useState, useEffect } from 'react';
import './TokenDashboard.css';
import { developerContractService } from '../services/DeveloperContractService';
import { tokenAllocationManager } from '../services/TokenAllocationManager';

interface TokenDashboardProps {
  developerId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface DeveloperStats {
  totalTokens: number;
  vestedTokens: number;
  unvestedTokens: number;
  usdValue: number;
  totalEarnings: number;
  performanceRating: 'poor' | 'good' | 'excellent';
  averageQuality: number;
  milestonesCompleted: number;
  activeContracts: number;
  recentAllocations: any[];
  monthlyEarnings: { month: string; tokens: number; usd: number }[];
}

const TokenDashboard: React.FC<TokenDashboardProps> = ({ developerId, isOpen, onClose }) => {
  const [stats, setStats] = useState<DeveloperStats | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('3M');
  const [activeTab, setActiveTab] = useState<'overview' | 'allocations' | 'contracts' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);

  // Mock BCODE token price - in production this would come from an API
  const BCODE_PRICE_USD = 0.0034;

  useEffect(() => {
    if (isOpen && developerId) {
      loadDeveloperStats();
    }
  }, [isOpen, developerId]);

  const loadDeveloperStats = async () => {
    setLoading(true);
    try {
      // Get performance data
      const performance = developerContractService.getDeveloperPerformance(developerId);
      
      // Get detailed token allocations
      const allocations = await tokenAllocationManager.getDeveloperAllocations(developerId);
      
      // Calculate vested vs unvested tokens
      const totalTokens = performance.totalTokensEarned;
      const vestedTokens = allocations.filter(a => a.vestingSchedule?.vestedAmount || 0).reduce((sum, a) => sum + (a.vestingSchedule?.vestedAmount || a.tokenAmount), 0);
      const unvestedTokens = totalTokens - vestedTokens;

      // Mock monthly earnings data
      const monthlyEarnings = [
        { month: 'Oct', tokens: 125000, usd: 425 },
        { month: 'Sep', tokens: 89000, usd: 302.60 },
        { month: 'Aug', tokens: 234000, usd: 795.60 },
        { month: 'Jul', tokens: 156000, usd: 530.40 },
        { month: 'Jun', tokens: 198000, usd: 673.20 },
        { month: 'May', tokens: 176000, usd: 598.40 }
      ].reverse();

      const developerStats: DeveloperStats = {
        totalTokens,
        vestedTokens,
        unvestedTokens,
        usdValue: totalTokens * BCODE_PRICE_USD,
        totalEarnings: totalTokens * BCODE_PRICE_USD,
        performanceRating: performance.performanceRating,
        averageQuality: performance.averageQualityScore,
        milestonesCompleted: performance.milestonesCompleted,
        activeContracts: performance.contractsActive,
        recentAllocations: allocations.slice(-10),
        monthlyEarnings
      };

      setStats(developerStats);
    } catch (error) {
      console.error('Failed to load developer stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTokens = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };

  const getPerformanceColor = (rating: string): string => {
    switch (rating) {
      case 'excellent': return '#00ff88';
      case 'good': return '#ffa500';
      case 'poor': return '#ff4444';
      default: return '#666';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="token-dashboard-overlay">
      <div className="token-dashboard">
        <div className="dashboard-header">
          <div className="header-left">
            <h2>💎 Token Dashboard</h2>
            <p>Developer ID: {developerId}</p>
          </div>
          <div className="header-right">
            <div className="timeframe-selector">
              {['1M', '3M', '6M', '1Y', 'ALL'].map(period => (
                <button
                  key={period}
                  className={selectedTimeframe === period ? 'active' : ''}
                  onClick={() => setSelectedTimeframe(period as any)}
                >
                  {period}
                </button>
              ))}
            </div>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="dashboard-tabs">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'allocations', label: '💰 Allocations', icon: '💰' },
            { id: 'contracts', label: '📝 Contracts', icon: '📝' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading token data...</p>
            </div>
          ) : stats ? (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="stats-grid">
                    <div className="stat-card primary">
                      <div className="stat-header">
                        <span className="stat-icon">💎</span>
                        <span className="stat-label">Total $BCODE Tokens</span>
                      </div>
                      <div className="stat-value">{formatTokens(stats.totalTokens)}</div>
                      <div className="stat-subvalue">${stats.usdValue.toFixed(2)} USD</div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <span className="stat-icon">🔓</span>
                        <span className="stat-label">Vested Tokens</span>
                      </div>
                      <div className="stat-value">{formatTokens(stats.vestedTokens)}</div>
                      <div className="stat-subvalue">{((stats.vestedTokens / stats.totalTokens) * 100).toFixed(1)}% of total</div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <span className="stat-icon">🔒</span>
                        <span className="stat-label">Unvested Tokens</span>
                      </div>
                      <div className="stat-value">{formatTokens(stats.unvestedTokens)}</div>
                      <div className="stat-subvalue">Vesting over time</div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <span className="stat-icon">⭐</span>
                        <span className="stat-label">Performance Rating</span>
                      </div>
                      <div className="stat-value" style={{ color: getPerformanceColor(stats.performanceRating) }}>
                        {stats.performanceRating.toUpperCase()}
                      </div>
                      <div className="stat-subvalue">{stats.averageQuality.toFixed(1)}/100 avg quality</div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <span className="stat-icon">🎯</span>
                        <span className="stat-label">Milestones Completed</span>
                      </div>
                      <div className="stat-value">{stats.milestonesCompleted}</div>
                      <div className="stat-subvalue">{stats.activeContracts} active contracts</div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-header">
                        <span className="stat-icon">💰</span>
                        <span className="stat-label">Total Earnings</span>
                      </div>
                      <div className="stat-value">${stats.totalEarnings.toFixed(2)}</div>
                      <div className="stat-subvalue">All-time USD value</div>
                    </div>
                  </div>

                  <div className="earnings-chart">
                    <h3>Monthly Token Earnings</h3>
                    <div className="chart-container">
                      {stats.monthlyEarnings.map((month, index) => {
                        const maxTokens = Math.max(...stats.monthlyEarnings.map(m => m.tokens));
                        const height = (month.tokens / maxTokens) * 100;
                        
                        return (
                          <div key={index} className="chart-bar">
                            <div className="bar-container">
                              <div 
                                className="bar" 
                                style={{ height: `${height}%` }}
                                title={`${formatTokens(month.tokens)} tokens ($${month.usd})`}
                              ></div>
                            </div>
                            <div className="bar-label">{month.month}</div>
                            <div className="bar-value">{formatTokens(month.tokens)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'allocations' && (
                <div className="allocations-tab">
                  <h3>Recent Token Allocations</h3>
                  <div className="allocations-list">
                    {stats.recentAllocations.map((allocation, index) => (
                      <div key={index} className="allocation-item">
                        <div className="allocation-icon">
                          {allocation.eventType === 'contract-signed' && '✍️'}
                          {allocation.eventType === 'milestone-completed' && '🎯'}
                          {allocation.eventType === 'performance-bonus' && '⭐'}
                          {allocation.eventType === 'quality-bonus' && '🏆'}
                        </div>
                        <div className="allocation-details">
                          <div className="allocation-title">{allocation.reason}</div>
                          <div className="allocation-meta">
                            {new Date(allocation.timestamp).toLocaleDateString()} • 
                            {allocation.qualityMultiplier}x multiplier
                          </div>
                        </div>
                        <div className="allocation-amount">
                          +{formatTokens(allocation.tokenAmount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contracts' && (
                <div className="contracts-tab">
                  <h3>Active Contracts</h3>
                  <div className="contracts-list">
                    <div className="contract-item">
                      <div className="contract-header">
                        <span className="contract-title">Bitcoin Code Core Development</span>
                        <span className="contract-status active">Active</span>
                      </div>
                      <div className="contract-details">
                        <div className="contract-stat">
                          <span>Token Pool:</span>
                          <span>15M $BCODE</span>
                        </div>
                        <div className="contract-stat">
                          <span>Progress:</span>
                          <span>67% Complete</span>
                        </div>
                        <div className="contract-stat">
                          <span>Next Milestone:</span>
                          <span>Git Integration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <h3>Performance Analytics</h3>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <h4>Code Quality Trend</h4>
                      <div className="quality-meter">
                        <div className="meter-bar">
                          <div 
                            className="meter-fill" 
                            style={{ width: `${stats.averageQuality}%` }}
                          ></div>
                        </div>
                        <span>{stats.averageQuality.toFixed(1)}/100</span>
                      </div>
                    </div>
                    
                    <div className="analytics-card">
                      <h4>Token Efficiency</h4>
                      <div className="efficiency-stat">
                        <span className="efficiency-value">2.34x</span>
                        <span className="efficiency-label">Avg Multiplier</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="error-state">
              <p>Failed to load token data</p>
              <button onClick={loadDeveloperStats}>Retry</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenDashboard;