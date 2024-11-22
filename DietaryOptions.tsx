import React from 'react';
import { Leaf, Wheat, Milk, Egg, Fish, Nut } from 'lucide-react';

interface DietaryOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DietaryOptionsProps {
  selectedDiets: string[];
  onToggle: (dietId: string) => void;
}

const dietaryOptions: DietaryOption[] = [
  { id: 'vegan', label: 'Vegan', icon: <Leaf className="w-4 h-4" /> },
  { id: 'vegetarian', label: 'Vegetarian', icon: <Leaf className="w-4 h-4" /> },
  { id: 'gluten-free', label: 'Gluten Free', icon: <Wheat className="w-4 h-4" /> },
  { id: 'dairy-free', label: 'Dairy Free', icon: <Milk className="w-4 h-4" /> },
  { id: 'egg-free', label: 'Egg Free', icon: <Egg className="w-4 h-4" /> },
  { id: 'fish-free', label: 'Fish Free', icon: <Fish className="w-4 h-4" /> },
  { id: 'nut-free', label: 'Nut Free', icon: <Nut className="w-4 h-4" /> }
];

const DietaryOptions: React.FC<DietaryOptionsProps> = ({ selectedDiets, onToggle }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {dietaryOptions.map(option => (
        <button
          key={option.id}
          onClick={() => onToggle(option.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
            selectedDiets.includes(option.id)
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default DietaryOptions;