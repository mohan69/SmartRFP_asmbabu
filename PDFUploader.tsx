import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader } from 'lucide-react';
import { parsePDF, validatePDFFile, formatFileSize, PDFParseResult } from '../utils/pdfParser';

interface PDFUploaderProps {
  onTextExtracted: (text: string, metadata?: PDFParseResult['metadata']) => void;
  onError?: (error: string) => void;
  className?: string;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ 
  onTextExtracted, 
  onError, 
  className = '' 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<PDFParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setUploadedFile(null);
    setParseResult(null);

    // Validate file
    if (!validatePDFFile(file)) {
      const errorMsg = file.type !== 'application/pdf' 
        ? 'Please select a valid PDF file.'
        : 'File size must be less than 10MB.';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const result = await parsePDF(file);
      setParseResult(result);
      
      if (result.text.trim()) {
        onTextExtracted(result.text, result.metadata);
      } else {
        const errorMsg = 'No text content found in the PDF. The file might be image-based or corrupted.';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to process PDF file.';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileSelect(pdfFile);
    } else {
      const errorMsg = 'Please drop a PDF file.';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setParseResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary-400 bg-primary-50'
            : error
            ? 'border-red-300 bg-red-50'
            : uploadedFile
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
          id="pdf-upload"
        />

        {isProcessing ? (
          <div className="space-y-3">
            <Loader className="h-8 w-8 text-primary-500 mx-auto animate-spin" />
            <div className="text-sm text-gray-600">Processing PDF...</div>
            {uploadedFile && (
              <div className="text-xs text-gray-500">
                Extracting text from {uploadedFile.name}
              </div>
            )}
          </div>
        ) : uploadedFile && parseResult ? (
          <div className="space-y-3">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
            <div className="text-sm font-medium text-green-700">PDF processed successfully!</div>
            <div className="bg-white rounded-lg p-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
                </div>
                <button
                  onClick={clearFile}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>Size: {formatFileSize(uploadedFile.size)}</div>
                <div>Pages: {parseResult.pageCount}</div>
                <div>Characters: {parseResult.text.length.toLocaleString()}</div>
                <div>Words: ~{parseResult.text.split(/\s+/).length.toLocaleString()}</div>
              </div>
              {parseResult.metadata?.title && (
                <div className="mt-2 text-xs text-gray-600">
                  Title: {parseResult.metadata.title}
                </div>
              )}
            </div>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
            <div className="text-sm text-red-600">{error}</div>
            <button
              onClick={() => {
                setError(null);
                fileInputRef.current?.click();
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <div className="text-sm text-gray-600">
              Drop your RFP PDF here or{' '}
              <label htmlFor="pdf-upload" className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                click to browse
              </label>
            </div>
            <div className="text-xs text-gray-500">
              Supports PDF files up to 10MB
            </div>
          </div>
        )}
      </div>

      {/* Text Preview */}
      {parseResult && parseResult.text && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Extracted Text Preview:</div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {parseResult.text.substring(0, 500)}
              {parseResult.text.length > 500 && '...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;