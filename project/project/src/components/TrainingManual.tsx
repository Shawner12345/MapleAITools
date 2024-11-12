import React, { useState } from 'react';
import { Mic, FileText, Sparkles, Loader2, FileDown } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { createTrainingManual } from '../services/openai';

export function TrainingManual() {
  const [content, setContent] = useState('');
  const [manual, setManual] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessManual = async () => {
    if (!content) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await createTrainingManual(content);
      setManual(result);
    } catch (error) {
      console.error('Error processing manual:', error);
      setError('Failed to create manual. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(manual, 'text/html');
    const elements = doc.body.children;
    
    let yPosition = 20;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    Array.from(elements).forEach(element => {
      const tag = element.tagName.toLowerCase();
      const text = element.textContent?.trim() || '';
      
      if (!text) return;
      
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      switch (tag) {
        case 'h1':
          pdf.setFontSize(24);
          pdf.setFont('helvetica', 'bold');
          break;
        case 'h2':
          pdf.setFontSize(20);
          pdf.setFont('helvetica', 'bold');
          break;
        case 'h3':
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          break;
        default:
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      
      const lineHeight = tag.startsWith('h') ? 10 : 7;
      yPosition += lines.length * lineHeight + 5;
      
      if (element.className === 'exercise' || element.className === 'takeaway') {
        yPosition += 5;
      }
    });
    
    pdf.save('training-manual.pdf');
  };

  const handleCopyToClipboard = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(manual, 'text/html');
    const plainText = doc.body.textContent || '';
    navigator.clipboard.writeText(plainText);
  };

  return (
    <div className="p-8">
      <div className="grid gap-6">
        {/* Input Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-maple-blue" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Create Training Manual</h3>
                <p className="text-gray-600 mb-4">Record or type your content to create a training manual.</p>
                
                {/* Voice Recording */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Voice Recording</h4>
                  <VoiceRecorder 
                    onTranscriptionChange={setContent}
                    onStatusChange={setIsTranscribing}
                  />
                </div>

                {/* Manual Text Input */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Or Type/Paste Content</h4>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your training manual content..."
                    className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-maple-blue"
                  />
                </div>

                <button
                  onClick={handleProcessManual}
                  disabled={!content || isProcessing}
                  className="flex items-center gap-2 px-4 py-2 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Manual
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Manual */}
        {manual && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileDown className="w-6 h-6 text-maple-blue" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Training Manual</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyToClipboard}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-maple-blue text-white rounded-lg hover:bg-maple-blue-dark transition-colors"
                      >
                        Copy to Clipboard
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: manual }}
                      className="[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:text-gray-900
                        [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-gray-800
                        [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-gray-700
                        [&_p]:text-gray-600 [&_p]:mb-4 [&_p]:leading-relaxed
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-gray-600
                        [&_li]:mb-2
                        [&_hr]:my-8 [&_hr]:border-gray-200
                        [&_.exercise]:bg-maple-orange/5 [&_.exercise]:p-6 [&_.exercise]:rounded-lg [&_.exercise]:mb-6 [&_.exercise]:border-l-4 [&_.exercise]:border-maple-orange
                        [&_.takeaway]:bg-maple-blue/5 [&_.takeaway]:p-6 [&_.takeaway]:rounded-lg [&_.takeaway]:mb-6 [&_.takeaway]:border-l-4 [&_.takeaway]:border-maple-blue"
                    />
                  </div>
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