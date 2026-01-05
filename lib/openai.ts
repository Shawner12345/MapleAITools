import OpenAI from 'openai';

const getApiKey = () => {
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  const localKey = localStorage.getItem('openai_api_key');
  return envKey || localKey || '';
};

let openaiInstance = new OpenAI({
  apiKey: getApiKey(),
  dangerouslyAllowBrowser: true
});

export const openai = openaiInstance;

export const isOpenAIKeyConfigured = () => {
  const key = getApiKey();
  return !!key && key !== 'dummy-key';
};

export const setApiKey = (key: string) => {
  localStorage.setItem('openai_api_key', key);
  openaiInstance = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true
  });
};

export const handleOpenAIError = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle rate limiting errors
    if (error.message.includes('429')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    // Handle authentication errors
    if (error.message.includes('401')) {
      return 'Invalid API key. Please check your OpenAI API key configuration.';
    }
    // Handle other API errors
    if (error.message.includes('500')) {
      return 'OpenAI service is temporarily unavailable. Please try again later.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};