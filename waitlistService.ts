import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface WaitlistEntry {
  email: string;
  createdAt: string;
  source?: string;
}

export const waitlistService = {
  async addToWaitlist(email: string, source?: string): Promise<void> {
    const waitlistRef = collection(db, 'waitlist');
    const entry: WaitlistEntry = {
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      source: source || 'website'
    };

    // Fire and forget - don't await the operation
    addDoc(waitlistRef, entry).catch(error => {
      console.error('Background waitlist operation failed:', error);
    });
  }
};