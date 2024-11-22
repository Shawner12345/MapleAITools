import { User } from 'firebase/auth';

export interface BudgetItem {
  id: string;
  category: string;
  item: string;
  recipient: string;
  estimated_cost: number;
  actual_cost?: number;
  created_at: string;
}

export interface BudgetData {
  totalBudget: number;
  items: BudgetItem[];
  lastUpdated: string;
}

const CACHE_KEY = 'budget_data_cache';

const DEFAULT_BUDGET: BudgetData = {
  totalBudget: 0,
  items: [],
  lastUpdated: new Date().toISOString()
};

export const budgetService = {
  async saveBudget(user: User, data: BudgetData): Promise<boolean> {
    if (!user) return false;

    try {
      localStorage.setItem(`${CACHE_KEY}_${user.uid}`, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('Failed to save budget:', err);
      return false;
    }
  },

  async loadBudget(user: User): Promise<{ data: BudgetData; source: 'cache' }> {
    if (!user) {
      return { data: DEFAULT_BUDGET, source: 'cache' };
    }

    const cachedData = this.loadFromCache(user.uid);
    if (cachedData) {
      return { data: cachedData, source: 'cache' };
    }

    return { data: DEFAULT_BUDGET, source: 'cache' };
  },

  loadFromCache(userId: string): BudgetData | null {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);
      if (!cached) return null;

      const data = JSON.parse(cached);
      return this.validateBudgetData(data) ? data : null;
    } catch (err) {
      console.error('Failed to load from cache:', err);
      return null;
    }
  },

  validateBudgetData(data: any): data is BudgetData {
    return (
      data &&
      typeof data.totalBudget === 'number' &&
      Array.isArray(data.items) &&
      typeof data.lastUpdated === 'string'
    );
  },

  clearCache(userId: string): void {
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
  },

  async resetBudget(user: User): Promise<BudgetData> {
    if (!user) return DEFAULT_BUDGET;
    
    this.clearCache(user.uid);
    return DEFAULT_BUDGET;
  }
};