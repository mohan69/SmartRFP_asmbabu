import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up the worker with the bundled worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface PDFParseResult {
  text: string;
  pageCount: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

export const parsePDF = async (file: File): Promise<PDFParseResult> => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const pageCount = pdf.numPages;
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with proper spacing
      const pageText = textContent.items
        .map((item: any) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ')
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      if (pageText) {
        fullText += pageText + '\n\n';
      }
    }
    
    // Get metadata
    const metadata = await pdf.getMetadata();
    const parsedMetadata = metadata.info ? {
      title: metadata.info.Title || undefined,
      author: metadata.info.Author || undefined,
      subject: metadata.info.Subject || undefined,
      creator: metadata.info.Creator || undefined,
      producer: metadata.info.Producer || undefined,
      creationDate: metadata.info.CreationDate ? new Date(metadata.info.CreationDate) : undefined,
      modificationDate: metadata.info.ModDate ? new Date(metadata.info.ModDate) : undefined,
    } : undefined;
    
    return {
      text: fullText.trim(),
      pageCount,
      metadata: parsedMetadata
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please ensure the file is a valid PDF document.');
  }
};

export const validatePDFFile = (file: File): boolean => {
  // Check file type
  if (file.type !== 'application/pdf') {
    return false;
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return false;
  }
  
  return true;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};