import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserPlan {
  hasPaid: boolean;
  updatedAt: string;
  stripeCustomerId?: string;
  email?: string;
  purchaseDate?: string;
}

const CACHE_KEY = 'user_plan_cache';
const FREE_TOOLS = ['gift', 'movie', 'date'];

export const userPlanService = {
  async getUserPlan(user: User | null): Promise<UserPlan | null> {
    if (!user) return null;

    try {
      console.log('Fetching plan for user:', user.uid);
      const planRef = doc(db, 'user_plans', user.uid);
      const planDoc = await getDoc(planRef);

      if (planDoc.exists()) {
        const plan = planDoc.data() as UserPlan;
        console.log('Found plan:', plan);
        localStorage.setItem(`${CACHE_KEY}_${user.uid}`, JSON.stringify(plan));
        return plan;
      }

      // If no plan exists, create a free plan
      const freePlan: UserPlan = {
        hasPaid: false,
        updatedAt: new Date().toISOString()
      };

      await setDoc(planRef, freePlan);
      localStorage.setItem(`${CACHE_KEY}_${user.uid}`, JSON.stringify(freePlan));
      return freePlan;
    } catch (error) {
      console.error('Error fetching user plan:', error);
      
      // Check cache if offline
      const cached = localStorage.getItem(`${CACHE_KEY}_${user.uid}`);
      if (cached) {
        return JSON.parse(cached);
      }
      
      return {
        hasPaid: false,
        updatedAt: new Date().toISOString()
      };
    }
  },

  isToolAvailable(toolType: string, plan: UserPlan | null): boolean {
    if (FREE_TOOLS.includes(toolType)) return true;
    return plan?.hasPaid ?? false;
  },

  clearCache(userId: string): void {
    localStorage.removeItem(`${CACHE_KEY}_${userId}`);
  }
};