import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Configure PDF.js worker
const pdfjsWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

async function extractTextWithOCR(pdfData: ArrayBuffer): Promise<string> {
  try {
    const worker = await createWorker('eng');
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
      
      // Create canvas and render PDF page
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Perform OCR on the canvas
      const { data: { text } } = await worker.recognize(canvas);
      fullText += text + '\n';
    }

    await worker.terminate();
    return fullText.trim();
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to process document with OCR. Please try a different file.');
  }
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    try {
      // First try normal text extraction
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
    } catch (error) {
      console.warn('Normal text extraction failed, falling back to OCR:', error);
    }

    // If no readable text found or extraction failed, try OCR
    if (!fullText.trim()) {
      console.log('No readable text found, attempting OCR...');
      fullText = await extractTextWithOCR(arrayBuffer);
    }

    if (!fullText.trim()) {
      throw new Error('Could not extract any text from the PDF, even with OCR.');
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Could not read PDF file. Please make sure it contains readable text or clear images of text.');
  }
}