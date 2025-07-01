import React, { useState } from 'react';
import { RFPAnalysis, RFPQuestion } from '../utils/rfpAnalyzer';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Target,
  Shield,
  DollarSign,
  Users,
  Lightbulb
} from 'lucide-react';

interface RFPAnalysisViewProps {
  analysis: RFPAnalysis;
}

const RFPAnalysisView: React.FC<RFPAnalysisViewProps> = ({ analysis }) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getQuestionIcon = (type: RFPQuestion['type']) => {
    switch (type) {
      case 'technical': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'commercial': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'compliance': return <Shield className="h-4 w-4 text-red-500" />;
      case 'experience': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: RFPQuestion['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const filteredQuestions = analysis.sections.flatMap(section => 
    section.questions.filter(question => {
      const matchesType = filterType === 'all' || question.type === filterType;
      const matchesPriority = filterPriority === 'all' || question.priority === filterPriority;
      const matchesSearch = !searchTerm || 
        question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesType && matchesPriority && matchesSearch;
    })
  );

  const questionsByType = {
    technical: analysis.sections.flatMap(s => s.questions.filter(q => q.type === 'technical')).length,
    commercial: analysis.sections.flatMap(s => s.questions.filter(q => q.type === 'commercial')).length,
    compliance: analysis.sections.flatMap(s => s.questions.filter(q => q.type === 'compliance')).length,
    experience: analysis.sections.flatMap(s => s.questions.filter(q => q.type === 'experience')).length,
    general: analysis.sections.flatMap(s => s.questions.filter(q => q.type === 'general')).length,
  };

  const questionsByPriority = {
    high: analysis.sections.flatMap(s => s.questions.filter(q => q.priority === 'high')).length,
    medium: analysis.sections.flatMap(s => s.questions.filter(q => q.priority === 'medium')).length,
    low: analysis.sections.flatMap(s => s.questions.filter(q => q.priority === 'low')).length,
  };

  return (
    <div className="space-y-6">
      {/* Analysis Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200/50">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">RFP Analysis Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white/70 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{analysis.totalPages}</div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </div>
          <div className="bg-white/70 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{analysis.sections.length}</div>
            <div className="text-sm text-gray-600">Sections</div>
          </div>
          <div className="bg-white/70 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{analysis.totalQuestions}</div>
            <div className="text-sm text-gray-600">Questions Found</div>
          </div>
          <div className="bg-white/70 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{questionsByPriority.high}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </div>
        
        <div className="bg-white/70 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">AI Analysis Summary:</h4>
          <p className="text-sm text-gray-700">{analysis.summary}</p>
        </div>
      </div>

      {/* Question Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions by Type</h3>
          <div className="space-y-3">
            {Object.entries(questionsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getQuestionIcon(type as RFPQuestion['type'])}
                  <span className="capitalize text-gray-700">{type}</span>
                </div>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions by Priority</h3>
          <div className="space-y-3">
            {Object.entries(questionsByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    priority === 'high' ? 'bg-red-500' : 
                    priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="capitalize text-gray-700">{priority} Priority</span>
                </div>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Explorer</h3>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="technical">Technical</option>
              <option value="commercial">Commercial</option>
              <option value="compliance">Compliance</option>
              <option value="experience">Experience</option>
              <option value="general">General</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredQuestions.length} of {analysis.totalQuestions} questions
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredQuestions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getQuestionIcon(question.type)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(question.priority)}`}>
                      {question.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">Section: {question.section}</span>
                    {question.requiresAttention && (
                      <div className="flex items-center space-x-1 text-xs text-orange-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Requires Attention</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-900 mb-2">{question.question}</p>
                  {question.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {question.keywords.slice(0, 5).map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {keyword}
                        </span>
                      ))}
                      {question.keywords.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{question.keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Requirements */}
      {analysis.keyRequirements.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Requirements Identified</h3>
          <div className="space-y-3">
            {analysis.keyRequirements.slice(0, 5).map((requirement, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-gray-700 text-sm">{requirement}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200/50">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Lightbulb className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span>All {analysis.totalQuestions} questions have been identified and categorized</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span>{questionsByPriority.high} high-priority questions require immediate attention</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span>Knowledge base content will be automatically matched to relevant questions</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <Lightbulb className="h-4 w-4" />
            <span>AI will generate comprehensive responses addressing all requirements</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFPAnalysisView;