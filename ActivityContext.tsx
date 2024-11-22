import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { activityService, ActivityLog } from '../lib/activityService';

interface ActivityContextType {
  activities: ActivityLog[];
  logActivity: (type: ActivityLog['activity_type'], content: any) => Promise<ActivityLog>;
  getHistory: (type?: ActivityLog['activity_type']) => Promise<void>;
  getActivityById: (id: string) => Promise<ActivityLog>;
  loading: boolean;
  error: string | null;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRecentActivities();
    } else {
      setActivities([]);
    }
  }, [user]);

  const loadRecentActivities = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const history = await activityService.getActivityHistory(user.uid);
      setActivities(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (type: ActivityLog['activity_type'], content: any) => {
    if (!user) throw new Error('User must be authenticated');

    setLoading(true);
    try {
      const newActivity = await activityService.logActivity(user.uid, type, content);
      setActivities(prev => [newActivity, ...prev]);
      return newActivity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log activity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (type?: ActivityLog['activity_type']) => {
    if (!user) return;

    setLoading(true);
    try {
      const history = await activityService.getActivityHistory(user.uid, type);
      setActivities(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const getActivityById = async (id: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      return await activityService.getActivityById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity');
      throw err;
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        logActivity,
        getHistory,
        getActivityById,
        loading,
        error
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};