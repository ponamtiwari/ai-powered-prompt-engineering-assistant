import { getLocalizedTemplate, formatLocalizedTemplate } from './localizedEnhancementTemplates';
import type { Language } from './languageDetector';
import { getLanguageByCode } from './languageDetector';
import { openaiService } from './openaiService';

const ENGLISH_LANGUAGE = getLanguageByCode('en');

// Build English-only prompts; translate via promptLanguageBuilder before display
function createLocalizedPrompt(originalPrompt: string, domain: 'email' | 'resume' | 'design' | 'code' | 'marketing' | 'hr' | 'legal' | 'finance' | 'generic'): string {
  try {
    const template = getLocalizedTemplate(domain, ENGLISH_LANGUAGE);
    return formatLocalizedTemplate(template, originalPrompt, '');
  } catch (error) {
    console.warn(`Failed to create localized template for ${domain}, falling back to simple template:`, error);
    // Fallback to simple templates
    switch (domain) {
      case 'email': return createSimpleEmailPrompt(originalPrompt);
      case 'resume': return createSimpleResumePrompt(originalPrompt);
      case 'design': return createSimpleDesignPrompt(originalPrompt);
      case 'code': return createSimpleCodePrompt(originalPrompt);
      case 'marketing': return createSimpleMarketingPrompt(originalPrompt);
      case 'hr': return createSimpleHRPrompt(originalPrompt);
      case 'legal': return createSimpleLegalPrompt(originalPrompt);
      case 'finance': return createSimpleFinancePrompt(originalPrompt);
      default: return createSimpleGenericPrompt(originalPrompt);
    }
  }
}

// Simple, direct enhancement for first-time enhancement (always English; translate afterward)
export function enhancePromptSimple(originalPrompt: string): string {
  const promptDomain = classifyPrompt(originalPrompt);
  
  // Create simple, focused enhancement without language instructions
  switch (promptDomain) {
    case 'qa':
      return createSimpleQAPrompt(originalPrompt);
    case 'finance':
      return createSimpleFinancePrompt(originalPrompt);
    case 'content':
      return createSimpleContentPrompt(originalPrompt);
    case 'marketing':
      return createSimpleMarketingPrompt(originalPrompt);
    case 'sales':
      return createSimpleSalesPrompt(originalPrompt);
    case 'hr':
      return createSimpleHRPrompt(originalPrompt);
    case 'legal':
      return createSimpleLegalPrompt(originalPrompt);
    case 'operations':
      return createSimpleOperationsPrompt(originalPrompt);
    case 'project_management':
      return createSimpleProjectManagementPrompt(originalPrompt);
    case 'customer_service':
      return createSimpleCustomerServicePrompt(originalPrompt);
    case 'training':
      return createSimpleTrainingPrompt(originalPrompt);
    case 'research':
      return createSimpleResearchPrompt(originalPrompt);
    case 'consulting':
      return createSimpleConsultingPrompt(originalPrompt);
    case 'healthcare':
      return createSimpleHealthcarePrompt(originalPrompt);
    case 'education':
      return createSimpleEducationPrompt(originalPrompt);
    case 'manufacturing':
      return createSimpleManufacturingPrompt(originalPrompt);
    case 'logistics':
      return createSimpleLogisticsPrompt(originalPrompt);
    case 'real_estate':
      return createSimpleRealEstatePrompt(originalPrompt);
    case 'insurance':
      return createSimpleInsurancePrompt(originalPrompt);
    case 'banking':
      return createSimpleBankingPrompt(originalPrompt);
    case 'accounting':
      return createSimpleAccountingPrompt(originalPrompt);
    case 'social_media':
      return createSimpleSocialMediaPrompt(originalPrompt);
    case 'seo':
      return createSimpleSEOPrompt(originalPrompt);
    case 'analytics':
      return createSimpleAnalyticsPrompt(originalPrompt);
    case 'compliance':
      return createSimpleCompliancePrompt(originalPrompt);
    case 'resume':
      return createLocalizedPrompt(originalPrompt, 'resume');
    case 'email':
      return createLocalizedPrompt(originalPrompt, 'email');
    case 'design':
      return createLocalizedPrompt(originalPrompt, 'design');
    case 'code':
      return createLocalizedPrompt(originalPrompt, 'code');
    default:
      return createSimpleGenericPrompt(originalPrompt);
  }
}

export function enhanceMore(originalPrompt: string, _previousEnhancement: string): string {
  // Create a more detailed and comprehensive version following professional rules
  const promptDomain = classifyPrompt(originalPrompt);
  
  switch (promptDomain) {
    // Core categories
    case 'resume':
    return createEnhancedResumePrompt(originalPrompt);
    case 'email':
    return createEnhancedEmailPrompt(originalPrompt);
    case 'design':
    return createEnhancedDesignPrompt(originalPrompt);
    case 'code':
    return createEnhancedCodePrompt(originalPrompt);
    
    // Professional domains
    case 'qa':
      return createQAEnhancedPrompt(originalPrompt);
    case 'finance':
      return createFinanceEnhancedPrompt(originalPrompt);
    case 'content':
      return createContentEnhancedPrompt(originalPrompt);
    case 'marketing':
      return createMarketingEnhancedPrompt(originalPrompt);
    case 'sales':
      return createSalesEnhancedPrompt(originalPrompt);
    case 'hr':
      return createHREnhancedPrompt(originalPrompt);
    case 'legal':
      return createLegalEnhancedPrompt(originalPrompt);
    case 'operations':
      return createOperationsEnhancedPrompt(originalPrompt);
    case 'project_management':
      return createProjectManagementEnhancedPrompt(originalPrompt);
    case 'customer_service':
      return createCustomerServiceEnhancedPrompt(originalPrompt);
    case 'training':
      return createTrainingEnhancedPrompt(originalPrompt);
    case 'research':
      return createResearchEnhancedPrompt(originalPrompt);
    case 'consulting':
      return createConsultingEnhancedPrompt(originalPrompt);
    case 'healthcare':
      return createHealthcareEnhancedPrompt(originalPrompt);
    case 'education':
      return createEducationEnhancedPrompt(originalPrompt);
    case 'manufacturing':
      return createManufacturingEnhancedPrompt(originalPrompt);
    case 'logistics':
      return createLogisticsEnhancedPrompt(originalPrompt);
    case 'real_estate':
      return createRealEstateEnhancedPrompt(originalPrompt);
    case 'insurance':
      return createInsuranceEnhancedPrompt(originalPrompt);
    case 'banking':
      return createBankingEnhancedPrompt(originalPrompt);
    case 'accounting':
      return createAccountingEnhancedPrompt(originalPrompt);
    case 'social_media':
      return createSocialMediaEnhancedPrompt(originalPrompt);
    case 'seo':
      return createSEOEnhancedPrompt(originalPrompt);
    case 'analytics':
      return createAnalyticsEnhancedPrompt(originalPrompt);
    case 'compliance':
      return createComplianceEnhancedPrompt(originalPrompt);
    
    default:
  return createGenericEnhancedPrompt(originalPrompt);
  }
}

// Professional domain classification system
type PromptDomain = 
  // Core categories
  | 'resume' | 'email' | 'design' | 'code' 
  // Professional domains
  | 'qa' | 'finance' | 'content' | 'marketing' | 'sales' 
  | 'hr' | 'legal' | 'operations' | 'project_management'
  | 'customer_service' | 'training' | 'research' | 'consulting'
  | 'healthcare' | 'education' | 'manufacturing' | 'logistics'
  | 'real_estate' | 'insurance' | 'banking' | 'accounting'
  | 'social_media' | 'seo' | 'analytics' | 'compliance'
  | 'generic';

function classifyPrompt(prompt: string): PromptDomain {
  const lowerPrompt = prompt.toLowerCase();
  
  // Core categories (highest priority)
  if (/\b(resume|cv|curriculum vitae)\b/i.test(prompt)) {
    return 'resume';
  }
  
  if (/\b(email|announcement|newsletter|message|communication|letter|memo|notice)\b/i.test(prompt)) {
    return 'email';
  }
  
  if (/\b(design|banner|logo|graphic|visual|layout|image|mockup|ui|ux|interface)\b/i.test(prompt)) {
    return 'design';
  }
  
  if (/\b(code|website|app|function|script|program|software|api|database|algorithm|develop)\b/i.test(prompt)) {
    return 'code';
  }
  
  // Professional domain classifications
  if (/\b(qa|quality assurance|testing|test case|bug report|test plan|quality control|defect|regression|automation testing)\b/i.test(lowerPrompt)) {
    return 'qa';
  }
  
  if (/\b(finance|financial|budget|investment|profit|loss|revenue|expense|accounting|audit|tax|fiscal|roi|cash flow|balance sheet|income statement)\b/i.test(lowerPrompt)) {
    return 'finance';
  }
  
  if (/\b(content writing|blog|article|copy|copywriting|content strategy|editorial|writing|author|journalist|content marketing|seo content)\b/i.test(lowerPrompt)) {
    return 'content';
  }
  
  if (/\b(marketing|campaign|brand|advertising|promotion|lead generation|conversion|funnel|customer acquisition|market research|digital marketing)\b/i.test(lowerPrompt)) {
    return 'marketing';
  }
  
  if (/\b(sales|selling|prospect|lead|deal|quota|pipeline|crm|customer|client|revenue|commission|closing|negotiation)\b/i.test(lowerPrompt)) {
    return 'sales';
  }
  
  if (/\b(hr|human resources|hiring|recruitment|employee|onboarding|performance|training|benefits|payroll|talent|workforce)\b/i.test(lowerPrompt)) {
    return 'hr';
  }
  
  if (/\b(legal|law|contract|compliance|regulation|policy|terms|agreement|liability|intellectual property|patent|trademark)\b/i.test(lowerPrompt)) {
    return 'legal';
  }
  
  if (/\b(operations|process|workflow|efficiency|logistics|supply chain|inventory|production|manufacturing|quality)\b/i.test(lowerPrompt)) {
    return 'operations';
  }
  
  if (/\b(project management|project|scrum|agile|sprint|milestone|timeline|deliverable|stakeholder|gantt|kanban)\b/i.test(lowerPrompt)) {
    return 'project_management';
  }
  
  if (/\b(customer service|support|help desk|ticket|customer satisfaction|service level|escalation|resolution)\b/i.test(lowerPrompt)) {
    return 'customer_service';
  }
  
  if (/\b(training|education|learning|course|curriculum|instruction|workshop|seminar|certification|skill development)\b/i.test(lowerPrompt)) {
    return 'training';
  }
  
  if (/\b(research|analysis|study|survey|data|statistics|findings|methodology|hypothesis|experiment)\b/i.test(lowerPrompt)) {
    return 'research';
  }
  
  if (/\b(consulting|advisory|strategy|recommendation|solution|best practice|optimization|improvement)\b/i.test(lowerPrompt)) {
    return 'consulting';
  }
  
  if (/\b(healthcare|medical|patient|clinical|diagnosis|treatment|pharmacy|nursing|hospital|health)\b/i.test(lowerPrompt)) {
    return 'healthcare';
  }
  
  if (/\b(education|school|student|teacher|academic|curriculum|lesson plan|assessment|learning objective)\b/i.test(lowerPrompt)) {
    return 'education';
  }
  
  if (/\b(manufacturing|production|assembly|quality control|lean|six sigma|factory|industrial|machinery)\b/i.test(lowerPrompt)) {
    return 'manufacturing';
  }
  
  if (/\b(logistics|shipping|delivery|warehouse|distribution|freight|transportation|supply chain)\b/i.test(lowerPrompt)) {
    return 'logistics';
  }
  
  if (/\b(real estate|property|listing|mortgage|rental|lease|appraisal|broker|agent|mls)\b/i.test(lowerPrompt)) {
    return 'real_estate';
  }
  
  if (/\b(insurance|policy|claim|premium|coverage|underwriting|risk assessment|actuarial)\b/i.test(lowerPrompt)) {
    return 'insurance';
  }
  
  if (/\b(banking|bank|loan|credit|deposit|mortgage|interest rate|financial services|investment banking)\b/i.test(lowerPrompt)) {
    return 'banking';
  }
  
  if (/\b(accounting|bookkeeping|ledger|journal|accounts payable|accounts receivable|depreciation|amortization)\b/i.test(lowerPrompt)) {
    return 'accounting';
  }
  
  if (/\b(social media|facebook|twitter|instagram|linkedin|tiktok|youtube|social marketing|influencer|engagement)\b/i.test(lowerPrompt)) {
    return 'social_media';
  }
  
  if (/\b(seo|search engine optimization|keyword|ranking|backlink|organic traffic|serp|google|search marketing)\b/i.test(lowerPrompt)) {
    return 'seo';
  }
  
  if (/\b(analytics|data analysis|metrics|kpi|dashboard|reporting|business intelligence|data visualization)\b/i.test(lowerPrompt)) {
    return 'analytics';
  }
  
  if (/\b(compliance|regulation|audit|governance|risk management|internal control|sox|gdpr|hipaa)\b/i.test(lowerPrompt)) {
    return 'compliance';
  }
  
  return 'generic';
}

function createEnhancedEmailPrompt(originalPrompt: string): string {
  return `You are a professional communications specialist creating effective email content that achieves specific business objectives without altering the original intent.

**TASK:** ${originalPrompt}

**CONTEXT:** Business communication that represents the organization professionally while achieving specific communication goals. This email must maintain the exact purpose and scope specified in the original request.

**REFERENCE:**
- Professional business email standards and formatting
- Clear subject line that accurately reflects the content
- Appropriate tone for the intended audience and purpose
- Structured content with logical flow and organization
- Length appropriate for the message complexity (typically 150-400 words)
- Include clear call-to-action where relevant to the original request
- Maintain professional language while being accessible

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original request without deviation
- Message clarity and recipient comprehension
- Professional presentation and appropriate tone
- Achievement of the specific communication objectives stated
- Proper email formatting and structure
- Error-free grammar, spelling, and punctuation
- Appropriate level of detail for the intended audience

**SPECIFIC REQUIREMENTS:**
- Create complete email including subject line, greeting, body, and professional closing
- Maintain the specific purpose and scope from the original prompt
- Use professional email formatting conventions
- Include all elements necessary for the specific type of email requested
- Ensure content is actionable and ready for immediate use
- Adapt tone and formality level to match the intended recipients
- Include any specific details or requirements mentioned in the original request

Create a comprehensive, professional email that fully addresses the original request with exceptional quality and precision.`;
}

function createEnhancedDesignPrompt(originalPrompt: string): string {
  return `You are a professional graphic designer with expertise in creating visually compelling designs that achieve specific business objectives without altering the original design intent.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional design work that must meet industry standards, be visually appealing, and effectively communicate the intended message to the target audience. The design must fulfill the exact specifications and purpose outlined in the original request.

**REFERENCE:**
- Modern design principles: visual hierarchy, contrast, balance, alignment, and proximity
- Industry-standard specifications, formats, and technical requirements
- Color theory principles and accessibility considerations
- Typography best practices and readability standards
- Brand consistency and professional presentation guidelines
- Responsive design considerations where applicable
- Current design trends and aesthetic standards

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original design request without deviation
- Visual impact and professional appearance that meets industry standards
- Clear communication of the intended message to target audience
- Technical accuracy and completeness of design specifications
- Implementability by other designers or design tools
- Adherence to design best practices and accessibility standards
- Appropriateness for the intended use case and medium

**SPECIFIC REQUIREMENTS:**
- Create complete design specifications including exact dimensions, measurements, and formats
- Provide comprehensive color palette with hex codes, RGB values, and usage guidelines
- Detail typography specifications including font families, sizes, weights, and spacing
- Define visual hierarchy and layout structure with precise positioning
- Include technical implementation details and file format requirements
- Specify any interactive elements, animations, or responsive behaviors if applicable
- Ensure all design elements serve the specific purpose outlined in the original request
- Provide implementation guidelines that enable accurate reproduction

Create comprehensive, professional design specifications that fully address the original request and are ready for immediate implementation.`;
}

function createEnhancedCodePrompt(originalPrompt: string): string {
  return `You are a senior software developer with expertise in writing clean, maintainable, and efficient code following industry best practices without altering the original coding requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional software development environment where code quality, maintainability, performance, and security are critical for long-term success. The solution must address the exact technical requirements specified in the original request.

**REFERENCE:**
- Clean code principles: readability, simplicity, and maintainability
- Industry-standard coding conventions and style guides
- Proper error handling, input validation, and edge case management
- Security best practices and vulnerability prevention
- Performance optimization and efficient algorithm implementation
- Comprehensive documentation and inline commenting standards
- Testing considerations and debugging capabilities
- Scalability and extensibility principles

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original coding request without deviation
- Code functionality, correctness, and reliability
- Readability, maintainability, and code organization
- Proper implementation of error handling and edge cases
- Security considerations and vulnerability prevention
- Performance efficiency and resource optimization
- Documentation quality, completeness, and clarity
- Adherence to industry best practices and coding standards

**SPECIFIC REQUIREMENTS:**
- Create complete, functional, and tested code that addresses the specific requirements
- Include comprehensive inline comments explaining complex logic and decision-making
- Implement proper error handling, input validation, and edge case management
- Follow security best practices relevant to the specific technology stack
- Provide clear documentation including usage instructions, dependencies, and setup requirements
- Structure code for maintainability with appropriate separation of concerns
- Include example usage and expected outputs where applicable
- Ensure code is production-ready and follows industry standards
- Address any specific technical constraints or requirements mentioned in the original request

Create professional, production-ready code with comprehensive documentation that fully satisfies the original technical requirements.`;
}

function createGenericEnhancedPrompt(originalPrompt: string): string {
  return `You are a professional expert providing comprehensive assistance with deep knowledge in your field without altering the original intent or scope of the request.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional work environment where high-quality, accurate, and comprehensive results are essential for success. The output must precisely address the original request while maintaining professional standards and industry best practices.

**REFERENCE:**
- Industry best practices and professional standards relevant to the specific field
- Comprehensive approach with meticulous attention to detail and accuracy
- Clear, actionable, and well-structured output that serves the intended purpose
- Professional tone and presentation appropriate for the target audience
- Evidence-based recommendations and solutions supported by expertise
- Logical organization and coherent flow of information
- Accessibility and clarity for the intended user level

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original request without deviation or scope creep
- Accuracy, completeness, and reliability of information provided
- Professional quality and presentation that meets industry standards
- Practical applicability and immediate usefulness for the intended purpose
- Clear structure, organization, and logical flow of content
- Achievement of the specific objectives stated in the original request
- Appropriateness for the intended audience and use case

**SPECIFIC REQUIREMENTS:**
- Provide comprehensive coverage of all aspects mentioned in the original request
- Maintain professional formatting, structure, and presentation standards
- Include clear, actionable recommendations and specific guidance
- Offer detailed explanations where necessary for understanding and implementation
- Create ready-to-use, practical output that requires no additional development
- Ensure content is immediately applicable to the stated purpose
- Address any specific constraints, preferences, or requirements mentioned
- Structure information in a logical, accessible, and user-friendly manner

Create comprehensive, professional content that fully addresses the original request with exceptional quality while preserving the exact intent and scope specified.`;
}

// Classification helper functions following strict professional rules
// Note: These functions are kept for backward compatibility but not actively used

function createEnhancedResumePrompt(originalPrompt: string): string {
  return `You are a professional career counselor and resume writer with expertise in modern hiring practices and ATS optimization without altering the original resume requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional job market where resumes must effectively showcase qualifications, pass through Applicant Tracking Systems (ATS), and stand out to hiring managers. The resume must address the specific career level, industry, and requirements mentioned in the original request.

**REFERENCE:** 
- Modern resume best practices: clean design, ATS-friendly formatting, and strategic keyword placement
- Industry-standard resume structure: contact information, professional summary, core competencies, work experience, education, and relevant sections
- Professional presentation standards: consistent formatting, appropriate length (1-2 pages), and error-free content
- Achievement-focused approach: quantified accomplishments, action verbs, and measurable impact statements
- Relevant skill highlighting: technical competencies, soft skills, and industry-specific expertise
- ATS optimization: proper formatting, keyword integration, and scannable structure

**EVALUATION METHOD:** 
Success measured by:
- Exact fulfillment of the original resume request specifications
- ATS compatibility and proper formatting for automated screening systems
- Clear demonstration of relevant skills, experience, and qualifications
- Professional presentation with impeccable grammar and formatting
- Strategic positioning of strengths and achievements for maximum impact
- Appropriate content organization and logical flow
- Relevance to the specific industry, role, and career level requested

**SPECIFIC REQUIREMENTS:**
- Create complete resume sections as specified in the original request
- Include professional contact information and relevant online profiles
- Develop compelling professional summary that aligns with career objectives
- Structure work experience with quantified achievements and relevant responsibilities
- Highlight technical skills, certifications, and competencies as requested
- Include education, projects, or additional sections as specified in the original prompt
- Ensure ATS-friendly formatting with consistent styling and proper hierarchy
- Use industry-appropriate keywords and terminology relevant to the target role
- Maintain professional tone and presentation throughout all sections

Create a comprehensive, professional resume that precisely addresses the original specifications and is ready for immediate job application use.`;
}

export function generateEnhancedOutput(originalPrompt: string, enhancedPrompt: string): string {
  // Generate professional sample output based on the enhanced prompt classification
  const promptDomain = classifyPrompt(originalPrompt);
  
  switch (promptDomain) {
    // Core categories
    case 'email':
    return generateEmailSample(originalPrompt, enhancedPrompt);
    case 'design':
      return generateDesignSample(originalPrompt, enhancedPrompt);
    case 'code':
      return generateCodeSample(originalPrompt, enhancedPrompt);
    case 'resume':
      return generateResumeSample(originalPrompt, enhancedPrompt);
    
    // Professional domains - generate domain-specific samples
    case 'qa':
    case 'finance':
    case 'content':
    case 'marketing':
    case 'sales':
    case 'hr':
    case 'legal':
    case 'operations':
    case 'project_management':
    case 'customer_service':
    case 'training':
    case 'research':
    case 'consulting':
    case 'healthcare':
    case 'education':
    case 'manufacturing':
    case 'logistics':
    case 'real_estate':
    case 'insurance':
    case 'banking':
    case 'accounting':
    case 'social_media':
    case 'seo':
    case 'analytics':
    case 'compliance':
      return generateDomainSpecificSample(originalPrompt, enhancedPrompt, promptDomain);
    
    default:
      return generateGenericSample(originalPrompt, enhancedPrompt);
  }
}

function isEmailRequest(prompt: string): boolean {
  return /email|message|announcement|newsletter|communication/i.test(prompt);
}

function isDesignRequest(prompt: string): boolean {
  return /design|banner|logo|graphic|visual|image|layout/i.test(prompt);
}

function isContentRequest(prompt: string): boolean {
  return /content|blog|article|copy|write|text|post/i.test(prompt);
}

function isCodeRequest(prompt: string): boolean {
  return /code|website|app|function|script|program|software/i.test(prompt);
}

function generateEmailSample(originalPrompt: string, _enhancedPrompt: string): string {
  if (/new joinee|new employee|new hire/i.test(originalPrompt)) {
    return `**Sample Email Output:**

Subject: Welcome Our New Team Member - Sarah Johnson!

Dear Team,

I'm excited to announce that Sarah Johnson will be joining our Marketing Department as a Senior Marketing Specialist, starting Monday, January 15th.

Sarah brings over 5 years of experience in digital marketing and content strategy from her previous role at TechCorp. She holds a Master's degree in Marketing and has a proven track record of driving successful campaigns that increased brand awareness by 40%.

In her new role, Sarah will be focusing on our social media strategy and content marketing initiatives. She'll be working closely with the creative team to develop engaging campaigns for our upcoming product launches.

Please join me in giving Sarah a warm welcome when she starts next week. I'm confident she'll be a valuable addition to our team.

Best regards,
[Your Name]
HR Manager`;
  }
  
  return `**Sample Email Output:**

Subject: [Professional Subject Line]

Dear [Recipient],

[Professional email content following the enhanced prompt guidelines]

Best regards,
[Your Name]`;
}

function generateDesignSample(enhancedPrompt: string): string {
  return `**Sample Design Output:**

**Visual Concept:**
Modern, professional design with clean typography and strategic color placement

**Color Palette:**
- Primary: #2563EB (Professional Blue)
- Secondary: #1E40AF (Deep Blue)  
- Accent: #F59E0B (Golden Yellow)
- Text: #1F2937 (Dark Gray)
- Background: #F8FAFC (Light Gray)

**Typography:**
- Headline: Inter Bold, 32px
- Subtext: Inter Regular, 18px
- Contact: Inter Medium, 14px

**Layout Specifications:**
- Dimensions: 1200px x 400px
- Margins: 40px all sides
- Grid: 12-column responsive layout

**Implementation:**
CSS Grid structure with responsive breakpoints and hover effects on interactive elements.`;
}

function generateGenericSample(originalPrompt: string, enhancedPrompt: string): string {
  return `**Professional Sample Output Based on Enhanced Prompt:**

**Content Structure:**
[Organized presentation addressing the specific requirements from the original request]

**Main Sections:**
- [Comprehensive coverage of all aspects mentioned in the original prompt]
- [Professional formatting and logical organization]
- [Industry-appropriate depth and detail level]
- [Actionable recommendations and specific guidance]

**Key Deliverables:**
- [Complete fulfillment of original request specifications]
- [Professional quality presentation and formatting]
- [Ready-to-use, practical output requiring no additional development]
- [Evidence-based recommendations supported by expertise]

**Quality Assurance:**
- Exact adherence to original request: "${originalPrompt}"
- Professional standards and industry best practices
- Comprehensive coverage without scope deviation
- Immediate applicability for intended purpose
- Error-free content with clear structure and flow

**Implementation Ready:** This enhanced prompt generates comprehensive, professional content that precisely fulfills your original request while maintaining exceptional quality and industry standards.`;
}

function generateCodeSample(originalPrompt: string, enhancedPrompt: string): string {
  return `**Professional Code Output Based on Enhanced Prompt:**

\`\`\`
// Complete, functional code addressing the specific requirements
// [Code structure tailored to the original request]

/**
 * [Comprehensive documentation explaining the solution]
 * @param {type} parameter - [Description of inputs]
 * @returns {type} - [Description of outputs]
 */
function [specificFunctionName](parameter) {
  // Input validation and error handling
  if (!parameter) {
    throw new Error('[Specific error message]');
  }
  
  // Main logic implementing the requested functionality
  const result = [implementationLogic];
  
  // Additional error handling for edge cases
  if (!result) {
    throw new Error('[Specific error handling]');
  }
  
  return result;
}

// [Additional functions, classes, or modules as requested]
// [Export statements and usage examples]
\`\`\`

**Documentation:**
- **Purpose:** [Exact fulfillment of original request]
- **Dependencies:** [Required libraries, frameworks, or tools]
- **Usage:** [Clear implementation instructions]
- **Testing:** [Example usage and expected outputs]

**Key Features of This Enhanced Output:**
- Exact implementation of original request: "${originalPrompt}"
- Production-ready code following industry best practices
- Comprehensive error handling and input validation
- Clear documentation and inline comments
- Security considerations and performance optimization
- Maintainable structure with proper separation of concerns

**Implementation Ready:** This enhanced prompt generates complete, functional code that precisely addresses your original requirements while meeting professional development standards.`;
}

function generateResumeSample(originalPrompt: string, enhancedPrompt: string): string {
  return `**Professional Resume Output Based on Enhanced Prompt:**

**Resume Structure:**

**[Full Name]**
[Professional contact information and relevant profiles]

**PROFESSIONAL SUMMARY**
[2-3 line summary highlighting key qualifications and career objectives]

**CORE COMPETENCIES**
[Relevant technical and professional skills organized by category]

**PROFESSIONAL EXPERIENCE**
[Work history with quantified achievements and relevant responsibilities]

**EDUCATION**
[Academic credentials and relevant certifications]

**[ADDITIONAL SECTIONS]**
[Projects, certifications, or other relevant sections as specified]

**Key Features of This Enhanced Output:**
- Exact fulfillment of original request: "${originalPrompt}"
- ATS-optimized formatting and keyword integration
- Professional presentation with consistent styling
- Quantified achievements and impact statements
- Industry-appropriate content and terminology
- Complete sections ready for immediate job application use

**Implementation Ready:** This enhanced prompt generates a comprehensive, professional resume that precisely addresses your original specifications while meeting modern hiring standards and ATS requirements.`;
}

// Domain-specific enhancement functions

function createQAEnhancedPrompt(originalPrompt: string): string {
  return `You are a senior Quality Assurance professional with expertise in software testing, quality control, and process improvement without altering the original QA requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional QA environment where quality standards, testing methodologies, and defect prevention are critical for product reliability and user satisfaction. The deliverable must address the exact QA requirements specified in the original request.

**REFERENCE:**
- Industry-standard testing methodologies: manual testing, automation, regression, performance, security testing
- Quality assurance best practices: test planning, test case design, defect tracking, and quality metrics
- Testing frameworks and tools: test automation, bug tracking systems, continuous integration
- QA documentation standards: test plans, test cases, bug reports, and quality reports
- Risk-based testing approaches and quality gates
- Compliance with testing standards (ISO, ISTQB, Agile testing practices)

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original QA request without deviation
- Comprehensive testing coverage and quality assurance approach
- Clear testing procedures and quality control measures
- Adherence to industry testing standards and best practices
- Actionable quality metrics and success criteria
- Risk mitigation and defect prevention strategies

**SPECIFIC REQUIREMENTS:**
- Create complete QA deliverables addressing the specific testing requirements
- Include detailed testing procedures, acceptance criteria, and quality gates
- Provide clear defect identification and resolution processes
- Ensure comprehensive test coverage for the specified scope
- Include quality metrics, reporting mechanisms, and success criteria
- Address risk assessment and mitigation strategies as applicable
- Follow industry-standard QA documentation and process guidelines

Create comprehensive, professional QA content that precisely addresses the original requirements while meeting industry quality standards.`;
}

function createFinanceEnhancedPrompt(originalPrompt: string): string {
  return `You are a senior Financial professional with expertise in financial analysis, planning, and reporting without altering the original financial requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional financial environment where accuracy, compliance, and strategic financial insight are critical for business decision-making. The deliverable must address the exact financial requirements specified in the original request.

**REFERENCE:**
- Financial reporting standards: GAAP, IFRS, and regulatory compliance requirements
- Financial analysis techniques: ratio analysis, trend analysis, variance analysis, and forecasting
- Budgeting and planning methodologies: strategic planning, capital budgeting, cash flow management
- Risk management principles: financial risk assessment, internal controls, and audit procedures
- Investment analysis: ROI, NPV, IRR, and portfolio management
- Tax planning and compliance considerations
- Financial modeling and data visualization best practices

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original financial request without deviation
- Accuracy and reliability of financial data and analysis
- Compliance with relevant financial standards and regulations
- Clear financial insights and actionable recommendations
- Appropriate level of detail for the intended stakeholder audience
- Professional presentation and error-free calculations

**SPECIFIC REQUIREMENTS:**
- Create complete financial deliverables addressing the specific requirements
- Include accurate financial calculations, analysis, and supporting documentation
- Provide clear financial insights, trends, and recommendations
- Ensure compliance with relevant financial standards and regulations
- Include appropriate financial metrics, ratios, and performance indicators
- Address risk factors and mitigation strategies where applicable
- Follow professional financial reporting and presentation standards

Create comprehensive, professional financial content that precisely addresses the original requirements while meeting industry financial standards.`;
}

function createContentEnhancedPrompt(originalPrompt: string): string {
  return `You are a professional Content Writer and Content Strategist with expertise in creating engaging, high-quality content without altering the original content requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional content creation environment where audience engagement, brand voice consistency, and content effectiveness are critical for achieving communication and marketing objectives. The deliverable must address the exact content requirements specified in the original request.

**REFERENCE:**
- Content writing best practices: audience research, tone of voice, storytelling techniques
- SEO content optimization: keyword research, on-page optimization, content structure
- Content strategy principles: content planning, editorial calendars, content distribution
- Brand voice and messaging consistency across all content types
- Content formatting and readability: headings, bullet points, scannable content
- Engagement techniques: compelling headlines, calls-to-action, social proof
- Content performance metrics and optimization strategies

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original content request without deviation
- Audience engagement and content effectiveness
- Brand voice consistency and messaging alignment
- SEO optimization and search visibility (where applicable)
- Content readability and accessibility
- Achievement of specified content objectives and KPIs

**SPECIFIC REQUIREMENTS:**
- Create complete content addressing the specific topic and audience requirements
- Include compelling headlines, engaging introduction, and clear content structure
- Optimize for target audience reading level and preferences
- Incorporate relevant keywords and SEO best practices where applicable
- Include appropriate calls-to-action and engagement elements
- Ensure brand voice consistency and professional tone throughout
- Provide content that is ready for immediate publication or use

Create comprehensive, professional content that precisely addresses the original requirements while meeting industry content standards and best practices.`;
}

function createMarketingEnhancedPrompt(originalPrompt: string): string {
  return `You are a senior Marketing professional with expertise in marketing strategy, campaign development, and customer acquisition without altering the original marketing requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional marketing environment where brand positioning, customer engagement, and ROI optimization are critical for business growth and market success. The deliverable must address the exact marketing requirements specified in the original request.

**REFERENCE:**
- Marketing strategy frameworks: market segmentation, targeting, positioning, and competitive analysis
- Digital marketing best practices: social media, email marketing, content marketing, PPC, SEO
- Campaign development: creative strategy, messaging, channel selection, and budget allocation
- Customer journey mapping and conversion funnel optimization
- Brand management: brand identity, voice, messaging, and consistency
- Marketing analytics: KPIs, attribution modeling, A/B testing, and performance measurement
- Customer acquisition and retention strategies

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original marketing request without deviation
- Strategic alignment with business objectives and target audience needs
- Creative effectiveness and brand consistency
- Measurable impact on marketing KPIs and business metrics
- ROI potential and cost-effectiveness
- Competitive differentiation and market positioning

**SPECIFIC REQUIREMENTS:**
- Create complete marketing deliverables addressing the specific campaign or strategy requirements
- Include clear target audience definition and customer personas
- Provide strategic rationale and competitive positioning
- Include measurable objectives, KPIs, and success metrics
- Develop compelling messaging and creative concepts
- Address budget considerations and resource requirements
- Provide implementation timeline and tactical execution plan

Create comprehensive, professional marketing content that precisely addresses the original requirements while meeting industry marketing standards and best practices.`;
}

function createSalesEnhancedPrompt(originalPrompt: string): string {
  return `You are a senior Sales professional with expertise in sales strategy, customer relationship management, and revenue generation without altering the original sales requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional sales environment where customer acquisition, relationship building, and revenue growth are critical for business success. The deliverable must address the exact sales requirements specified in the original request.

**REFERENCE:**
- Sales methodology frameworks: consultative selling, solution selling, challenger sale, SPIN selling
- Customer relationship management: lead qualification, pipeline management, customer lifecycle
- Sales process optimization: prospecting, discovery, presentation, objection handling, closing
- Sales enablement: sales tools, training materials, competitive intelligence, value propositions
- Revenue forecasting and sales analytics: conversion rates, sales metrics, performance tracking
- Customer success and retention strategies
- Negotiation techniques and contract management

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original sales request without deviation
- Alignment with sales objectives and revenue targets
- Customer-centric approach and value proposition clarity
- Effectiveness in advancing sales opportunities
- Measurable impact on sales metrics and conversion rates
- Professional presentation and persuasive communication

**SPECIFIC REQUIREMENTS:**
- Create complete sales deliverables addressing the specific sales objectives
- Include clear value propositions and customer benefit statements
- Provide strategic sales approach and tactical execution plan
- Include objection handling strategies and competitive differentiation
- Address customer pain points and solution positioning
- Provide measurable sales metrics and success criteria
- Include follow-up strategies and relationship management approaches

Create comprehensive, professional sales content that precisely addresses the original requirements while meeting industry sales standards and best practices.`;
}

function createHREnhancedPrompt(originalPrompt: string): string {
  return `You are a senior Human Resources professional with expertise in talent management, employee relations, and organizational development without altering the original HR requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional HR environment where employee engagement, compliance, and organizational effectiveness are critical for business success and employee satisfaction. The deliverable must address the exact HR requirements specified in the original request.

**REFERENCE:**
- HR best practices: recruitment, onboarding, performance management, employee development
- Employment law and compliance: labor regulations, equal opportunity, workplace safety
- Compensation and benefits: salary structures, benefits administration, total rewards
- Employee relations: conflict resolution, disciplinary procedures, employee engagement
- Organizational development: change management, culture development, leadership development
- HR analytics and metrics: turnover rates, employee satisfaction, performance indicators

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original HR request without deviation
- Compliance with employment laws and regulations
- Employee-centric approach and organizational alignment
- Effectiveness in achieving HR objectives and outcomes
- Professional presentation and clear communication
- Measurable impact on HR metrics and employee satisfaction

**SPECIFIC REQUIREMENTS:**
- Create complete HR deliverables addressing the specific people management requirements
- Ensure compliance with relevant employment laws and company policies
- Include clear processes, procedures, and implementation guidelines
- Address employee experience and organizational culture considerations
- Provide measurable HR metrics and success criteria
- Include communication strategies and stakeholder management approaches

Create comprehensive, professional HR content that precisely addresses the original requirements while meeting industry HR standards and best practices.`;
}

function createLegalEnhancedPrompt(originalPrompt: string): string {
  return `You are a senior Legal professional with expertise in corporate law, compliance, and risk management without altering the original legal requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional legal environment where regulatory compliance, risk mitigation, and legal precision are critical for organizational protection and business operations. The deliverable must address the exact legal requirements specified in the original request.

**REFERENCE:**
- Legal documentation standards: contracts, agreements, policies, and legal procedures
- Regulatory compliance: industry regulations, statutory requirements, and legal obligations
- Risk management: legal risk assessment, liability mitigation, and compliance monitoring
- Corporate governance: board governance, fiduciary duties, and corporate structure
- Intellectual property: patents, trademarks, copyrights, and trade secrets
- Litigation management: dispute resolution, legal strategy, and settlement procedures

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original legal request without deviation
- Legal accuracy and regulatory compliance
- Risk mitigation effectiveness and liability protection
- Professional legal presentation and documentation standards
- Enforceability and legal validity of deliverables
- Clear legal guidance and actionable recommendations

**SPECIFIC REQUIREMENTS:**
- Create complete legal deliverables addressing the specific legal requirements
- Ensure accuracy in legal terminology and regulatory compliance
- Include risk assessment and mitigation strategies
- Provide clear legal guidance and implementation procedures
- Address enforceability and legal validity considerations
- Include compliance monitoring and review mechanisms

Create comprehensive, professional legal content that precisely addresses the original requirements while meeting industry legal standards and regulatory compliance.`;
}

function createOperationsEnhancedPrompt(originalPrompt: string): string {
  return `You are a senior Operations professional with expertise in process optimization, operational efficiency, and performance management without altering the original operations requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional operations environment where efficiency, quality, and continuous improvement are critical for business performance and customer satisfaction. The deliverable must address the exact operational requirements specified in the original request.

**REFERENCE:**
- Operations management principles: process design, workflow optimization, and performance measurement
- Quality management systems: quality control, quality assurance, and continuous improvement
- Supply chain management: vendor management, inventory control, and logistics optimization
- Lean methodologies: waste reduction, value stream mapping, and operational excellence
- Performance metrics: KPIs, operational dashboards, and performance monitoring
- Risk management: operational risk assessment, contingency planning, and business continuity

**EVALUATION METHOD:**
Success measured by:
- Exact fulfillment of the original operations request without deviation
- Operational efficiency and process optimization effectiveness
- Quality improvement and performance enhancement
- Cost reduction and resource optimization
- Measurable impact on operational KPIs and business metrics
- Implementation feasibility and scalability

**SPECIFIC REQUIREMENTS:**
- Create complete operational deliverables addressing the specific process requirements
- Include detailed process flows, procedures, and implementation guidelines
- Provide performance metrics, monitoring mechanisms, and success criteria
- Address quality control measures and continuous improvement strategies
- Include resource requirements and implementation timelines
- Provide risk mitigation and contingency planning approaches

Create comprehensive, professional operations content that precisely addresses the original requirements while meeting industry operational excellence standards.`;
}

// Additional domain-specific enhancement functions (streamlined for efficiency)

function createProjectManagementEnhancedPrompt(originalPrompt: string): string {
  return createDomainEnhancedPrompt(originalPrompt, {
    domain: "Project Management",
    expertise: "project planning, execution, and delivery",
    context: "project environment where scope, timeline, budget, and quality management are critical for successful project outcomes",
    reference: [
      "Project management methodologies: Agile, Waterfall, Scrum, Kanban, and hybrid approaches",
      "Project planning: scope definition, work breakdown structure, scheduling, and resource allocation",
      "Risk management: risk identification, assessment, mitigation, and monitoring",
      "Stakeholder management: communication planning, expectation management, and engagement strategies",
      "Quality management: quality planning, assurance, and control processes",
      "Budget and cost management: cost estimation, budgeting, and financial tracking"
    ],
    evaluation: [
      "Exact fulfillment of original project management request",
      "Alignment with project objectives and success criteria",
      "Adherence to project management best practices and methodologies",
      "Clear project deliverables and milestone definitions",
      "Effective risk mitigation and stakeholder management strategies"
    ],
    requirements: [
      "Create complete project deliverables addressing specific project requirements",
      "Include detailed project plans, timelines, and resource allocation",
      "Provide risk management and mitigation strategies",
      "Include stakeholder communication and management plans",
      "Address quality control and project success metrics"
    ]
  });
}

function createCustomerServiceEnhancedPrompt(originalPrompt: string): string {
  return createDomainEnhancedPrompt(originalPrompt, {
    domain: "Customer Service",
    expertise: "customer experience management and service delivery",
    context: "customer service environment where customer satisfaction, problem resolution, and service quality are critical for customer retention and business success",
    reference: [
      "Customer service best practices: active listening, empathy, problem-solving, and communication",
      "Service delivery standards: response times, resolution procedures, and quality metrics",
      "Customer experience management: journey mapping, touchpoint optimization, and feedback systems",
      "Conflict resolution: de-escalation techniques, complaint handling, and service recovery",
      "Performance metrics: customer satisfaction scores, first-call resolution, and service level agreements"
    ],
    evaluation: [
      "Exact fulfillment of original customer service request",
      "Customer-centric approach and satisfaction optimization",
      "Effective problem resolution and service delivery",
      "Professional communication and relationship management",
      "Measurable improvement in customer service metrics"
    ],
    requirements: [
      "Create complete customer service deliverables addressing specific service requirements",
      "Include customer interaction protocols and service standards",
      "Provide problem resolution procedures and escalation paths",
      "Address customer feedback and continuous improvement processes",
      "Include performance metrics and quality assurance measures"
    ]
  });
}

function createSocialMediaEnhancedPrompt(originalPrompt: string): string {
  return createDomainEnhancedPrompt(originalPrompt, {
    domain: "Social Media Marketing",
    expertise: "social media strategy, content creation, and community management",
    context: "social media environment where audience engagement, brand presence, and digital marketing effectiveness are critical for brand awareness and customer acquisition",
    reference: [
      "Social media strategy: platform selection, audience targeting, content planning, and campaign development",
      "Content creation: visual design, copywriting, video production, and multimedia content",
      "Community management: audience engagement, customer service, and reputation management",
      "Social media analytics: engagement metrics, reach analysis, and ROI measurement",
      "Platform best practices: Facebook, Instagram, Twitter, LinkedIn, TikTok, and emerging platforms"
    ],
    evaluation: [
      "Exact fulfillment of original social media request",
      "Audience engagement and community growth effectiveness",
      "Brand consistency and messaging alignment",
      "Content quality and platform optimization",
      "Measurable impact on social media KPIs and business objectives"
    ],
    requirements: [
      "Create complete social media deliverables addressing specific platform and audience requirements",
      "Include content strategy, posting schedules, and engagement tactics",
      "Provide brand voice guidelines and visual identity standards",
      "Address community management and customer service protocols",
      "Include analytics tracking and performance measurement strategies"
    ]
  });
}

function createSEOEnhancedPrompt(originalPrompt: string): string {
  return createDomainEnhancedPrompt(originalPrompt, {
    domain: "Search Engine Optimization (SEO)",
    expertise: "organic search optimization and digital visibility",
    context: "digital marketing environment where search rankings, organic traffic, and online visibility are critical for business growth and customer acquisition",
    reference: [
      "SEO fundamentals: keyword research, on-page optimization, technical SEO, and link building",
      "Content optimization: search intent, content structure, meta tags, and semantic SEO",
      "Technical SEO: site speed, mobile optimization, crawlability, and indexation",
      "Analytics and measurement: search console data, ranking tracking, and traffic analysis",
      "Algorithm updates: Google updates, best practices, and penalty recovery"
    ],
    evaluation: [
      "Exact fulfillment of original SEO request",
      "Search ranking improvement potential",
      "Technical SEO compliance and best practices",
      "Content optimization effectiveness",
      "Measurable impact on organic traffic and search visibility"
    ],
    requirements: [
      "Create complete SEO deliverables addressing specific optimization requirements",
      "Include keyword research, content optimization, and technical recommendations",
      "Provide implementation guidelines and priority rankings",
      "Address measurement and tracking strategies",
      "Include competitive analysis and market positioning"
    ]
  });
}

// Generic domain enhancement helper function
function createDomainEnhancedPrompt(originalPrompt: string, config: {
  domain: string;
  expertise: string;
  context: string;
  reference: string[];
  evaluation: string[];
  requirements: string[];
}): string {
  return `You are a senior ${config.domain} professional with expertise in ${config.expertise} without altering the original requirements.

**TASK:** ${originalPrompt}

**CONTEXT:** Professional ${config.context}. The deliverable must address the exact requirements specified in the original request.

**REFERENCE:**
${config.reference.map(item => `- ${item}`).join('\n')}

**EVALUATION METHOD:**
Success measured by:
${config.evaluation.map(item => `- ${item}`).join('\n')}

**SPECIFIC REQUIREMENTS:**
${config.requirements.map(item => `- ${item}`).join('\n')}

Create comprehensive, professional ${config.domain.toLowerCase()} content that precisely addresses the original requirements while meeting industry standards and best practices.`;
}

// Streamlined functions for remaining domains
function createTrainingEnhancedPrompt(originalPrompt: string): string {
  return createDomainEnhancedPrompt(originalPrompt, {
    domain: "Training and Development",
    expertise: "instructional design and learning solutions",
    context: "learning environment where knowledge transfer, skill development, and performance improvement are critical",
    reference: ["Adult learning principles", "Instructional design methodologies", "Training delivery methods", "Assessment and evaluation"],
    evaluation: ["Learning objective achievement", "Engagement and retention", "Performance improvement", "Training effectiveness"],
    requirements: ["Create learning objectives", "Include assessment methods", "Provide implementation timeline", "Address different learning styles"]
  });
}

function createResearchEnhancedPrompt(originalPrompt: string): string {
  return createDomainEnhancedPrompt(originalPrompt, {
    domain: "Research and Analysis",
    expertise: "research methodology and data analysis",
    context: "research environment where data accuracy, methodology rigor, and actionable insights are critical",
    reference: ["Research methodologies", "Data collection techniques", "Statistical analysis", "Report writing standards"],
    evaluation: ["Research validity and reliability", "Data accuracy", "Insight actionability", "Methodology appropriateness"],
    requirements: ["Define research objectives", "Include methodology", "Provide data analysis plan", "Address limitations"]
  });
}

function createConsultingEnhancedPrompt(originalPrompt: string): string {
  return createDomainEnhancedPrompt(originalPrompt, {
    domain: "Business Consulting",
    expertise: "strategic advisory and solution development",
    context: "consulting environment where strategic insight, problem-solving, and value delivery are critical",
    reference: ["Consulting methodologies", "Problem-solving frameworks", "Strategic analysis", "Change management"],
    evaluation: ["Solution effectiveness", "Strategic alignment", "Implementation feasibility", "Value creation"],
    requirements: ["Define problem statement", "Include strategic recommendations", "Provide implementation roadmap", "Address success metrics"]
  });
}

function createHealthcareEnhancedPrompt(originalPrompt: string): string {
  return createDomainEnhancedPrompt(originalPrompt, {
    domain: "Healthcare",
    expertise: "healthcare delivery and patient care",
    context: "healthcare environment where patient safety, clinical outcomes, and regulatory compliance are critical",
    reference: ["Healthcare standards", "Patient safety protocols", "Clinical best practices", "Regulatory compliance"],
    evaluation: ["Patient outcome improvement", "Safety compliance", "Clinical effectiveness", "Regulatory adherence"],
    requirements: ["Address patient safety", "Include clinical protocols", "Ensure regulatory compliance", "Provide quality metrics"]
  });
}

function createEducationEnhancedPrompt(originalPrompt: string): string {
  return createDomainEnhancedPrompt(originalPrompt, {
    domain: "Education",
    expertise: "educational design and academic excellence",
    context: "educational environment where learning outcomes, student engagement, and academic standards are critical",
    reference: ["Educational standards", "Learning theories", "Curriculum design", "Assessment methods"],
    evaluation: ["Learning outcome achievement", "Student engagement", "Academic standards compliance", "Educational effectiveness"],
    requirements: ["Define learning objectives", "Include assessment criteria", "Address different learning needs", "Provide implementation guidelines"]
  });
}

// Create streamlined functions for remaining domains using the helper
function createManufacturingEnhancedPrompt(originalPrompt: string): string { return createDomainEnhancedPrompt(originalPrompt, { domain: "Manufacturing", expertise: "production management and quality control", context: "manufacturing environment where quality, efficiency, and safety are critical", reference: ["Manufacturing processes", "Quality control", "Safety standards", "Lean manufacturing"], evaluation: ["Production efficiency", "Quality standards", "Safety compliance", "Cost optimization"], requirements: ["Include quality metrics", "Address safety protocols", "Provide process optimization", "Include performance indicators"] }); }

function createLogisticsEnhancedPrompt(originalPrompt: string): string { return createDomainEnhancedPrompt(originalPrompt, { domain: "Logistics", expertise: "supply chain and distribution management", context: "logistics environment where efficiency, cost control, and delivery performance are critical", reference: ["Supply chain management", "Distribution strategies", "Inventory control", "Transportation optimization"], evaluation: ["Delivery performance", "Cost efficiency", "Inventory optimization", "Customer satisfaction"], requirements: ["Include delivery metrics", "Address cost optimization", "Provide inventory strategies", "Include performance tracking"] }); }

function createRealEstateEnhancedPrompt(originalPrompt: string): string { return createDomainEnhancedPrompt(originalPrompt, { domain: "Real Estate", expertise: "property management and real estate transactions", context: "real estate environment where market knowledge, client service, and transaction management are critical", reference: ["Real estate law", "Market analysis", "Property valuation", "Transaction management"], evaluation: ["Client satisfaction", "Market accuracy", "Transaction success", "Compliance adherence"], requirements: ["Include market analysis", "Address legal compliance", "Provide transaction timeline", "Include client communication plan"] }); }

function createInsuranceEnhancedPrompt(originalPrompt: string): string { return createDomainEnhancedPrompt(originalPrompt, { domain: "Insurance", expertise: "risk assessment and insurance solutions", context: "insurance environment where risk evaluation, policy accuracy, and client protection are critical", reference: ["Insurance principles", "Risk assessment", "Policy management", "Claims processing"], evaluation: ["Risk accuracy", "Policy effectiveness", "Client protection", "Regulatory compliance"], requirements: ["Include risk assessment", "Address policy details", "Provide claims procedures", "Include compliance measures"] }); }

function createBankingEnhancedPrompt(originalPrompt: string): string { return createDomainEnhancedPrompt(originalPrompt, { domain: "Banking", expertise: "financial services and banking operations", context: "banking environment where financial accuracy, regulatory compliance, and customer service are critical", reference: ["Banking regulations", "Financial products", "Risk management", "Customer service"], evaluation: ["Financial accuracy", "Regulatory compliance", "Customer satisfaction", "Risk management"], requirements: ["Include regulatory compliance", "Address financial accuracy", "Provide customer service standards", "Include risk assessment"] }); }

function createAccountingEnhancedPrompt(originalPrompt: string): string { return createDomainEnhancedPrompt(originalPrompt, { domain: "Accounting", expertise: "financial reporting and accounting practices", context: "accounting environment where accuracy, compliance, and financial integrity are critical", reference: ["Accounting principles", "Financial reporting", "Audit procedures", "Tax compliance"], evaluation: ["Financial accuracy", "Compliance adherence", "Reporting quality", "Audit readiness"], requirements: ["Include financial accuracy", "Address compliance requirements", "Provide reporting standards", "Include audit trail"] }); }

function createAnalyticsEnhancedPrompt(originalPrompt: string): string { return createDomainEnhancedPrompt(originalPrompt, { domain: "Data Analytics", expertise: "data analysis and business intelligence", context: "analytics environment where data accuracy, insight generation, and decision support are critical", reference: ["Data analysis methods", "Statistical techniques", "Visualization best practices", "Business intelligence"], evaluation: ["Data accuracy", "Insight quality", "Decision support effectiveness", "Visualization clarity"], requirements: ["Include data methodology", "Address statistical validity", "Provide visualization guidelines", "Include actionable insights"] }); }

function createComplianceEnhancedPrompt(originalPrompt: string): string { return createDomainEnhancedPrompt(originalPrompt, { domain: "Compliance", expertise: "regulatory compliance and risk management", context: "compliance environment where regulatory adherence, risk mitigation, and audit readiness are critical", reference: ["Regulatory requirements", "Compliance frameworks", "Risk assessment", "Audit procedures"], evaluation: ["Regulatory compliance", "Risk mitigation", "Audit readiness", "Policy effectiveness"], requirements: ["Include regulatory requirements", "Address compliance procedures", "Provide audit documentation", "Include monitoring mechanisms"] }); }

// Helper function for simple prompt framework
function createSimplePromptFramework(originalPrompt: string, context: string, reference: string, evaluation: string, closing: string): string {
  return `**TASK:** ${originalPrompt}

**CONTEXT:** ${context}

**REFERENCE:** ${reference}

**EVALUATION:** ${evaluation}

${closing}`;
}

// Simple enhancement functions for first-time enhancement (short and meaningful)

function createSimpleQAPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional QA environment where quality standards and testing methodologies are critical.",
    "Follow QA best practices with comprehensive test coverage, clear documentation, and quality metrics.",
    "Success measured by test coverage completeness, adherence to QA standards, and defect prevention.",
    "Create professional QA documentation that ensures product quality."
  );
}

function createSimpleFinancePrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional financial environment where accuracy, compliance, and strategic insight are critical.",
    "Follow financial standards with accurate analysis, relevant metrics, and regulatory compliance.",
    "Success measured by financial accuracy, compliance adherence, and actionable insights.",
    "Create professional financial content with clear recommendations."
  );
}

function createSimpleContentPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional content creation environment where audience engagement and brand consistency are critical.",
    "Follow content writing best practices with engaging structure, target audience optimization, and compelling CTAs.",
    "Success measured by audience engagement, brand alignment, and content effectiveness.",
    "Create professional content ready for publication."
  );
}

function createSimpleMarketingPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional marketing environment where brand positioning and customer engagement are critical.",
    "Follow marketing best practices with target audience definition, measurable KPIs, and competitive positioning.",
    "Success measured by strategic alignment, creative effectiveness, and measurable business impact.",
    "Create professional marketing strategy with clear implementation plan."
  );
}

function createSimpleSalesPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional sales environment where customer relationships and revenue generation are critical.",
    "Follow sales best practices with clear value propositions, proven methodologies, and objection handling.",
    "Success measured by customer engagement, conversion rates, and revenue impact.",
    "Create professional sales content that drives revenue growth."
  );
}

function createSimpleHRPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional HR environment where employee engagement and compliance are critical.",
    "Follow HR best practices with employment law compliance, clear processes, and employee-centric approach.",
    "Success measured by compliance adherence, employee satisfaction, and organizational effectiveness.",
    "Create professional HR content that supports people management."
  );
}

function createSimpleLegalPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional legal environment where regulatory compliance and risk mitigation are critical.",
    "Follow legal standards with accurate documentation, risk assessment, and enforceability requirements.",
    "Success measured by legal accuracy, compliance coverage, and risk protection.",
    "Create professional legal content that protects organizational interests."
  );
}

function createSimpleOperationsPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional operations environment where efficiency and quality control are critical.",
    "Follow operations best practices with process optimization, performance metrics, and quality measures.",
    "Success measured by operational efficiency, quality improvement, and measurable KPIs.",
    "Create professional operations content that improves efficiency."
  );
}

function createSimpleResumePrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional job market where ATS compatibility and achievement demonstration are critical.",
    "Follow modern resume standards with ATS optimization, quantified achievements, and professional presentation.",
    "Success measured by ATS compatibility, achievement clarity, and professional impact.",
    "Create a professional resume ready for job applications."
  );
}

function createSimpleEmailPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional business communication that represents the organization effectively.",
    "Follow business email standards with clear subject, professional tone, and proper structure.",
    "Success measured by clarity, professionalism, and achievement of communication objectives.",
    "Create a complete, professional email ready for sending."
  );
}

function createSimpleDesignPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional design environment where visual impact and brand consistency are critical.",
    "Follow modern design principles with technical specifications, color theory, and typography standards.",
    "Success measured by visual effectiveness, technical accuracy, and brand alignment.",
    "Create professional design specifications ready for implementation."
  );
}

function createSimpleCodePrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional software development environment where code quality and security are critical.",
    "Follow coding best practices with clean architecture, comprehensive documentation, and security measures.",
    "Success measured by code functionality, maintainability, and adherence to best practices.",
    "Create production-ready code with proper documentation."
  );
}

function createSimpleGenericPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional work environment where high-quality, accurate results are essential.",
    "Follow industry best practices with comprehensive approach and professional presentation.",
    "Success measured by accuracy, professional quality, and practical applicability.",
    "Create professional content that meets high-quality standards."
  );
}

// Add remaining simple functions for all domains
function createSimpleProjectManagementPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional project environment where scope, timeline, and stakeholder management are critical.",
    "Follow project management best practices with clear deliverables, risk mitigation, and communication plans.",
    "Success measured by project delivery, stakeholder satisfaction, and adherence to scope and timeline.",
    "Create professional project documentation that ensures successful delivery."
  );
}

function createSimpleCustomerServicePrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional customer service environment where satisfaction and problem resolution are critical.",
    "Follow customer service best practices with professional communication and quality service standards.",
    "Success measured by customer satisfaction, resolution effectiveness, and service quality.",
    "Create professional customer service content that enhances customer experience."
  );
}

function createSimpleTrainingPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional learning environment where knowledge transfer and skill development are critical.",
    "Follow instructional design principles with clear objectives, assessment methods, and diverse learning approaches.",
    "Success measured by learning outcomes, engagement levels, and skill acquisition.",
    "Create professional training content that achieves learning outcomes."
  );
}

function createSimpleResearchPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional research environment where methodology rigor and data accuracy are critical.",
    "Follow research standards with rigorous methodology, accurate analysis, and actionable insights.",
    "Success measured by research validity, data accuracy, and insight actionability.",
    "Create professional research content with reliable findings."
  );
}

function createSimpleConsultingPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional consulting environment where strategic insight and value delivery are critical.",
    "Follow consulting best practices with strategic recommendations, implementation roadmaps, and business alignment.",
    "Success measured by solution effectiveness, implementation feasibility, and business value creation.",
    "Create professional consulting content that creates business value."
  );
}

function createSimpleHealthcarePrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional healthcare environment where patient safety and clinical outcomes are critical.",
    "Follow healthcare standards with patient safety protocols, clinical best practices, and regulatory compliance.",
    "Success measured by patient outcomes, safety compliance, and clinical effectiveness.",
    "Create professional healthcare content that improves patient outcomes."
  );
}

function createSimpleEducationPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional educational environment where learning outcomes and student engagement are critical.",
    "Follow educational standards with clear objectives, assessment criteria, and engagement strategies.",
    "Success measured by learning achievement, student engagement, and educational effectiveness.",
    "Create professional educational content that enhances learning."
  );
}

function createSimpleManufacturingPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional manufacturing environment where quality, efficiency, and safety are critical.",
    "Follow manufacturing standards with quality control, safety protocols, and process optimization.",
    "Success measured by production efficiency, quality standards, and safety compliance.",
    "Create professional manufacturing content that improves production."
  );
}

function createSimpleLogisticsPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional logistics environment where delivery efficiency and cost control are critical.",
    "Follow supply chain best practices with delivery optimization, inventory management, and performance metrics.",
    "Success measured by delivery performance, cost efficiency, and operational effectiveness.",
    "Create professional logistics content that improves operations."
  );
}

function createSimpleRealEstatePrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional real estate environment where market knowledge and client service are critical.",
    "Follow real estate standards with market analysis, legal compliance, and transaction management.",
    "Success measured by client satisfaction, market accuracy, and transaction success.",
    "Create professional real estate content that serves client needs."
  );
}

function createSimpleInsurancePrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional insurance environment where risk assessment and client protection are critical.",
    "Follow insurance standards with risk evaluation, policy accuracy, and regulatory compliance.",
    "Success measured by risk accuracy, client protection, and regulatory adherence.",
    "Create professional insurance content that protects client interests."
  );
}

function createSimpleBankingPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional banking environment where regulatory compliance and financial accuracy are critical.",
    "Follow banking standards with regulatory compliance, financial accuracy, and customer service excellence.",
    "Success measured by compliance adherence, financial accuracy, and customer satisfaction.",
    "Create professional banking content that meets financial standards."
  );
}

function createSimpleAccountingPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional accounting environment where financial accuracy and compliance are critical.",
    "Follow accounting principles with accurate reporting, compliance requirements, and audit readiness.",
    "Success measured by financial accuracy, compliance adherence, and reporting quality.",
    "Create professional accounting content with accurate financial information."
  );
}

function createSimpleSocialMediaPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional social media environment where audience engagement and brand presence are critical.",
    "Follow social media best practices with audience targeting, content strategy, and brand consistency.",
    "Success measured by audience engagement, brand alignment, and performance metrics.",
    "Create professional social media content that drives engagement."
  );
}

function createSimpleSEOPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional SEO environment where search rankings and organic visibility are critical.",
    "Follow SEO best practices with keyword optimization, technical requirements, and content guidelines.",
    "Success measured by search ranking improvement, organic traffic, and technical compliance.",
    "Create professional SEO content that improves search rankings."
  );
}
      
function createSimpleAnalyticsPrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional analytics environment where data accuracy and insight generation are critical.",
    "Follow analytics best practices with rigorous methodology, statistical validity, and clear visualization.",
    "Success measured by data accuracy, insight quality, and decision support effectiveness.",
    "Create professional analytics content that supports decision-making."
  );
}

function createSimpleCompliancePrompt(originalPrompt: string): string {
  return createSimplePromptFramework(
    originalPrompt,
    "Professional compliance environment where regulatory adherence and risk mitigation are critical.",
    "Follow compliance frameworks with regulatory requirements, audit procedures, and risk management.",
    "Success measured by regulatory compliance, risk mitigation, and audit readiness.",
    "Create professional compliance content that ensures regulatory adherence."
  );
}

// AI Enhancement Prompt Generator for multiple enhance more clicks
export function createAIEnhancementPrompt(
  originalPrompt: string,
  currentEnhancement: string,
  clickCount: number,
  language?: Language
): string {
  const enhancementTypes = [
    "Add more specific details and technical requirements",
    "Include industry-specific best practices and standards",
    "Expand with advanced methodologies and frameworks", 
    "Add comprehensive quality assurance and validation criteria",
    "Include detailed implementation guidelines and examples"
  ];
  
  const currentType = enhancementTypes[Math.min(clickCount - 1, enhancementTypes.length - 1)];

  return `You are an expert prompt engineer. Your task is to further enhance an already enhanced prompt by making it more comprehensive and professional.

**ORIGINAL USER REQUEST:** ${originalPrompt}

**CURRENT ENHANCED PROMPT:**
${currentEnhancement}

**ENHANCEMENT FOCUS:** ${currentType}

**INSTRUCTIONS:**
1. Keep the existing TASK-CONTEXT-REFERENCE-EVALUATION structure
2. Preserve the original user request exactly as stated in the TASK section
3. ${currentType} to make the prompt more detailed and comprehensive
4. Ensure the enhancement maintains professional standards
5. Do not change the core intent or scope of the original request
6. Make the prompt more actionable and specific
${language && language.code !== 'en' ? `7. Write the ENTIRE enhanced prompt in ${language.name} (${language.nativeName}) only—not English.` : ''}

**OUTPUT:** Return only the enhanced prompt following the same structure, with more comprehensive details that would generate higher quality results.`;
}

const DOMAIN_ROLE_HINTS: Partial<Record<PromptDomain, string>> = {
  email: 'professional communications specialist',
  resume: 'career counselor and resume writer',
  design: 'professional graphic designer',
  code: 'senior software engineer',
  marketing: 'marketing strategist',
  hr: 'human resources professional',
  legal: 'legal professional',
  finance: 'financial analyst',
  content: 'professional content writer',
  generic: 'domain expert suited to the request',
};

/** Meta-prompt sent to OpenAI for first-time AI enhancement */
export function createInitialAIEnhancementPrompt(
  originalPrompt: string,
  baselineTemplate: string,
  language?: Language
): string {
  const domain = classifyPrompt(originalPrompt);
  const roleHint = DOMAIN_ROLE_HINTS[domain] ?? DOMAIN_ROLE_HINTS.generic!;

  return `You are an expert prompt engineer helping users who do not know how to write effective AI prompts.

**ORIGINAL USER REQUEST:** ${originalPrompt}

**DETECTED DOMAIN:** ${domain}
**SUGGESTED ROLE/PERSONA:** ${roleHint}

**BASELINE TEMPLATE (improve and expand):**
${baselineTemplate}

**INSTRUCTIONS:**
1. Transform the user's request into the best professional prompt using this structure:
   - Opening role/persona line (expert suited to the task and domain)
   - **TASK:** (preserve original request verbatim)
   - **CONTEXT:** (professional context for the domain)
   - **REFERENCE:** (industry standards and best practices)
   - **EVALUATION METHOD:** (clear success criteria)
   - **SPECIFIC REQUIREMENTS:** (bulleted actionable requirements)
   - Closing instruction for high-quality output
2. Infer role, audience, deliverable, and tone from the user's words—even when vague
3. Add specificity and best practices without changing core intent
4. The prompt must work with any AI assistant (ChatGPT, Claude, Gemini, etc.)
5. Do NOT answer the user's request—return only the enhanced prompt they can paste into an AI
${language && language.code !== 'en' ? `6. Write the enhanced prompt in English (translation to ${language.name} happens separately)` : ''}

**OUTPUT:** Return only the enhanced prompt following the structure above. No explanation or preamble.`;
}

/** AI-powered first enhancement; falls back to template when no API key or on error */
export async function enhancePromptWithAI(originalPrompt: string, language?: Language): Promise<string> {
  const baseline = enhancePromptSimple(originalPrompt);

  if (!openaiService.hasApiKey()) {
    return baseline;
  }

  try {
    const metaPrompt = createInitialAIEnhancementPrompt(originalPrompt, baseline, language);
    const aiEnhanced = await openaiService.enhancePromptRequest(metaPrompt);
    return aiEnhanced.trim() || baseline;
  } catch (error) {
    console.warn('AI prompt enhancement failed, using template:', error);
    return baseline;
  }
}

// Domain-specific sample generation function
function generateDomainSpecificSample(originalPrompt: string, _enhancedPrompt: string, domain: PromptDomain): string {
  const domainNames: { [key in PromptDomain]: string } = {
    resume: "Resume", email: "Email", design: "Design", code: "Code",
    qa: "Quality Assurance", finance: "Finance", content: "Content Writing", marketing: "Marketing", sales: "Sales",
    hr: "Human Resources", legal: "Legal", operations: "Operations", project_management: "Project Management",
    customer_service: "Customer Service", training: "Training", research: "Research", consulting: "Consulting",
    healthcare: "Healthcare", education: "Education", manufacturing: "Manufacturing", logistics: "Logistics",
    real_estate: "Real Estate", insurance: "Insurance", banking: "Banking", accounting: "Accounting",
    social_media: "Social Media", seo: "SEO", analytics: "Analytics", compliance: "Compliance", generic: "Generic"
  };

  const domainName = domainNames[domain] || "Professional";

  return `**Professional ${domainName} Sample Output Based on Enhanced Prompt:**

**${domainName} Deliverable Structure:**
[Complete ${domainName.toLowerCase()} content addressing the specific requirements from the original request]

**Key Components:**
- [Comprehensive coverage of all aspects mentioned in the original prompt]
- [Industry-specific standards and best practices applied]
- [Professional formatting and logical organization]
- [Actionable recommendations and specific guidance]
- [Measurable objectives and success criteria]

**Professional Standards Applied:**
- Exact adherence to original request: "${originalPrompt}"
- ${domainName} industry standards and best practices
- Professional presentation and error-free content
- Implementation-ready deliverables
- Compliance with relevant regulations and standards

**Quality Assurance:**
- Domain expertise and professional knowledge applied
- Comprehensive coverage without scope deviation
- Immediate applicability for intended ${domainName.toLowerCase()} purpose
- Measurable impact on ${domainName.toLowerCase()} objectives and KPIs

**Implementation Ready:** This enhanced prompt generates comprehensive, professional ${domainName.toLowerCase()} content that precisely fulfills your original request while meeting industry standards and professional excellence criteria.

**Sample ${domainName} Output Features:**
- [Domain-specific deliverables tailored to original requirements]
- [Professional documentation and implementation guidelines]
- [Industry-standard formatting and presentation]
- [Measurable success metrics and performance indicators]
- [Ready-to-use content requiring no additional development]`;
}