import React, { useState } from 'react';
import { openai, isOpenAIKeyConfigured, setApiKey } from '../lib/openai';
import { Film, Loader2, AlertCircle, Clock, Star, Popcorn, Users, Sparkles, Heart, RefreshCw, Copy, Check, Gem } from 'lucide-react';
import ApiKeyPrompt from './ApiKeyPrompt';

interface Movie {
  title: string;
  description: string;
  duration: string;
  rating: string;
  mood: string;
  snacks: string[];
  ambiance: string[];
  funFacts: string[];
}

const MoviePlanner: React.FC = () => {
  const [showApiPrompt, setShowApiPrompt] = useState(!isOpenAIKeyConfigured());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [preferences, setPreferences] = useState({
    mood: 'classic',
    audience: 'family',
    duration: 'any',
    excludeMovies: '',
    popularity: 'all'
  });
  const [suggestions, setSuggestions] = useState<Movie[]>([]);

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiPrompt(false);
  };

  const generateSuggestions = async (regenerate: boolean = false) => {
    if (!isOpenAIKeyConfigured()) {
      setError('OpenAI API key is not configured. Please add your API key to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `Suggest 3 Christmas movies for a ${preferences.mood} ${preferences.audience} movie night.
      ${preferences.duration !== 'any' ? `Preferred duration: ${preferences.duration}` : ''}
      ${preferences.excludeMovies ? `Please exclude: ${preferences.excludeMovies}` : ''}
      ${preferences.popularity === 'hidden-gems' ? 'Focus on lesser-known, underrated, or overlooked Christmas movies that deserve more attention. Avoid highly popular or mainstream options.' : ''}
      ${preferences.popularity === 'classics' ? 'Focus on well-known, beloved classic Christmas movies.' : ''}

      Format response as JSON:
      {
        "suggestions": [
          {
            "title": "Movie title",
            "description": "Brief plot summary",
            "duration": "Movie length",
            "rating": "Movie rating",
            "mood": "Movie mood/atmosphere",
            "snacks": ["Themed snack suggestions"],
            "ambiance": ["Room setup and atmosphere tips"],
            "funFacts": ["Interesting facts about the movie"]
          }
        ]
      }`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
        temperature: regenerate ? 0.9 : 0.7
      });

      const response = completion.choices[0].message.content;
      if (response) {
        const data = JSON.parse(response);
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate suggestions. Please try again.');
      }
      console.error('OpenAI error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!suggestions.length) return;

    const content = suggestions.map((movie, index) => `
Movie Night Option ${index + 1}

Movie: ${movie.title}
Duration: ${movie.duration}
Rating: ${movie.rating}
Mood: ${movie.mood}

Description:
${movie.description}

Recommended Snacks:
${movie.snacks.map(snack => `- ${snack}`).join('\n')}

Ambiance Setup:
${movie.ambiance.map(tip => `- ${tip}`).join('\n')}

Fun Facts:
${movie.funFacts.map(fact => `- ${fact}`).join('\n')}

-------------------`).join('\n');

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
          <Film className="w-6 h-6 text-red-600" />
          Christmas Movie Night Planner
        </h2>
        <p className="text-gray-600">
          Get personalized Christmas movie suggestions with themed snacks and ambiance tips.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Movie Selection
          </label>
          <select
            value={preferences.popularity}
            onChange={(e) => setPreferences({ ...preferences, popularity: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Movies</option>
            <option value="classics">Popular Classics</option>
            <option value="hidden-gems">Hidden Gems & Underrated</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Movie Mood
          </label>
          <select
            value={preferences.mood}
            onChange={(e) => setPreferences({ ...preferences, mood: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="classic">Classic & Traditional</option>
            <option value="funny">Fun & Comedic</option>
            <option value="romantic">Romantic</option>
            <option value="nostalgic">Nostalgic</option>
            <option value="magical">Magical & Whimsical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Audience
          </label>
          <select
            value={preferences.audience}
            onChange={(e) => setPreferences({ ...preferences, audience: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="family">Family-Friendly</option>
            <option value="kids">Kids</option>
            <option value="adult">Adult</option>
            <option value="date">Date Night</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration Preference
          </label>
          <select
            value={preferences.duration}
            onChange={(e) => setPreferences({ ...preferences, duration: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="any">Any Length</option>
            <option value="short">Under 90 minutes</option>
            <option value="medium">90-120 minutes</option>
            <option value="long">Over 120 minutes</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Movies to Exclude (Optional)
          </label>
          <input
            type="text"
            value={preferences.excludeMovies}
            onChange={(e) => setPreferences({ ...preferences, excludeMovies: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., Home Alone, Elf"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => generateSuggestions(false)}
          disabled={loading}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Finding Perfect Movies...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Get Movie Suggestions
            </>
          )}
        </button>

        {suggestions.length > 0 && (
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy to Clipboard
              </>
            )}
          </button>
        )}
      </div>

      {loading && (
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
                  Generation may take up to <span className="font-bold">1 minute</span>
                </p>
                <p className="text-sm text-green-600 mt-1">
                  We're finding the perfect movies for your movie night...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Movie Suggestions</h3>
            <button
              onClick={() => generateSuggestions(true)}
              disabled={loading}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors disabled:text-gray-400"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>
          {suggestions.map((movie, index) => (
            <div
              key={index}
              className="border border-red-100 rounded-lg overflow-hidden bg-gradient-to-r from-red-50 to-orange-50"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{movie.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {movie.duration}
                  </span>
                  <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {movie.rating}
                  </span>
                  <span className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded-full flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {movie.mood}
                  </span>
                  {preferences.popularity === 'hidden-gems' && (
                    <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                      <Gem className="w-4 h-4" />
                      Hidden Gem
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{movie.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Popcorn className="w-5 h-5 text-red-600" />
                      Recommended Snacks
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {movie.snacks.map((snack, i) => (
                        <li key={i}>{snack}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-red-600" />
                      Ambiance Setup
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {movie.ambiance.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-2">Fun Facts</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {movie.funFacts.map((fact, i) => (
                      <li key={i}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviePlanner;