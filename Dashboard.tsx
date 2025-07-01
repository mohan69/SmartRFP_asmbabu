import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  FileText, 
  BarChart3, 
  Users,
  Target,
  ChevronRight,
  Calendar,
  Award,
  Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { proposals } = useApp();

  const stats = [
    {
      label: 'Total Proposals',
      value: proposals.length,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Win Rate',
      value: '68%',
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'green'
    },
    {
      label: 'Active RFPs',
      value: proposals.filter(p => p.status === 'in-review' || p.status === 'submitted').length,
      change: '+3',
      trend: 'up',
      icon: Clock,
      color: 'orange'
    },
    {
      label: 'Total Value',
      value: `₹${(proposals.reduce((sum, p) => sum + (p.value || 0), 0) / 100000).toFixed(1)}L`,
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple'
    }
  ];

  const recentProposals = proposals.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': 'bg-gray-100 text-gray-700',
      'in-review': 'bg-blue-100 text-blue-700',
      'submitted': 'bg-yellow-100 text-yellow-700',
      'won': 'bg-green-100 text-green-700',
      'lost': 'bg-red-100 text-red-700'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-700';
  };

  const quickActions = [
    {
      title: 'Create New Proposal',
      description: 'Start with AI-powered proposal generation',
      icon: Plus,
      color: 'bg-gradient-to-r from-primary-500 to-secondary-500',
      href: '/create'
    },
    {
      title: 'Browse Templates',
      description: 'Use proven proposal templates',
      icon: FileText,
      color: 'bg-gradient-to-r from-accent-500 to-green-500',
      href: '/templates'
    },
    {
      title: 'View Analytics',
      description: 'Track your proposal performance',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      href: '/analytics'
    }
  ];

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your proposals.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                  </div>
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Proposals */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Proposals</h2>
                <Link 
                  to="/create" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentProposals.map((proposal) => (
                  <div key={proposal.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{proposal.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{proposal.client}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {proposal.updatedAt}</span>
                        </div>
                        {proposal.value && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>₹{(proposal.value / 100000).toFixed(1)}L</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(proposal.status)}`}>
                        {proposal.status}
                      </span>
                      <Link 
                        to={`/proposal/${proposal.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-105 transition-transform`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{action.title}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200/50">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Performance Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold text-green-600">+25% Win Rate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold text-blue-600">2.3 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Top Category</span>
                  <span className="font-semibold text-purple-600">Web Development</span>
                </div>
              </div>
            </div>

            {/* AI Tip */}
            <div className="bg-gradient-to-br from-accent-50 to-green-50 rounded-lg p-6 border border-accent-200/50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-accent-100 rounded-lg">
                  <Zap className="h-5 w-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI Tip</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Include specific technical details and past project examples to increase your proposal's credibility by up to 40%.
              </p>
              <Link to="/templates" className="text-accent-600 hover:text-accent-700 text-sm font-medium">
                Browse winning templates →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;