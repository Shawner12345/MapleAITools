import React, { useState } from 'react';
import { openai, isOpenAIKeyConfigured, setApiKey } from '../lib/openai';
import { Heart, Loader2, AlertCircle, MapPin, Clock, Tag, Filter, Sparkles, RefreshCw, Copy, Check, Globe, Link } from 'lucide-react';
import ApiKeyPrompt from './ApiKeyPrompt';

interface Venue {
  name: string;
  address: string;
  area: string;
  website?: string;
  priceRange: string;
  notes?: string;
  reservationTips?: string;
}

interface DateIdea {
  title: string;
  description: string;
  location: 'Indoor' | 'Outdoor' | 'Both';
  duration: string;
  estimatedCost: string;
  moodType: 'Romantic' | 'Fun' | 'Adventurous' | 'Cozy';
  activities: string[];
  preparations: string[];
  weatherConsiderations?: string;
  venues: Venue[];
  alternativeVenues?: Venue[];
}

const DateNightIdeas: React.FC = () => {
  const [showApiPrompt, setShowApiPrompt] = useState(!isOpenAIKeyConfigured());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateIdeas, setDateIdeas] = useState<DateIdea[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    budget: '',
    duration: '',
    mood: ''
  });
  const [preferences, setPreferences] = useState({
    interests: '',
    location: '',
    weatherConditions: '',
    budget: '',
    specialConsiderations: '',
    area: '' // For specific neighborhoods/areas
  });
  const [copied, setCopied] = useState(false);

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiPrompt(false);
  };

  const generateDateIdea = async (regenerate: boolean = false) => {
    if (!regenerate && (!preferences.interests || !preferences.location)) {
      setError('Please fill in at least your interests and location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `Create a romantic Christmas-themed date idea in ${preferences.location}${preferences.area ? `, specifically in/around ${preferences.area}` : ''} with these preferences:
      - Interests: ${preferences.interests}
      - Weather Conditions: ${preferences.weatherConditions || 'Any'}
      - Budget Range: ${preferences.budget || 'Any'}
      - Special Considerations: ${preferences.specialConsiderations || 'None'}

      Include SPECIFIC venue recommendations with real locations, especially for:
      - Restaurants (include cuisine type, price range, and atmosphere)
      - Activities (include actual venues, class providers, etc.)
      - Entertainment venues
      - Scenic spots or walking areas
      
      If suggesting cooking classes, include specific cooking schools or venues that offer classes.
      If suggesting restaurants, include actual restaurant names and locations.
      If suggesting walks or outdoor activities, specify exact locations or neighborhoods.

      Format response as JSON:
      {
        "title": "Creative date name",
        "description": "Engaging description of the date",
        "location": "Indoor/Outdoor/Both",
        "duration": "Estimated duration",
        "estimatedCost": "Cost range",
        "moodType": "Romantic/Fun/Adventurous/Cozy",
        "activities": ["List of specific activities"],
        "preparations": ["List of things to prepare"],
        "weatherConsiderations": "Weather-related notes if applicable",
        "venues": [
          {
            "name": "Venue name",
            "address": "Full address",
            "area": "Neighborhood/District",
            "website": "Website URL if available",
            "priceRange": "Price category",
            "notes": "Special notes about the venue",
            "reservationTips": "Booking information if needed"
          }
        ],
        "alternativeVenues": [
          {
            "name": "Alternative venue name",
            "address": "Full address",
            "area": "Neighborhood/District",
            "website": "Website URL if available",
            "priceRange": "Price category",
            "notes": "Special notes about the venue"
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

      const newIdea = JSON.parse(response);
      setDateIdeas([newIdea, ...dateIdeas]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate date idea. Please try again.');
      }
      console.error('OpenAI error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!dateIdeas.length) return;

    const content = dateIdeas[0].venues.map(venue => `
Venue: ${venue.name}
Address: ${venue.address}
Area: ${venue.area}
Price Range: ${venue.priceRange}
${venue.website ? `Website: ${venue.website}` : ''}
${venue.notes ? `Notes: ${venue.notes}` : ''}
${venue.reservationTips ? `Reservation Tips: ${venue.reservationTips}` : ''}
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-600" />
          Christmas Date Night Ideas
        </h2>
        <p className="text-gray-600">
          Get personalized, romantic date ideas with specific venue recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Interests & Activities You Both Enjoy
          </label>
          <input
            type="text"
            value={preferences.interests}
            onChange={(e) => setPreferences({ ...preferences, interests: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., cooking, art, live music"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={preferences.location}
            onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., Toronto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specific Area/Neighborhood (Optional)
          </label>
          <input
            type="text"
            value={preferences.area}
            onChange={(e) => setPreferences({ ...preferences, area: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., Yorkville, Distillery District"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <select
            value={preferences.budget}
            onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Any Budget</option>
            <option value="budget">Budget-Friendly (Under $50)</option>
            <option value="moderate">Moderate ($50-150)</option>
            <option value="upscale">Upscale ($150-300)</option>
            <option value="luxury">Luxury ($300+)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weather Conditions (Optional)
          </label>
          <input
            type="text"
            value={preferences.weatherConditions}
            onChange={(e) => setPreferences({ ...preferences, weatherConditions: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., snowy, cold, mild"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Considerations (Optional)
          </label>
          <input
            type="text"
            value={preferences.specialConsiderations}
            onChange={(e) => setPreferences({ ...preferences, specialConsiderations: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., accessibility needs, dietary restrictions"
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
        onClick={() => generateDateIdea(false)}
        disabled={loading}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Perfect Date...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Date Idea
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
                  We're creating the perfect date night plan for you...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {dateIdeas.length > 0 && (
        <div className="space-y-8">
          {dateIdeas.map((idea, index) => (
            <div
              key={index}
              className="border border-red-100 rounded-lg overflow-hidden bg-gradient-to-r from-red-50 to-pink-50"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{idea.title}</h3>
                <p className="text-gray-600 mb-4">{idea.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-full flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {idea.location}
                  </span>
                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {idea.duration}
                  </span>
                  <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {idea.estimatedCost}
                  </span>
                  <span className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded-full flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {idea.moodType}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Recommended Venues:</h4>
                  <div className="grid gap-4">
                    {idea.venues.map((venue, vIndex) => (
                      <div key={vIndex} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-800">{venue.name}</h5>
                          {venue.website && (
                            <a
                              href={venue.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Globe className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">
                            <strong>Address:</strong> {venue.address}
                          </p>
                          <p className="text-gray-600">
                            <strong>Area:</strong> {venue.area}
                          </p>
                          <p className="text-gray-600">
                            <strong>Price Range:</strong> {venue.priceRange}
                          </p>
                          {venue.notes && (
                            <p className="text-gray-600">
                              <strong>Notes:</strong> {venue.notes}
                            </p>
                          )}
                          {venue.reservationTips && (
                            <p className="text-gray-600">
                              <strong>Reservation Tips:</strong> {venue.reservationTips}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {idea.alternativeVenues && idea.alternativeVenues.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-2">Alternative Options:</h4>
                    <div className="grid gap-4">
                      {idea.alternativeVenues.map((venue, vIndex) => (
                        <div key={vIndex} className="bg-white/50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-800">{venue.name}</h5>
                            {venue.website && (
                              <a
                                href={venue.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Globe className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-600">
                              <strong>Address:</strong> {venue.address}
                            </p>
                            <p className="text-gray-600">
                              <strong>Area:</strong> {venue.area}
                            </p>
                            <p className="text-gray-600">
                              <strong>Price Range:</strong> {venue.priceRange}
                            </p>
                            {venue.notes && (
                              <p className="text-gray-600">
                                <strong>Notes:</strong> {venue.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Activities:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {idea.activities.map((activity, i) => (
                        <li key={i}>{activity}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Preparations:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {idea.preparations.map((prep, i) => (
                        <li key={i}>{prep}</li>
                      ))}
                    </ul>
                  </div>

                  {idea.weatherConsiderations && (
                    <div className="text-sm text-gray-600">
                      <strong>Weather Note:</strong> {idea.weatherConsiderations}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateNightIdeas;