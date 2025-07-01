import { RFPAnalysis, RFPQuestion, RFPSection } from './rfpAnalyzer';
import { KnowledgeBaseItem } from '../contexts/AppContext';

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  rfpQuestions: string[];
  knowledgeUsed: string[];
  confidence: number;
}

export interface GeneratedProposal {
  title: string;
  executiveSummary: string;
  sections: ProposalSection[];
  questionsAddressed: number;
  totalQuestions: number;
  coveragePecentage: number;
  recommendations: string[];
  missingInformation: string[];
}

export class ProposalGenerator {
  private knowledgeBase: KnowledgeBaseItem[] = [];

  constructor(knowledgeBase: KnowledgeBaseItem[]) {
    this.knowledgeBase = knowledgeBase;
  }

  public generateProposal(
    rfpAnalysis: RFPAnalysis,
    projectTitle: string,
    clientName: string,
    additionalContext?: string
  ): GeneratedProposal {
    console.log('Generating comprehensive proposal from RFP analysis...');
    
    // Generate executive summary
    const executiveSummary = this.generateExecutiveSummary(rfpAnalysis, projectTitle, clientName);
    
    // Generate sections based on RFP sections
    const sections = this.generateSections(rfpAnalysis);
    
    // Calculate coverage metrics
    const questionsAddressed = sections.reduce((sum, section) => sum + section.rfpQuestions.length, 0);
    const coveragePercentage = (questionsAddressed / rfpAnalysis.totalQuestions) * 100;
    
    // Generate recommendations and identify missing information
    const recommendations = this.generateRecommendations(rfpAnalysis, sections);
    const missingInformation = this.identifyMissingInformation(rfpAnalysis, sections);
    
    console.log(`Proposal generated: ${sections.length} sections, ${questionsAddressed}/${rfpAnalysis.totalQuestions} questions addressed (${coveragePercentage.toFixed(1)}% coverage)`);
    
    return {
      title: projectTitle,
      executiveSummary,
      sections,
      questionsAddressed,
      totalQuestions: rfpAnalysis.totalQuestions,
      coveragePecentage: coveragePercentage,
      recommendations,
      missingInformation
    };
  }

  private generateExecutiveSummary(rfpAnalysis: RFPAnalysis, projectTitle: string, clientName: string): string {
    const companyInfo = this.findRelevantKnowledge(['company', 'overview', 'capabilities']);
    const keyRequirements = rfpAnalysis.keyRequirements.slice(0, 3);
    
    return `# Executive Summary

We are pleased to submit our comprehensive proposal for ${projectTitle} to ${clientName}. Our team has thoroughly analyzed your RFP requirements and identified ${rfpAnalysis.totalQuestions} specific questions and requirements across ${rfpAnalysis.sections.length} key areas.

## Our Understanding
${rfpAnalysis.summary}

## Our Approach
${companyInfo ? companyInfo.content.substring(0, 300) + '...' : 'Our experienced team brings proven expertise in delivering complex software solutions that drive business growth and digital transformation.'}

## Key Differentiators
- Comprehensive coverage of all ${rfpAnalysis.totalQuestions} RFP requirements
- Proven track record with similar projects
- Dedicated project team with relevant expertise
- Agile development methodology ensuring timely delivery
- 24/7 support and maintenance capabilities

## Value Proposition
We understand that ${clientName} requires a solution that not only meets your technical specifications but also delivers measurable business value. Our proposal addresses each of your requirements with detailed solutions, timelines, and pricing.

${keyRequirements.length > 0 ? `\n## Key Requirements Addressed\n${keyRequirements.map((req, i) => `${i + 1}. ${req.substring(0, 200)}...`).join('\n')}` : ''}

We look forward to discussing how our solution can help ${clientName} achieve its objectives and deliver exceptional results.`;
  }

  private generateSections(rfpAnalysis: RFPAnalysis): ProposalSection[] {
    const sections: ProposalSection[] = [];
    
    // Process each RFP section
    rfpAnalysis.sections.forEach((rfpSection, index) => {
      if (rfpSection.questions.length > 0) {
        const proposalSection = this.generateSectionContent(rfpSection, index + 1);
        sections.push(proposalSection);
      }
    });
    
    // Add standard sections if not covered
    const standardSections = this.generateStandardSections(rfpAnalysis);
    sections.push(...standardSections);
    
    return sections;
  }

  private generateSectionContent(rfpSection: RFPSection, sectionNumber: number): ProposalSection {
    const relevantKnowledge = this.findRelevantKnowledgeForSection(rfpSection);
    const highPriorityQuestions = rfpSection.questions.filter(q => q.priority === 'high');
    const technicalQuestions = rfpSection.questions.filter(q => q.type === 'technical');
    const commercialQuestions = rfpSection.questions.filter(q => q.type === 'commercial');
    
    let content = `# ${sectionNumber}. ${rfpSection.title}\n\n`;
    
    // Add section overview
    content += `## Overview\n`;
    content += `This section addresses ${rfpSection.questions.length} specific requirements from your RFP, including ${highPriorityQuestions.length} high-priority items.\n\n`;
    
    // Address questions by category
    if (technicalQuestions.length > 0) {
      content += `## Technical Approach\n`;
      content += this.generateTechnicalResponses(technicalQuestions, relevantKnowledge);
      content += '\n\n';
    }
    
    if (commercialQuestions.length > 0) {
      content += `## Commercial Considerations\n`;
      content += this.generateCommercialResponses(commercialQuestions, relevantKnowledge);
      content += '\n\n';
    }
    
    // Address remaining questions
    const otherQuestions = rfpSection.questions.filter(q => q.type !== 'technical' && q.type !== 'commercial');
    if (otherQuestions.length > 0) {
      content += `## Additional Requirements\n`;
      content += this.generateGeneralResponses(otherQuestions, relevantKnowledge);
      content += '\n\n';
    }
    
    // Add relevant case studies or examples
    const caseStudies = relevantKnowledge.filter(k => k.type === 'case-study');
    if (caseStudies.length > 0) {
      content += `## Relevant Experience\n`;
      content += caseStudies[0].content.substring(0, 500) + '...\n\n';
    }
    
    return {
      id: `section-${sectionNumber}`,
      title: rfpSection.title,
      content,
      rfpQuestions: rfpSection.questions.map(q => q.question),
      knowledgeUsed: relevantKnowledge.map(k => k.title),
      confidence: this.calculateSectionConfidence(rfpSection.questions, relevantKnowledge)
    };
  }

  private generateTechnicalResponses(questions: RFPQuestion[], knowledge: KnowledgeBaseItem[]): string {
    let response = '';
    const techKnowledge = knowledge.filter(k => k.type === 'technical-spec' || k.tags.some(tag => 
      ['technical', 'technology', 'architecture', 'development'].includes(tag.toLowerCase())
    ));
    
    // Group questions by technology area
    const techAreas = this.groupQuestionsByTechnology(questions);
    
    Object.entries(techAreas).forEach(([area, areaQuestions]) => {
      response += `### ${area}\n`;
      
      areaQuestions.forEach((question, index) => {
        response += `**${index + 1}. ${question.question}**\n\n`;
        response += this.generateQuestionResponse(question, techKnowledge);
        response += '\n\n';
      });
    });
    
    // Add technical specifications from knowledge base
    if (techKnowledge.length > 0) {
      response += `### Our Technical Capabilities\n`;
      response += techKnowledge[0].content.substring(0, 400) + '...\n\n';
    }
    
    return response;
  }

  private generateCommercialResponses(questions: RFPQuestion[], knowledge: KnowledgeBaseItem[]): string {
    let response = '';
    const pricingKnowledge = knowledge.filter(k => k.type === 'pricing' || k.tags.includes('pricing'));
    
    questions.forEach((question, index) => {
      response += `**${index + 1}. ${question.question}**\n\n`;
      response += this.generateQuestionResponse(question, pricingKnowledge);
      response += '\n\n';
    });
    
    // Add pricing structure if available
    if (pricingKnowledge.length > 0) {
      response += `### Our Pricing Approach\n`;
      response += pricingKnowledge[0].content.substring(0, 400) + '...\n\n';
    }
    
    return response;
  }

  private generateGeneralResponses(questions: RFPQuestion[], knowledge: KnowledgeBaseItem[]): string {
    let response = '';
    
    questions.forEach((question, index) => {
      response += `**${index + 1}. ${question.question}**\n\n`;
      response += this.generateQuestionResponse(question, knowledge);
      response += '\n\n';
    });
    
    return response;
  }

  private generateQuestionResponse(question: RFPQuestion, knowledge: KnowledgeBaseItem[]): string {
    // Find most relevant knowledge for this question
    const relevantKnowledge = this.findMostRelevantKnowledge(question, knowledge);
    
    let response = '';
    
    // Generate response based on question type and available knowledge
    switch (question.type) {
      case 'technical':
        response = this.generateTechnicalResponse(question, relevantKnowledge);
        break;
      case 'commercial':
        response = this.generateCommercialResponse(question, relevantKnowledge);
        break;
      case 'experience':
        response = this.generateExperienceResponse(question, relevantKnowledge);
        break;
      case 'compliance':
        response = this.generateComplianceResponse(question, relevantKnowledge);
        break;
      default:
        response = this.generateGeneralResponse(question, relevantKnowledge);
    }
    
    return response;
  }

  private generateTechnicalResponse(question: RFPQuestion, knowledge: KnowledgeBaseItem[]): string {
    if (knowledge.length > 0) {
      const techKnowledge = knowledge.find(k => k.type === 'technical-spec') || knowledge[0];
      return `Our technical approach leverages industry best practices and proven technologies. ${techKnowledge.content.substring(0, 300)}...

We ensure scalability, security, and performance through:
- Modern architecture patterns and frameworks
- Comprehensive testing and quality assurance
- Continuous integration and deployment practices
- Performance monitoring and optimization`;
    }
    
    return `Our technical team brings extensive experience in modern software development practices. We follow industry standards and best practices to ensure:

- Scalable and maintainable architecture
- Robust security implementation
- High-performance solutions
- Comprehensive documentation and testing

We will provide detailed technical specifications and architecture diagrams during the project planning phase.`;
  }

  private generateCommercialResponse(question: RFPQuestion, knowledge: KnowledgeBaseItem[]): string {
    if (knowledge.length > 0) {
      const pricingKnowledge = knowledge.find(k => k.type === 'pricing') || knowledge[0];
      return `Our commercial approach is transparent and competitive. ${pricingKnowledge.content.substring(0, 300)}...

We offer flexible pricing models including:
- Fixed-price project delivery
- Time and materials engagement
- Hybrid pricing structures
- Flexible payment terms`;
    }
    
    return `We provide transparent and competitive pricing with flexible payment terms. Our commercial approach includes:

- Detailed cost breakdown and justification
- Flexible payment schedules aligned with project milestones
- Competitive rates with no hidden costs
- Value-based pricing that delivers ROI

We will provide a comprehensive commercial proposal with detailed pricing upon request.`;
  }

  private generateExperienceResponse(question: RFPQuestion, knowledge: KnowledgeBaseItem[]): string {
    const caseStudies = knowledge.filter(k => k.type === 'case-study');
    
    if (caseStudies.length > 0) {
      return `Our team has extensive experience in similar projects. ${caseStudies[0].content.substring(0, 300)}...

Key highlights of our experience:
- Successfully delivered 200+ projects
- 95% client satisfaction rate
- Average project delivery 20% faster than industry standards
- Proven track record across multiple industries`;
    }
    
    return `Our team brings extensive experience and proven expertise:

- 8+ years of software development experience
- Successfully delivered 200+ projects across various industries
- 95% client satisfaction rate with long-term partnerships
- Certified professionals with relevant industry experience
- Proven methodology and best practices

We can provide detailed case studies and client references upon request.`;
  }

  private generateComplianceResponse(question: RFPQuestion, knowledge: KnowledgeBaseItem[]): string {
    return `We maintain strict compliance with industry standards and regulations:

- ISO 27001 certified for information security management
- GDPR compliant data handling and privacy practices
- Regular security audits and compliance assessments
- Documented policies and procedures for all processes
- Staff training on compliance requirements

We will ensure all project deliverables meet your compliance requirements and provide necessary documentation and certifications.`;
  }

  private generateGeneralResponse(question: RFPQuestion, knowledge: KnowledgeBaseItem[]): string {
    if (knowledge.length > 0) {
      return `${knowledge[0].content.substring(0, 200)}...

We are committed to delivering exceptional results that meet and exceed your expectations. Our approach includes:
- Detailed project planning and management
- Regular communication and progress updates
- Quality assurance at every stage
- Comprehensive documentation and training`;
    }
    
    return `We understand the importance of this requirement and are committed to providing a comprehensive solution. Our approach includes:

- Thorough analysis and planning
- Best-in-class implementation practices
- Regular progress monitoring and reporting
- Dedicated support throughout the project lifecycle

We will provide detailed specifications and implementation plans during the project planning phase.`;
  }

  private findRelevantKnowledgeForSection(section: RFPSection): KnowledgeBaseItem[] {
    const sectionKeywords = this.extractKeywords(section.title + ' ' + section.content);
    const questionKeywords = section.questions.flatMap(q => q.keywords);
    const allKeywords = [...sectionKeywords, ...questionKeywords];
    
    return this.knowledgeBase
      .filter(item => item.isActive)
      .map(item => ({
        item,
        relevance: this.calculateRelevance(item, allKeywords)
      }))
      .filter(({ relevance }) => relevance > 0.1)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5)
      .map(({ item }) => item);
  }

  private findMostRelevantKnowledge(question: RFPQuestion, knowledge: KnowledgeBaseItem[]): KnowledgeBaseItem[] {
    return knowledge
      .map(item => ({
        item,
        relevance: this.calculateRelevance(item, question.keywords)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3)
      .map(({ item }) => item);
  }

  private calculateRelevance(item: KnowledgeBaseItem, keywords: string[]): number {
    let relevance = 0;
    const itemText = (item.title + ' ' + item.content + ' ' + item.tags.join(' ')).toLowerCase();
    
    keywords.forEach(keyword => {
      if (itemText.includes(keyword.toLowerCase())) {
        relevance += 1;
      }
    });
    
    // Boost relevance for exact matches in title or tags
    keywords.forEach(keyword => {
      if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
        relevance += 2;
      }
      if (item.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))) {
        relevance += 1.5;
      }
    });
    
    return relevance / Math.max(keywords.length, 1);
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Remove common words
    const commonWords = ['this', 'that', 'with', 'from', 'they', 'been', 'have', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could', 'other'];
    
    return [...new Set(words.filter(word => !commonWords.includes(word)))];
  }

  private groupQuestionsByTechnology(questions: RFPQuestion[]): Record<string, RFPQuestion[]> {
    const groups: Record<string, RFPQuestion[]> = {
      'Architecture & Design': [],
      'Development & Implementation': [],
      'Security & Compliance': [],
      'Performance & Scalability': [],
      'Integration & APIs': [],
      'General Technical': []
    };
    
    questions.forEach(question => {
      const lowerQuestion = question.question.toLowerCase();
      
      if (lowerQuestion.includes('architecture') || lowerQuestion.includes('design') || lowerQuestion.includes('pattern')) {
        groups['Architecture & Design'].push(question);
      } else if (lowerQuestion.includes('development') || lowerQuestion.includes('implementation') || lowerQuestion.includes('coding')) {
        groups['Development & Implementation'].push(question);
      } else if (lowerQuestion.includes('security') || lowerQuestion.includes('compliance') || lowerQuestion.includes('audit')) {
        groups['Security & Compliance'].push(question);
      } else if (lowerQuestion.includes('performance') || lowerQuestion.includes('scalability') || lowerQuestion.includes('load')) {
        groups['Performance & Scalability'].push(question);
      } else if (lowerQuestion.includes('integration') || lowerQuestion.includes('api') || lowerQuestion.includes('interface')) {
        groups['Integration & APIs'].push(question);
      } else {
        groups['General Technical'].push(question);
      }
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  }

  private calculateSectionConfidence(questions: RFPQuestion[], knowledge: KnowledgeBaseItem[]): number {
    if (questions.length === 0) return 0;
    
    let totalConfidence = 0;
    
    questions.forEach(question => {
      const relevantKnowledge = this.findMostRelevantKnowledge(question, knowledge);
      const questionConfidence = Math.min(relevantKnowledge.length * 0.3, 1.0);
      totalConfidence += questionConfidence;
    });
    
    return totalConfidence / questions.length;
  }

  private generateStandardSections(rfpAnalysis: RFPAnalysis): ProposalSection[] {
    const sections: ProposalSection[] = [];
    
    // Add project timeline section
    sections.push({
      id: 'timeline',
      title: 'Project Timeline & Milestones',
      content: this.generateTimelineSection(rfpAnalysis),
      rfpQuestions: [],
      knowledgeUsed: [],
      confidence: 0.8
    });
    
    // Add team section
    sections.push({
      id: 'team',
      title: 'Project Team & Resources',
      content: this.generateTeamSection(),
      rfpQuestions: [],
      knowledgeUsed: [],
      confidence: 0.9
    });
    
    // Add risk management section
    sections.push({
      id: 'risk-management',
      title: 'Risk Management & Mitigation',
      content: this.generateRiskSection(),
      rfpQuestions: [],
      knowledgeUsed: [],
      confidence: 0.7
    });
    
    return sections;
  }

  private generateTimelineSection(rfpAnalysis: RFPAnalysis): string {
    return `# Project Timeline & Milestones

## Project Phases

### Phase 1: Discovery & Planning (Weeks 1-2)
- Detailed requirements analysis and validation
- Technical architecture design and review
- Project plan finalization and team allocation
- Risk assessment and mitigation planning

**Deliverables:**
- Requirements specification document
- Technical architecture document
- Detailed project plan with milestones
- Risk management plan

### Phase 2: Design & Prototyping (Weeks 3-4)
- UI/UX design and user experience planning
- System design and database architecture
- API design and integration planning
- Prototype development and validation

**Deliverables:**
- UI/UX designs and style guide
- System design documentation
- API specifications
- Working prototype

### Phase 3: Development & Implementation (Weeks 5-12)
- Core system development
- Feature implementation and testing
- Integration with external systems
- Performance optimization

**Deliverables:**
- Core application functionality
- Integrated system components
- Test results and quality reports
- Performance benchmarks

### Phase 4: Testing & Quality Assurance (Weeks 13-14)
- Comprehensive system testing
- User acceptance testing
- Performance and security testing
- Bug fixes and optimization

**Deliverables:**
- Test execution reports
- UAT sign-off
- Performance test results
- Security assessment report

### Phase 5: Deployment & Go-Live (Weeks 15-16)
- Production environment setup
- Data migration and system deployment
- User training and documentation
- Go-live support and monitoring

**Deliverables:**
- Production-ready system
- User training materials
- System documentation
- Go-live support plan

## Key Milestones
- Week 2: Requirements and architecture approval
- Week 4: Design approval and prototype sign-off
- Week 8: Core functionality demonstration
- Week 12: System integration complete
- Week 14: UAT completion and sign-off
- Week 16: Production go-live

## Timeline Flexibility
We understand that project timelines may need adjustment based on changing requirements or priorities. Our agile approach allows for flexibility while maintaining quality and delivery commitments.`;
  }

  private generateTeamSection(): string {
    const teamKnowledge = this.findRelevantKnowledge(['team', 'resource', 'expertise']);
    
    return `# Project Team & Resources

## Team Structure

### Project Management
- **Project Manager**: Dedicated PM with 8+ years experience
- **Technical Lead**: Senior architect overseeing technical decisions
- **Quality Assurance Lead**: Ensuring deliverable quality and standards

### Development Team
- **Senior Full-Stack Developers**: 2-3 developers with relevant technology expertise
- **Frontend Specialists**: UI/UX focused developers for optimal user experience
- **Backend Developers**: API and database specialists
- **DevOps Engineer**: Infrastructure and deployment specialist

### Specialized Roles
- **Business Analyst**: Requirements gathering and stakeholder communication
- **Security Specialist**: Security implementation and compliance
- **Testing Engineers**: Automated and manual testing specialists

## Team Qualifications
${teamKnowledge ? teamKnowledge.content.substring(0, 400) + '...' : 'Our team members are certified professionals with relevant industry experience and proven track records in similar projects.'}

## Resource Allocation
- Full-time dedicated team for project duration
- Part-time specialists available as needed
- 24/7 support during critical phases
- Backup resources for continuity planning

## Communication Structure
- Daily standups for development team coordination
- Weekly progress reviews with stakeholders
- Bi-weekly steering committee meetings
- Monthly executive briefings

## Team Availability
Our team is committed to your project success with:
- Dedicated resources for the project duration
- Flexible working arrangements to meet project needs
- Overlap with client time zones for effective communication
- Escalation procedures for urgent issues`;
  }

  private generateRiskSection(): string {
    return `# Risk Management & Mitigation

## Risk Assessment Framework

### Technical Risks
**Risk**: Technology integration challenges
- **Probability**: Medium
- **Impact**: Medium
- **Mitigation**: Proof of concept development, early integration testing

**Risk**: Performance and scalability issues
- **Probability**: Low
- **Impact**: High
- **Mitigation**: Performance testing throughout development, scalable architecture design

**Risk**: Security vulnerabilities
- **Probability**: Low
- **Impact**: High
- **Mitigation**: Security-first development approach, regular security audits

### Project Risks
**Risk**: Scope creep and requirement changes
- **Probability**: Medium
- **Impact**: Medium
- **Mitigation**: Clear change management process, regular stakeholder communication

**Risk**: Resource availability issues
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: Backup resource planning, cross-training team members

**Risk**: Timeline delays
- **Probability**: Medium
- **Impact**: Medium
- **Mitigation**: Buffer time in schedule, agile delivery approach

### Business Risks
**Risk**: Stakeholder alignment issues
- **Probability**: Low
- **Impact**: High
- **Mitigation**: Regular communication, clear decision-making processes

**Risk**: Budget constraints
- **Probability**: Low
- **Impact**: High
- **Mitigation**: Transparent cost tracking, flexible scope management

## Risk Monitoring
- Weekly risk assessment reviews
- Risk register maintenance and updates
- Proactive communication of potential issues
- Escalation procedures for high-impact risks

## Contingency Planning
- Alternative technical approaches identified
- Backup resource allocation plans
- Emergency response procedures
- Business continuity planning

## Success Factors
- Clear communication channels
- Regular progress monitoring
- Proactive issue identification
- Collaborative problem-solving approach`;
  }

  private findRelevantKnowledge(keywords: string[]): KnowledgeBaseItem | null {
    const relevant = this.knowledgeBase
      .filter(item => item.isActive)
      .find(item => 
        keywords.some(keyword => 
          item.title.toLowerCase().includes(keyword) ||
          item.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
          item.content.toLowerCase().includes(keyword)
        )
      );
    
    return relevant || null;
  }

  private generateRecommendations(rfpAnalysis: RFPAnalysis, sections: ProposalSection[]): string[] {
    const recommendations: string[] = [];
    
    // Analyze coverage gaps
    const lowConfidenceSections = sections.filter(s => s.confidence < 0.5);
    if (lowConfidenceSections.length > 0) {
      recommendations.push(`Consider adding more specific information for: ${lowConfidenceSections.map(s => s.title).join(', ')}`);
    }
    
    // Check for high-priority questions
    const highPriorityQuestions = rfpAnalysis.sections.flatMap(s => s.questions.filter(q => q.priority === 'high'));
    if (highPriorityQuestions.length > 0) {
      recommendations.push(`Ensure detailed responses to ${highPriorityQuestions.length} high-priority requirements`);
    }
    
    // Check for compliance requirements
    const complianceQuestions = rfpAnalysis.sections.flatMap(s => s.questions.filter(q => q.type === 'compliance'));
    if (complianceQuestions.length > 0) {
      recommendations.push(`Include compliance documentation and certifications for ${complianceQuestions.length} compliance requirements`);
    }
    
    // Technical depth recommendations
    const technicalQuestions = rfpAnalysis.sections.flatMap(s => s.questions.filter(q => q.type === 'technical'));
    if (technicalQuestions.length > 10) {
      recommendations.push('Consider adding technical architecture diagrams and detailed specifications');
    }
    
    // Commercial recommendations
    const commercialQuestions = rfpAnalysis.sections.flatMap(s => s.questions.filter(q => q.type === 'commercial'));
    if (commercialQuestions.length > 0) {
      recommendations.push('Include detailed pricing breakdown and commercial terms');
    }
    
    return recommendations;
  }

  private identifyMissingInformation(rfpAnalysis: RFPAnalysis, sections: ProposalSection[]): string[] {
    const missing: string[] = [];
    
    // Check for unanswered questions
    const allAddressedQuestions = sections.flatMap(s => s.rfpQuestions);
    const allRfpQuestions = rfpAnalysis.sections.flatMap(s => s.questions.map(q => q.question));
    const unansweredQuestions = allRfpQuestions.filter(q => !allAddressedQuestions.includes(q));
    
    if (unansweredQuestions.length > 0) {
      missing.push(`${unansweredQuestions.length} questions require additional attention`);
    }
    
    // Check for missing knowledge areas
    const requiredKnowledgeTypes = ['company-info', 'case-study', 'technical-spec', 'pricing'];
    const availableTypes = [...new Set(this.knowledgeBase.map(k => k.type))];
    const missingTypes = requiredKnowledgeTypes.filter(type => !availableTypes.includes(type));
    
    if (missingTypes.length > 0) {
      missing.push(`Consider adding knowledge base content for: ${missingTypes.join(', ')}`);
    }
    
    // Check for specific requirements
    if (rfpAnalysis.technicalRequirements.length > 0 && !this.knowledgeBase.some(k => k.type === 'technical-spec')) {
      missing.push('Technical specifications and capabilities documentation');
    }
    
    if (rfpAnalysis.complianceItems.length > 0) {
      missing.push('Compliance certifications and documentation');
    }
    
    return missing;
  }
}

export const generateProposalFromRFP = (
  rfpAnalysis: RFPAnalysis,
  knowledgeBase: KnowledgeBaseItem[],
  projectTitle: string,
  clientName: string,
  additionalContext?: string
): GeneratedProposal => {
  const generator = new ProposalGenerator(knowledgeBase);
  return generator.generateProposal(rfpAnalysis, projectTitle, clientName, additionalContext);
};