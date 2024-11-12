import OpenAI from 'openai';
import { type FAQ } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function processTranscriptionWithAI(transcription: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a process simplification expert. Break down processes into simple, high-level steps like 'Take photo' or 'Upload to TikTok'. Each step should be a single, clear action."
        },
        {
          role: "user",
          content: `Break down this process into 3-4 simple, high-level steps. Keep each step very brief and actionable, like 'Take photo' or 'Upload to TikTok'. Format the response as a JSON array where each object has 'number' and 'content' properties. Example: [{"number": 1, "content": "Take photo"}, {"number": 2, "content": "Edit photo"}].\n\nProcess:\n${transcription}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"steps": []}');
    const steps = Array.isArray(result) ? result : (result.steps || []);
    
    return steps.map((step: any, index: number) => ({
      id: `step-${index + 1}`,
      number: step.number || index + 1,
      content: step.content || 'Unknown step',
      keywords: []
    }));
  } catch (error) {
    console.error('Error processing with OpenAI:', error);
    throw new Error('Failed to process steps. Please try again.');
  }
}

export async function modifyTranscriptionWithAI(transcription: string, instruction: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at modifying and improving process documentation. Your task is to modify the given process based on the user's instructions while maintaining clarity and accuracy."
        },
        {
          role: "user",
          content: `Please modify this process according to the following instruction: "${instruction}"\n\nProcess:\n${transcription}`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || transcription;
  } catch (error) {
    console.error('Error modifying with OpenAI:', error);
    throw new Error('Failed to modify transcription. Please try again.');
  }
}

export async function convertToMarkdown(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Convert the provided content into well-formatted Markdown with appropriate headers, lists, and formatting."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error converting to Markdown:', error);
    throw new Error('Failed to convert to Markdown. Please try again.');
  }
}

export async function createTrainingManual(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Create a comprehensive training manual with sections, clear explanations, and practical exercises. Format the output in HTML with appropriate semantic tags and classes."
        },
        {
          role: "user",
          content: `Create a training manual from this content:\n\n${content}`
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error creating training manual:', error);
    throw new Error('Failed to create training manual. Please try again.');
  }
}

export async function generateFAQs(topic: string, context: string = ''): Promise<FAQ[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a FAQ generation expert. Create comprehensive FAQs with detailed answers. Return exactly 10 FAQs in JSON format with 'faqs' array containing objects with 'question' and 'answer' properties."
        },
        {
          role: "user",
          content: context 
            ? `Generate 10 FAQs about: ${topic}\nAdditional context: ${context}`
            : `Generate 10 comprehensive FAQs about: ${topic}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure we have a valid faqs array
    if (!result.faqs || !Array.isArray(result.faqs)) {
      throw new Error('Invalid response format from API');
    }

    // Validate and format each FAQ
    const validFaqs = result.faqs.map((faq: any) => ({
      question: faq.question || 'Question not available',
      answer: faq.answer || 'Answer not available'
    }));

    return validFaqs;
  } catch (error) {
    console.error('Error generating FAQs:', error);
    throw new Error('Failed to generate FAQs. Please try again.');
  }
}

export async function analyzeRootCause(messages: { role: string; content: string }[], userInput: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a root cause analysis expert. Ask focused questions to identify the underlying cause of problems. Limit to 3 questions maximum. After gathering information, provide a detailed analysis and actionable recommendations."
        },
        ...messages,
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error analyzing root cause:', error);
    throw new Error('Failed to analyze root cause. Please try again.');
  }
}

export async function convertToHTML(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Convert the provided content into well-formatted HTML with appropriate semantic tags, classes, and structure. Use modern HTML5 elements where appropriate."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error converting to HTML:', error);
    throw new Error('Failed to convert to HTML. Please try again.');
  }
}

export async function convertFromHTML(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Convert the provided HTML into plain text while maintaining the structure and formatting intent. Preserve headings, lists, and other important structural elements in a text-only format."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error converting from HTML:', error);
    throw new Error('Failed to convert from HTML. Please try again.');
  }
}