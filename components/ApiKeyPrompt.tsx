import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface ApiKeyPromptProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-start gap-3 mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold mb-1">OpenAI API Key Required</h3>
          <p className="text-sm">
            To use this feature, you'll need to provide your OpenAI API key. You can find your API key in your{' '}
            <a 
              href="https://platform.openai.com/account/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-yellow-900"
            >
              OpenAI dashboard
            </a>.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="sk-..."
          />
        </div>

        <button
          onClick={() => onSubmit(apiKey)}
          disabled={!apiKey}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Save API Key
        </button>

        <p className="text-xs text-gray-500 mt-2">
          Your API key will be stored securely in your browser's local storage and will only be used for making requests to OpenAI.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;