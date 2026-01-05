import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userPlanService, UserPlan } from '../lib/userPlan';

interface UserPlanContextType {
  hasPaid: boolean;
  loading: boolean;
  error: string | null;
  isToolAvailable: (toolType: string) => boolean;
  refreshPlan: () => Promise<void>;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined);

export const useUserPlan = () => {
  const context = useContext(UserPlanContext);
  if (context === undefined) {
    throw new Error('useUserPlan must be used within a UserPlanProvider');
  }
  return context;
};

export const UserPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserPlan = async () => {
    if (!user) {
      setPlan(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Loading user plan for:', user.uid);
      const userPlan = await userPlanService.getUserPlan(user);
      console.log('User plan loaded:', userPlan);
      setPlan(userPlan);
      setError(null);
    } catch (err) {
      console.error('Error loading user plan:', err);
      setError('Failed to load user plan');
    } finally {
      setLoading(false);
    }
  };

  // Load plan when user changes
  useEffect(() => {
    loadUserPlan();
  }, [user]);

  // Poll for plan updates every 30 seconds after payment
  useEffect(() => {
    if (!user) return;

    const pollInterval = setInterval(() => {
      loadUserPlan();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [user]);

  const isToolAvailable = (toolType: string): boolean => {
    return userPlanService.isToolAvailable(toolType, plan);
  };

  const refreshPlan = async () => {
    setLoading(true);
    await loadUserPlan();
  };

  return (
    <UserPlanContext.Provider
      value={{
        hasPaid: plan?.hasPaid ?? false,
        loading,
        error,
        isToolAvailable,
        refreshPlan
      }}
    >
      {children}
    </UserPlanContext.Provider>
  );
};

export default UserPlanProvider;