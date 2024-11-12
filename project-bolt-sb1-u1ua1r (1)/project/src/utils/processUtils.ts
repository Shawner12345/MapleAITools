import { type ProcessedStep } from '../types';

export function processTranscriptionIntoSteps(transcription: string): ProcessedStep[] {
  // Split into sentences and clean up
  const sentences = transcription
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Process each sentence into a structured step
  return sentences.map((sentence, index) => ({
    id: `step-${index + 1}`,
    number: index + 1,
    content: sentence,
    keywords: extractKeywords(sentence),
  }));
}

function extractKeywords(sentence: string): string[] {
  // Remove common words and extract key terms
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  return sentence
    .toLowerCase()
    .split(' ')
    .filter(word => !commonWords.has(word) && word.length > 2)
    .slice(0, 3); // Keep top 3 keywords
}