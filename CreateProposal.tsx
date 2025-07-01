import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import PDFUploader from '../components/PDFUploader';
import RFPAnalysisView from '../components/RFPAnalysisView';
import { 
  FileText, 
  Brain, 
  Zap, 
  Target, 
  Calendar,
  DollarSign,
  Users,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle,
  BookOpen,
  Search,
  AlertCircle,
  BarChart3,
  FileSearch,
  Lightbulb
} from 'lucide-react';
import { analyzeRFP, RFPAnalysis } from '../utils/rfpAnalyzer';
import { generateProposalFromRFP, GeneratedProposal } from '../utils/proposalGenerator';

const CreateProposal: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [knowledgeResults, setKnowledgeResults] = useState<any[]>([]);
  const [showKnowledgeSearch, setShowKnowledgeSearch] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [rfpAnalysis, setRfpAnalysis] = useState<RFPAnalysis | null>(null);
  const [generatedProposal, setGeneratedProposal] = useState<GeneratedProposal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    rfpContent: '',
    deadline: '',
    value: '',
    probability: 70,
    category: '',
    requirements: '',
    teamSize: '',
    timeline: ''
  });

  const { addProposal, templates, searchKnowledgeBase, knowledgeBases } = useApp();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-search knowledge base when RFP content changes
    if (name === 'rfpContent' && value.length > 50) {
      const results = searchKnowledgeBase(value);
      setKnowledgeResults(results.slice(0, 5));
      setShowKnowledgeSearch(results.length > 0);
    }
  };

  const handlePDFTextExtracted = (text: string, metadata?: any) => {
    setPdfError(null);
    
    setFormData(prev => ({
      ...prev,
      rfpContent: text
    }));
    
    if (metadata?.title && !formData.title) {
      setFormData(prev => ({
        ...prev,
        title: metadata.title
      }));
    } else if (!formData.title) {
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      const potentialTitle = lines[0]?.trim();
      if (potentialTitle && potentialTitle.length < 100) {
        setFormData(prev => ({
          ...prev,
          title: potentialTitle
        }));
      }
    }
    
    const results = searchKnowledgeBase(text);
    setKnowledgeResults(results.slice(0, 5));
    setShowKnowledgeSearch(results.length > 0);
  };

  const handlePDFError = (error: string) => {
    setPdfError(error);
  };

  const analyzeRFPContent = async () => {
    if (!formData.rfpContent) {
      alert('Please provide RFP content to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate analysis delay for large documents
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = analyzeRFP(formData.rfpContent);
      setRfpAnalysis(analysis);
      setStep(3);
    } catch (error) {
      console.error('RFP analysis failed:', error);
      alert('Failed to analyze RFP. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateProposal = async () => {
    if (!rfpAnalysis) {
      alert('Please analyze the RFP first');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Get all knowledge base items
      const allKnowledgeItems = knowledgeBases.flatMap(kb => kb.items);
      
      // Generate comprehensive proposal
      const proposal = generateProposalFromRFP(
        rfpAnalysis,
        allKnowledgeItems,
        formData.title,
        formData.client,
        formData.requirements
      );
      
      setGeneratedProposal(proposal);
      
      // Create proposal with generated content
      const proposalId = addProposal({
        title: formData.title,
        client: formData.client,
        status: 'draft',
        deadline: formData.deadline,
        value: formData.value ? parseInt(formData.value) : undefined,
        probability: formData.probability,
        content: formatProposalContent(proposal),
        rfpContent: formData.rfpContent
      });

      setIsGenerating(false);
      navigate(`/proposal/${proposalId}`);
    } catch (error) {
      console.error('Proposal generation failed:', error);
      alert('Failed to generate proposal. Please try again.');
      setIsGenerating(false);
    }
  };

  const formatProposalContent = (proposal: GeneratedProposal): string => {
    let content = proposal.executiveSummary + '\n\n';
    
    proposal.sections.forEach(section => {
      content += section.content + '\n\n';
    });
    
    return content;
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Cloud Services',
    'E-commerce',
    'Enterprise Software',
    'UI/UX Design',
    'Digital Transformation',
    'API Development',
    'System Integration'
  ];

  if (isGenerating) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-400 rounded-full animate-bounce">
              <Sparkles className="h-4 w-4 text-white m-1" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI is Crafting Your Proposal</h2>
          <p className="text-gray-600 mb-6">
            Generating comprehensive responses to {rfpAnalysis?.totalQuestions || 0} RFP questions...
          </p>
          <div className="space-y-2 text-left">
            {[
              'Analyzing RFP requirements and questions',
              'Matching with knowledge base content',
              'Generating technical responses',
              'Creating commercial proposals',
              'Addressing compliance requirements',
              'Finalizing proposal structure'
            ].map((task, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-700">{task}</span>
              </div>
            ))}
          </div>
          {generatedProposal && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-700">
                ✅ Generated proposal addressing {generatedProposal.questionsAddressed}/{generatedProposal.totalQuestions} questions 
                ({generatedProposal.coveragePecentage.toFixed(1)}% coverage)
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <FileSearch className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing RFP Document</h2>
          <p className="text-gray-600 mb-6">AI is reading and extracting all questions and requirements...</p>
          <div className="space-y-2 text-left">
            {[
              'Parsing document structure and sections',
              'Identifying questions and requirements',
              'Categorizing by type and priority',
              'Extracting technical specifications',
              'Finding compliance requirements',
              'Generating comprehensive analysis'
            ].map((task, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Proposal</h1>
          <p className="text-gray-600">AI-powered proposal generation with comprehensive RFP analysis</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>RFP Upload</span>
            <span>Requirements</span>
            <span>AI Analysis</span>
            <span>Generate</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">RFP Document & Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., E-commerce Platform Development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="client"
                    required
                    value={formData.client}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Client company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload RFP Document (PDF)
                </label>
                <PDFUploader
                  onTextExtracted={handlePDFTextExtracted}
                  onError={handlePDFError}
                  className="mb-4"
                />
                {pdfError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700">{pdfError}</span>
                  </div>
                )}
              </div>

              {/* Manual RFP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or paste RFP content directly
                </label>
                <textarea
                  name="rfpContent"
                  value={formData.rfpContent}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Paste the complete RFP content here for comprehensive analysis..."
                />
                <div className="mt-2 text-sm text-gray-500">
                  {formData.rfpContent.length > 0 && (
                    <span>Content length: {formData.rfpContent.length.toLocaleString()} characters</span>
                  )}
                </div>
              </div>

              {/* Knowledge Base Search Results */}
              {showKnowledgeSearch && knowledgeResults.length > 0 && (
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200/50">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Relevant Knowledge Found</h3>
                    <span className="text-sm text-gray-500">({knowledgeResults.length} items)</span>
                  </div>
                  <div className="space-y-3">
                    {knowledgeResults.map((item, index) => (
                      <div key={index} className="bg-white/70 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                            {item.type.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.content.substring(0, 150)}...
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 inline mr-1 text-green-500" />
                    This content will be automatically referenced in your proposal
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.client || !formData.rfpContent}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next Step</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Requirements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Value (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., 2500000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Win Probability: {formData.probability}%
                  </label>
                  <input
                    type="range"
                    name="probability"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select team size</option>
                      <option value="1-3">1-3 members</option>
                      <option value="4-6">4-6 members</option>
                      <option value="7-10">7-10 members</option>
                      <option value="10+">10+ members</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="2-4 weeks">2-4 weeks</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6+ months">6+ months</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Context & Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any additional context, specific requirements, or constraints that should be considered..."
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={analyzeRFPContent}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <FileSearch className="h-5 w-5" />
                  <span>Analyze RFP</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && rfpAnalysis && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">RFP Analysis Results</h2>
              
              <RFPAnalysisView analysis={rfpAnalysis} />

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={generateProposal}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Brain className="h-5 w-5" />
                  <span>Generate Comprehensive Proposal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProposal;