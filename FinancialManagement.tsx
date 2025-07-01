import React, { useState } from 'react';
import { useApp, FinancialBreakdown } from '../contexts/AppContext';
import { 
  Calculator, 
  DollarSign, 
  Users, 
  Server, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  BarChart3,
  FileText,
  Eye,
  EyeOff,
  Plus,
  Edit3,
  Trash2,
  Save,
  Download,
  Shield,
  Target,
  Calendar,
  Percent
} from 'lucide-react';

const FinancialManagement: React.FC = () => {
  const { proposals, updateFinancialBreakdown, approveFinancialBreakdown } = useApp();
  const [selectedProposal, setSelectedProposal] = useState(proposals.find(p => p.financialBreakdown) || null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInternalCosts, setShowInternalCosts] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const proposalsWithFinancials = proposals.filter(p => p.financialBreakdown);
  const breakdown = selectedProposal?.financialBreakdown;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'labor', label: 'Labor Costs', icon: Users },
    { id: 'capital', label: 'Capital Costs', icon: Server },
    { id: 'expenses', label: 'Expenses', icon: Calculator },
    { id: 'timeline', label: 'Timeline & Payments', icon: Calendar },
    { id: 'client-view', label: 'Client View', icon: Eye }
  ];

  const getRiskColor = (level: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'high': 'text-red-600 bg-red-100'
    };
    return colors[level as keyof typeof colors] || colors.medium;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    return `${hours}h`;
  };

  if (!breakdown) {
    return (
      <div className="min-h-screen pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Financial Data Available</h3>
            <p className="text-gray-600 mb-6">Select a proposal with financial breakdown to view details.</p>
            <div className="max-w-md mx-auto">
              <select
                value={selectedProposal?.id || ''}
                onChange={(e) => {
                  const proposal = proposals.find(p => p.id === e.target.value);
                  setSelectedProposal(proposal || null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a proposal</option>
                {proposalsWithFinancials.map(proposal => (
                  <option key={proposal.id} value={proposal.id}>
                    {proposal.title} - {proposal.client}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Management</h1>
              <p className="text-gray-600">Manage proposal costs, margins, and financial breakdowns</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedProposal?.id || ''}
                onChange={(e) => {
                  const proposal = proposals.find(p => p.id === e.target.value);
                  setSelectedProposal(proposal || null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {proposalsWithFinancials.map(proposal => (
                  <option key={proposal.id} value={proposal.id}>
                    {proposal.title} - {proposal.client}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowInternalCosts(!showInternalCosts)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showInternalCosts 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showInternalCosts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showInternalCosts ? 'Hide' : 'Show'} Internal Costs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Proposal Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{selectedProposal.title}</h2>
              <p className="text-gray-600">Client: {selectedProposal.client}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Proposed Value</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(breakdown.projectFinancials.proposedValue)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Gross Margin</div>
                <div className="text-xl font-semibold text-blue-600">
                  {breakdown.projectFinancials.grossMarginPercentage.toFixed(1)}%
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {breakdown.isApproved ? (
                  <span className="flex items-center space-x-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Approved</span>
                  </span>
                ) : (
                  <button
                    onClick={() => approveFinancialBreakdown(selectedProposal.id, 'Current User')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Financial Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Total Project Cost</div>
                      <div className="text-xl font-semibold text-gray-900">
                        {showInternalCosts ? formatCurrency(breakdown.projectFinancials.totalProjectCost) : '••••••'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Proposed Value</div>
                      <div className="text-xl font-semibold text-green-600">
                        {formatCurrency(breakdown.projectFinancials.proposedValue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Gross Margin</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {showInternalCosts ? formatCurrency(breakdown.projectFinancials.grossMargin) : '••••••'}
                        <span className="text-sm ml-2">({breakdown.projectFinancials.grossMarginPercentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Net Margin</div>
                      <div className="text-xl font-semibold text-purple-600">
                        {showInternalCosts ? formatCurrency(breakdown.projectFinancials.netMargin) : '••••••'}
                        <span className="text-sm ml-2">({breakdown.projectFinancials.netMarginPercentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown Chart */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-gray-700">Labor Costs</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {showInternalCosts ? formatCurrency(breakdown.laborCosts.totalLaborCost) : '••••••'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {((breakdown.laborCosts.totalLaborCost / breakdown.projectFinancials.totalProjectCost) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-700">Capital Costs</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {showInternalCosts ? formatCurrency(breakdown.capitalCosts.totalCapitalCost) : '••••••'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {((breakdown.capitalCosts.totalCapitalCost / breakdown.projectFinancials.totalProjectCost) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-gray-700">Operational Expenses</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {showInternalCosts ? formatCurrency(breakdown.operationalExpenses.totalExpenses) : '••••••'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {((breakdown.operationalExpenses.totalExpenses / breakdown.projectFinancials.totalProjectCost) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment & Key Metrics */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Risk Level</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(breakdown.riskAssessment.riskLevel)}`}>
                        {breakdown.riskAssessment.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Risk Factors</div>
                      <ul className="space-y-1">
                        {breakdown.riskAssessment.riskFactors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center space-x-2">
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Buffer Amount</div>
                      <div className="font-semibold text-gray-900">
                        {showInternalCosts ? formatCurrency(breakdown.riskAssessment.bufferAmount) : '••••••'}
                        <span className="text-sm text-gray-500 ml-2">({breakdown.riskAssessment.bufferPercentage}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Total Hours</span>
                      <span className="font-semibold text-gray-900">
                        {formatHours(breakdown.laborCosts.totalEstimatedHours)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Project Duration</span>
                      <span className="font-semibold text-gray-900">
                        {breakdown.timeline.totalDuration} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Team Size</span>
                      <span className="font-semibold text-gray-900">
                        {breakdown.laborCosts.roles.length} members
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Avg Hourly Rate</span>
                      <span className="font-semibold text-gray-900">
                        {showInternalCosts ? formatCurrency(breakdown.laborCosts.totalLaborCost / breakdown.laborCosts.totalEstimatedHours) : '••••••'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'labor' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Labor Costs</h3>
                <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Role</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Level</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Hourly Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Est. Hours</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Total Cost</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.laborCosts.roles.map((role) => (
                      <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{role.role}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                            {role.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {showInternalCosts ? formatCurrency(role.hourlyRate) : '••••••'}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{formatHours(role.estimatedHours)}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {showInternalCosts ? formatCurrency(role.cost) : '••••••'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-500 hover:text-gray-700">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 bg-gray-50">
                      <td colSpan={3} className="py-3 px-4 font-semibold text-gray-900">Total</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {formatHours(breakdown.laborCosts.totalEstimatedHours)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {showInternalCosts ? formatCurrency(breakdown.laborCosts.totalLaborCost) : '••••••'}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'capital' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Capital Costs</h3>
                <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {breakdown.capitalCosts.infrastructure.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{item.item}</h4>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                            {item.category}
                          </span>
                          {item.isRecurring && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                              Recurring ({item.recurringPeriod})
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                      <div className="text-right ml-6">
                        <div className="font-semibold text-gray-900">
                          {showInternalCosts ? formatCurrency(item.cost) : '••••••'}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <button className="p-1 text-gray-500 hover:text-gray-700">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total Capital Costs</span>
                    <span className="font-semibold text-gray-900 text-lg">
                      {showInternalCosts ? formatCurrency(breakdown.capitalCosts.totalCapitalCost) : '••••••'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Operational Expenses</h3>
                <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Expense</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {breakdown.operationalExpenses.expenses.map((expense) => (
                  <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{expense.description}</h4>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                            {expense.category}
                          </span>
                          {expense.isEstimated && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                              Estimated
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="font-semibold text-gray-900">
                          {showInternalCosts ? formatCurrency(expense.cost) : '••••••'}
                        </div>
                        {expense.actualCost && (
                          <div className="text-sm text-gray-500">
                            Actual: {showInternalCosts ? formatCurrency(expense.actualCost) : '••••••'}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <button className="p-1 text-gray-500 hover:text-gray-700">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total Expenses</span>
                    <span className="font-semibold text-gray-900 text-lg">
                      {showInternalCosts ? formatCurrency(breakdown.operationalExpenses.totalExpenses) : '••••••'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Timeline & Phases</h3>
                <div className="space-y-4">
                  {breakdown.timeline.phases.map((phase, index) => (
                    <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{phase.name}</h4>
                          <p className="text-sm text-gray-600">
                            {phase.startDate} - {phase.endDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {showInternalCosts ? formatCurrency(phase.cost) : '••••••'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatHours(phase.effortHours)} • {phase.paymentPercentage}% payment
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Deliverables:</div>
                        <div className="flex flex-wrap gap-2">
                          {phase.deliverables.map((deliverable, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {deliverable}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Schedule</h3>
                <div className="space-y-3">
                  {breakdown.timeline.paymentSchedule.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{payment.milestone}</div>
                        <div className="text-sm text-gray-600">Due: {payment.dueDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                        <div className="text-sm text-gray-500">{payment.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'client-view' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Client-Facing Summary</h3>
                <div className="flex items-center space-x-2">
                  <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export PDF</span>
                  </button>
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Generate Proposal</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200/50">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Total Investment</h4>
                    <div className="text-4xl font-bold text-primary-600 mb-4">
                      {formatCurrency(breakdown.clientSummary.totalInvestment)}
                    </div>
                    <p className="text-gray-600">{breakdown.clientSummary.timeline}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                    <ul className="space-y-2">
                      {breakdown.clientSummary.inclusions.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Deliverables</h4>
                    <ul className="space-y-2">
                      {breakdown.clientSummary.deliverables.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-700">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Terms</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {breakdown.clientSummary.paymentTerms}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Exclusions</h4>
                    <ul className="space-y-2">
                      {breakdown.clientSummary.exclusions.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-700">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Assumptions</h4>
                    <ul className="space-y-2">
                      {breakdown.clientSummary.assumptions.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-700">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;