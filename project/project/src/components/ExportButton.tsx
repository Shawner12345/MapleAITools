import React from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSopStore } from '../store/sopStore';

export function ExportButton() {
  const { sopData } = useSopStore();

  const exportToPDF = async () => {
    if (sopData.steps.length === 0) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;

    // Add title
    pdf.setFontSize(20);
    pdf.text('Process Documentation', margin, margin);
    
    // Add steps
    pdf.setFontSize(12);
    let yPosition = margin + 10;
    
    pdf.text('Steps:', margin, yPosition += 10);
    sopData.steps.forEach((step) => {
      const stepText = `${step.number}. ${step.content}`;
      const lines = pdf.splitTextToSize(stepText, pageWidth - 2 * margin);
      
      if (yPosition + (lines.length * 7) > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.text(lines, margin, yPosition += 7);
      
      if (step.notes) {
        const noteLines = pdf.splitTextToSize(`   Note: ${step.notes}`, pageWidth - 2 * margin);
        pdf.setTextColor(100);
        pdf.text(noteLines, margin, yPosition += 7);
        pdf.setTextColor(0);
        yPosition += (noteLines.length - 1) * 7;
      }
      
      yPosition += 3;
    });

    // Capture mind map
    const mindMapElement = document.querySelector('.react-flow') as HTMLElement;
    if (mindMapElement) {
      pdf.addPage();
      const canvas = await html2canvas(mindMapElement, {
        backgroundColor: '#f9fafb',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.text('Mind Map:', margin, margin);
      pdf.addImage(imgData, 'PNG', margin, margin + 10, imgWidth, imgHeight);
    }

    pdf.save('process-documentation.pdf');
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={sopData.steps.length === 0}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        sopData.steps.length === 0
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-maple-orange hover:bg-maple-orange-dark text-white'
      }`}
    >
      <Download className="w-4 h-4" />
      Export PDF
    </button>
  );
}