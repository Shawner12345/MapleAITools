import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, Copy, Download } from 'lucide-react';
import { generateFAQs } from '../services/openai';

interface FAQ {
  question: string;
  answer: string;
}

export function FAQGenerator() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);
    setFaqs([]);

    try {
      const generatedFaqs = await generateFAQs(topic.trim(), content.trim());
      setFaqs(generatedFaqs);
    } catch (error) {
      console.error('Error generating FAQs:', error);
      setError('Failed to generate FAQs. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    
    let yPosition = 20;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`FAQs: ${topic}`, margin, yPosition);
    yPosition += 20;

    faqs.forEach((faq, index) => {
      // Add new page if needed
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      // Question
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const questionLines = pdf.splitTextToSize(`Q${index + 1}: ${faq.question}`, pageWidth - 2 * margin);
      pdf.text(questionLines, margin, yPosition);
      yPosition += questionLines.length * 8;

      // Answer
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const answerLines = pdf.splitTextToSize(`A: ${faq.answer}`, pageWidth - 2 * margin);
      pdf.text(answerLines, margin, yPosition);
      yPosition += answerLines.length * 7 + 15;
    });
    
    pdf.save('faqs.pdf');
  };

  const handleCopyToClipboard = () => {
    const text = faqs.map((faq, index) => (
      `Q${index + 1}: ${faq.question}\nA: ${faq.answer}\n`
    )).join('\n');
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="p-8">
      <div className="grid gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-maple-orange/10 rounded-lg">
                <FileText className="w-6 h-6 text-maple-orange" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Generate FAQs</h3>
                <p className="text-gray-600 mb-4">Enter a topic to generate relevant FAQs. Add optional context for more specific questions.</p>

                {/* Topic Input */}
                <div className="mb-6">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Topic <span className="text-maple-orange">*</span>
                  </label>
                  <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter the main topic for FAQs..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-maple-orange focus:border-maple-orange"
                  />
                </div>

                {/* Additional Context */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add any additional context to make the FAQs more specific..."
                    className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-maple-orange focus:border-maple-orange"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate FAQs
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generated FAQs */}
        {faqs.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-maple-orange/10 rounded-lg">
                  <FileText className="w-6 h-6 text-maple-orange" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Generated FAQs</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyToClipboard}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-maple-blue text-white rounded-lg hover:bg-maple-blue-dark transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {faqs.map((faq, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Q{index + 1}: {faq.question}
                        </h4>
                        <p className="text-gray-600">
                          A: {faq.answer}
                        </p>
                      </div>
                    ))}
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