/**
 * PriceService - Real-time token price feeds for Bitcoin Code
 * Fetches prices for BCODE and other development-related tokens
 */

export interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  price_usd: number;
  price_btc?: number;
  change_24h: number;
  change_percent_24h: number;
  volume_24h: number;
  market_cap?: number;
  last_updated: Date;
  source: string;
}

export interface PriceSubscription {
  unsubscribe: () => void;
}

class PriceServiceClass {
  private prices: Map<string, TokenPrice> = new Map();
  private subscribers: Map<string, Set<(price: TokenPrice) => void>> = new Map();
  private allSubscribers: Set<(prices: TokenPrice[]) => void> = new Set();
  private updateInterval: number = 30000; // 30 seconds
  private intervalId?: NodeJS.Timeout;
  private wsConnections: Map<string, WebSocket> = new Map();

  constructor() {
    // Only start price updates in browser environment
    if (typeof window !== 'undefined') {
      this.startPriceUpdates();
    }
  }

  /**
   * Start periodic price updates
   */
  private startPriceUpdates() {
    // Initial fetch
    this.fetchAllPrices();
    
    // Set up interval
    this.intervalId = setInterval(() => {
      this.fetchAllPrices();
    }, this.updateInterval);
  }

  /**
   * Fetch all token prices
   */
  private async fetchAllPrices() {
    try {
      // Fetch BSV and BCODE prices
      await Promise.all([
        this.fetchBSVPrice(),
        this.fetchBCODEPrice(),
        this.fetchDevTokenPrices(),
      ]);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  }

  /**
   * Fetch BSV price (keeping same as bitcoin-os)
   */
  private async fetchBSVPrice() {
    const mockPrice: TokenPrice = {
      symbol: 'BSV',
      name: 'Bitcoin SV',
      price: 42.15,
      price_usd: 42.15,
      change_24h: 2.45,
      change_percent_24h: 6.17,
      volume_24h: 2100000,
      last_updated: new Date(),
      source: 'Mock Data'
    };
    
    this.updatePrice('BSV', mockPrice);
  }

  /**
   * Fetch BCODE token price (Bitcoin Code native token)
   */
  private async fetchBCODEPrice() {
    try {
      // For now, we'll use mock data
      // In production, this would connect to a DEX API or price oracle
      const mockPrice: TokenPrice = {
        symbol: 'BCODE',
        name: 'Bitcoin Code',
        price: 0.0789,
        price_usd: 0.0789,
        change_24h: 0.0052,
        change_percent_24h: 7.05,
        volume_24h: 156000,
        market_cap: 2400000,
        last_updated: new Date(),
        source: 'Dev Exchange'
      };
      
      this.updatePrice('BCODE', mockPrice);
    } catch (error) {
      console.error('Error fetching BCODE price:', error);
    }
  }

  /**
   * Fetch development-related token prices
   */
  private async fetchDevTokenPrices() {
    try {
      // Mock prices for development tokens
      const devTokens = [
        {
          symbol: 'COMPUTE',
          name: 'Compute Credits',
          price: 0.025,
          change_24h: 0.002,
          change_percent_24h: 8.7,
          volume_24h: 45000
        },
        {
          symbol: 'DEPLOY',
          name: 'Deployment Tokens',
          price: 0.055,
          change_24h: -0.003,
          change_percent_24h: -5.2,
          volume_24h: 28000
        },
        {
          symbol: 'API',
          name: 'API Call Credits',
          price: 0.003,
          change_24h: 0.0001,
          change_percent_24h: 3.4,
          volume_24h: 67000
        }
      ];

      devTokens.forEach(token => {
        const tokenPrice: TokenPrice = {
          symbol: token.symbol,
          name: token.name,
          price: token.price,
          price_usd: token.price,
          change_24h: token.change_24h,
          change_percent_24h: token.change_percent_24h,
          volume_24h: token.volume_24h,
          last_updated: new Date(),
          source: 'Dev Market'
        };
        
        this.updatePrice(token.symbol, tokenPrice);
      });
    } catch (error) {
      console.error('Error fetching dev token prices:', error);
    }
  }

  /**
   * Update a token price and notify subscribers
   */
  private updatePrice(symbol: string, price: TokenPrice) {
    this.prices.set(symbol, price);
    
    // Notify symbol-specific subscribers
    const symbolSubscribers = this.subscribers.get(symbol);
    if (symbolSubscribers) {
      symbolSubscribers.forEach(callback => callback(price));
    }
    
    // Notify all-prices subscribers
    this.allSubscribers.forEach(callback => {
      callback(Array.from(this.prices.values()));
    });
  }

  /**
   * Subscribe to a specific token's price updates
   */
  subscribe(symbol: string, callback: (price: TokenPrice) => void): PriceSubscription {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    
    this.subscribers.get(symbol)!.add(callback);
    
    // Send current price if available
    const currentPrice = this.prices.get(symbol);
    if (currentPrice) {
      callback(currentPrice);
    }
    
    return {
      unsubscribe: () => {
        const symbolSubscribers = this.subscribers.get(symbol);
        if (symbolSubscribers) {
          symbolSubscribers.delete(callback);
          if (symbolSubscribers.size === 0) {
            this.subscribers.delete(symbol);
          }
        }
      }
    };
  }

  /**
   * Subscribe to all token price updates
   */
  subscribeAll(callback: (prices: TokenPrice[]) => void): PriceSubscription {
    this.allSubscribers.add(callback);
    
    // Send current prices if available
    if (this.prices.size > 0) {
      callback(Array.from(this.prices.values()));
    }
    
    return {
      unsubscribe: () => {
        this.allSubscribers.delete(callback);
      }
    };
  }

  /**
   * Get current price for a specific token
   */
  getPrice(symbol: string): TokenPrice | undefined {
    return this.prices.get(symbol);
  }

  /**
   * Get all current prices
   */
  getAllPrices(): TokenPrice[] {
    return Array.from(this.prices.values());
  }

  /**
   * Connect to real-time WebSocket price feed
   */
  private connectWebSocket(symbol: string) {
    if (typeof window === 'undefined') return;
    
    try {
      // In production, connect to real WebSocket price feeds
      // For now, this is just a placeholder
      console.log(`WebSocket connection for ${symbol} would be established here`);
    } catch (error) {
      console.error(`Failed to connect WebSocket for ${symbol}:`, error);
    }
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Close all WebSocket connections
    this.wsConnections.forEach(ws => ws.close());
    this.wsConnections.clear();
    
    // Clear all subscribers
    this.subscribers.clear();
    this.allSubscribers.clear();
  }
}

// Export singleton instance
export const PriceService = new PriceServiceClass();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    PriceService.destroy();
  });
}