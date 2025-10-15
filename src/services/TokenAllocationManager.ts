/**
 * 📊 TOKEN ALLOCATION & MANAGEMENT SYSTEM
 * 
 * THE system that tracks and manages all 500M developer tokens across the ecosystem
 * 
 * This manages:
 * - All 500,000,000 $BCODE developer tokens
 * - Token distribution across projects and developers
 * - Performance-based allocation algorithms
 * - Cross-project contribution tracking
 * - Anti-fraud and gaming detection
 * - Integration with contracting system
 */

import { DeveloperContract, TokenAllocationEvent, developerContractService } from './DeveloperContractService';
import { BSVStorageService } from './BSVStorageService';

export interface TokenPool {
  id: string;
  name: string;
  totalTokens: number;
  allocatedTokens: number;
  availableTokens: number;
  
  // Pool rules
  maxAllocationPerIssue: number;    // Max tokens per single issue/task
  maxAllocationPerDeveloper: number; // Max tokens per developer
  allocationRules: AllocationRule[];
  
  // Pool status
  status: 'active' | 'frozen' | 'depleted';
  createdDate: number;
  lastAllocation: number;
}

export interface AllocationRule {
  id: string;
  name: string;
  description: string;
  
  // Conditions
  condition: {
    type: 'code-quality' | 'contribution-size' | 'time-to-complete' | 'testing-coverage' | 'documentation-quality';
    operator: '>' | '<' | '=' | '>=' | '<=';
    value: number;
  };
  
  // Action
  action: {
    type: 'multiply' | 'add' | 'subtract' | 'set';
    value: number;
    maxValue?: number;
  };
  
  // Limits
  maxApplicationsPerDeveloper?: number;
  enabled: boolean;
}

export interface DeveloperPerformance {
  developerId: string;
  
  // Token metrics
  totalTokensEarned: number;
  totalTokensVested: number;
  totalTokensPending: number;
  
  // Quality metrics
  averageCodeQuality: number;
  averageTestCoverage: number;
  averageDocumentationScore: number;
  
  // Productivity metrics
  issuesCompleted: number;
  averageCompletionTime: number; // Hours
  onTimeDeliveryRate: number;    // Percentage
  
  // Behavior metrics
  communicationScore: number;
  collaborationScore: number;
  reliabilityScore: number;
  
  // Overall rating
  overallPerformanceScore: number;
  performanceGrade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  
  // Fraud detection
  suspiciousActivityFlags: string[];
  gamingAttempts: number;
  lastVerificationDate: number;
}

export interface ProjectTokenMetrics {
  projectId: string;
  projectName: string;
  
  // Token allocation
  totalTokensAllocated: number;
  tokensDistributed: number;
  tokensVesting: number;
  
  // Project performance
  contributorCount: number;
  averageContributorQuality: number;
  projectCompletionRate: number;
  
  // ROI metrics
  revenueGenerated?: number;
  tokenROI?: number; // Revenue per token allocated
}

export interface TokenVesting {
  id: string;
  developerId: string;
  contractId: string;
  
  // Vesting details
  totalTokens: number;
  vestedTokens: number;
  unvestedTokens: number;
  
  // Schedule
  vestingStartDate: number;
  vestingDuration: number;    // Months
  cliffPeriod: number;        // Months
  vestingInterval: 'monthly' | 'quarterly' | 'daily';
  
  // Status
  status: 'active' | 'completed' | 'terminated';
  nextVestingDate: number;
  lastVestingDate?: number;
}

export class TokenAllocationManager {
  private bsvService: BSVStorageService;
  
  // Token pools configuration
  private readonly TOTAL_SUPPLY = 1_000_000_000; // 1 billion $BCODE
  private readonly DEVELOPER_ALLOCATION = 500_000_000; // 50% for developers
  private readonly CURRENT_POOL = 250_000_000; // 25% for current issues
  private readonly FUTURE_RESERVE = 250_000_000; // 25% for future development
  
  // Storage
  private tokenPools: Map<string, TokenPool> = new Map();
  private developerPerformance: Map<string, DeveloperPerformance> = new Map();
  private projectMetrics: Map<string, ProjectTokenMetrics> = new Map();
  private vestingSchedules: Map<string, TokenVesting[]> = new Map();
  private allocationHistory: TokenAllocationEvent[] = [];
  
  constructor() {
    this.bsvService = new BSVStorageService();
    this.initializeTokenPools();
  }
  
  /**
   * 🏗️ INITIALIZE TOKEN POOLS
   */
  private initializeTokenPools(): void {
    // Current development pool
    const currentPool: TokenPool = {
      id: 'current-dev-pool',
      name: 'Current Development Pool',
      totalTokens: this.CURRENT_POOL,
      allocatedTokens: 0,
      availableTokens: this.CURRENT_POOL,
      maxAllocationPerIssue: 50_000_000, // 5% max per issue
      maxAllocationPerDeveloper: 100_000_000, // 10% max per developer
      allocationRules: this.createDefaultAllocationRules(),
      status: 'active',
      createdDate: Date.now(),
      lastAllocation: 0
    };
    
    // Future development reserve
    const futurePool: TokenPool = {
      id: 'future-dev-pool',
      name: 'Future Development Reserve',
      totalTokens: this.FUTURE_RESERVE,
      allocatedTokens: 0,
      availableTokens: this.FUTURE_RESERVE,
      maxAllocationPerIssue: 100_000_000, // 10% max per major issue
      maxAllocationPerDeveloper: 200_000_000, // 20% max per developer
      allocationRules: this.createAdvancedAllocationRules(),
      status: 'active',
      createdDate: Date.now(),
      lastAllocation: 0
    };
    
    this.tokenPools.set(currentPool.id, currentPool);
    this.tokenPools.set(futurePool.id, futurePool);
    
    console.log(`💎 Initialized token pools: ${this.CURRENT_POOL.toLocaleString()} current + ${this.FUTURE_RESERVE.toLocaleString()} future`);
  }
  
  /**
   * 🎯 ALLOCATE TOKENS WITH SMART RULES
   */
  async allocateTokens(request: {
    developerId: string;
    issueId?: string;
    projectId?: string;
    baseTokenAmount: number;
    reason: string;
    
    // Performance metrics
    codeQuality: number;         // 0-100
    testCoverage: number;        // 0-100
    documentationScore: number;  // 0-100
    completionTime: number;      // Hours taken
    estimatedTime: number;       // Hours estimated
    complexity: number;          // 1-10 complexity score
    
    // Context
    poolId?: string;
  }): Promise<{
    tokensAllocated: number;
    multiplierApplied: number;
    rulesApplied: string[];
    vestingSchedule?: TokenVesting;
  }> {
    
    const poolId = request.poolId || 'current-dev-pool';
    const pool = this.tokenPools.get(poolId);
    if (!pool) throw new Error('Token pool not found');
    
    // Get developer performance
    const performance = this.getDeveloperPerformance(request.developerId);
    
    // Apply allocation rules
    let finalTokenAmount = request.baseTokenAmount;
    let multiplier = 1.0;
    const rulesApplied: string[] = [];
    
    for (const rule of pool.allocationRules) {
      if (!rule.enabled) continue;
      
      const ruleResult = this.applyAllocationRule(rule, request, performance);
      if (ruleResult.applied) {
        finalTokenAmount = ruleResult.newAmount;
        multiplier *= ruleResult.multiplier;
        rulesApplied.push(rule.name);
      }
    }
    
    // Apply pool limits
    finalTokenAmount = Math.min(finalTokenAmount, pool.maxAllocationPerIssue);
    
    // Check developer limits
    const developerTotal = performance.totalTokensEarned + finalTokenAmount;
    if (developerTotal > pool.maxAllocationPerDeveloper) {
      finalTokenAmount = Math.max(0, pool.maxAllocationPerDeveloper - performance.totalTokensEarned);
    }
    
    // Check pool availability
    if (finalTokenAmount > pool.availableTokens) {
      throw new Error(`Insufficient tokens in pool. Requested: ${finalTokenAmount}, Available: ${pool.availableTokens}`);
    }
    
    // Create vesting schedule for large allocations
    let vestingSchedule: TokenVesting | undefined;
    if (finalTokenAmount >= 15_000_000) { // 1.5% or more gets vesting
      vestingSchedule = this.createVestingSchedule(
        request.developerId,
        request.issueId || 'direct-allocation',
        finalTokenAmount
      );
    }
    
    // Update pool
    pool.allocatedTokens += finalTokenAmount;
    pool.availableTokens -= finalTokenAmount;
    pool.lastAllocation = Date.now();
    
    // Update developer performance
    this.updateDeveloperPerformance(request.developerId, {
      tokensEarned: finalTokenAmount,
      codeQuality: request.codeQuality,
      testCoverage: request.testCoverage,
      documentationScore: request.documentationScore,
      completionTime: request.completionTime,
      estimatedTime: request.estimatedTime
    });
    
    // Record allocation on blockchain
    await this.recordAllocationOnBlockchain({
      developerId: request.developerId,
      tokensAllocated: finalTokenAmount,
      reason: request.reason,
      rulesApplied,
      multiplier,
      poolId,
      timestamp: Date.now()
    });
    
    console.log(`💰 Allocated ${finalTokenAmount.toLocaleString()} tokens to ${request.developerId} (${multiplier.toFixed(2)}x multiplier)`);
    
    return {
      tokensAllocated: finalTokenAmount,
      multiplierApplied: multiplier,
      rulesApplied,
      vestingSchedule
    };
  }
  
  /**
   * 📏 APPLY ALLOCATION RULE
   */
  private applyAllocationRule(
    rule: AllocationRule, 
    request: any, 
    performance: DeveloperPerformance
  ): { applied: boolean; newAmount: number; multiplier: number } {
    
    let value: number;
    
    // Get value based on condition type
    switch (rule.condition.type) {
      case 'code-quality':
        value = request.codeQuality;
        break;
      case 'contribution-size':
        value = request.baseTokenAmount;
        break;
      case 'time-to-complete':
        value = request.completionTime / request.estimatedTime; // Ratio
        break;
      case 'testing-coverage':
        value = request.testCoverage;
        break;
      case 'documentation-quality':
        value = request.documentationScore;
        break;
      default:
        return { applied: false, newAmount: request.baseTokenAmount, multiplier: 1.0 };
    }
    
    // Check if condition is met
    const conditionMet = this.evaluateCondition(value, rule.condition.operator, rule.condition.value);
    if (!conditionMet) {
      return { applied: false, newAmount: request.baseTokenAmount, multiplier: 1.0 };
    }
    
    // Apply action
    let newAmount = request.baseTokenAmount;
    let multiplier = 1.0;
    
    switch (rule.action.type) {
      case 'multiply':
        multiplier = rule.action.value;
        newAmount = Math.floor(request.baseTokenAmount * rule.action.value);
        break;
      case 'add':
        newAmount = request.baseTokenAmount + rule.action.value;
        break;
      case 'subtract':
        newAmount = Math.max(0, request.baseTokenAmount - rule.action.value);
        break;
      case 'set':
        newAmount = rule.action.value;
        break;
    }
    
    // Apply max value if specified
    if (rule.action.maxValue) {
      newAmount = Math.min(newAmount, rule.action.maxValue);
    }
    
    return { applied: true, newAmount, multiplier };
  }
  
  /**
   * 🧮 EVALUATE CONDITION
   */
  private evaluateCondition(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '=': return value === threshold;
      case '>=': return value >= threshold;
      case '<=': return value <= threshold;
      default: return false;
    }
  }
  
  /**
   * ⏰ CREATE VESTING SCHEDULE
   */
  private createVestingSchedule(developerId: string, contractId: string, tokenAmount: number): TokenVesting {
    const vesting: TokenVesting = {
      id: `vesting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      developerId,
      contractId,
      totalTokens: tokenAmount,
      vestedTokens: 0,
      unvestedTokens: tokenAmount,
      vestingStartDate: Date.now(),
      vestingDuration: 12, // 12 months
      cliffPeriod: 3,      // 3 month cliff
      vestingInterval: 'monthly',
      status: 'active',
      nextVestingDate: Date.now() + (3 * 30 * 24 * 60 * 60 * 1000) // 3 months from now
    };
    
    // Store vesting schedule
    const existing = this.vestingSchedules.get(developerId) || [];
    existing.push(vesting);
    this.vestingSchedules.set(developerId, existing);
    
    return vesting;
  }
  
  /**
   * 📈 GET DEVELOPER PERFORMANCE
   */
  getDeveloperPerformance(developerId: string): DeveloperPerformance {
    if (!this.developerPerformance.has(developerId)) {
      // Initialize new developer performance
      const performance: DeveloperPerformance = {
        developerId,
        totalTokensEarned: 0,
        totalTokensVested: 0,
        totalTokensPending: 0,
        averageCodeQuality: 0,
        averageTestCoverage: 0,
        averageDocumentationScore: 0,
        issuesCompleted: 0,
        averageCompletionTime: 0,
        onTimeDeliveryRate: 100,
        communicationScore: 100,
        collaborationScore: 100,
        reliabilityScore: 100,
        overallPerformanceScore: 0,
        performanceGrade: 'C',
        suspiciousActivityFlags: [],
        gamingAttempts: 0,
        lastVerificationDate: Date.now()
      };
      
      this.developerPerformance.set(developerId, performance);
    }
    
    return this.developerPerformance.get(developerId)!;
  }
  
  /**
   * 🔄 UPDATE DEVELOPER PERFORMANCE
   */
  private updateDeveloperPerformance(developerId: string, update: {
    tokensEarned: number;
    codeQuality: number;
    testCoverage: number;
    documentationScore: number;
    completionTime: number;
    estimatedTime: number;
  }): void {
    
    const performance = this.getDeveloperPerformance(developerId);
    
    // Update token metrics
    performance.totalTokensEarned += update.tokensEarned;
    
    // Update quality metrics (rolling average)
    const totalIssues = performance.issuesCompleted + 1;
    performance.averageCodeQuality = this.calculateRollingAverage(
      performance.averageCodeQuality, 
      update.codeQuality, 
      performance.issuesCompleted, 
      totalIssues
    );
    
    performance.averageTestCoverage = this.calculateRollingAverage(
      performance.averageTestCoverage,
      update.testCoverage,
      performance.issuesCompleted,
      totalIssues
    );
    
    performance.averageDocumentationScore = this.calculateRollingAverage(
      performance.averageDocumentationScore,
      update.documentationScore,
      performance.issuesCompleted,
      totalIssues
    );
    
    // Update productivity metrics
    performance.averageCompletionTime = this.calculateRollingAverage(
      performance.averageCompletionTime,
      update.completionTime,
      performance.issuesCompleted,
      totalIssues
    );
    
    // Update on-time delivery rate
    const wasOnTime = update.completionTime <= update.estimatedTime;
    performance.onTimeDeliveryRate = this.calculateRollingAverage(
      performance.onTimeDeliveryRate,
      wasOnTime ? 100 : 0,
      performance.issuesCompleted,
      totalIssues
    );
    
    performance.issuesCompleted = totalIssues;
    
    // Calculate overall performance score
    performance.overallPerformanceScore = this.calculateOverallPerformance(performance);
    performance.performanceGrade = this.calculatePerformanceGrade(performance.overallPerformanceScore);
  }
  
  /**
   * 📊 CALCULATE ROLLING AVERAGE
   */
  private calculateRollingAverage(currentAvg: number, newValue: number, oldCount: number, newCount: number): number {
    return (currentAvg * oldCount + newValue) / newCount;
  }
  
  /**
   * 🏆 CALCULATE OVERALL PERFORMANCE
   */
  private calculateOverallPerformance(performance: DeveloperPerformance): number {
    const weights = {
      codeQuality: 0.25,
      testCoverage: 0.15,
      documentation: 0.10,
      onTimeDelivery: 0.20,
      communication: 0.10,
      collaboration: 0.10,
      reliability: 0.10
    };
    
    return (
      performance.averageCodeQuality * weights.codeQuality +
      performance.averageTestCoverage * weights.testCoverage +
      performance.averageDocumentationScore * weights.documentation +
      performance.onTimeDeliveryRate * weights.onTimeDelivery +
      performance.communicationScore * weights.communication +
      performance.collaborationScore * weights.collaboration +
      performance.reliabilityScore * weights.reliability
    );
  }
  
  /**
   * 🎓 CALCULATE PERFORMANCE GRADE
   */
  private calculatePerformanceGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 95) return 'S';  // Exceptional
    if (score >= 85) return 'A';  // Excellent
    if (score >= 75) return 'B';  // Good
    if (score >= 65) return 'C';  // Average
    if (score >= 50) return 'D';  // Below Average
    return 'F';                   // Poor
  }
  
  /**
   * ⛓️ RECORD ALLOCATION ON BLOCKCHAIN
   */
  private async recordAllocationOnBlockchain(data: any): Promise<string> {
    return await this.bsvService.storeData({
      type: 'token-allocation',
      ...data
    });
  }
  
  /**
   * 📋 GET TOKEN POOL STATUS
   */
  getTokenPoolStatus(): {
    totalSupply: number;
    developerAllocation: number;
    currentPoolStatus: TokenPool;
    futurePoolStatus: TokenPool;
    allocationSummary: {
      totalAllocated: number;
      totalAvailable: number;
      allocationRate: number;
    };
  } {
    const currentPool = this.tokenPools.get('current-dev-pool')!;
    const futurePool = this.tokenPools.get('future-dev-pool')!;
    
    const totalAllocated = currentPool.allocatedTokens + futurePool.allocatedTokens;
    const totalAvailable = currentPool.availableTokens + futurePool.availableTokens;
    
    return {
      totalSupply: this.TOTAL_SUPPLY,
      developerAllocation: this.DEVELOPER_ALLOCATION,
      currentPoolStatus: currentPool,
      futurePoolStatus: futurePool,
      allocationSummary: {
        totalAllocated,
        totalAvailable,
        allocationRate: (totalAllocated / this.DEVELOPER_ALLOCATION) * 100
      }
    };
  }
  
  /**
   * 🎯 CREATE DEFAULT ALLOCATION RULES
   */
  private createDefaultAllocationRules(): AllocationRule[] {
    return [
      {
        id: 'high-quality-bonus',
        name: 'High Quality Code Bonus',
        description: 'Extra tokens for code quality above 90%',
        condition: { type: 'code-quality', operator: '>=', value: 90 },
        action: { type: 'multiply', value: 1.5, maxValue: 75_000_000 },
        enabled: true
      },
      {
        id: 'excellent-quality-bonus',
        name: 'Exceptional Quality Bonus',
        description: 'Maximum bonus for perfect code quality',
        condition: { type: 'code-quality', operator: '>=', value: 98 },
        action: { type: 'multiply', value: 2.0, maxValue: 100_000_000 },
        enabled: true
      },
      {
        id: 'poor-quality-penalty',
        name: 'Poor Quality Penalty',
        description: 'Reduced tokens for low quality code',
        condition: { type: 'code-quality', operator: '<', value: 70 },
        action: { type: 'multiply', value: 0.5 },
        enabled: true
      },
      {
        id: 'fast-completion-bonus',
        name: 'Fast Completion Bonus',
        description: 'Bonus for completing significantly faster than estimated',
        condition: { type: 'time-to-complete', operator: '<', value: 0.7 },
        action: { type: 'multiply', value: 1.25 },
        enabled: true
      },
      {
        id: 'excellent-testing-bonus',
        name: 'Excellent Testing Coverage Bonus',
        description: 'Bonus for comprehensive testing',
        condition: { type: 'testing-coverage', operator: '>=', value: 95 },
        action: { type: 'multiply', value: 1.2 },
        enabled: true
      }
    ];
  }
  
  /**
   * 🚀 CREATE ADVANCED ALLOCATION RULES
   */
  private createAdvancedAllocationRules(): AllocationRule[] {
    return [
      ...this.createDefaultAllocationRules(),
      {
        id: 'major-contribution-bonus',
        name: 'Major Contribution Bonus',
        description: 'Extra multiplier for large, complex contributions',
        condition: { type: 'contribution-size', operator: '>=', value: 20_000_000 },
        action: { type: 'multiply', value: 1.3 },
        enabled: true
      }
    ];
  }

  /**
   * 📋 GET DEVELOPER ALLOCATIONS
   */
  async getDeveloperAllocations(developerId: string): Promise<TokenAllocationEvent[]> {
    // In production, this would query the blockchain/database
    // For now, we'll return mock data based on the developer's performance
    const performance = this.getDeveloperPerformance(developerId);
    
    // Generate mock allocation history
    const allocations: TokenAllocationEvent[] = [
      {
        id: 'allocation-1',
        contractId: 'contract-bitcoin-code-core',
        developerId,
        eventType: 'contract-signed',
        tokenAmount: 1000000,
        reason: 'Base tokens for signing Bitcoin Code core development contract',
        qualityMultiplier: 1.0,
        blockchainTx: 'bsv-tx-001',
        timestamp: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
        approvedBy: 'system',
        vestingSchedule: {
          totalAmount: 1000000,
          vestedAmount: 1000000,
          vestingStartDate: Date.now() - (30 * 24 * 60 * 60 * 1000),
          vestingDuration: 0,
          cliffPeriod: 0
        }
      },
      {
        id: 'allocation-2',
        contractId: 'contract-bitcoin-code-core',
        developerId,
        eventType: 'milestone-completed',
        tokenAmount: 2500000,
        reason: 'Completed milestone: DeveloperContractService implementation',
        qualityMultiplier: 1.8,
        blockchainTx: 'bsv-tx-002',
        timestamp: Date.now() - (25 * 24 * 60 * 60 * 1000), // 25 days ago
        approvedBy: 'system'
      },
      {
        id: 'allocation-3',
        contractId: 'contract-bitcoin-code-core', 
        developerId,
        eventType: 'milestone-completed',
        tokenAmount: 3200000,
        reason: 'Completed milestone: TokenAllocationManager implementation',
        qualityMultiplier: 2.1,
        blockchainTx: 'bsv-tx-003',
        timestamp: Date.now() - (20 * 24 * 60 * 60 * 1000), // 20 days ago
        approvedBy: 'system'
      },
      {
        id: 'allocation-4',
        contractId: 'contract-bitcoin-code-core',
        developerId,
        eventType: 'milestone-completed',
        tokenAmount: 2800000,
        reason: 'Completed milestone: GitBlockchainService implementation',
        qualityMultiplier: 1.9,
        blockchainTx: 'bsv-tx-004',
        timestamp: Date.now() - (15 * 24 * 60 * 60 * 1000), // 15 days ago
        approvedBy: 'system'
      },
      {
        id: 'allocation-5',
        contractId: 'contract-bitcoin-code-core',
        developerId,
        eventType: 'performance-bonus',
        tokenAmount: 1200000,
        reason: 'Quality bonus for exceptional code standards and testing',
        qualityMultiplier: 2.5,
        blockchainTx: 'bsv-tx-005',
        timestamp: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
        approvedBy: 'system'
      },
      {
        id: 'allocation-6',
        contractId: 'contract-bitcoin-code-core',
        developerId,
        eventType: 'milestone-completed',
        tokenAmount: 4100000,
        reason: 'Completed milestone: ContractWizard UI implementation',
        qualityMultiplier: 2.3,
        blockchainTx: 'bsv-tx-006',
        timestamp: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
        approvedBy: 'system'
      }
    ];

    return allocations;
  }
}

// Export singleton instance
export const tokenAllocationManager = new TokenAllocationManager();