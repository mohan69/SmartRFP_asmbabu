import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Proposal {
  id: string;
  title: string;
  client: string;
  status: 'draft' | 'in-review' | 'submitted' | 'won' | 'lost';
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  value?: number;
  probability?: number;
  content?: string;
  rfpContent?: string;
  financialBreakdown?: FinancialBreakdown;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  isDefault: boolean;
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  category: string;
  type: 'company-info' | 'case-study' | 'technical-spec' | 'pricing' | 'team-profile' | 'process' | 'faq';
  content: string;
  tags: string[];
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  items: KnowledgeBaseItem[];
  isDefault: boolean;
}

export interface FinancialBreakdown {
  projectFinancials: {
    totalProjectCost: number;
    proposedValue: number;
    grossMargin: number;
    grossMarginPercentage: number;
    netMargin: number;
    netMarginPercentage: number;
  };
  laborCosts: {
    roles: Array<{
      id: string;
      role: string;
      level: 'junior' | 'mid' | 'senior' | 'lead';
      hourlyRate: number;
      estimatedHours: number;
      cost: number;
    }>;
    totalLaborCost: number;
    totalEstimatedHours: number;
  };
  capitalCosts: {
    infrastructure: Array<{
      id: string;
      item: string;
      category: 'hardware' | 'software' | 'cloud' | 'licenses';
      description: string;
      cost: number;
      isRecurring: boolean;
      recurringPeriod?: 'monthly' | 'yearly';
    }>;
    totalCapitalCost: number;
  };
  operationalExpenses: {
    expenses: Array<{
      id: string;
      description: string;
      category: 'travel' | 'training' | 'communication' | 'utilities' | 'other';
      cost: number;
      isEstimated: boolean;
      actualCost?: number;
    }>;
    totalExpenses: number;
  };
  timeline: {
    totalDuration: number;
    phases: Array<{
      id: string;
      name: string;
      startDate: string;
      endDate: string;
      effortHours: number;
      cost: number;
      deliverables: string[];
      paymentPercentage: number;
    }>;
    paymentSchedule: Array<{
      milestone: string;
      dueDate: string;
      amount: number;
      percentage: number;
    }>;
  };
  riskAssessment: {
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    bufferPercentage: number;
    bufferAmount: number;
  };
  clientSummary: {
    totalInvestment: number;
    timeline: string;
    inclusions: string[];
    exclusions: string[];
    assumptions: string[];
    deliverables: string[];
    paymentTerms: string;
  };
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

interface AppContextType {
  proposals: Proposal[];
  templates: Template[];
  knowledgeBases: KnowledgeBase[];
  addProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;
  getProposal: (id: string) => Proposal | undefined;
  addTemplate: (template: Omit<Template, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  addKnowledgeBase: (kb: Omit<KnowledgeBase, 'id'>) => void;
  updateKnowledgeBase: (id: string, updates: Partial<KnowledgeBase>) => void;
  deleteKnowledgeBase: (id: string) => void;
  addKnowledgeBaseItem: (kbId: string, item: Omit<KnowledgeBaseItem, 'id' | 'usageCount'>) => void;
  updateKnowledgeBaseItem: (kbId: string, itemId: string, updates: Partial<KnowledgeBaseItem>) => void;
  deleteKnowledgeBaseItem: (kbId: string, itemId: string) => void;
  searchKnowledgeBase: (query: string) => KnowledgeBaseItem[];
  updateFinancialBreakdown: (proposalId: string, breakdown: FinancialBreakdown) => void;
  approveFinancialBreakdown: (proposalId: string, approvedBy: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Storage keys
const STORAGE_KEYS = {
  PROPOSALS: 'smartrfp_proposals',
  TEMPLATES: 'smartrfp_templates',
  KNOWLEDGE_BASES: 'smartrfp_knowledge_bases'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);

  // Helper functions for localStorage operations
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Data saved to ${key}:`, data);
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
    }
  };

  const loadFromStorage = (key: string, defaultValue: any = []) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log(`Data loaded from ${key}:`, parsed);
        return parsed;
      }
    } catch (error) {
      console.error(`Error loading from ${key}:`, error);
    }
    return defaultValue;
  };

  // Initialize data from localStorage on component mount
  useEffect(() => {
    console.log('Initializing AppContext data from localStorage...');
    
    // Load proposals
    const savedProposals = loadFromStorage(STORAGE_KEYS.PROPOSALS, []);
    if (savedProposals.length > 0) {
      setProposals(savedProposals);
      console.log(`Loaded ${savedProposals.length} proposals from storage`);
    }

    // Load templates
    const savedTemplates = loadFromStorage(STORAGE_KEYS.TEMPLATES, getDefaultTemplates());
    setTemplates(savedTemplates);
    console.log(`Loaded ${savedTemplates.length} templates from storage`);

    // Load knowledge bases
    const savedKnowledgeBases = loadFromStorage(STORAGE_KEYS.KNOWLEDGE_BASES, getDefaultKnowledgeBases());
    setKnowledgeBases(savedKnowledgeBases);
    console.log(`Loaded ${savedKnowledgeBases.length} knowledge bases from storage`);
  }, []);

  // Save proposals to localStorage whenever they change
  useEffect(() => {
    if (proposals.length > 0) {
      saveToStorage(STORAGE_KEYS.PROPOSALS, proposals);
    }
  }, [proposals]);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    if (templates.length > 0) {
      saveToStorage(STORAGE_KEYS.TEMPLATES, templates);
    }
  }, [templates]);

  // Save knowledge bases to localStorage whenever they change
  useEffect(() => {
    if (knowledgeBases.length > 0) {
      saveToStorage(STORAGE_KEYS.KNOWLEDGE_BASES, knowledgeBases);
    }
  }, [knowledgeBases]);

  // Proposal functions
  const addProposal = (proposalData: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const now = new Date().toISOString();
    const newProposal: Proposal = {
      ...proposalData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    
    console.log('Adding new proposal:', newProposal);
    setProposals(prev => {
      const updated = [...prev, newProposal];
      console.log('Updated proposals list:', updated);
      return updated;
    });
    
    return newProposal.id;
  };

  const updateProposal = (id: string, updates: Partial<Proposal>): void => {
    console.log(`Updating proposal ${id}:`, updates);
    setProposals(prev => {
      const updated = prev.map(proposal => 
        proposal.id === id 
          ? { ...proposal, ...updates, updatedAt: new Date().toISOString() }
          : proposal
      );
      console.log('Updated proposals after update:', updated);
      return updated;
    });
  };

  const deleteProposal = (id: string): void => {
    console.log(`Deleting proposal ${id}`);
    setProposals(prev => {
      const updated = prev.filter(proposal => proposal.id !== id);
      console.log('Updated proposals after delete:', updated);
      return updated;
    });
  };

  const getProposal = (id: string): Proposal | undefined => {
    const proposal = proposals.find(p => p.id === id);
    console.log(`Getting proposal ${id}:`, proposal);
    return proposal;
  };

  // Template functions
  const addTemplate = (templateData: Omit<Template, 'id'>): void => {
    const newTemplate: Template = {
      ...templateData,
      id: Date.now().toString()
    };
    
    console.log('Adding new template:', newTemplate);
    setTemplates(prev => [...prev, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<Template>): void => {
    console.log(`Updating template ${id}:`, updates);
    setTemplates(prev => 
      prev.map(template => 
        template.id === id ? { ...template, ...updates } : template
      )
    );
  };

  const deleteTemplate = (id: string): void => {
    console.log(`Deleting template ${id}`);
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  // Knowledge base functions
  const addKnowledgeBase = (kbData: Omit<KnowledgeBase, 'id'>): void => {
    const newKB: KnowledgeBase = {
      ...kbData,
      id: Date.now().toString()
    };
    
    console.log('Adding new knowledge base:', newKB);
    setKnowledgeBases(prev => [...prev, newKB]);
  };

  const updateKnowledgeBase = (id: string, updates: Partial<KnowledgeBase>): void => {
    console.log(`Updating knowledge base ${id}:`, updates);
    setKnowledgeBases(prev => 
      prev.map(kb => 
        kb.id === id ? { ...kb, ...updates } : kb
      )
    );
  };

  const deleteKnowledgeBase = (id: string): void => {
    console.log(`Deleting knowledge base ${id}`);
    setKnowledgeBases(prev => prev.filter(kb => kb.id !== id));
  };

  const addKnowledgeBaseItem = (kbId: string, itemData: Omit<KnowledgeBaseItem, 'id' | 'usageCount'>): void => {
    const newItem: KnowledgeBaseItem = {
      ...itemData,
      id: Date.now().toString(),
      usageCount: 0
    };
    
    console.log(`Adding item to knowledge base ${kbId}:`, newItem);
    setKnowledgeBases(prev => 
      prev.map(kb => 
        kb.id === kbId 
          ? { ...kb, items: [...kb.items, newItem] }
          : kb
      )
    );
  };

  const updateKnowledgeBaseItem = (kbId: string, itemId: string, updates: Partial<KnowledgeBaseItem>): void => {
    console.log(`Updating item ${itemId} in knowledge base ${kbId}:`, updates);
    setKnowledgeBases(prev => 
      prev.map(kb => 
        kb.id === kbId 
          ? {
              ...kb,
              items: kb.items.map(item => 
                item.id === itemId ? { ...item, ...updates } : item
              )
            }
          : kb
      )
    );
  };

  const deleteKnowledgeBaseItem = (kbId: string, itemId: string): void => {
    console.log(`Deleting item ${itemId} from knowledge base ${kbId}`);
    setKnowledgeBases(prev => 
      prev.map(kb => 
        kb.id === kbId 
          ? { ...kb, items: kb.items.filter(item => item.id !== itemId) }
          : kb
      )
    );
  };

  const searchKnowledgeBase = (query: string): KnowledgeBaseItem[] => {
    const lowerQuery = query.toLowerCase();
    const results: KnowledgeBaseItem[] = [];
    
    knowledgeBases.forEach(kb => {
      kb.items.forEach(item => {
        if (item.isActive) {
          const titleMatch = item.title.toLowerCase().includes(lowerQuery);
          const contentMatch = item.content.toLowerCase().includes(lowerQuery);
          const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
          
          if (titleMatch || contentMatch || tagMatch) {
            results.push({
              ...item,
              usageCount: item.usageCount + 1,
              lastUsed: new Date().toLocaleDateString()
            });
          }
        }
      });
    });
    
    return results.sort((a, b) => b.usageCount - a.usageCount);
  };

  const updateFinancialBreakdown = (proposalId: string, breakdown: FinancialBreakdown): void => {
    console.log(`Updating financial breakdown for proposal ${proposalId}:`, breakdown);
    updateProposal(proposalId, { financialBreakdown: breakdown });
  };

  const approveFinancialBreakdown = (proposalId: string, approvedBy: string): void => {
    const proposal = getProposal(proposalId);
    if (proposal?.financialBreakdown) {
      const updatedBreakdown = {
        ...proposal.financialBreakdown,
        isApproved: true,
        approvedBy,
        approvedAt: new Date().toISOString()
      };
      
      console.log(`Approving financial breakdown for proposal ${proposalId} by ${approvedBy}`);
      updateProposal(proposalId, { financialBreakdown: updatedBreakdown });
    }
  };

  return (
    <AppContext.Provider value={{
      proposals,
      templates,
      knowledgeBases,
      addProposal,
      updateProposal,
      deleteProposal,
      getProposal,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      addKnowledgeBase,
      updateKnowledgeBase,
      deleteKnowledgeBase,
      addKnowledgeBaseItem,
      updateKnowledgeBaseItem,
      deleteKnowledgeBaseItem,
      searchKnowledgeBase,
      updateFinancialBreakdown,
      approveFinancialBreakdown
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Default data functions
function getDefaultTemplates(): Template[] {
  return [
    {
      id: 'template-1',
      name: 'Web Development Standard',
      category: 'Web Development',
      description: 'Standard template for web development projects',
      content: `# Web Development Proposal

## Executive Summary
We propose to develop a modern, responsive web application that meets your business requirements and delivers exceptional user experience.

## Technical Approach
- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Cloud: AWS deployment

## Timeline
- Phase 1: Planning & Design (2 weeks)
- Phase 2: Development (8 weeks)
- Phase 3: Testing & Deployment (2 weeks)

## Investment
Total Project Cost: ₹15-25 Lakhs`,
      isDefault: true
    },
    {
      id: 'template-2',
      name: 'Mobile App Development',
      category: 'Mobile Development',
      description: 'Template for mobile application development',
      content: `# Mobile Application Development

## Executive Summary
We will develop a cross-platform mobile application that provides seamless user experience across iOS and Android devices.

## Technical Specifications
- Framework: React Native / Flutter
- Backend: Node.js API
- Database: MongoDB
- Push Notifications: Firebase

## Deliverables
- Native iOS and Android applications
- Admin dashboard
- API documentation
- App store deployment

## Investment
Total Project Cost: ₹20-35 Lakhs`,
      isDefault: true
    }
  ];
}

function getDefaultKnowledgeBases(): KnowledgeBase[] {
  return [
    {
      id: 'kb-1',
      name: 'Company Knowledge Base',
      description: 'Main knowledge base containing company information and capabilities',
      isDefault: true,
      items: [
        {
          id: 'kb-item-1',
          title: 'Company Overview',
          category: 'Company Information',
          type: 'company-info',
          content: `TechCorp Solutions is a leading software development company based in Bangalore, India. Founded in 2016, we specialize in creating innovative digital solutions for businesses across various industries.

Our core competencies include:
- Web Application Development
- Mobile App Development
- Cloud Solutions & Migration
- E-commerce Platforms
- Enterprise Software Development
- UI/UX Design
- Digital Transformation Consulting

We have successfully delivered 200+ projects for clients ranging from startups to Fortune 500 companies. Our team of 50+ experienced professionals follows agile methodologies and industry best practices to ensure timely delivery and exceptional quality.

Key achievements:
- 95% client satisfaction rate
- 40% average improvement in client business metrics
- ISO 27001 certified for information security
- 24/7 support and maintenance services`,
          tags: ['company', 'overview', 'capabilities', 'experience'],
          isActive: true,
          usageCount: 0
        },
        {
          id: 'kb-item-2',
          title: 'E-commerce Platform Case Study',
          category: 'Case Studies',
          type: 'case-study',
          content: `Project: Multi-vendor E-commerce Platform
Client: RetailMax India
Duration: 6 months
Team Size: 8 developers

Challenge:
RetailMax needed a scalable e-commerce platform to support multiple vendors, handle high traffic, and provide seamless user experience across web and mobile.

Solution:
- Developed using React.js frontend and Node.js backend
- Implemented microservices architecture for scalability
- Integrated payment gateways (Razorpay, PayU, Stripe)
- Built vendor management system
- Implemented real-time inventory management
- Added AI-powered product recommendations

Results:
- 300% increase in online sales within 6 months
- 50% reduction in page load times
- 99.9% uptime achieved
- Successfully handling 10,000+ concurrent users
- 25% increase in customer retention

Technologies Used: React.js, Node.js, MongoDB, Redis, AWS, Docker, Kubernetes`,
          tags: ['e-commerce', 'case-study', 'retail', 'scalability'],
          isActive: true,
          usageCount: 0
        },
        {
          id: 'kb-item-3',
          title: 'Technical Capabilities',
          category: 'Technical Specifications',
          type: 'technical-spec',
          content: `Frontend Technologies:
- React.js, Angular, Vue.js
- TypeScript, JavaScript (ES6+)
- HTML5, CSS3, SASS/SCSS
- Responsive design and PWA development
- State management (Redux, MobX, Vuex)

Backend Technologies:
- Node.js, Python (Django, Flask)
- Java (Spring Boot), .NET Core
- RESTful APIs and GraphQL
- Microservices architecture
- Serverless computing (AWS Lambda)

Databases:
- PostgreSQL, MySQL, MongoDB
- Redis for caching
- Elasticsearch for search
- Data warehousing solutions

Cloud & DevOps:
- AWS, Azure, Google Cloud Platform
- Docker containerization
- Kubernetes orchestration
- CI/CD pipelines (Jenkins, GitLab CI)
- Infrastructure as Code (Terraform)

Security:
- OAuth 2.0, JWT authentication
- SSL/TLS encryption
- OWASP security standards
- Regular security audits
- GDPR compliance implementation`,
          tags: ['technical', 'capabilities', 'technology', 'stack'],
          isActive: true,
          usageCount: 0
        }
      ]
    }
  ];
}