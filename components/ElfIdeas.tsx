import React, { useState, useEffect } from 'react';
import { openai, isOpenAIKeyConfigured, setApiKey } from '../lib/openai';
import { Sparkles, Loader2, AlertCircle, Home, Plus, Trash2, RefreshCw, Clock, MapPin, Save } from 'lucide-react';
import ApiKeyPrompt from './ApiKeyPrompt';

interface Room {
  name: string;
  furniture: string[];
}

interface ElfLocation {
  id: string;
  date: string;
  location: string;
  description: string;
}

const ElfIdeas: React.FC = () => {
  const [showApiPrompt, setShowApiPrompt] = useState(!isOpenAIKeyConfigured());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('elf_rooms');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentIdea, setCurrentIdea] = useState<ElfLocation | null>(null);

  useEffect(() => {
    localStorage.setItem('elf_rooms', JSON.stringify(rooms));
  }, [rooms]);

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiPrompt(false);
  };

  const addRoom = () => {
    if (!newRoom.name || !newRoom.furniture) {
      setError('Please fill in both room name and furniture items');
      return;
    }

    setRooms([...rooms, {
      name: newRoom.name,
      furniture: newRoom.furniture.split(',').map(item => item.trim())
    }]);
    setNewRoom({ name: '', furniture: '' });
    setError('');
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const generateIdea = async (regenerate: boolean = false) => {
    if (!regenerate && rooms.length === 0) {
      setError('Please add at least one room first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const roomsDescription = rooms.map(room => 
        `${room.name} (contains: ${room.furniture.join(', ')})`
      ).join('; ');

      const prompt = `As a creative Elf on the Shelf expert, suggest a new hiding spot and scene for the elf. 
      Available rooms and furniture: ${roomsDescription}
      
      Create a fun, creative, and safe scene. Include both the location and what the elf is doing.
      
      Format response as JSON:
      {
        "location": "specific location in the house",
        "description": "detailed description of the scene"
      }`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
        temperature: regenerate ? 0.9 : 0.7
      });

      const response = completion.choices[0].message.content;
      if (response) {
        const idea = JSON.parse(response);
        const newLocation: ElfLocation = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          location: idea.location,
          description: idea.description
        };
        setCurrentIdea(newLocation);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate idea. Please try again.');
      }
      console.error('OpenAI error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [newRoom, setNewRoom] = useState({ name: '', furniture: '' });

  if (showApiPrompt) {
    return <ApiKeyPrompt onSubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-red-600" />
          Elf on the Shelf Ideas
        </h2>
        <p className="text-gray-600">
          Get creative hiding spots for your Elf on the Shelf based on your home's layout.
        </p>
      </div>

      {!setupComplete && (
        <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-green-50 rounded-xl border border-red-100">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Home className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Set Up Your Home Layout</h3>
              <p className="text-gray-600 mb-4">
                Add the rooms in your house and list the main furniture or objects in each room.
                This helps generate more personalized and realistic hiding spots for your elf.
              </p>
              <button
                onClick={() => setSetupComplete(true)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                I've already added my rooms →
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-red-600" />
              Room Setup
            </h3>
            <div className="space-y-4">
              <div className="grid gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Living Room"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Furniture Items
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., couch, TV stand, bookshelf"
                    value={newRoom.furniture}
                    onChange={(e) => setNewRoom({ ...newRoom, furniture: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">Separate items with commas</p>
                </div>
                <button
                  onClick={addRoom}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Room
                </button>
              </div>

              <div className="space-y-3">
                {rooms.map((room, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">{room.name}</h4>
                        <p className="text-sm text-gray-600">
                          {room.furniture.join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeRoom(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-green-50 p-6 rounded-xl border border-red-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-600" />
                Generate New Idea
              </h3>
              {currentIdea && (
                <button
                  onClick={() => generateIdea(true)}
                  disabled={loading}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors disabled:text-gray-400"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              )}
            </div>
            <button
              onClick={() => generateIdea(false)}
              disabled={loading || rooms.length === 0}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-600 transition-colors disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Idea...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate New Hiding Spot
                </>
              )}
            </button>

            {loading && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-100">
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
                      We're finding the perfect hiding spot for your elf...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentIdea && (
              <div className="mt-4 bg-white p-6 rounded-lg border border-red-100 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  New Hiding Spot
                </h4>
                <div className="space-y-3 mb-4">
                  <p className="text-gray-800">
                    <strong>Location:</strong> {currentIdea.location}
                  </p>
                  <p className="text-gray-800">
                    <strong>Scene:</strong> {currentIdea.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-red-50 p-6 rounded-xl border border-green-100">
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=2340&auto=format&fit=crop"
              alt="Elf on the Shelf"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tips for Success</h3>
            <ul className="text-left text-gray-600 space-y-2 list-disc list-inside">
              <li>Move your elf to a new spot each night</li>
              <li>Take photos to remember your favorite spots</li>
              <li>Keep spots age-appropriate and safe</li>
              <li>Be creative but keep it simple</li>
              <li>Avoid touching the elf directly</li>
              <li>Consider your children's routine when choosing spots</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElfIdeas;