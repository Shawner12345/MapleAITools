import React, { useState } from 'react';
import { openai, isOpenAIKeyConfigured, setApiKey, handleOpenAIError } from '../lib/openai';
import { Wand2, Loader2, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import ApiKeyPrompt from './ApiKeyPrompt';

interface CustomActivity {
  title: string;
  description: string;
  ageRange: string;
  duration: string;
  materials: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: string;
  instructions: string[];
  participants: string;
  learningOutcomes: string[];
}

interface CustomActivityGeneratorProps {
  onActivityGenerated: (activity: CustomActivity) => void;
}

const CustomActivityGenerator: React.FC<CustomActivityGeneratorProps> = ({ onActivityGenerated }) => {
  const [showApiPrompt, setShowApiPrompt] = useState(!isOpenAIKeyConfigured());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    interests: '',
    skillLevel: 'beginner',
    duration: '30',
    type: 'any'
  });

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiPrompt(false);
  };

  const generateActivity = async (regenerate: boolean = false) => {
    if (!regenerate && (!formData.age || !formData.interests)) {
      setError('Please fill in at least age and interests');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `Create a custom Christmas-themed activity for a child with these characteristics:
      - Age: ${formData.age} years old
      - Gender: ${formData.gender || 'Any'}
      - Interests: ${formData.interests}
      - Skill Level: ${formData.skillLevel}
      - Preferred Duration: ${formData.duration} minutes
      - Activity Type: ${formData.type === 'any' ? 'Any type' : formData.type}

      Create an engaging, age-appropriate activity that incorporates their interests and the Christmas theme.
      
      Format response as JSON:
      {
        "title": "Activity Name",
        "description": "Brief engaging description",
        "ageRange": "Suitable age range",
        "duration": "Estimated duration",
        "materials": ["Required materials"],
        "difficulty": "Easy/Medium/Hard",
        "type": "Activity type",
        "instructions": ["Step by step instructions"],
        "participants": "Number of participants",
        "learningOutcomes": ["List of skills or learning outcomes"]
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

      try {
        const activity = JSON.parse(response);
        onActivityGenerated(activity);
      } catch (parseError) {
        throw new Error('Failed to parse AI response. Please try again.');
      }
    } catch (err) {
      setError(handleOpenAIError(err));
    } finally {
      setLoading(false);
    }
  };

  if (showApiPrompt) {
    return <ApiKeyPrompt onSubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="p-6 bg-blue-50 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
          <Wand2 className="w-6 h-6" />
          Create Custom Activity
        </h3>
        <button
          onClick={() => generateActivity(true)}
          disabled={loading}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-400"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Child's Age
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 8"
            min="1"
            max="12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender (Optional)
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interests & Hobbies
          </label>
          <input
            type="text"
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., dinosaurs, space, drawing, music"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill Level
          </label>
          <select
            value={formData.skillLevel}
            onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Duration (minutes)
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activity Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="any">Any Type</option>
            <option value="Craft">Craft</option>
            <option value="Game">Game</option>
            <option value="Learning">Learning Activity</option>
            <option value="Music">Music Activity</option>
            <option value="Story">Storytelling</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => generateActivity(false)}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Activity...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Custom Activity
          </>
        )}
      </button>

      {loading && (
        <div className="relative mt-4">
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
                  We're creating the perfect activity for your child...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomActivityGenerator;