import React, { useState } from 'react';
import { openai, isOpenAIKeyConfigured, setApiKey, handleOpenAIError } from '../lib/openai';
import { Gift, Loader2, AlertCircle, ShoppingBag, Star, RefreshCw, Copy, Check, Clock } from 'lucide-react';
import ApiKeyPrompt from './ApiKeyPrompt';

interface GiftSuggestion {
  name: string;
  description: string;
  priceRange: string;
  whereToBuy: string;
}

const GiftIdeas: React.FC = () => {
  const [showApiPrompt, setShowApiPrompt] = useState(!isOpenAIKeyConfigured());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [interests, setInterests] = useState('');
  const [age, setAge] = useState('');
  const [relationship, setRelationship] = useState('');
  const [budget, setBudget] = useState('');
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [copied, setCopied] = useState(false);

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiPrompt(false);
  };

  const generateGiftIdeas = async (regenerate: boolean = false) => {
    if (!regenerate && (!interests || !age || !relationship || !budget)) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `As a gift recommendation expert, suggest 3 thoughtful Christmas gift ideas for a ${age} year old ${relationship} who is interested in: ${interests}. Budget: ${budget}.

For each gift suggestion, include general suggestions on where to find the item (e.g., "Available at major electronics retailers like Best Buy", "Can be found in local bookstores or online retailers", etc.).

Please format your response strictly as a JSON object with this exact structure:
{
  "suggestions": [
    {
      "name": "Gift Name",
      "description": "Brief description of why this would be a good gift",
      "priceRange": "Price range",
      "whereToBuy": "General suggestions on where to find this item"
    }
  ]
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

      const parsedResponse = JSON.parse(response);
      if (!Array.isArray(parsedResponse.suggestions)) {
        throw new Error('Invalid response format');
      }

      setSuggestions(parsedResponse.suggestions);
    } catch (err) {
      setError(handleOpenAIError(err));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!suggestions.length) return;

    const content = suggestions.map((suggestion, index) => `
Gift Suggestion ${index + 1}:
${suggestion.name}
Description: ${suggestion.description}
Price Range: ${suggestion.priceRange}
Where to Buy: ${suggestion.whereToBuy}
`).join('\n---\n');

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Gift className="w-6 h-6 text-red-600" />
          AI Gift Generator
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-gray-600">
            Let our AI help you find the perfect Christmas gift for your loved ones.
          </p>
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Unlimited Free Access
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Their Interests
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., gaming, cooking, reading"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., 25"
            min="0"
            max="120"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship
          </label>
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., brother, mother, friend"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget
          </label>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., $50-$100"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <button
        onClick={() => generateGiftIdeas(false)}
        disabled={loading}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Ideas...
          </>
        ) : (
          'Generate Gift Ideas'
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
                  We're finding the perfect gifts for your loved one...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Gift Suggestions
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => generateGiftIdeas(true)}
                disabled={loading}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors disabled:text-gray-400"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 transition-colors ${
                  copied 
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-800 mb-2">
                {suggestion.name}
              </h4>
              <p className="text-gray-600 text-sm mb-2">
                {suggestion.description}
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-600">
                  Price Range: {suggestion.priceRange}
                </p>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <ShoppingBag className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{suggestion.whereToBuy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GiftIdeas;