import React, { useState } from 'react';
import { useApp, KnowledgeBase as KB, KnowledgeBaseItem } from '../contexts/AppContext';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Eye, 
  Edit3, 
  Trash2,
  Star,
  Tag,
  Calendar,
  TrendingUp,
  Database,
  FileText,
  Users,
  Settings,
  ChevronRight,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  Upload
} from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const { 
    knowledgeBases, 
    addKnowledgeBase, 
    updateKnowledgeBase, 
    deleteKnowledgeBase,
    addKnowledgeBaseItem,
    updateKnowledgeBaseItem,
    deleteKnowledgeBaseItem,
    searchKnowledgeBase
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedKB, setSelectedKB] = useState<KB | null>(knowledgeBases[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeBaseItem | null>(null);

  const [newKBForm, setNewKBForm] = useState({
    name: '',
    description: ''
  });

  const [newItemForm, setNewItemForm] = useState({
    title: '',
    category: '',
    type: 'company-info' as KnowledgeBaseItem['type'],
    content: '',
    tags: ''
  });

  const categories = [
    'all',
    'Company Information',
    'Case Studies',
    'Technical Specifications',
    'Pricing',
    'Process',
    'Team Profiles',
    'FAQs'
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'company-info', label: 'Company Info' },
    { value: 'case-study', label: 'Case Study' },
    { value: 'technical-spec', label: 'Technical Spec' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'team-profile', label: 'Team Profile' },
    { value: 'process', label: 'Process' },
    { value: 'faq', label: 'FAQ' }
  ];

  const filteredItems = selectedKB ? selectedKB.items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  }) : [];

  const handleCreateKB = () => {
    if (newKBForm.name && newKBForm.description) {
      addKnowledgeBase({
        name: newKBForm.name,
        description: newKBForm.description,
        items: [],
        isDefault: false
      });
      setNewKBForm({ name: '', description: '' });
      setShowCreateModal(false);
    }
  };

  const handleCreateItem = () => {
    if (selectedKB && newItemForm.title && newItemForm.content) {
      addKnowledgeBaseItem(selectedKB.id, {
        title: newItemForm.title,
        category: newItemForm.category,
        type: newItemForm.type,
        content: newItemForm.content,
        tags: newItemForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isActive: true
      });
      setNewItemForm({
        title: '',
        category: '',
        type: 'company-info',
        content: '',
        tags: ''
      });
      setShowCreateItemModal(false);
    }
  };

  const handleUpdateItem = () => {
    if (selectedKB && editingItem) {
      updateKnowledgeBaseItem(selectedKB.id, editingItem.id, {
        title: newItemForm.title,
        category: newItemForm.category,
        type: newItemForm.type,
        content: newItemForm.content,
        tags: newItemForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      setEditingItem(null);
      setNewItemForm({
        title: '',
        category: '',
        type: 'company-info',
        content: '',
        tags: ''
      });
    }
  };

  const startEditItem = (item: KnowledgeBaseItem) => {
    setEditingItem(item);
    setNewItemForm({
      title: item.title,
      category: item.category,
      type: item.type,
      content: item.content,
      tags: item.tags.join(', ')
    });
    setShowCreateItemModal(true);
  };

  const getTypeIcon = (type: KnowledgeBaseItem['type']) => {
    const icons = {
      'company-info': Users,
      'case-study': Star,
      'technical-spec': Settings,
      'pricing': Database,
      'team-profile': Users,
      'process': TrendingUp,
      'faq': FileText
    };
    return icons[type] || FileText;
  };

  const getTypeColor = (type: KnowledgeBaseItem['type']) => {
    const colors = {
      'company-info': 'bg-blue-100 text-blue-700',
      'case-study': 'bg-green-100 text-green-700',
      'technical-spec': 'bg-purple-100 text-purple-700',
      'pricing': 'bg-orange-100 text-orange-700',
      'team-profile': 'bg-indigo-100 text-indigo-700',
      'process': 'bg-pink-100 text-pink-700',
      'faq': 'bg-gray-100 text-gray-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const totalItems = selectedKB?.items.length || 0;
  const activeItems = selectedKB?.items.filter(item => item.isActive).length || 0;
  const totalUsage = selectedKB?.items.reduce((sum, item) => sum + item.usageCount, 0) || 0;
  const avgUsage = totalItems > 0 ? Math.round(totalUsage / totalItems) : 0;

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
              <p className="text-gray-600">Manage your company knowledge for AI-powered proposal generation</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Knowledge Base</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Knowledge Base Selector */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Knowledge Bases</h3>
              <div className="space-y-2">
                {knowledgeBases.map((kb) => (
                  <button
                    key={kb.id}
                    onClick={() => setSelectedKB(kb)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedKB?.id === kb.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{kb.name}</div>
                        <div className="text-xs text-gray-500">{kb.items.length} items</div>
                      </div>
                      {kb.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            {selectedKB && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Items</span>
                    <span className="font-semibold text-gray-900">{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Items</span>
                    <span className="font-semibold text-green-600">{activeItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Usage</span>
                    <span className="font-semibold text-blue-600">{totalUsage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Usage</span>
                    <span className="font-semibold text-purple-600">{avgUsage}</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Integration Status */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-200/50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Brain className="h-4 w-4 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI Integration</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Knowledge base connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Auto-reference enabled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-700">AI fallback active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedKB ? (
              <div className="space-y-6">
                {/* Knowledge Base Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">{selectedKB.name}</h2>
                      <p className="text-gray-600">{selectedKB.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowCreateItemModal(true)}
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Item</span>
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Upload className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1 flex items-center space-x-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search knowledge base..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {types.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Knowledge Base Items */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Knowledge Items ({filteredItems.length})
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {filteredItems.map((item) => {
                      const TypeIcon = getTypeIcon(item.type);
                      return (
                        <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                                  <TypeIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{item.category}</span>
                                    <span>•</span>
                                    <span>Used {item.usageCount} times</span>
                                    {item.lastUsed && (
                                      <>
                                        <span>•</span>
                                        <span>Last used {item.lastUsed}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {item.content.substring(0, 200)}...
                              </p>
                              
                              <div className="flex items-center space-x-2">
                                {item.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-6">
                              <button
                                onClick={() => startEditItem(item)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => selectedKB && deleteKnowledgeBaseItem(selectedKB.id, item.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your search or filters, or add a new item.</p>
                      <button
                        onClick={() => setShowCreateItemModal(true)}
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Add First Item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-12 text-center">
                <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Knowledge Base Selected</h3>
                <p className="text-gray-600 mb-6">Select a knowledge base from the sidebar or create a new one to get started.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Create Knowledge Base
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create Knowledge Base Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Knowledge Base</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newKBForm.name}
                    onChange={(e) => setNewKBForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Technical Knowledge Base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newKBForm.description}
                    onChange={(e) => setNewKBForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe what this knowledge base contains..."
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
                  onClick={handleCreateKB}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Item Modal */}
        {showCreateItemModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Edit Knowledge Item' : 'Add New Knowledge Item'}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={newItemForm.title}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Company Overview"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={newItemForm.category}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Company Information"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newItemForm.type}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, type: e.target.value as KnowledgeBaseItem['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {types.slice(1).map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newItemForm.content}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter the detailed content for this knowledge item..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newItemForm.tags}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., company, overview, capabilities, team"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateItemModal(false);
                    setEditingItem(null);
                    setNewItemForm({
                      title: '',
                      category: '',
                      type: 'company-info',
                      content: '',
                      tags: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleUpdateItem : handleCreateItem}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;