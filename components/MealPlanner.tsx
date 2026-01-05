import React, { useState } from 'react';
import { openai, isOpenAIKeyConfigured, setApiKey, handleOpenAIError } from '../lib/openai';
import { Utensils, Loader2, AlertCircle, Clock, ChefHat, RefreshCw, Copy, Check, Info } from 'lucide-react';
import ApiKeyPrompt from './ApiKeyPrompt';
import DietaryOptions from './DietaryOptions';

interface MealPlan {
  appetizers: string[];
  mainCourses: string[];
  sideDishes: string[];
  desserts: string[];
  drinks: string[];
  servingSize: string;
  totalPrepTime: string;
  dietaryNotes: string[];
}

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  tips: string[];
}

const MealPlanner: React.FC = () => {
  const [showApiPrompt, setShowApiPrompt] = useState(!isOpenAIKeyConfigured());
  const [loading, setLoading] = useState(false);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [error, setError] = useState('');
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [guestCount, setGuestCount] = useState('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    cookingSkill: 'intermediate',
    maxPrepTime: '2',
    additionalNotes: ''
  });
  const [copied, setCopied] = useState(false);

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiPrompt(false);
  };

  const toggleDietaryOption = (dietId: string) => {
    setSelectedDiets(prev => 
      prev.includes(dietId) 
        ? prev.filter(id => id !== dietId)
        : [...prev, dietId]
    );
  };

  const toggleRecipeSelection = (recipe: string) => {
    setSelectedRecipes(prev =>
      prev.includes(recipe)
        ? prev.filter(r => r !== recipe)
        : [...prev, recipe]
    );
  };

  const generateMealPlan = async (regenerate: boolean = false) => {
    if (!regenerate && !guestCount) {
      setError('Please enter the number of guests');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);
    setSelectedRecipes([]);

    try {
      const prompt = `Create a Christmas meal plan for ${guestCount} people with these specifications:
      - Cooking Skill Level: ${preferences.cookingSkill}
      - Maximum Prep Time: ${preferences.maxPrepTime} hours
      - Dietary Restrictions: ${selectedDiets.join(', ') || 'None'}
      ${preferences.additionalNotes ? `- Additional Notes: ${preferences.additionalNotes}` : ''}

      Format response as JSON:
      {
        "appetizers": ["List of appetizers"],
        "mainCourses": ["List of main courses"],
        "sideDishes": ["List of side dishes"],
        "desserts": ["List of desserts"],
        "drinks": ["List of drinks"],
        "servingSize": "Number of servings",
        "totalPrepTime": "Total preparation time",
        "dietaryNotes": ["Important dietary notes"]
      }`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
        temperature: regenerate ? 0.9 : 0.7
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from AI service');
      }

      const plan = JSON.parse(response);
      setMealPlan(plan);
    } catch (err) {
      setError(handleOpenAIError(err));
    } finally {
      setLoading(false);
    }
  };

  const generateRecipes = async () => {
    if (!mealPlan || selectedRecipes.length === 0) {
      setError('Please select at least one recipe to generate');
      return;
    }

    setRecipeLoading(true);
    setError('');

    try {
      const prompt = `Create detailed recipes for these Christmas dishes: ${selectedRecipes.join(', ')}
      
      Consider these specifications:
      - Cooking Skill Level: ${preferences.cookingSkill}
      - Dietary Restrictions: ${selectedDiets.join(', ') || 'None'}
      - Serving Size: ${guestCount} people

      Format each recipe as JSON:
      {
        "name": "Recipe name",
        "ingredients": ["List of ingredients with quantities"],
        "instructions": ["Step-by-step instructions"],
        "prepTime": "Preparation time",
        "cookTime": "Cooking time",
        "servings": "Number of servings",
        "difficulty": "Easy/Medium/Hard",
        "tips": ["Helpful cooking tips"]
      }

      Return an array of recipe objects.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
        temperature: 0.7
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from AI service');
      }

      const generatedRecipes = JSON.parse(response);
      setRecipes(generatedRecipes);
    } catch (err) {
      setError(handleOpenAIError(err));
    } finally {
      setRecipeLoading(false);
    }
  };

  const renderMealSection = (title: string, items: string[]) => (
    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-medium text-green-800 mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map((item, i) => (
          <label key={i} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedRecipes.includes(item)}
              onChange={() => toggleRecipeSelection(item)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-600">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const copyToClipboard = async () => {
    if (!mealPlan) return;

    const content = `Christmas Meal Plan

Appetizers:
${mealPlan.appetizers.map(item => `- ${item}`).join('\n')}

Main Courses:
${mealPlan.mainCourses.map(item => `- ${item}`).join('\n')}

Side Dishes:
${mealPlan.sideDishes.map(item => `- ${item}`).join('\n')}

Desserts:
${mealPlan.desserts.map(item => `- ${item}`).join('\n')}

Drinks:
${mealPlan.drinks.map(item => `- ${item}`).join('\n')}

Serving Size: ${mealPlan.servingSize}
Total Prep Time: ${mealPlan.totalPrepTime}

Dietary Notes:
${mealPlan.dietaryNotes.map(note => `- ${note}`).join('\n')}

${recipes.length > 0 ? `\nDetailed Recipes:\n\n${recipes.map(recipe => `
${recipe.name}
Prep Time: ${recipe.prepTime}
Cook Time: ${recipe.cookTime}
Serves: ${recipe.servings}
Difficulty: ${recipe.difficulty}

Ingredients:
${recipe.ingredients.map(ing => `- ${ing}`).join('\n')}

Instructions:
${recipe.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

Chef's Tips:
${recipe.tips.map(tip => `- ${tip}`).join('\n')}
`).join('\n-------------------\n')}` : ''}`;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  if (showApiPrompt) {
    return <ApiKeyPrompt onSubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Utensils className="w-6 h-6 text-green-600" />
          Christmas Meal Planner
        </h2>
        <p className="text-gray-600">
          Generate a personalized Christmas meal plan with recipes and cooking instructions.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Dietary Restrictions
          </label>
          <DietaryOptions
            selectedDiets={selectedDiets}
            onToggle={toggleDietaryOption}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 8"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cooking Skill Level
            </label>
            <select
              value={preferences.cookingSkill}
              onChange={(e) => setPreferences({ ...preferences, cookingSkill: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Prep Time (hours)
            </label>
            <select
              value={preferences.maxPrepTime}
              onChange={(e) => setPreferences({ ...preferences, maxPrepTime: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4+ hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <input
              type="text"
              value={preferences.additionalNotes}
              onChange={(e) => setPreferences({ ...preferences, additionalNotes: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., traditional, modern fusion"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="my-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <button
        onClick={() => generateMealPlan(false)}
        disabled={loading}
        className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Plan...
          </>
        ) : (
          'Generate Meal Plan'
        )}
      </button>

      {loading && (
        <div className="relative mt-8 mb-8">
          <div className="absolute inset-0 bg-green-600 opacity-10 animate-pulse rounded-lg"></div>
          <div className="border-2 border-green-200 bg-green-50 p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <Clock className="w-8 h-8 text-green-600 animate-pulse" />
              <div>
                <h4 className="text-lg font-semibold text-green-800 mb-1">
                  Please Wait
                </h4>
                <p className="text-green-700 font-medium">
                  Generation may take up to <span className="font-bold">1 minute</span>
                </p>
                <p className="text-sm text-green-600 mt-1">
                  We're creating your perfect Christmas meal plan...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {mealPlan && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Your Meal Plan</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy to Clipboard
                  </>
                )}
              </button>
              <button
                onClick={() => generateMealPlan(true)}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Regenerate
              </button>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Recipe Selection</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Check the boxes next to any dishes you'd like detailed recipes for. Generation time varies:
                </p>
                <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                  <li>1-2 recipes: ~1-2 minutes</li>
                  <li>3-4 recipes: ~2-3 minutes</li>
                  <li>All recipes: ~3-4 minutes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {renderMealSection('Appetizers', mealPlan.appetizers)}
            {renderMealSection('Main Courses', mealPlan.mainCourses)}
            {renderMealSection('Side Dishes', mealPlan.sideDishes)}
            {renderMealSection('Desserts', mealPlan.desserts)}
            {renderMealSection('Drinks', mealPlan.drinks)}
          </div>

          <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg">
            <div>
              <p className="text-green-800">
                <strong>Serving Size:</strong> {mealPlan.servingSize}
              </p>
              <p className="text-green-800">
                <strong>Total Prep Time:</strong> {mealPlan.totalPrepTime}
              </p>
              <p className="text-green-800">
                <strong>Selected Recipes:</strong> {selectedRecipes.length}
              </p>
            </div>
            <button
              onClick={generateRecipes}
              disabled={recipeLoading || selectedRecipes.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {recipeLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Recipes...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5" />
                  Generate Selected Recipes
                </>
              )}
            </button>
          </div>

          {recipeLoading && (
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-green-600 opacity-10 animate-pulse rounded-lg"></div>
              <div className="border-2 border-green-200 bg-green-50 p-6 rounded-lg shadow-md">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <Clock className="w-8 h-8 text-green-600 animate-pulse" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-800 mb-1">
                      Please Wait
                    </h4>
                    <p className="text-green-700 font-medium">
                      Generation may take <span className="font-bold">3-4 minutes</span> for all recipes
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      We're creating detailed recipes for your selected dishes...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {recipes.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Detailed Recipes</h3>
              {recipes.map((recipe, index) => (
                <div key={index} className="bg-white border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">{recipe.name}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="font-medium">Prep Time:</span> {recipe.prepTime}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Cook Time:</span> {recipe.cookTime}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Serves:</span> {recipe.servings}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Ingredients</h5>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {recipe.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Instructions</h5>
                      <ol className="list-decimal list-inside text-gray-600 space-y-2">
                        {recipe.instructions.map((instruction, i) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Chef's Tips</h5>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {recipe.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlanner;