import React, { useState } from 'react';
import { Send, Loader2, Wand2 } from 'lucide-react';
import { modifyTranscriptionWithAI } from '../services/openai';
import { useSopStore } from '../store/sopStore';
import { generateNodesFromSteps } from '../utils/mindMapUtils';
import { processTranscriptionWithAI } from '../services/openai';

interface TranscriptionEditorProps {
  transcription: string;
  onTranscriptionChange: (text: string) => void;
}

export function TranscriptionEditor({ transcription, onTranscriptionChange }: TranscriptionEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { setSteps, setNodes, setEdges } = useSopStore();

  const handleModify = async () => {
    if (!instruction.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      // First modify the transcription
      const modifiedText = await modifyTranscriptionWithAI(transcription, instruction);
      onTranscriptionChange(modifiedText);

      // Then process it into steps
      const newSteps = await processTranscriptionWithAI(modifiedText);
      setSteps(newSteps);

      // Update mind map
      const { nodes, edges } = generateNodesFromSteps(newSteps);
      setNodes(nodes);
      setEdges(edges);

      setInstruction('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error modifying transcription:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleModify();
    }
  };

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-maple-orange hover:bg-maple-orange/10 rounded-lg transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Modify with AI
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Ask AI to modify your transcription. Try:
            <br />
            • "Add more detail"
            <br />
            • "Make it more concise"
            <br />
            • "Break it down into smaller steps"
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your instruction..."
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-maple-orange focus:border-maple-orange"
              disabled={isProcessing}
            />
            <button
              onClick={handleModify}
              disabled={!instruction.trim() || isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Modify
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setInstruction('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}