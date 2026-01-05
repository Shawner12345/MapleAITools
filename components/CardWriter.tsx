import React, { useState } from 'react';
import { PenLine, Loader2, AlertCircle, Clock, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { openai, isOpenAIKeyConfigured, setApiKey, handleOpenAIError } from '../lib/openai';
import ApiKeyPrompt from './ApiKeyPrompt';

interface PoemTemplate {
  content: string;
  style: string;
  description: string;
}

const CardWriter: React.FC = () => {
  const [showApiPrompt, setShowApiPrompt] = useState(!isOpenAIKeyConfigured());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState('rhyming');
  const [mood, setMood] = useState('joyful');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [generatedPoem, setGeneratedPoem] = useState<PoemTemplate | null>(null);
  const [copied, setCopied] = useState(false);

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiPrompt(false);
  };

  const generatePoem = async (regenerate: boolean = false) => {
    if (!isOpenAIKeyConfigured()) {
      setError('OpenAI API key is not configured. Please add your API key to continue.');
      return;
    }

    if (!regenerate && !subject) {
      setError('Please fill in the subject of your poem');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `Write a modern Christmas poem about ${subject}.
      Style should be ${style} and mood should be ${mood}.
      ${additionalInfo ? `Additional context: ${additionalInfo}` : ''}

      Format the response as a JSON object with this structure:
      {
        "content": "The poem content",
        "style": "Description of the poetic style used",
        "description": "Brief description of the poem's theme and approach"
      }

      Make the poem unique and festive, incorporating Christmas themes and imagery.
      Ensure proper formatting with line breaks and stanzas.
      Use modern language and contemporary references where appropriate.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
        temperature: regenerate ? 0.9 : 0.8
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from AI service');
      }

      try {
        const poem = JSON.parse(response);
        setGeneratedPoem(poem);
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
    if (!generatedPoem) return;

    const content = `Christmas Poem

${generatedPoem.content}

Style: ${generatedPoem.style}
Description: ${generatedPoem.description}`;

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
          <PenLine className="w-6 h-6 text-green-600" />
          Christmas Poem Writer
        </h2>
        <p className="text-gray-600">
          Generate festive Christmas poems with AI assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject / Theme
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Santa's reindeer, Christmas tree"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Poetic Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="rhyming">Modern Rhyming Verse</option>
            <option value="free-verse">Free Verse</option>
            <option value="slam">Slam Poetry</option>
            <option value="rap">Rap Style</option>
            <option value="spoken-word">Spoken Word</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mood
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="joyful">Joyful & Festive</option>
            <option value="nostalgic">Nostalgic & Warm</option>
            <option value="whimsical">Whimsical & Playful</option>
            <option value="peaceful">Peaceful & Serene</option>
            <option value="magical">Magical & Wonder</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Context (Optional)
          </label>
          <input
            type="text"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., specific imagery or themes to include"
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
        onClick={() => generatePoem(false)}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Crafting Poem...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Poem
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
                  We're crafting your perfect Christmas poem...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {generatedPoem && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Christmas Poem</h3>
            <div className="flex gap-2">
              <button
                onClick={() => generatePoem(true)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Generate a new version"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="p-6 bg-green-50 rounded-lg border border-green-100">
            <pre className="text-gray-800 mb-4 whitespace-pre-line font-serif">{generatedPoem.content}</pre>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Style:</strong> {generatedPoem.style}</p>
              <p><strong>Description:</strong> {generatedPoem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardWriter;