import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app, db } from './firebase';

const auth = getAuth(app);

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: 'gift' | 'meal' | 'decoration' | 'movie' | 'date' | 'elf' | 'poem' | 'activity';
  content: any;
  created_at: string;
}

const CACHE_KEY = 'activity_history_cache';

export const activityService = {
  async logActivity(
    userId: string,
    activityType: ActivityLog['activity_type'],
    content: any
  ) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to log activity');
      }

      const activity = {
        user_id: userId,
        activity_type: activityType,
        content,
        created_at: new Date().toISOString()
      };

      // Add to local cache first
      const cachedActivities = this._getFromCache(userId);
      cachedActivities.unshift({ ...activity, id: crypto.randomUUID() });
      this._saveToCache(userId, cachedActivities);

      // Then try to save to Firestore
      const docRef = await addDoc(collection(db, 'activities'), activity);
      return {
        id: docRef.id,
        ...activity
      };
    } catch (err) {
      console.error('Failed to log activity:', err);
      // Return cached version if Firestore fails
      return {
        id: crypto.randomUUID(),
        ...activity
      };
    }
  },

  async getActivityHistory(
    userId: string,
    activityType?: ActivityLog['activity_type']
  ) {
    try {
      // First, get cached activities
      const cachedActivities = this._getFromCache(userId);

      try {
        // Try to get fresh data from Firestore
        let queryConstraints = [
          where('user_id', '==', userId),
          orderBy('created_at', 'desc')
        ];

        if (activityType) {
          queryConstraints = [
            where('user_id', '==', userId),
            where('activity_type', '==', activityType),
            orderBy('created_at', 'desc')
          ];
        }

        const q = query(collection(db, 'activities'), ...queryConstraints);
        const querySnapshot = await getDocs(q);
        
        const activities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ActivityLog[];

        // Update cache with fresh data
        this._saveToCache(userId, activities);
        
        return activities;
      } catch (err) {
        console.warn('Failed to fetch from Firestore, using cache:', err);
        return cachedActivities;
      }
    } catch (err) {
      console.error('Failed to fetch activity history:', err);
      return [];
    }
  },

  _getFromCache(userId: string): ActivityLog[] {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);
      return cached ? JSON.parse(cached) : [];
    } catch (err) {
      console.error('Failed to get from cache:', err);
      return [];
    }
  },

  _saveToCache(userId: string, activities: ActivityLog[]) {
    try {
      localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(activities));
    } catch (err) {
      console.error('Failed to save to cache:', err);
    }
  }
};