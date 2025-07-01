import React from 'react';
import { Brain } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center">
        <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full inline-block animate-bounce-subtle mb-4">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <div className="text-lg font-medium text-gray-900 mb-2">Loading SmartRFP AI</div>
        <div className="text-sm text-gray-500">Preparing your workspace...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;