import React, { useState, useEffect } from 'react';
import { PriceService, TokenPrice as ServiceTokenPrice } from '../services/PriceService';
import './TickerSidebar.css';

interface TokenPrice extends ServiceTokenPrice {
  change24h: number;
  changePercent: number;
  contractId?: string;
  liquidity?: number;
  holders?: number;
  category?: string;
  isSpecial?: boolean;
  isDev?: boolean;
}

interface TickerSidebarProps {
  userHandle?: string;
  currentProjectToken?: {
    symbol: string;
    name: string;
  };
}

const TickerSidebar: React.FC<TickerSidebarProps> = ({
  userHandle,
  currentProjectToken
}) => {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Generate trending development tools and resources tokens
    const generateDeveloperTokens = (): TokenPrice[] => {
      const devTokens = [
        { base: 'CODE_runtime', name: 'Code Runtime Hours', category: 'Compute', basePrice: 0.085, volatility: 0.4 },
        { base: 'AI_assist', name: 'AI Code Assistant', category: 'AI', basePrice: 0.145, volatility: 0.35 },
        { base: 'DEPLOY_slots', name: 'Deployment Slots', category: 'Infrastructure', basePrice: 0.055, volatility: 0.3 },
        { base: 'API_calls', name: 'API Call Credits', category: 'Network', basePrice: 0.003, volatility: 0.25 },
        { base: 'STORAGE_git', name: 'Git Repository Storage', category: 'Storage', basePrice: 0.015, volatility: 0.2 },
        { base: 'BUILD_minutes', name: 'Build Pipeline Minutes', category: 'CI/CD', basePrice: 0.025, volatility: 0.28 },
        { base: 'TEST_coverage', name: 'Test Coverage Reports', category: 'Testing', basePrice: 0.012, volatility: 0.22 },
        { base: 'REVIEW_credits', name: 'Code Review Credits', category: 'Quality', basePrice: 0.065, volatility: 0.35 },
        { base: 'LICENSE_keys', name: 'Software Licenses', category: 'Tools', basePrice: 0.195, volatility: 0.45 },
        { base: 'DOCS_tokens', name: 'Documentation Tokens', category: 'Docs', basePrice: 0.008, volatility: 0.18 }
      ];

      // Generate tokens with varying liquidity to simulate market dynamics
      const tokensWithLiquidity = devTokens.map((token, index) => {
        const contractNum = Math.floor(Math.random() * 9000) + 1000;
        const contractId = `${Math.random().toString(36).substring(2, 5)}_${contractNum}`;
        
        // Simulate market dynamics with varying liquidity
        const liquidityMultiplier = Math.random() * 2 + 0.5; // 0.5x to 2.5x
        const basePrice = token.basePrice * liquidityMultiplier;
        const change = (Math.random() - 0.5) * basePrice * token.volatility;
        const liquidity = Math.floor(Math.random() * 150000 * liquidityMultiplier) + 8000;
        const holders = Math.floor(liquidity / 300 + Math.random() * 150);
        
        return {
          symbol: `${token.base}_${contractId}`,
          name: token.name,
          category: token.category,
          contractId: contractId,
          price: basePrice,
          price_usd: basePrice,
          change24h: change,
          changePercent: (change / basePrice) * 100,
          change_24h: change,
          change_percent_24h: (change / basePrice) * 100,
          volume_24h: liquidity,
          liquidity: liquidity,
          holders: holders,
          last_updated: new Date(),
          source: 'Dev Market',
          isDev: false,
          isSpecial: false
        };
      });

      // Sort tokens by liquidity (most liquid first)
      return tokensWithLiquidity.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
    };

    // Subscribe to price updates
    const subscription = PriceService.subscribeAll((updatedPrices) => {
      // Get core token prices (BSV and BCODE)
      const corePrices: TokenPrice[] = updatedPrices.filter(p => 
        p.symbol === 'BSV' || p.symbol === 'BCODE'
      ).map(p => ({
        ...p,
        change24h: p.change_24h,
        changePercent: p.change_percent_24h,
        isSpecial: true,
        isDev: false
      }));

      // Add user's handle token if available
      let userToken: TokenPrice | null = null;
      if (userHandle) {
        userToken = {
          symbol: userHandle.toUpperCase(),
          name: `@${userHandle} Code Token`,
          price: 0.00235,
          price_usd: 0.00235,
          change24h: 0.00018,
          changePercent: 8.27,
          change_24h: 0.00018,
          change_percent_24h: 8.27,
          volume_24h: 22000,
          liquidity: 22000,
          holders: 68,
          last_updated: new Date(),
          source: 'HandCash',
          isSpecial: true,
          isDev: false,
          category: 'Developer'
        };
      }

      // Generate trending developer tokens
      const devTokens = generateDeveloperTokens();
      
      // Combine all prices: Special tokens at top, then sorted dev tokens
      const specialTokens = [...corePrices];
      if (userToken) specialTokens.push(userToken);
      
      const allPrices = [...specialTokens, ...devTokens];
      
      setPrices(allPrices);
      setLastUpdate(new Date());
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userHandle, currentProjectToken]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatVolume = (volume?: number): string => {
    if (!volume) return 'N/A';
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  const formatLiquidity = (liquidity?: number): string => {
    if (!liquidity) return 'Low';
    if (liquidity >= 100000) return 'Very High';
    if (liquidity >= 50000) return 'High';
    if (liquidity >= 15000) return 'Medium';
    if (liquidity >= 8000) return 'Fair';
    return 'Low';
  };

  const getLiquidityColor = (liquidity?: number): string => {
    if (!liquidity) return '#666';
    if (liquidity >= 100000) return '#22c55e';
    if (liquidity >= 50000) return '#16a34a';
    if (liquidity >= 15000) return '#facc15';
    if (liquidity >= 8000) return '#f97316';
    return '#ef4444';
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  return (
    <div className={`ticker-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="ticker-header">
        <h3>$BCODE Market</h3>
        <div className="ticker-header-controls">
          <button 
            className="ticker-toggle"
            onClick={() => {
              const newCollapsed = !isCollapsed;
              setIsCollapsed(newCollapsed);
              // Emit event for desktop icons to listen to
              window.dispatchEvent(new CustomEvent('tickerToggled', { detail: newCollapsed }));
            }}
            title={isCollapsed ? 'Expand ticker' : 'Collapse ticker'}
          >
            {isCollapsed ? '←' : '→'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {isLoading ? (
            <div className="ticker-loading">Loading prices...</div>
          ) : (
            <div className="ticker-list">
              {prices.map((token, index) => {
                // Add divider after last special token
                const showDivider = token.isSpecial && 
                  index < prices.length - 1 && 
                  !prices[index + 1].isSpecial;
                
                return (
                  <React.Fragment key={token.symbol}>
                    <div className={`ticker-item ${token.isSpecial ? 'special' : ''} ${token.isDev ? 'dev' : ''}`}>
                  <div className="ticker-symbol-row">
                    <span className="ticker-symbol">${token.symbol}</span>
                    <span className={`ticker-change ${token.change24h >= 0 ? 'positive' : 'negative'}`}>
                      {token.change24h >= 0 ? '↑' : '↓'} {Math.abs(token.changePercent).toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="ticker-name">
                    {token.name}
                    {token.category && (
                      <span className="ticker-category"> • {token.category}</span>
                    )}
                  </div>
                  
                  <div className="ticker-price-row">
                    <span className="ticker-price">{formatPrice(token.price)}</span>
                    {token.contractId && (
                      <span className="ticker-contract-id">#{token.contractId}</span>
                    )}
                  </div>
                  
                  <div className="ticker-stats">
                    {token.volume_24h && (
                      <span className="ticker-volume">
                        Vol: {formatVolume(token.volume_24h)}
                      </span>
                    )}
                    {token.liquidity !== undefined && (
                      <span 
                        className="ticker-liquidity"
                        style={{ color: getLiquidityColor(token.liquidity) }}
                      >
                        {formatLiquidity(token.liquidity)}
                      </span>
                    )}
                    {token.holders !== undefined && (
                      <span className="ticker-holders">
                        {token.holders} holders
                      </span>
                    )}
                  </div>
                </div>
                {showDivider && (
                  <div className="ticker-divider">
                    <span>Dev Resources</span>
                  </div>
                )}
              </React.Fragment>
              );
            })}
            </div>
          )}

          <div className="ticker-footer">
            <div className="ticker-disclaimer">
              Prices update every 30s
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TickerSidebar;