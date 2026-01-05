import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { planLimits, UserPlan } from '../lib/planLimits';

interface PlanContextType {
  plan: UserPlan | null;
  loading: boolean;
  error: string | null;
  checkGenerationAllowed: () => Promise<{ allowed: boolean; message?: string }>;
  useGeneration: () => Promise<void>;
  refreshPlan: () => Promise<void>;
  isOffline: boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPlan = async () => {
    try {
      const userPlan = await planLimits.getUserPlan(user);
      setPlan(userPlan);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plan');
      // Don't clear existing plan on error to maintain functionality
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, [user]);

  // Refresh plan when coming back online
  useEffect(() => {
    if (!isOffline) {
      loadPlan();
    }
  }, [isOffline]);

  const checkGenerationAllowed = async () => {
    if (isOffline) {
      return { 
        allowed: false, 
        message: 'Generation is not available while offline. Please check your internet connection.' 
      };
    }
    return planLimits.checkGenerationAllowed(user);
  };

  const useGeneration = async () => {
    if (isOffline) {
      throw new Error('Cannot use generations while offline');
    }
    await planLimits.useGeneration(user);
    await loadPlan();
  };

  const refreshPlan = async () => {
    setLoading(true);
    await loadPlan();
  };

  return (
    <PlanContext.Provider
      value={{
        plan,
        loading,
        error,
        checkGenerationAllowed,
        useGeneration,
        refreshPlan,
        isOffline
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};