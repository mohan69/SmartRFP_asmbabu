import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock, 
  Award, 
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { proposals } = useApp();
  const [timeRange, setTimeRange] = useState('3-months');

  // Calculate metrics
  const totalProposals = proposals.length;
  const wonProposals = proposals.filter(p => p.status === 'won').length;
  const winRate = totalProposals ? Math.round((wonProposals / totalProposals) * 100) : 0;
  const totalValue = proposals.reduce((sum, p) => sum + (p.value || 0), 0);
  const wonValue = proposals.filter(p => p.status === 'won').reduce((sum, p) => sum + (p.value || 0), 0);
  const avgResponseTime = 2.8; // Mock data
  const avgProposalValue = totalProposals ? totalValue / totalProposals : 0;

  const metrics = [
    {
      title: 'Total Proposals',
      value: totalProposals,
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
      color: 'blue'
    },
    {
      title: 'Win Rate',
      value: `${winRate}%`,
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Total Pipeline Value',
      value: `₹${(totalValue / 10000000).toFixed(1)}Cr`,
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Avg Response Time',
      value: `${avgResponseTime} days`,
      change: '-0.5 days',
      trend: 'up',
      icon: Clock,
      color: 'orange'
    }
  ];

  const categoryData = [
    { name: 'Web Development', proposals: 8, value: 12500000, winRate: 75 },
    { name: 'Mobile Development', proposals: 5, value: 8000000, winRate: 60 },
    { name: 'Cloud Services', proposals: 4, value: 15000000, winRate: 80 },
    { name: 'E-commerce', proposals: 3, value: 6000000, winRate: 67 },
    { name: 'Enterprise Software', proposals: 2, value: 8500000, winRate: 50 }
  ];

  const monthlyData = [
    { month: 'Jan', proposals: 12, won: 8, value: 15000000 },
    { month: 'Feb', proposals: 15, won: 10, value: 18000000 },
    { month: 'Mar', proposals: 18, won: 14, value: 22000000 },
    { month: 'Apr', proposals: 22, won: 16, value: 25000000 },
    { month: 'May', proposals: 20, won: 15, value: 28000000 },
    { month: 'Jun', proposals: 25, won: 19, value: 32000000 }
  ];

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your proposal performance and identify growth opportunities</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                >
                  <option value="1-month">Last Month</option>
                  <option value="3-months">Last 3 Months</option>
                  <option value="6-months">Last 6 Months</option>
                  <option value="1-year">Last Year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                    <Icon className={`h-5 w-5 text-${metric.color}-600`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.title}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Proposal Trends */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Proposal Trends</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-600">Submitted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Won</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                      <div 
                        className="bg-primary-500 h-3 rounded-full relative" 
                        style={{ width: `${(data.proposals / 25) * 100}%` }}
                      >
                        <div 
                          className="bg-green-500 h-3 rounded-full absolute top-0 left-0" 
                          style={{ width: `${(data.won / data.proposals) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 w-16">{data.proposals} total</div>
                  </div>
                  <div className="text-sm font-medium text-green-600 w-20">{data.won} won</div>
                  <div className="text-sm text-gray-600 w-24">₹{(data.value / 10000000).toFixed(1)}Cr</div>
                </div>
              ))}
            </div>
          </div>

          {/* Win Rate by Category */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Win Rate by Category</h2>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className="text-gray-600">{category.winRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.winRate}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{category.proposals} proposals</span>
                    <span>₹{(category.value / 10000000).toFixed(1)}Cr value</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Insights */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Insights</h2>
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1 bg-green-100 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-green-800">Strong Performance</span>
                </div>
                <p className="text-sm text-green-700">
                  Your win rate has increased by 8% this quarter. Cloud Services category is performing exceptionally well.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-blue-800">Opportunity</span>
                </div>
                <p className="text-sm text-blue-700">
                  Consider focusing more on Enterprise Software category where you have a 50% win rate with high-value deals.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1 bg-purple-100 rounded-full">
                    <Award className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-purple-800">Achievement</span>
                </div>
                <p className="text-sm text-purple-700">
                  You've reduced your average response time by 0.5 days, giving you a competitive advantage.
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Metrics Summary</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Pipeline Health</span>
                  <span className="text-sm font-semibold text-green-600">Excellent</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                  <span className="text-sm font-semibold text-blue-600">{winRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${winRate}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Avg Deal Size</span>
                  <span className="text-sm font-semibold text-purple-600">₹{(avgProposalValue / 1000000).toFixed(1)}L</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Top performing month</div>
                <div className="text-lg font-semibold text-gray-900">June 2024</div>
                <div className="text-sm text-gray-500">25 proposals, 76% win rate</div>
              </div>

              <div className="pt-2">
                <div className="text-sm text-gray-600 mb-2">Revenue generated</div>
                <div className="text-lg font-semibold text-gray-900">₹{(wonValue / 10000000).toFixed(1)} Crores</div>
                <div className="text-sm text-gray-500">From {wonProposals} won proposals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;