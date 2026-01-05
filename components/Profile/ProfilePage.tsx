import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        {user ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg text-gray-900">{user.displayName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Verified</label>
              <p className="text-lg text-gray-900">{user.emailVerified ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Please sign in to view your profile.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
