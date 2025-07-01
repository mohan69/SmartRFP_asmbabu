import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ExportModal from '../components/ExportModal';
import ShareModal from '../components/ShareModal';
import { 
  Save, 
  Download, 
  Share2, 
  Eye, 
  Edit3, 
  FileText, 
  Clock,
  DollarSign,
  Target,
  ArrowLeft,
  Zap,
  Brain,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProposalEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProposal, updateProposal } = useApp();
  const navigate = useNavigate();
  
  const [proposal, setProposal] = useState(getProposal(id || ''));
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(proposal?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!proposal) {
      navigate('/dashboard');
    }
  }, [proposal, navigate]);

  if (!proposal) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Proposal Not Found</h2>
          <p className="text-gray-600 mb-4">The proposal you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateProposal(proposal.id, { content });
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const handleStatusChange = (newStatus: typeof proposal.status) => {
    updateProposal(proposal.id, { status: newStatus });
    setProposal(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { color: 'bg-gray-100 text-gray-700', label: 'Draft' },
      'in-review': { color: 'bg-blue-100 text-blue-700', label: 'In Review' },
      'submitted': { color: 'bg-yellow-100 text-yellow-700', label: 'Submitted' },
      'won': { color: 'bg-green-100 text-green-700', label: 'Won' },
      'lost': { color: 'bg-red-100 text-red-700', label: 'Lost' }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  };

  const statusBadge = getStatusBadge(proposal.status);

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>
              <p className="text-gray-600">Client: {proposal.client}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
              <select
                value={proposal.status}
                onChange={(e) => handleStatusChange(e.target.value as typeof proposal.status)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="in-review">In Review</option>
                <option value="submitted">Submitted</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Deadline</span>
              </div>
              <div className="font-semibold text-gray-900 mt-1">
                {proposal.deadline || 'Not set'}
              </div>
            </div>
            
            {proposal.value && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Value</span>
                </div>
                <div className="font-semibold text-gray-900 mt-1">
                  ₹{(proposal.value / 100000).toFixed(1)}L
                </div>
              </div>
            )}
            
            {proposal.probability && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Win Probability</span>
                </div>
                <div className="font-semibold text-gray-900 mt-1">
                  {proposal.probability}%
                </div>
              </div>
            )}
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Last Updated</span>
              </div>
              <div className="font-semibold text-gray-900 mt-1">
                {proposal.updatedAt}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {isEditing ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                <span>{isEditing ? 'Preview' : 'Edit'}</span>
              </button>
              
              {lastSaved && (
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Saved at {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
              
              <button 
                onClick={() => setShowExportModal(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-8">
              {isEditing ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Proposal Content</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Brain className="h-4 w-4" />
                      <span>AI-Enhanced Editor</span>
                    </div>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[600px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                    placeholder="Write your proposal content here..."
                  />
                </div>
              ) : (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Proposal Preview</h3>
                    <div className="text-sm text-gray-500">
                      {content.length} characters
                    </div>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="whitespace-pre-wrap text-gray-900 leading-relaxed"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {content || 'No content available. Click Edit to add content.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200/50">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Zap className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white/70 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">Strengthen Technical Approach</div>
                  <div className="text-xs text-gray-600">Add more specific technology details to increase credibility</div>
                </div>
                <div className="p-3 bg-white/70 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">Include Success Metrics</div>
                  <div className="text-xs text-gray-600">Add measurable outcomes and KPIs to demonstrate value</div>
                </div>
                <div className="p-3 bg-white/70 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">Case Study Reference</div>
                  <div className="text-xs text-gray-600">Include a relevant past project example</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <div className="font-medium text-gray-900">Regenerate Section</div>
                  <div className="text-xs text-gray-500">AI regenerate specific sections</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <div className="font-medium text-gray-900">Check Grammar</div>
                  <div className="text-xs text-gray-500">AI-powered grammar check</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <div className="font-medium text-gray-900">Optimize for Keywords</div>
                  <div className="text-xs text-gray-500">Enhance SEO and relevance</div>
                </button>
              </div>
            </div>

            {/* Version History */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
              <h3 className="font-semibold text-gray-900 mb-4">Version History</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Current Version</div>
                    <div className="text-xs text-gray-500">Today, 2:30 PM</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Latest</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Initial Draft</div>
                    <div className="text-xs text-gray-500">Yesterday, 4:15 PM</div>
                  </div>
                  <button className="text-xs text-primary-600 hover:text-primary-700">Restore</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Modal */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title={proposal.title}
          content={content}
          client={proposal.client}
        />

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={proposal.title}
          content={content}
          client={proposal.client}
        />
      </div>
    </div>
  );
};

export default ProposalEditor;