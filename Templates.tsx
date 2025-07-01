import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Edit3, 
  Copy, 
  Star,
  Bookmark,
  ChevronRight,
  Grid,
  List,
  Zap,
  X,
  Save,
  CheckCircle
} from 'lucide-react';

const Templates: React.FC = () => {
  const { templates, addTemplate, addProposal } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const [newTemplateForm, setNewTemplateForm] = useState({
    name: '',
    category: '',
    description: '',
    content: ''
  });

  const categories = [
    'all',
    'Web Development',
    'Mobile Development',
    'Cloud Services',
    'E-commerce',
    'Enterprise Software',
    'UI/UX Design',
    'System Integration'
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTemplates = [
    {
      id: 'featured-1',
      name: 'AI-Powered E-commerce Solution',
      category: 'E-commerce',
      description: 'Complete e-commerce platform with AI recommendations, payment integration, and analytics dashboard',
      content: `# AI-Powered E-commerce Solution

## Executive Summary
We propose to develop a cutting-edge e-commerce platform that leverages artificial intelligence to enhance user experience and drive sales growth.

## Key Features
- AI-powered product recommendations
- Advanced search and filtering
- Secure payment gateway integration
- Real-time inventory management
- Comprehensive analytics dashboard
- Mobile-responsive design

## Technical Approach
- Frontend: React.js with Next.js
- Backend: Node.js with Express
- Database: PostgreSQL with Redis caching
- AI/ML: TensorFlow for recommendation engine
- Payment: Stripe and Razorpay integration
- Cloud: AWS deployment with auto-scaling

## Timeline
- Phase 1: Planning & Design (2 weeks)
- Phase 2: Core Development (8 weeks)
- Phase 3: AI Integration (4 weeks)
- Phase 4: Testing & Deployment (2 weeks)

## Investment
Total Project Cost: ₹25-45 Lakhs
Payment Terms: 30% advance, 40% on milestones, 30% on delivery`,
      isDefault: false,
      features: ['AI Recommendations', 'Payment Gateway', 'Analytics', 'Mobile Responsive'],
      estimatedValue: '₹25-45L',
      winRate: '75%'
    },
    {
      id: 'featured-2',
      name: 'Enterprise Digital Transformation',
      category: 'System Integration',
      description: 'Comprehensive digital transformation solution with cloud migration, process automation, and data analytics',
      content: `# Enterprise Digital Transformation

## Executive Summary
Transform your enterprise operations with our comprehensive digital transformation solution.

## Solution Components
- Legacy system modernization
- Cloud migration strategy
- Process automation
- Data analytics platform
- Employee training programs

## Technical Architecture
- Microservices architecture
- API-first design
- Cloud-native deployment
- DevOps implementation
- Security compliance

## Implementation Phases
- Phase 1: Assessment & Strategy (3 weeks)
- Phase 2: Infrastructure Setup (6 weeks)
- Phase 3: Application Migration (12 weeks)
- Phase 4: Training & Go-live (4 weeks)

## Investment
Total Project Cost: ₹50-100 Lakhs
ROI Expected: 200% within 18 months`,
      isDefault: false,
      features: ['Cloud Migration', 'Process Automation', 'Data Analytics', 'Security Compliance'],
      estimatedValue: '₹50-100L',
      winRate: '68%'
    },
    {
      id: 'featured-3',
      name: 'ERP Implementation & Integration',
      category: 'System Integration',
      description: 'End-to-end ERP implementation with system integration, data migration, and process optimization',
      content: `# ERP Implementation & Integration

## Executive Summary
Streamline your business operations with our comprehensive ERP implementation and integration services.

## ERP Solutions
- SAP S/4HANA implementation
- Oracle ERP Cloud
- Microsoft Dynamics 365
- Custom ERP development

## Integration Services
- Third-party system integration
- Data migration and cleansing
- Business process optimization
- Custom workflow development

## Implementation Methodology
- Phase 1: Business Analysis (4 weeks)
- Phase 2: System Configuration (8 weeks)
- Phase 3: Data Migration (6 weeks)
- Phase 4: Testing & Training (4 weeks)
- Phase 5: Go-live Support (2 weeks)

## Investment
Total Project Cost: ₹75-150 Lakhs
Implementation Timeline: 6-8 months`,
      isDefault: false,
      features: ['ERP Implementation', 'System Integration', 'Data Migration', 'Process Optimization'],
      estimatedValue: '₹75-150L',
      winRate: '72%'
    }
  ];

  const handleUseTemplate = (template: any) => {
    // Create a new proposal using the template
    const proposalId = addProposal({
      title: `${template.name} - New Proposal`,
      client: '',
      status: 'draft',
      content: template.content
    });
    
    // Navigate to the proposal editor
    navigate(`/proposal/${proposalId}`);
  };

  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowViewModal(true);
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setNewTemplateForm({
      name: template.name,
      category: template.category,
      description: template.description,
      content: template.content
    });
    setShowEditModal(true);
  };

  const handleCopyTemplate = async (template: any) => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopySuccess(template.id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy template:', error);
      alert('Failed to copy template content');
    }
  };

  const handleCreateTemplate = () => {
    if (newTemplateForm.name && newTemplateForm.category && newTemplateForm.content) {
      addTemplate({
        name: newTemplateForm.name,
        category: newTemplateForm.category,
        description: newTemplateForm.description,
        content: newTemplateForm.content,
        isDefault: false
      });
      
      setNewTemplateForm({
        name: '',
        category: '',
        description: '',
        content: ''
      });
      setShowCreateModal(false);
    }
  };

  const handleUpdateTemplate = () => {
    // In a real app, you'd have an updateTemplate function
    // For now, we'll create a new template with updated content
    if (newTemplateForm.name && newTemplateForm.category && newTemplateForm.content) {
      addTemplate({
        name: `${newTemplateForm.name} (Updated)`,
        category: newTemplateForm.category,
        description: newTemplateForm.description,
        content: newTemplateForm.content,
        isDefault: false
      });
      
      setShowEditModal(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Proposal Templates</h1>
          <p className="text-gray-600">Browse and customize proven proposal templates to win more business</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Template</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Templates */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg">
              <Zap className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Featured Templates</h2>
            <span className="text-sm text-gray-500">High-performing templates</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {featuredTemplates.map((template) => (
              <div key={template.id} className="bg-gradient-to-br from-white to-primary-50/30 rounded-lg p-6 border border-primary-200/50 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Estimated Value</div>
                    <div className="font-semibold text-gray-900">{template.estimatedValue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Win Rate</div>
                    <div className="font-semibold text-green-600">{template.winRate}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">Key Features</div>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                  >
                    Use Template
                  </button>
                  <button 
                    onClick={() => handleViewTemplate(template)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleCopyTemplate(template)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                  >
                    {copySuccess === template.id ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regular Templates */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Templates</h2>
            <div className="text-sm text-gray-500">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {template.category}
                      </span>
                    </div>
                    {template.isDefault && (
                      <div className="ml-2">
                        <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                          Default
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 bg-primary-50 text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <span>Use Template</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleViewTemplate(template)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleCopyTemplate(template)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                    >
                      {copySuccess === template.id ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleEditTemplate(template)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <FileText className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{template.category}</span>
                              {template.isDefault && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 ml-11">{template.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-6">
                        <button 
                          onClick={() => handleUseTemplate(template)}
                          className="bg-primary-50 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                        >
                          Use Template
                        </button>
                        <button 
                          onClick={() => handleViewTemplate(template)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleCopyTemplate(template)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                        >
                          {copySuccess === template.id ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button 
                          onClick={() => handleEditTemplate(template)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filters, or create a new template.</p>
          </div>
        )}

        {/* Create Template Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Template</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                    <input
                      type="text"
                      value={newTemplateForm.name}
                      onChange={(e) => setNewTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Web Development Standard"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newTemplateForm.category}
                      onChange={(e) => setNewTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select category</option>
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTemplateForm.description}
                    onChange={(e) => setNewTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief description of the template..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Content</label>
                  <textarea
                    value={newTemplateForm.content}
                    onChange={(e) => setNewTemplateForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                    placeholder="Enter the template content here..."
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Create Template</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Template Modal */}
        {showViewModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {selectedTemplate.content}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Template Modal */}
        {showEditModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Template</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                    <input
                      type="text"
                      value={newTemplateForm.name}
                      onChange={(e) => setNewTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newTemplateForm.category}
                      onChange={(e) => setNewTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTemplateForm.description}
                    onChange={(e) => setNewTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Content</label>
                  <textarea
                    value={newTemplateForm.content}
                    onChange={(e) => setNewTemplateForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTemplate}
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;