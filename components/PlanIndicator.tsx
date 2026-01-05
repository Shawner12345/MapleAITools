import React from 'react';
import { Crown, User } from 'lucide-react';
import { useUserPlan } from '../contexts/UserPlanContext';

const PlanIndicator: React.FC = () => {
  const { plan } = useUserPlan();
  const isUnlimited = plan?.planType === 'unlimited';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
      isUnlimited 
        ? 'bg-yellow-100 text-yellow-800' 
        : 'bg-gray-100 text-gray-700'
    }`}>
      {isUnlimited ? (
        <>
          <Crown className="w-4 h-4" />
          Unlimited User
        </>
      ) : (
        <>
          <User className="w-4 h-4" />
          Free User
        </>
      )}
    </div>
  );
};

export default PlanIndicator;