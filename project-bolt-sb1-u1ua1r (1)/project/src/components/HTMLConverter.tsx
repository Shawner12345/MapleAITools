import React, { useState } from 'react';
import { FileText, Code, ArrowRight, ArrowLeft, Copy, Loader2 } from 'lucide-react';
import { convertToHTML, convertFromHTML } from '../services/openai';

type ConversionDirection = 'toHTML' | 'fromHTML';

export function HTMLConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<ConversionDirection>('toHTML');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!input.trim() || isConverting) return;

    setIsConverting(true);
    setError(null);

    try {
      const result = direction === 'toHTML' 
        ? await convertToHTML(input)
        : await convertFromHTML(input);
      setOutput(result);
    } catch (error) {
      console.error('Conversion error:', error);
      setError('Failed to convert content. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const handleSwapDirection = () => {
    setDirection(prev => prev === 'toHTML' ? 'fromHTML' : 'toHTML');
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="p-8">
      <div className="grid gap-6">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-center gap-4">
            <span className="text-gray-600">Text</span>
            <button
              onClick={handleSwapDirection}
              className="flex items-center gap-2 px-4 py-2 bg-maple-blue text-white rounded-lg hover:bg-maple-blue-dark transition-colors"
            >
              {direction === 'toHTML' ? (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Convert to HTML
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  Convert from HTML
                </>
              )}
            </button>
            <span className="text-gray-600">HTML</span>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                {direction === 'toHTML' ? (
                  <FileText className="w-6 h-6 text-maple-blue" />
                ) : (
                  <Code className="w-6 h-6 text-maple-blue" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {direction === 'toHTML' ? 'Input Text' : 'Input HTML'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {direction === 'toHTML' 
                    ? 'Enter your text to convert it to HTML'
                    : 'Paste your HTML code to convert it to plain text'}
                </p>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={direction === 'toHTML' 
                    ? 'Enter your text here...'
                    : 'Paste your HTML code here...'}
                  className="w-full h-48 p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-maple-blue"
                />
                <button
                  onClick={handleConvert}
                  disabled={!input.trim() || isConverting}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Convert
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        {output && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  {direction === 'toHTML' ? (
                    <Code className="w-6 h-6 text-maple-blue" />
                  ) : (
                    <FileText className="w-6 h-6 text-maple-blue" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {direction === 'toHTML' ? 'Generated HTML' : 'Converted Text'}
                    </h3>
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-maple-blue text-white rounded-lg hover:bg-maple-blue-dark transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                  <div className="relative">
                    <pre className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm text-gray-700 whitespace-pre-wrap">
                      {output}
                    </pre>
                  </div>
                  {direction === 'toHTML' && (
                    <div className="mt-4 p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                      <div 
                        dangerouslySetInnerHTML={{ __html: output }}
                        className="prose max-w-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}