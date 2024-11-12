import React, { useState } from 'react';
import { Upload, FileDown, Loader2, FileText } from 'lucide-react';
import { convertToMarkdown } from '../services/openai';
import { markdownToPdfContent } from '../utils/markdownUtils';

export function MarkdownConverter() {
  const [content, setContent] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setMarkdown('');
    setError(null);
  };

  const handleConvert = async () => {
    if (!content.trim()) return;

    setIsConverting(true);
    setError(null);

    try {
      const result = await convertToMarkdown(content);
      setMarkdown(result);
    } catch (err) {
      setError('Failed to convert content. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    
    const formattedContent = markdownToPdfContent(markdown);
    let yPosition = 20;
    const margin = 20;
    const lineHeight = 7;
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    formattedContent.forEach(item => {
      if (yPosition + item.height > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      if (item.type === 'heading') {
        pdf.setFontSize(item.level === 1 ? 24 : item.level === 2 ? 20 : 16);
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
      }

      const lines = pdf.splitTextToSize(item.text, pdf.internal.pageSize.getWidth() - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * lineHeight + (item.type === 'heading' ? 5 : 2);
    });
    
    pdf.save('markdown-document.pdf');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
  };

  return (
    <div className="p-8">
      <div className="grid gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Upload className="w-6 h-6 text-maple-blue" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Input Content</h3>
                <p className="text-gray-600 mb-4">Paste your content below to convert it to Markdown format.</p>
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Enter your content here..."
                  className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-maple-blue"
                />
                <button
                  onClick={handleConvert}
                  disabled={!content.trim() || isConverting}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Convert to Markdown
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        {markdown && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileDown className="w-6 h-6 text-maple-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Markdown Output</h3>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                      {markdown}
                    </pre>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 bg-maple-blue text-white rounded-lg hover:bg-maple-blue-dark transition-colors"
                    >
                      Copy to Clipboard
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors"
                    >
                      Download PDF
                    </button>
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