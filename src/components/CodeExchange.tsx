import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  Upload, 
  Code, 
  Zap,
  DollarSign,
  Trophy,
  Sparkles,
  Search,
  Users
} from 'lucide-react';
import './CodeExchange.css';

interface CodeListing {
  rank: number;
  title: string;
  description: string;
  author: string;
  authorHandle: string;
  authorTwitter?: string;
  authorType: 'human' | 'ai';
  publishDate: string;
  linesOfCode: number;
  views: number;
  downloads: number;
  sharesAvailable: number;
  totalShares: number;
  revenue: number;
  dividendPerShare: number;
  volume24h: number;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  codeType: 'app' | 'contract' | 'library' | 'snippet';
  category: string;
  tags: string[];
  txId: string;
  trending?: boolean;
}

interface DeveloperListing {
  rank: number;
  name: string;
  handle: string;
  twitter?: string;
  authorType: 'human' | 'ai';
  joinDate: string;
  totalProjects: number;
  totalUsers: number;
  totalRevenue: number;
  avgRating: number;
  sharesAvailable: number;
  totalShares: number;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  verified: boolean;
  trending?: boolean;
}

interface CodeNFT {
  id: string;
  name: string;
  description: string;
  author: string;
  authorAvatar: string;
  price: number;
  marketCap: number;
  holders: number;
  volume24h: number;
  change24h: number;
  codeType: 'app' | 'contract' | 'library' | 'snippet';
  language: string;
  tags: string[];
  downloads: number;
  rating: number;
  revenue: number;
  dividendYield: number;
  lastSale: number;
  thumbnail: string;
  verified: boolean;
  trending: boolean;
  featured: boolean;
}

interface Portfolio {
  totalValue: number;
  totalRevenue: number;
  holdingsCount: number;
  pendingDividends: number;
}

interface CodeExchangeProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectCode?: (code: CodeListing) => void;
}

const CodeExchange: React.FC<CodeExchangeProps> = ({ isOpen = true, onClose = () => {}, onSelectCode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType] = useState<'all' | 'app' | 'contract' | 'library' | 'snippet'>('all');
  const [sortBy] = useState<'price' | 'volume' | 'rating' | 'recent'>('price');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'portfolio' | 'mint'>('marketplace');
  const [selectedNFT, setSelectedNFT] = useState<CodeNFT | null>(null);

  // Mock data for code NFTs
  const [codeNFTs] = useState<CodeNFT[]>([
    {
      id: 'nft-1',
      name: 'Bitcoin DEX Protocol',
      description: 'Decentralized exchange smart contract for Bitcoin Layer 2',
      author: 'satoshi_dev',
      authorAvatar: '👨‍💻',
      price: 0.5,
      marketCap: 50.5,
      holders: 127,
      volume24h: 2.3,
      change24h: 12.5,
      codeType: 'contract',
      language: 'Solidity',
      tags: ['DeFi', 'DEX', 'Layer2'],
      downloads: 1250,
      rating: 4.8,
      revenue: 8.7,
      dividendYield: 15.2,
      lastSale: 0.48,
      thumbnail: '🏦',
      verified: true,
      trending: true,
      featured: true
    },
    {
      id: 'nft-2',
      name: 'Bitcoin Wallet UI Kit',
      description: 'Complete React components for Bitcoin wallet interfaces',
      author: 'ui_master',
      authorAvatar: '🎨',
      price: 0.25,
      marketCap: 15.8,
      holders: 89,
      volume24h: 1.1,
      change24h: -3.2,
      codeType: 'library',
      language: 'React',
      tags: ['UI', 'Wallet', 'Components'],
      downloads: 890,
      rating: 4.6,
      revenue: 3.2,
      dividendYield: 8.9,
      lastSale: 0.26,
      thumbnail: '💳',
      verified: true,
      trending: false,
      featured: false
    },
    {
      id: 'nft-4',
      name: 'Bitcoin Mining Pool',
      description: 'Efficient mining pool software with stratum protocol',
      author: 'pool_dev',
      authorAvatar: '⛏️',
      price: 0.8,
      marketCap: 32.4,
      holders: 67,
      volume24h: 1.8,
      change24h: 5.1,
      codeType: 'app',
      language: 'C++',
      tags: ['Mining', 'Pool', 'Stratum'],
      downloads: 445,
      rating: 4.4,
      revenue: 6.8,
      dividendYield: 12.5,
      lastSale: 0.79,
      thumbnail: '⛏️',
      verified: true,
      trending: false,
      featured: false
    },
    {
      id: 'nft-5',
      name: 'HD Wallet Generator',
      description: 'Secure hierarchical deterministic wallet generation library',
      author: 'crypto_security',
      authorAvatar: '🔐',
      price: 0.35,
      marketCap: 21.7,
      holders: 156,
      volume24h: 2.1,
      change24h: 18.3,
      codeType: 'library',
      language: 'Python',
      tags: ['Security', 'Wallet', 'HD'],
      downloads: 2100,
      rating: 4.7,
      revenue: 4.5,
      dividendYield: 14.8,
      lastSale: 0.33,
      thumbnail: '🔐',
      verified: true,
      trending: true,
      featured: false
    }
  ]);

  const [portfolio] = useState<Portfolio>({
    totalValue: 12.45,
    totalRevenue: 89.32,
    holdingsCount: 8,
    pendingDividends: 2.34
  });

  const filteredNFTs = codeNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || nft.codeType === filterType;
    return matchesSearch && matchesFilter;
  });


  const renderMarketplace = () => (
    <div className="professional-exchange-layout">
      {/* Market Overview Header */}
      <div className="market-overview-header">
        <div className="market-stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Coins size={20} />
            </div>
            <div className="stat-data">
              <span className="stat-value">₿2,847.32</span>
              <span className="stat-label">Total Market Cap</span>
              <span className="stat-change positive">+12.4%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={20} />
            </div>
            <div className="stat-data">
              <span className="stat-value">₿156.7</span>
              <span className="stat-label">24h Volume</span>
              <span className="stat-change positive">+8.2%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={20} />
            </div>
            <div className="stat-data">
              <span className="stat-value">12,453</span>
              <span className="stat-label">Active Traders</span>
              <span className="stat-change positive">+156</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign size={20} />
            </div>
            <div className="stat-data">
              <span className="stat-value">₿234.1</span>
              <span className="stat-label">Dividends Paid (24h)</span>
              <span className="stat-change positive">+15.7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Trading Layout */}
      <div className="trading-layout-grid">
        {/* Left Panel - Portfolio & Holdings */}
        <div className="portfolio-panel">
          <div className="panel-header">
            <h3>My Portfolio</h3>
            <div className="portfolio-value">
              <span className="value">₿{portfolio.totalValue}</span>
              <span className="change positive">+2.4%</span>
            </div>
          </div>
          
          <div className="portfolio-summary">
            <div className="portfolio-metrics">
              <div className="metric">
                <span className="metric-label">Total Value</span>
                <span className="metric-value">₿{portfolio.totalValue}</span>
              </div>
              <div className="metric">
                <span className="metric-label">24h P&L</span>
                <span className="metric-value positive">+₿0.89</span>
              </div>
              <div className="metric">
                <span className="metric-label">Holdings</span>
                <span className="metric-value">{portfolio.holdingsCount}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Pending Dividends</span>
                <span className="metric-value">₿{portfolio.pendingDividends}</span>
              </div>
            </div>
            
            <button className="claim-dividends-btn">
              <DollarSign size={16} />
              Claim ₿{portfolio.pendingDividends}
            </button>
          </div>

          <div className="holdings-list">
            <h4>Holdings</h4>
            {codeNFTs.slice(0, 4).map(nft => (
              <div key={nft.id} className="holding-item">
                <div className="holding-icon">{nft.thumbnail}</div>
                <div className="holding-info">
                  <div className="holding-name">{nft.name}</div>
                  <div className="holding-position">25 tokens (12.5%)</div>
                </div>
                <div className="holding-value">
                  <div className="value">₿{(nft.price * 0.125).toFixed(3)}</div>
                  <div className={`change ${nft.change24h >= 0 ? 'positive' : 'negative'}`}>
                    {nft.change24h >= 0 ? '+' : ''}{nft.change24h.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="portfolio-actions">
            <button className="action-btn primary">
              <Upload size={16} />
              Mint New Code
            </button>
            <button className="action-btn secondary">
              <Sparkles size={16} />
              Portfolio Analytics
            </button>
          </div>
        </div>

        {/* Center Panel - Trading Table */}
        <div className="trading-panel">
          <div className="panel-header">
            <div className="header-left">
              <h3>Live Trading Markets</h3>
              <div className="live-indicator">
                <div className="live-dot"></div>
                <span>Live</span>
              </div>
            </div>
            <div className="header-controls">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="view-controls">
                <button className="view-btn active">Table</button>
                <button className="view-btn">Cards</button>
              </div>
            </div>
          </div>

          <div className="table-controls">
            <div className="filter-tabs">
              <button className="filter-tab active">All Markets</button>
              <button className="filter-tab">Apps</button>
              <button className="filter-tab">Contracts</button>
              <button className="filter-tab">Libraries</button>
              <button className="filter-tab">Trending</button>
            </div>
            <div className="sort-controls">
              <select className="sort-select">
                <option value="marketCap">Market Cap</option>
                <option value="volume">Volume</option>
                <option value="change">24h Change</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>

          <div className="professional-table-container">
            <table className="professional-trading-table">
              <thead>
                <tr>
                  <th className="rank-col">#</th>
                  <th className="asset-col">Asset</th>
                  <th className="price-col">Price</th>
                  <th className="change-col">24h %</th>
                  <th className="volume-col">Volume (24h)</th>
                  <th className="mcap-col">Market Cap</th>
                  <th className="supply-col">Circulating Supply</th>
                  <th className="holders-col">Holders</th>
                  <th className="yield-col">APY</th>
                  <th className="actions-col">Trade</th>
                </tr>
              </thead>
              <tbody>
                {filteredNFTs.map((nft, index) => (
                  <tr key={nft.id} className="trading-row" onClick={() => setSelectedNFT(nft)}>
                    <td className="rank-col">
                      <span className="rank">{index + 1}</span>
                    </td>
                    <td className="asset-col">
                      <div className="asset-info">
                        <div className="asset-icon">{nft.thumbnail}</div>
                        <div className="asset-details">
                          <div className="asset-name">
                            {nft.name}
                            {nft.verified && <span className="verified-icon">✓</span>}
                            {nft.trending && <span className="trending-icon">🔥</span>}
                          </div>
                          <div className="asset-meta">
                            <span className="author">{nft.author}</span>
                            <span className="type-pill">{nft.codeType}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="price-col">
                      <div className="price-info">
                        <span className="price">₿{nft.price.toFixed(4)}</span>
                        <span className="price-usd">${(nft.price * 45000).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className={`change-col ${nft.change24h >= 0 ? 'positive' : 'negative'}`}>
                      <div className="change-info">
                        <span className="change-percent">
                          {nft.change24h >= 0 ? '+' : ''}{nft.change24h.toFixed(1)}%
                        </span>
                        <div className="change-bar">
                          <div className="bar-fill" style={{width: `${Math.abs(nft.change24h)}%`}}></div>
                        </div>
                      </div>
                    </td>
                    <td className="volume-col">
                      <div className="volume-info">
                        <span className="volume">₿{nft.volume24h.toFixed(1)}</span>
                        <span className="volume-usd">${(nft.volume24h * 45000).toFixed(0)}</span>
                      </div>
                    </td>
                    <td className="mcap-col">
                      <div className="mcap-info">
                        <span className="mcap">₿{nft.marketCap.toFixed(1)}</span>
                        <span className="mcap-rank">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="supply-col">
                      <div className="supply-info">
                        <span className="supply">{(nft.marketCap / nft.price).toFixed(0)}</span>
                        <span className="supply-total">/ 1,000,000</span>
                      </div>
                    </td>
                    <td className="holders-col">
                      <div className="holders-info">
                        <span className="holders-count">{nft.holders}</span>
                        <span className="holders-change">+{Math.floor(nft.holders * 0.1)}</span>
                      </div>
                    </td>
                    <td className="yield-col">
                      <div className="yield-info">
                        <span className="yield-percent">{nft.dividendYield.toFixed(1)}%</span>
                        <Sparkles size={12} className="yield-icon" />
                      </div>
                    </td>
                    <td className="actions-col">
                      <div className="trade-actions">
                        <button className="trade-btn buy" onClick={(e) => e.stopPropagation()}>
                          Buy
                        </button>
                        <button className="trade-btn sell" onClick={(e) => e.stopPropagation()}>
                          Sell
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel - Market Data & Analytics */}
        <div className="analytics-panel">
          <div className="panel-header">
            <h3>Market Analytics</h3>
          </div>
          
          <div className="analytics-content">
            <div className="trending-section">
              <h4>🔥 Trending Now</h4>
              <div className="trending-list">
                {codeNFTs.filter(nft => nft.trending).slice(0, 3).map(nft => (
                  <div key={nft.id} className="trending-item">
                    <div className="trending-icon">{nft.thumbnail}</div>
                    <div className="trending-info">
                      <span className="trending-name">{nft.name}</span>
                      <span className={`trending-change ${nft.change24h >= 0 ? 'positive' : 'negative'}`}>
                        {nft.change24h >= 0 ? '+' : ''}{nft.change24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gainers-section">
              <h4>📈 Top Gainers (24h)</h4>
              <div className="gainers-list">
                {[...codeNFTs].sort((a, b) => b.change24h - a.change24h).slice(0, 3).map(nft => (
                  <div key={nft.id} className="gainer-item">
                    <span className="gainer-name">{nft.name.substring(0, 12)}...</span>
                    <span className="gainer-change positive">+{nft.change24h.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="volume-section">
              <h4>💹 High Volume</h4>
              <div className="volume-list">
                {[...codeNFTs].sort((a, b) => b.volume24h - a.volume24h).slice(0, 3).map(nft => (
                  <div key={nft.id} className="volume-item">
                    <span className="volume-name">{nft.name.substring(0, 12)}...</span>
                    <span className="volume-amount">₿{nft.volume24h.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="news-section">
              <h4>📰 Market News</h4>
              <div className="news-list">
                <div className="news-item">
                  <span className="news-title">New DeFi protocol launches...</span>
                  <span className="news-time">2m ago</span>
                </div>
                <div className="news-item">
                  <span className="news-title">Major exchange lists BCODE...</span>
                  <span className="news-time">15m ago</span>
                </div>
                <div className="news-item">
                  <span className="news-title">Smart contract audit completed...</span>
                  <span className="news-time">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="portfolio-content">
      <div className="portfolio-header">
        <h2>My Code Portfolio</h2>
        <div className="portfolio-stats">
          <div className="portfolio-stat">
            <div className="stat-value">₿{portfolio.totalValue}</div>
            <div className="stat-label">Total Value</div>
          </div>
          <div className="portfolio-stat">
            <div className="stat-value">₿{portfolio.totalRevenue}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="portfolio-stat">
            <div className="stat-value">{portfolio.holdingsCount}</div>
            <div className="stat-label">Holdings</div>
          </div>
          <div className="portfolio-stat">
            <div className="stat-value">₿{portfolio.pendingDividends}</div>
            <div className="stat-label">Pending Dividends</div>
            <button className="claim-btn">Claim</button>
          </div>
        </div>
      </div>

      <div className="portfolio-grid">
        {codeNFTs.slice(0, 3).map(nft => (
          <div key={nft.id} className="portfolio-item">
            <div className="portfolio-nft">
              <div className="nft-thumbnail">{nft.thumbnail}</div>
              <div className="nft-details">
                <h4>{nft.name}</h4>
                <p>Holding: 25 tokens (12.5%)</p>
                <div className="portfolio-metrics">
                  <div className="metric">
                    <span>Value: ₿{(nft.price * 0.125).toFixed(3)}</span>
                  </div>
                  <div className="metric">
                    <span>Revenue: ₿{(nft.revenue * 0.125).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMint = () => (
    <div className="mint-content">
      <div className="mint-header">
        <h2>Mint Your Code as NFT</h2>
        <p>Transform your code into tradeable NFTs and earn dividends from users</p>
      </div>

      <div className="mint-form">
        <div className="form-section">
          <label>Project Name</label>
          <input type="text" placeholder="Enter your code project name" />
        </div>

        <div className="form-section">
          <label>Description</label>
          <textarea placeholder="Describe what your code does and its unique value"></textarea>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>Code Type</label>
            <select>
              <option value="app">Application</option>
              <option value="contract">Smart Contract</option>
              <option value="library">Library</option>
              <option value="snippet">Code Snippet</option>
            </select>
          </div>

          <div className="form-section">
            <label>Primary Language</label>
            <select>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="solidity">Solidity</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <label>Upload Code Files</label>
          <div className="upload-area">
            <Upload size={48} />
            <p>Drag & drop your code files or click to browse</p>
            <span>Supports: .js, .ts, .sol, .rs, .go, .py and more</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>Initial Token Supply</label>
            <input type="number" placeholder="1000" />
          </div>

          <div className="form-section">
            <label>Token Price (BTC)</label>
            <input type="number" step="0.001" placeholder="0.001" />
          </div>
        </div>

        <div className="form-section">
          <label>Revenue Sharing %</label>
          <input type="range" min="10" max="90" defaultValue="70" />
          <span>70% to token holders, 30% to creator</span>
        </div>

        <div className="mint-actions">
          <button className="mint-btn">
            <Sparkles size={20} />
            Mint NFT Collection
            <span className="mint-cost">Cost: ₿0.001</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="code-exchange">
      <div className="exchange-header">
        <div className="header-content">
          <div className="header-title">
            <Coins size={32} />
            <div>
              <h1>Bitcoin Code Exchange</h1>
              <p>Trade code NFTs • Earn dividends • Build the future</p>
            </div>
          </div>
          
          <div className="header-nav">
            <button 
              className="nav-btn"
              onClick={() => window.location.href = '/'}
            >
              <Code size={16} />
              Code Editor
            </button>
            <button 
              className="nav-btn active"
              onClick={() => window.location.href = '/exchange'}
            >
              <Coins size={16} />
              NFT Exchange
            </button>
          </div>
          
          <div className="header-stats">
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>Live Trading</span>
            </div>
          </div>
        </div>

        <div className="exchange-tabs">
          <button 
            className={`tab ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            <TrendingUp size={20} />
            Marketplace
          </button>
          <button 
            className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <Trophy size={20} />
            My Portfolio
          </button>
          <button 
            className={`tab ${activeTab === 'mint' ? 'active' : ''}`}
            onClick={() => setActiveTab('mint')}
          >
            <Zap size={20} />
            Mint NFT
          </button>
        </div>
      </div>

      <div className="exchange-content">
        {activeTab === 'marketplace' && renderMarketplace()}
        {activeTab === 'portfolio' && renderPortfolio()}
        {activeTab === 'mint' && renderMint()}
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="nft-modal-overlay" onClick={() => setSelectedNFT(null)}>
          <div className="nft-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedNFT.name}</h2>
              <button onClick={() => setSelectedNFT(null)}>×</button>
            </div>
            <div className="modal-content">
              <div className="modal-info">
                <p>{selectedNFT.description}</p>
                <div className="modal-stats">
                  <div>Market Cap: ₿{selectedNFT.marketCap}</div>
                  <div>Holders: {selectedNFT.holders}</div>
                  <div>Downloads: {selectedNFT.downloads.toLocaleString()}</div>
                  <div>Rating: {selectedNFT.rating}/5</div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="modal-btn primary">Buy Tokens</button>
                <button className="modal-btn secondary">View Source</button>
                <button className="modal-btn secondary">Download</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExchange;