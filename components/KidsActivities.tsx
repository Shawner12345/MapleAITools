import React, { useState } from 'react';
import { Gamepad2, Clock, Users, Star, BookOpen } from 'lucide-react';
import CustomActivityGenerator from './CustomActivityGenerator';

interface Activity {
  title: string;
  description: string;
  ageRange: string;
  duration: string;
  materials: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Craft' | 'Game' | 'Learning' | 'Music' | 'Story';
  instructions: string[];
  participants: string;
  learningOutcomes?: string[];
}

const KidsActivities: React.FC = () => {
  const [activity, setActivity] = useState<Activity | null>(null);

  const handleCustomActivity = (newActivity: Activity) => {
    setActivity(newActivity);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-blue-600" />
          Christmas Activities for Kids
        </h2>
        <p className="text-gray-600">
          Create custom Christmas activities tailored to your child's interests and age.
        </p>
      </div>

      <div className="mb-8">
        <CustomActivityGenerator onActivityGenerated={handleCustomActivity} />
      </div>

      {activity && (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{activity.title}</h3>
            <p className="text-gray-600 mb-4">{activity.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {activity.duration}
              </span>
              <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                <Users className="w-4 h-4" />
                {activity.participants}
              </span>
              <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4" />
                {activity.difficulty}
              </span>
              <span className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded-full flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Ages {activity.ageRange}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Materials Needed:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {activity.materials.map((material, i) => (
                  <li key={i}>{material}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Instructions:</h4>
              <ol className="list-decimal pl-5 text-sm text-gray-600">
                {activity.instructions.map((instruction, i) => (
                  <li key={i} className="mb-1">{instruction}</li>
                ))}
              </ol>
            </div>
            
            {activity.learningOutcomes && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Learning Outcomes:</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {activity.learningOutcomes.map((outcome, i) => (
                    <li key={i}>{outcome}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KidsActivities;