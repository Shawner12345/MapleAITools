import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export interface UserPlan {
  type: 'free' | 'pro' | 'ultimate';
  generationsLeft: number;
  totalGenerations: number;
}

const PLAN_LIMITS = {
  free: 5,
  pro: 10,
  ultimate: 100
} as const;

const DEFAULT_FREE_PLAN: UserPlan = {
  type: 'free',
  generationsLeft: PLAN_LIMITS.free,
  totalGenerations: PLAN_LIMITS.free
};

export const planLimits = {
  async getUserPlan(user: User | null): Promise<UserPlan> {
    if (!user) {
      return DEFAULT_FREE_PLAN;
    }

    try {
      const planDoc = await getDoc(doc(db, 'user_plans', user.uid));
      
      if (!planDoc.exists()) {
        // Initialize free plan for new users
        await setDoc(doc(db, 'user_plans', user.uid), DEFAULT_FREE_PLAN);
        return DEFAULT_FREE_PLAN;
      }

      return planDoc.data() as UserPlan;
    } catch (error) {
      console.error('Error fetching user plan:', error);
      // Return cached plan if available
      const cachedPlan = localStorage.getItem(`plan_${user.uid}`);
      if (cachedPlan) {
        return JSON.parse(cachedPlan);
      }
      // Fallback to default free plan if offline and no cache
      return DEFAULT_FREE_PLAN;
    }
  },

  async checkGenerationAllowed(user: User | null): Promise<{ allowed: boolean; message?: string }> {
    if (!user) {
      return { allowed: false, message: 'Please sign in to use this feature.' };
    }

    try {
      const plan = await this.getUserPlan(user);

      if (plan.generationsLeft <= 0) {
        return {
          allowed: false,
          message: `You've used all ${plan.totalGenerations} generations. Please upgrade your plan for more generations.`
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking generation allowance:', error);
      return { allowed: false, message: 'Unable to verify generation allowance. Please check your internet connection.' };
    }
  },

  async useGeneration(user: User | null): Promise<void> {
    if (!user) return;

    try {
      const plan = await this.getUserPlan(user);

      // Decrement the generations left
      const userPlanRef = doc(db, 'user_plans', user.uid);
      await setDoc(userPlanRef, {
        generationsLeft: increment(-1)
      }, { merge: true });

      // Update local cache with decremented count
      const updatedPlan = {
        ...plan,
        generationsLeft: Math.max(0, plan.generationsLeft - 1)
      };
      localStorage.setItem(`plan_${user.uid}`, JSON.stringify(updatedPlan));
    } catch (error) {
      console.error('Error using generation:', error);
      throw new Error('Failed to record generation usage. Please try again when online.');
    }
  },

  getPlanLimits() {
    return PLAN_LIMITS;
  }
};