import React, { useState } from 'react';
import { openai, isOpenAIKeyConfigured, setApiKey, handleOpenAIError } from '../lib/openai';
import { Snowflake, Loader2, AlertCircle, Home, ShoppingBag, DollarSign, Copy, Sparkles, Palette, TreePine, RefreshCw, Clock, Check } from 'lucide-react';
import ApiKeyPrompt from './ApiKeyPrompt';

interface DecorationItem {
  name: string;
  whereToBuy: string;
  estimatedPrice: string;
}

interface DecorationIdea {
  title: string;
  description: string;
  items: DecorationItem[];
  arrangement: string[];
  totalCost: string;
  style: string;
  tips: string[];
  area: string;
  alternatives: string[];
}

const DecoratingIdeas: React.FC = () => {
  const [showApiPrompt, setShowApiPrompt] = useState(!isOpenAIKeyConfigured());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [preferences, setPreferences] = useState({
    style: 'traditional',
    area: 'all',
    budget: 'medium',
    stores: 'any'
  });
  const [currentIdea, setCurrentIdea] = useState<DecorationIdea | null>(null);

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiPrompt(false);
  };

  const generateIdea = async (regenerate: boolean = false) => {
    if (!isOpenAIKeyConfigured()) {
      setError('OpenAI API key is not configured. Please add your API key to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `Generate a practical Christmas decoration idea with these preferences:
      - Style: ${preferences.style}
      - Area: ${preferences.area}
      - Budget: ${preferences.budget}
      - Preferred Stores: ${preferences.stores}

      Focus on ready-to-buy decorations and simple arrangements. Include specific items that can be purchased from common retail stores (like Target, Walmart, HomeGoods, Amazon, etc.). If suggesting any DIY elements, they should be extremely simple (like arranging store-bought items or basic ribbon tying).

      Format response as JSON:
      {
        "title": "Theme name",
        "description": "Overview of the decoration theme",
        "items": [
          {
            "name": "Specific item name/description",
            "whereToBuy": "Store names where this can be found",
            "estimatedPrice": "Price range"
          }
        ],
        "arrangement": ["Simple steps for arranging/displaying items"],
        "totalCost": "Total budget range",
        "style": "Decoration style",
        "tips": ["Practical tips for setup and maintenance"],
        "area": "Where to place",
        "alternatives": ["Budget-friendly alternatives or similar options"]
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
        const idea = JSON.parse(response);
        setCurrentIdea(idea);
      } catch (parseError) {
        throw new Error('Failed to parse AI response. Please try again.');
      }
    } catch (err) {
      setError(handleOpenAIError(err));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!currentIdea) return;

    const content = `
Christmas Decoration Theme: ${currentIdea.title}

Description:
${currentIdea.description}

Area: ${currentIdea.area}
Style: ${currentIdea.style}
Total Estimated Cost: ${currentIdea.totalCost}

Shopping List:
${currentIdea.items.map(item => `- ${item.name}
  • Where to buy: ${item.whereToBuy}
  • Estimated price: ${item.estimatedPrice}`).join('\n')}

Arrangement Instructions:
${currentIdea.arrangement.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Helpful Tips:
${currentIdea.tips.map(tip => `- ${tip}`).join('\n')}

Alternative Options:
${currentIdea.alternatives.map(alt => `- ${alt}`).join('\n')}`;

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
          <Snowflake className="w-6 h-6 text-green-600" />
          Christmas Decorating Ideas
        </h2>
        <p className="text-gray-600">
          Get practical and beautiful Christmas decoration suggestions for your home.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decoration Style
          </label>
          <select
            value={preferences.style}
            onChange={(e) => setPreferences({ ...preferences, style: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="traditional">Traditional</option>
            <option value="modern">Modern & Minimalist</option>
            <option value="rustic">Rustic & Cozy</option>
            <option value="glamorous">Glamorous & Elegant</option>
            <option value="scandinavian">Scandinavian</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area to Decorate
          </label>
          <select
            value={preferences.area}
            onChange={(e) => setPreferences({ ...preferences, area: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Entire Home</option>
            <option value="indoor">Indoor Only</option>
            <option value="outdoor">Outdoor Only</option>
            <option value="tree">Christmas Tree</option>
            <option value="mantel">Mantel & Fireplace</option>
            <option value="table">Table Settings</option>
            <option value="window">Windows & Doors</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <select
            value={preferences.budget}
            onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="low">Budget-Friendly (Under $100)</option>
            <option value="medium">Moderate ($100-300)</option>
            <option value="high">Premium ($300+)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Stores
          </label>
          <select
            value={preferences.stores}
            onChange={(e) => setPreferences({ ...preferences, stores: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="any">Any Stores</option>
            <option value="budget">Budget Stores (Walmart, Dollar Store)</option>
            <option value="mid">Mid-Range (Target, HomeGoods)</option>
            <option value="premium">Premium (Pottery Barn, Crate & Barrel)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <button
        onClick={() => generateIdea(false)}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Idea...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Get Decoration Idea
          </>
        )}
      </button>

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
                  We're creating your perfect decoration plan...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentIdea && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Your Decoration Plan</h3>
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
                onClick={() => generateIdea(true)}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Regenerate
              </button>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4">{currentIdea.title}</h4>
            <p className="text-gray-600 mb-6">{currentIdea.description}</p>

            <div className="space-y-6">
              <div>
                <h5 className="font-medium text-gray-800 mb-3">Shopping List:</h5>
                <div className="grid gap-4">
                  {currentIdea.items.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <h6 className="font-medium text-gray-800 mb-2">{item.name}</h6>
                      <p className="text-sm text-gray-600">Where to buy: {item.whereToBuy}</p>
                      <p className="text-sm text-gray-600">Estimated price: {item.estimatedPrice}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-3">Arrangement Instructions:</h5>
                <ol className="list-decimal list-inside space-y-2">
                  {currentIdea.arrangement.map((step, index) => (
                    <li key={index} className="text-gray-600">{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-3">Helpful Tips:</h5>
                <ul className="list-disc list-inside space-y-2">
                  {currentIdea.tips.map((tip, index) => (
                    <li key={index} className="text-gray-600">{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-3">Alternative Options:</h5>
                <ul className="list-disc list-inside space-y-2">
                  {currentIdea.alternatives.map((alternative, index) => (
                    <li key={index} className="text-gray-600">{alternative}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecoratingIdeas;