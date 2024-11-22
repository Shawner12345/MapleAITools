import React from 'react';
import { Clock } from 'lucide-react';

interface RecipeSelectionProps {
  mealPlan: {
    appetizers: string[];
    mainCourses: string[];
    sideDishes: string[];
    desserts: string[];
  };
  selectedRecipes: string[];
  onSelectionChange: (recipes: string[]) => void;
}

const RecipeSelection: React.FC<RecipeSelectionProps> = ({
  mealPlan,
  selectedRecipes,
  onSelectionChange,
}) => {
  const handleToggleRecipe = (recipe: string) => {
    const newSelection = selectedRecipes.includes(recipe)
      ? selectedRecipes.filter(r => r !== recipe)
      : [...selectedRecipes, recipe];
    onSelectionChange(newSelection);
  };

  const renderSection = (title: string, items: string[]) => (
    <div className="mb-4">
      <h4 className="font-medium text-gray-800 mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <label key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedRecipes.includes(item)}
              onChange={() => handleToggleRecipe(item)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-green-200">
      <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-800">Generation Time Note</p>
            <p className="text-sm text-yellow-700 mt-1">
              Recipe generation time depends on the number of recipes selected:
            </p>
            <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
              <li>1-2 recipes: ~1-2 minutes</li>
              <li>3-4 recipes: ~2-3 minutes</li>
              <li>All recipes: ~3-4 minutes</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {renderSection('Appetizers', mealPlan.appetizers)}
        {renderSection('Main Courses', mealPlan.mainCourses)}
        {renderSection('Side Dishes', mealPlan.sideDishes)}
        {renderSection('Desserts', mealPlan.desserts)}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Selected: {selectedRecipes.length} recipes
      </div>
    </div>
  );
};

export default RecipeSelection;