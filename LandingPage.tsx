import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Zap,
  Target,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Sparkles
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Generation',
      description: 'Advanced AI analyzes RFPs and generates compelling, tailored proposals in minutes'
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'Intelligent algorithms match your expertise with RFP requirements for higher win rates'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Reduce proposal creation time by 90% while maintaining quality and customization'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools for seamless teamwork on complex proposals'
    },
    {
      icon: BarChart3,
      title: 'Success Analytics',
      description: 'Track performance metrics and optimize your proposal strategy with data insights'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security ensures your confidential business data stays protected'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      company: 'TechInnovate Solutions',
      role: 'Business Development Director',
      content: 'SmartRFP AI transformed our proposal process. We\'ve increased our win rate by 40% and reduced preparation time from weeks to days.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      company: 'Digital Dynamics',
      role: 'Founder & CEO',
      content: 'The AI-generated proposals are incredibly accurate and professional. Our team can now focus on relationship building instead of document creation.',
      rating: 5
    },
    {
      name: 'Arjun Patel',
      company: 'CloudScale Systems',
      role: 'Sales Manager',
      content: 'From startup to enterprise clients, SmartRFP AI adapts perfectly to any requirement. Best investment we\'ve made for our sales process.',
      rating: 5
    }
  ];

  const stats = [
    { value: '90%', label: 'Time Saved' },
    { value: '40%', label: 'Higher Win Rate' },
    { value: '500+', label: 'Companies Trust Us' },
    { value: '10k+', label: 'Proposals Generated' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                SmartRFP AI
              </span>
            </div>
            <Link
              to="/auth"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-full text-sm font-medium text-primary-700 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Trusted by 500+ Software Development Companies</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
            Generate{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Winning Proposals
            </span>{' '}
            with AI
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Transform your RFP response process with AI-powered proposal generation. 
            Create compelling, customized proposals in minutes, not weeks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Link
              to="/auth"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors duration-200 flex items-center space-x-2">
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Modern Teams
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create winning proposals and grow your software development business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 hover:border-primary-200"
                >
                  <div className="p-3 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg w-fit mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-gray-600">See what our customers say about SmartRFP AI</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-gray-200/50"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-primary-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Globe className="h-8 w-8 text-white/80" />
            <span className="text-white/80 text-lg">Start in India, Scale Globally</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Proposal Process?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of software development companies already winning more business with SmartRFP AI
          </p>
          <Link
            to="/auth"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors duration-200 inline-flex items-center space-x-2 shadow-lg"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="mt-6 text-white/80">
            <CheckCircle className="h-5 w-5 inline mr-2" />
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">SmartRFP AI</span>
            </div>
            <p className="text-gray-400 mb-8">
              Empowering software development teams to win more business with AI-powered proposals
            </p>
            <div className="text-sm text-gray-500">
              © 2024 SmartRFP AI. All rights reserved. • Made in India for the World 🇮🇳
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;