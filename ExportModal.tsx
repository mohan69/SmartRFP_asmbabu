import React, { useState } from 'react';
import { Download, X, FileText, File, Printer, CheckCircle } from 'lucide-react';
import { exportProposal, ExportOptions } from '../utils/exportUtils';
import { useAuth } from '../contexts/AuthContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  client: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  client
}) => {
  const { user } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    
    try {
      const options: ExportOptions = {
        format: selectedFormat,
        includeMetadata,
        template: 'standard',
        companyProfile: user?.companyProfile
      };
      
      await exportProposal(title, content, client, options);
      setExportSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions = [
    {
      value: 'pdf' as const,
      label: 'PDF Document',
      description: 'Professional format with company branding',
      icon: Printer,
      recommended: true
    },
    {
      value: 'docx' as const,
      label: 'Word Document',
      description: 'Editable RTF format with headers/footers',
      icon: File,
      recommended: false
    },
    {
      value: 'txt' as const,
      label: 'Text File',
      description: 'Plain text with company information',
      icon: FileText,
      recommended: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Export Proposal</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {exportSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Export Successful!</h4>
            <p className="text-gray-600">Your proposal has been downloaded with company branding.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Format
              </label>
              <div className="space-y-3">
                {formatOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFormat === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={option.value}
                        checked={selectedFormat === option.value}
                        onChange={(e) => setSelectedFormat(e.target.value as any)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          selectedFormat === option.value ? 'bg-primary-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            selectedFormat === option.value ? 'text-primary-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{option.label}</span>
                            {option.recommended && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Include company branding</span>
                  <div className="text-xs text-gray-500">Add logo, address, and contact information</div>
                </div>
              </label>
            </div>

            {user?.companyProfile && includeMetadata && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900 mb-2">Company Information Preview:</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>{user.companyProfile.name}</div>
                  {user.companyProfile.address?.street && (
                    <div>{user.companyProfile.address.street}</div>
                  )}
                  {user.companyProfile.contact?.phone && (
                    <div>Phone: {user.companyProfile.contact.phone}</div>
                  )}
                  {user.companyProfile.contact?.email && (
                    <div>Email: {user.companyProfile.contact.email}</div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExportModal;