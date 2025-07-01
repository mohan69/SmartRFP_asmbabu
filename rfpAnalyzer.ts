export interface RFPQuestion {
  id: string;
  section: string;
  question: string;
  type: 'technical' | 'commercial' | 'compliance' | 'experience' | 'general';
  priority: 'high' | 'medium' | 'low';
  keywords: string[];
  suggestedResponse?: string;
  requiresAttention: boolean;
}

export interface RFPSection {
  id: string;
  title: string;
  content: string;
  questions: RFPQuestion[];
  pageNumbers: number[];
}

export interface RFPAnalysis {
  totalPages: number;
  totalQuestions: number;
  sections: RFPSection[];
  keyRequirements: string[];
  technicalRequirements: string[];
  commercialTerms: string[];
  complianceItems: string[];
  deadlines: string[];
  evaluationCriteria: string[];
  submissionRequirements: string[];
  summary: string;
}

export class RFPAnalyzer {
  private questionPatterns = [
    // Direct question patterns
    /(?:^|\n)\s*(?:\d+\.?\s*)?(.{0,200}?\?)/gm,
    // Requirement patterns
    /(?:please\s+(?:provide|describe|explain|detail|list|specify|include))\s+(.{0,300}?)(?:\.|$)/gi,
    // Request patterns
    /(?:we\s+(?:require|need|request|expect))\s+(.{0,300}?)(?:\.|$)/gi,
    // Must/shall patterns
    /(?:(?:must|shall|should)\s+(?:provide|include|demonstrate|show))\s+(.{0,300}?)(?:\.|$)/gi,
    // Vendor patterns
    /(?:vendor\s+(?:must|shall|should|will))\s+(.{0,300}?)(?:\.|$)/gi,
    // Proposal patterns
    /(?:proposal\s+(?:must|shall|should)\s+(?:include|contain|address))\s+(.{0,300}?)(?:\.|$)/gi,
    // Response patterns
    /(?:response\s+(?:must|shall|should)\s+(?:include|contain|address))\s+(.{0,300}?)(?:\.|$)/gi,
    // Bidder patterns
    /(?:bidder\s+(?:must|shall|should|will))\s+(.{0,300}?)(?:\.|$)/gi,
    // Contractor patterns
    /(?:contractor\s+(?:must|shall|should|will))\s+(.{0,300}?)(?:\.|$)/gi,
    // Supplier patterns
    /(?:supplier\s+(?:must|shall|should|will))\s+(.{0,300}?)(?:\.|$)/gi,
  ];

  private sectionPatterns = [
    // Common RFP section headers
    /(?:^|\n)\s*(?:\d+\.?\s*)?(?:SECTION|PART|CHAPTER)\s+(?:\d+\.?\s*)?(.{1,100}?)(?:\n|$)/gi,
    /(?:^|\n)\s*(?:\d+\.?\s*)?(EXECUTIVE\s+SUMMARY|TECHNICAL\s+REQUIREMENTS|COMMERCIAL\s+TERMS|SCOPE\s+OF\s+WORK|PROJECT\s+OVERVIEW|EVALUATION\s+CRITERIA|SUBMISSION\s+REQUIREMENTS|TERMS\s+AND\s+CONDITIONS|PRICING|TIMELINE|DELIVERABLES|COMPLIANCE|EXPERIENCE|QUALIFICATIONS)(?:\s|$)/gi,
    // Numbered sections
    /(?:^|\n)\s*(\d+\.?\s+[A-Z][^.\n]{5,80})(?:\n|$)/gm,
    // Lettered sections
    /(?:^|\n)\s*([A-Z]\.?\s+[A-Z][^.\n]{5,80})(?:\n|$)/gm,
  ];

  private keywordCategories = {
    technical: [
      'technology', 'architecture', 'platform', 'framework', 'database', 'api', 'integration',
      'security', 'performance', 'scalability', 'cloud', 'infrastructure', 'development',
      'programming', 'software', 'system', 'application', 'solution', 'technical', 'specification'
    ],
    commercial: [
      'price', 'cost', 'budget', 'payment', 'commercial', 'financial', 'pricing', 'rate',
      'fee', 'invoice', 'billing', 'contract', 'terms', 'conditions', 'warranty', 'support'
    ],
    compliance: [
      'compliance', 'regulation', 'standard', 'certification', 'audit', 'policy', 'procedure',
      'requirement', 'mandatory', 'must', 'shall', 'legal', 'regulatory', 'gdpr', 'iso'
    ],
    experience: [
      'experience', 'portfolio', 'case study', 'reference', 'client', 'project', 'track record',
      'qualification', 'expertise', 'capability', 'team', 'resource', 'skill', 'background'
    ]
  };

  public analyzeRFP(text: string, metadata?: any): RFPAnalysis {
    console.log('Starting comprehensive RFP analysis...');
    
    // Clean and normalize text
    const cleanText = this.cleanText(text);
    
    // Extract sections
    const sections = this.extractSections(cleanText);
    
    // Extract questions from each section
    sections.forEach(section => {
      section.questions = this.extractQuestions(section.content, section.title);
    });
    
    // Extract key information
    const keyRequirements = this.extractKeyRequirements(cleanText);
    const technicalRequirements = this.extractTechnicalRequirements(cleanText);
    const commercialTerms = this.extractCommercialTerms(cleanText);
    const complianceItems = this.extractComplianceItems(cleanText);
    const deadlines = this.extractDeadlines(cleanText);
    const evaluationCriteria = this.extractEvaluationCriteria(cleanText);
    const submissionRequirements = this.extractSubmissionRequirements(cleanText);
    
    // Generate summary
    const summary = this.generateSummary(sections, keyRequirements, technicalRequirements);
    
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
    
    console.log(`RFP Analysis Complete: ${sections.length} sections, ${totalQuestions} questions identified`);
    
    return {
      totalPages: metadata?.pageCount || Math.ceil(text.length / 2000),
      totalQuestions,
      sections,
      keyRequirements,
      technicalRequirements,
      commercialTerms,
      complianceItems,
      deadlines,
      evaluationCriteria,
      submissionRequirements,
      summary
    };
  }

  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private extractSections(text: string): RFPSection[] {
    const sections: RFPSection[] = [];
    const lines = text.split('\n');
    let currentSection: RFPSection | null = null;
    let sectionContent: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this line is a section header
      const sectionMatch = this.isSectionHeader(line);
      
      if (sectionMatch) {
        // Save previous section
        if (currentSection && sectionContent.length > 0) {
          currentSection.content = sectionContent.join('\n').trim();
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          id: `section-${sections.length + 1}`,
          title: sectionMatch,
          content: '',
          questions: [],
          pageNumbers: [Math.floor(i / 50) + 1] // Approximate page number
        };
        sectionContent = [];
      } else if (currentSection) {
        sectionContent.push(line);
      } else {
        // Content before first section - create a general section
        if (sections.length === 0) {
          currentSection = {
            id: 'section-general',
            title: 'General Information',
            content: '',
            questions: [],
            pageNumbers: [1]
          };
          sectionContent = [line];
        }
      }
    }
    
    // Add final section
    if (currentSection && sectionContent.length > 0) {
      currentSection.content = sectionContent.join('\n').trim();
      sections.push(currentSection);
    }
    
    // If no sections found, create one big section
    if (sections.length === 0) {
      sections.push({
        id: 'section-all',
        title: 'Complete RFP Document',
        content: text,
        questions: [],
        pageNumbers: [1]
      });
    }
    
    return sections;
  }

  private isSectionHeader(line: string): string | null {
    // Check various section header patterns
    for (const pattern of this.sectionPatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }
    
    // Check for common section indicators
    const commonSections = [
      'executive summary', 'scope of work', 'technical requirements', 'commercial terms',
      'evaluation criteria', 'submission requirements', 'project overview', 'timeline',
      'deliverables', 'pricing', 'terms and conditions', 'compliance', 'experience',
      'qualifications', 'proposal format', 'contract terms', 'service level agreement'
    ];
    
    const lowerLine = line.toLowerCase();
    for (const section of commonSections) {
      if (lowerLine.includes(section) && line.length < 100) {
        return line;
      }
    }
    
    return null;
  }

  private extractQuestions(text: string, sectionTitle: string): RFPQuestion[] {
    const questions: RFPQuestion[] = [];
    const questionSet = new Set<string>(); // Avoid duplicates
    
    // Extract using all question patterns
    for (const pattern of this.questionPatterns) {
      const matches = text.matchAll(pattern);
      
      for (const match of matches) {
        const questionText = match[1]?.trim();
        if (questionText && questionText.length > 10 && questionText.length < 500) {
          const normalizedQuestion = questionText.toLowerCase();
          
          if (!questionSet.has(normalizedQuestion)) {
            questionSet.add(normalizedQuestion);
            
            const question: RFPQuestion = {
              id: `q-${questions.length + 1}`,
              section: sectionTitle,
              question: questionText,
              type: this.categorizeQuestion(questionText),
              priority: this.assessPriority(questionText),
              keywords: this.extractKeywords(questionText),
              requiresAttention: this.requiresSpecialAttention(questionText)
            };
            
            questions.push(question);
          }
        }
      }
    }
    
    // Extract numbered/lettered questions
    const numberedQuestions = this.extractNumberedQuestions(text, sectionTitle);
    numberedQuestions.forEach(q => {
      const normalizedQuestion = q.question.toLowerCase();
      if (!questionSet.has(normalizedQuestion)) {
        questionSet.add(normalizedQuestion);
        questions.push(q);
      }
    });
    
    return questions;
  }

  private extractNumberedQuestions(text: string, sectionTitle: string): RFPQuestion[] {
    const questions: RFPQuestion[] = [];
    
    // Pattern for numbered questions like "1. What is your approach to..."
    const numberedPattern = /(?:^|\n)\s*(\d+\.?\s+.{10,500}?\?)/gm;
    const matches = text.matchAll(numberedPattern);
    
    for (const match of matches) {
      const questionText = match[1].trim();
      
      const question: RFPQuestion = {
        id: `nq-${questions.length + 1}`,
        section: sectionTitle,
        question: questionText,
        type: this.categorizeQuestion(questionText),
        priority: this.assessPriority(questionText),
        keywords: this.extractKeywords(questionText),
        requiresAttention: this.requiresSpecialAttention(questionText)
      };
      
      questions.push(question);
    }
    
    return questions;
  }

  private categorizeQuestion(question: string): RFPQuestion['type'] {
    const lowerQuestion = question.toLowerCase();
    
    // Check technical keywords
    if (this.keywordCategories.technical.some(keyword => lowerQuestion.includes(keyword))) {
      return 'technical';
    }
    
    // Check commercial keywords
    if (this.keywordCategories.commercial.some(keyword => lowerQuestion.includes(keyword))) {
      return 'commercial';
    }
    
    // Check compliance keywords
    if (this.keywordCategories.compliance.some(keyword => lowerQuestion.includes(keyword))) {
      return 'compliance';
    }
    
    // Check experience keywords
    if (this.keywordCategories.experience.some(keyword => lowerQuestion.includes(keyword))) {
      return 'experience';
    }
    
    return 'general';
  }

  private assessPriority(question: string): RFPQuestion['priority'] {
    const lowerQuestion = question.toLowerCase();
    
    // High priority indicators
    const highPriorityWords = ['must', 'shall', 'required', 'mandatory', 'critical', 'essential', 'key'];
    if (highPriorityWords.some(word => lowerQuestion.includes(word))) {
      return 'high';
    }
    
    // Medium priority indicators
    const mediumPriorityWords = ['should', 'preferred', 'desired', 'important', 'significant'];
    if (mediumPriorityWords.some(word => lowerQuestion.includes(word))) {
      return 'medium';
    }
    
    return 'low';
  }

  private extractKeywords(text: string): string[] {
    const keywords: string[] = [];
    const words = text.toLowerCase().split(/\s+/);
    
    // Extract relevant keywords from all categories
    Object.values(this.keywordCategories).flat().forEach(keyword => {
      if (words.some(word => word.includes(keyword))) {
        keywords.push(keyword);
      }
    });
    
    return [...new Set(keywords)];
  }

  private requiresSpecialAttention(question: string): boolean {
    const lowerQuestion = question.toLowerCase();
    const attentionWords = [
      'compliance', 'regulation', 'legal', 'audit', 'certification', 'security',
      'gdpr', 'privacy', 'data protection', 'iso', 'soc', 'hipaa'
    ];
    
    return attentionWords.some(word => lowerQuestion.includes(word));
  }

  private extractKeyRequirements(text: string): string[] {
    const requirements: string[] = [];
    const requirementPatterns = [
      /(?:key\s+requirements?|main\s+requirements?|primary\s+requirements?)[\s\S]{0,500}?(?:\n\n|\.\s)/gi,
      /(?:must\s+(?:have|include|provide|support))[\s\S]{0,200}?(?:\.|$)/gi,
      /(?:shall\s+(?:have|include|provide|support))[\s\S]{0,200}?(?:\.|$)/gi,
    ];
    
    requirementPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const requirement = match[0].trim();
        if (requirement.length > 20 && requirement.length < 300) {
          requirements.push(requirement);
        }
      }
    });
    
    return [...new Set(requirements)];
  }

  private extractTechnicalRequirements(text: string): string[] {
    const technical: string[] = [];
    const technicalPatterns = [
      /(?:technical\s+(?:requirements?|specifications?))[\s\S]{0,500}?(?:\n\n|\.\s)/gi,
      /(?:system\s+(?:requirements?|specifications?))[\s\S]{0,500}?(?:\n\n|\.\s)/gi,
      /(?:platform|technology|framework|database|api|integration)[\s\S]{0,200}?(?:\.|$)/gi,
    ];
    
    technicalPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const tech = match[0].trim();
        if (tech.length > 20 && tech.length < 300) {
          technical.push(tech);
        }
      }
    });
    
    return [...new Set(technical)];
  }

  private extractCommercialTerms(text: string): string[] {
    const commercial: string[] = [];
    const commercialPatterns = [
      /(?:commercial\s+terms|pricing|payment\s+terms|contract\s+terms)[\s\S]{0,500}?(?:\n\n|\.\s)/gi,
      /(?:price|cost|budget|fee|rate)[\s\S]{0,200}?(?:\.|$)/gi,
    ];
    
    commercialPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const term = match[0].trim();
        if (term.length > 20 && term.length < 300) {
          commercial.push(term);
        }
      }
    });
    
    return [...new Set(commercial)];
  }

  private extractComplianceItems(text: string): string[] {
    const compliance: string[] = [];
    const compliancePatterns = [
      /(?:compliance|regulatory|certification|audit|standard)[\s\S]{0,200}?(?:\.|$)/gi,
      /(?:gdpr|iso|soc|hipaa|pci|sox)[\s\S]{0,200}?(?:\.|$)/gi,
    ];
    
    compliancePatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const item = match[0].trim();
        if (item.length > 20 && item.length < 300) {
          compliance.push(item);
        }
      }
    });
    
    return [...new Set(compliance)];
  }

  private extractDeadlines(text: string): string[] {
    const deadlines: string[] = [];
    const datePatterns = [
      /(?:deadline|due\s+date|submission\s+date|closing\s+date)[\s\S]{0,100}?(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+\w+\s+\d{2,4})/gi,
      /(?:by|before|no\s+later\s+than)[\s\S]{0,50}?(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}\s+\w+\s+\d{2,4})/gi,
    ];
    
    datePatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const deadline = match[0].trim();
        if (deadline.length > 10 && deadline.length < 200) {
          deadlines.push(deadline);
        }
      }
    });
    
    return [...new Set(deadlines)];
  }

  private extractEvaluationCriteria(text: string): string[] {
    const criteria: string[] = [];
    const criteriaPatterns = [
      /(?:evaluation\s+criteria|selection\s+criteria|scoring|weighting)[\s\S]{0,500}?(?:\n\n|\.\s)/gi,
      /(?:will\s+be\s+evaluated|assessment\s+based\s+on)[\s\S]{0,300}?(?:\.|$)/gi,
    ];
    
    criteriaPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const criterion = match[0].trim();
        if (criterion.length > 20 && criterion.length < 400) {
          criteria.push(criterion);
        }
      }
    });
    
    return [...new Set(criteria)];
  }

  private extractSubmissionRequirements(text: string): string[] {
    const requirements: string[] = [];
    const submissionPatterns = [
      /(?:submission\s+requirements?|proposal\s+format|document\s+requirements?)[\s\S]{0,500}?(?:\n\n|\.\s)/gi,
      /(?:proposals?\s+must\s+include|responses?\s+must\s+contain)[\s\S]{0,300}?(?:\.|$)/gi,
    ];
    
    submissionPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const requirement = match[0].trim();
        if (requirement.length > 20 && requirement.length < 400) {
          requirements.push(requirement);
        }
      }
    });
    
    return [...new Set(requirements)];
  }

  private generateSummary(sections: RFPSection[], keyRequirements: string[], technicalRequirements: string[]): string {
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
    const highPriorityQuestions = sections.reduce((sum, section) => 
      sum + section.questions.filter(q => q.priority === 'high').length, 0
    );
    
    const questionsByType = {
      technical: 0,
      commercial: 0,
      compliance: 0,
      experience: 0,
      general: 0
    };
    
    sections.forEach(section => {
      section.questions.forEach(q => {
        questionsByType[q.type]++;
      });
    });
    
    return `This RFP contains ${sections.length} main sections with ${totalQuestions} identified questions and requirements. 
${highPriorityQuestions} questions are marked as high priority and require immediate attention.

Question breakdown:
- Technical: ${questionsByType.technical} questions
- Commercial: ${questionsByType.commercial} questions  
- Compliance: ${questionsByType.compliance} questions
- Experience: ${questionsByType.experience} questions
- General: ${questionsByType.general} questions

Key areas identified: ${keyRequirements.length} key requirements, ${technicalRequirements.length} technical specifications.

This comprehensive analysis ensures all RFP requirements are captured and addressed in your proposal response.`;
  }
}

export const analyzeRFP = (text: string, metadata?: any): RFPAnalysis => {
  const analyzer = new RFPAnalyzer();
  return analyzer.analyzeRFP(text, metadata);
};