import React, { useState } from 'react';
import { Share2, X, Mail, Link, Copy, CheckCircle } from 'lucide-react';
import { shareProposal, ShareOptions } from '../utils/exportUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  client: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  client
}) => {
  const [includeContent, setIncludeContent] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleShare = async (method: ShareOptions['method']) => {
    setIsSharing(true);
    setShareSuccess(null);
    
    try {
      const options: ShareOptions = {
        method,
        includeContent
      };
      
      await shareProposal(title, content, client, options);
      
      let successMessage = '';
      switch (method) {
        case 'email':
          successMessage = 'Email client opened successfully!';
          break;
        case 'link':
          successMessage = 'Link shared successfully!';
          break;
        case 'copy':
          successMessage = 'Content copied to clipboard!';
          break;
      }
      
      setShareSuccess(successMessage);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setShareSuccess(null);
      }, 2000);
    } catch (error) {
      console.error('Share failed:', error);
      alert('Share failed. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const shareOptions = [
    {
      method: 'email' as const,
      label: 'Email',
      description: 'Send via email client',
      icon: Mail,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      method: 'link' as const,
      label: 'Share Link',
      description: 'Share current page link',
      icon: Link,
      color: 'bg-green-100 text-green-600'
    },
    {
      method: 'copy' as const,
      label: 'Copy Text',
      description: 'Copy to clipboard',
      icon: Copy,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Share Proposal</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {shareSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Shared Successfully!</h4>
            <p className="text-gray-600">{shareSuccess}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-600">Client: {client}</p>
              </div>

              <label className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  checked={includeContent}
                  onChange={(e) => setIncludeContent(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Include full content</span>
                  <div className="text-xs text-gray-500">Share the complete proposal text</div>
                </div>
              </label>
            </div>

            <div className="space-y-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.method}
                    onClick={() => handleShare(option.method)}
                    disabled={isSharing}
                    className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`p-2 rounded-lg ${option.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                    {isSharing && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareModal;