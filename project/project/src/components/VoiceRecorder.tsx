import React, { useState, useEffect } from 'react';
import { Mic, Square, Type, Send } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscriptionChange: (text: string) => void;
  onStatusChange: (isRecording: boolean) => void;
}

export function VoiceRecorder({ onTranscriptionChange, onStatusChange }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [inputMethod, setInputMethod] = useState<'voice' | 'manual'>('voice');
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        onStatusChange(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
        onStatusChange(false);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        onTranscriptionChange(finalTranscript);
      };

      setRecognition(recognition);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscriptionChange, onStatusChange]);

  const toggleRecording = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onTranscriptionChange(manualInput.trim());
      setManualInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleManualSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Method Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setInputMethod('voice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            inputMethod === 'voice'
              ? 'bg-maple-blue text-white'
              : 'text-maple-blue hover:bg-blue-50'
          }`}
        >
          <Mic className="w-4 h-4" />
          Start voice recording
        </button>
        <button
          onClick={() => setInputMethod('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            inputMethod === 'manual'
              ? 'bg-maple-blue text-white'
              : 'text-maple-blue hover:bg-blue-50'
          }`}
        >
          <Type className="w-4 h-4" />
          Type process
        </button>
      </div>

      {/* Voice Recording Interface */}
      {inputMethod === 'voice' && isRecording && (
        <button
          onClick={toggleRecording}
          className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all bg-red-500 hover:bg-red-600 text-white shadow-red-200 shadow-lg hover:shadow-xl"
        >
          <Square className="w-4 h-4" />
          Stop Recording
        </button>
      )}

      {/* Manual Input Interface */}
      {inputMethod === 'manual' && (
        <div className="flex gap-2">
          <textarea
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your process steps here..."
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-maple-blue resize-none"
            rows={4}
          />
          <button
            onClick={handleManualSubmit}
            disabled={!manualInput.trim()}
            className="flex-shrink-0 flex items-center justify-center w-12 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}