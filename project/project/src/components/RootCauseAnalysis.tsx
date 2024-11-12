import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Download, RefreshCcw, Lightbulb } from 'lucide-react';
import { analyzeRootCause } from '../services/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isFinal?: boolean;
}

export function RootCauseAnalysis() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartNew = () => {
    setMessages([{
      role: 'assistant',
      content: "Hello! I'll help identify the root cause of your problem and suggest solutions. Please describe the issue you're experiencing.",
      timestamp: new Date()
    }]);
    setQuestionCount(0);
    setIsStarted(true);
    setAnalysisComplete(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isAnalyzing) return;

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAnalyzing(true);

    try {
      const response = await analyzeRootCause(
        messages.map(m => ({ role: m.role, content: m.content })),
        userMessage.content
      );

      // Check if this is the final analysis (contains recommendations)
      const isFinal = response.includes('Recommendations:');
      if (isFinal) {
        setAnalysisComplete(true);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        isFinal
      }]);

      // Increment question count if the response contains a question
      if (response.includes('?')) {
        setQuestionCount(prev => prev + 1);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try rephrasing your response.",
        timestamp: new Date()
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDownloadTranscript = () => {
    const transcript = messages
      .map(m => `${m.role.toUpperCase()} (${m.timestamp.toLocaleTimeString()}): ${m.content}`)
      .join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'root-cause-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Root Cause Analysis</h3>
              {questionCount > 0 && !analysisComplete && (
                <p className="text-sm text-gray-500">
                  Question {questionCount}/3
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleStartNew}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-maple-blue text-white rounded-lg hover:bg-maple-blue-dark transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                New Analysis
              </button>
              {messages.length > 0 && (
                <button
                  onClick={handleDownloadTranscript}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Save Transcript
                </button>
              )}
            </div>
          </div>

          {!isStarted ? (
            <div className="text-center py-12">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Quick Root Cause Analysis
              </h4>
              <p className="text-gray-600 mb-6">
                Through 3 focused questions, I'll help you identify the underlying cause of your problem and suggest solutions.
              </p>
              <button
                onClick={handleStartNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors"
              >
                Start Analysis
              </button>
            </div>
          ) : (
            <>
              <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === 'assistant'
                          ? message.isFinal
                            ? 'bg-maple-orange/10 border border-maple-orange/20'
                            : 'bg-maple-blue/5'
                          : 'bg-maple-orange/5'
                      } text-gray-800`}
                    >
                      {message.isFinal && (
                        <div className="flex items-center gap-2 mb-2 text-maple-orange">
                          <Lightbulb className="w-5 h-5" />
                          <span className="font-medium">Final Analysis & Recommendations</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={analysisComplete ? "Analysis complete. Start a new analysis to continue." : "Type your response..."}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-maple-blue resize-none"
                  rows={2}
                  disabled={isAnalyzing || analysisComplete}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isAnalyzing || analysisComplete}
                  className="flex items-center justify-center w-12 h-12 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}