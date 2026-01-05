import React from 'react';
import { useUserPlan } from '../contexts/UserPlanContext';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  comingSoon: boolean;
  toolType: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  icon, 
  title, 
  description, 
  comingSoon,
  toolType
}) => {
  const { hasPaid } = useUserPlan();
  const isFreeTool = ['gift', 'movie', 'date'].includes(toolType);

  return (
    <div className="relative group h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-green-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative h-full bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
          {comingSoon ? (
            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
              Coming Soon
            </span>
          ) : isFreeTool ? (
            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              Free Access
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
              Premium
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>
        <button
          className={`w-full py-2 rounded-lg transition-all transform hover:scale-[1.02] ${
            comingSoon
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white hover:from-green-700 hover:via-green-600 hover:to-green-700 hover:shadow-lg active:scale-[0.98] border-2 border-red-100/50 hover:border-red-200/50'
          }`}
          disabled={comingSoon}
        >
          {comingSoon ? 'Coming Soon' : 'Try Now'}
        </button>
      </div>
    </div>
  );
};

export default ToolCard;