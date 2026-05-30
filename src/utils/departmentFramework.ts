export interface DepartmentFramework {
  task: string;
  context: string;
  reference: string;
  evaluation: string;
}

export interface Department {
  name: string;
  keywords: string[];
  framework: DepartmentFramework;
}

export const departments: Department[] = [
  {
    name: 'HR',
    keywords: ['hr', 'human resources', 'employee', 'hiring', 'recruitment', 'onboarding', 'joinee', 'staff', 'personnel', 'team member'],
    framework: {
      task: 'Create professional HR communication that supports employee engagement and organizational culture.',
      context: 'HR communications impact employee morale, company culture, and legal compliance. They must be inclusive, clear, and professionally appropriate.',
      reference: 'Follow HR best practices: inclusive language, clear information hierarchy, professional tone, compliance with company policies, and focus on employee experience.',
      evaluation: 'Success measured by: clarity of information, professional tone, inclusivity, legal compliance, and positive impact on employee engagement.'
    }
  },
  {
    name: 'Marketing',
    keywords: ['marketing', 'campaign', 'product launch', 'promotion', 'brand', 'customer', 'sales', 'advertising', 'social media'],
    framework: {
      task: 'Create compelling marketing content that drives customer engagement and achieves business objectives.',
      context: 'Marketing content represents the brand voice and directly impacts customer perception, engagement, and conversion rates.',
      reference: 'Apply marketing principles: clear value proposition, customer-focused messaging, strong call-to-action, brand consistency, and persuasive copywriting techniques.',
      evaluation: 'Success measured by: message clarity, brand alignment, customer appeal, conversion potential, and engagement metrics.'
    }
  },
  {
    name: 'Finance',
    keywords: ['finance', 'budget', 'financial', 'accounting', 'revenue', 'cost', 'investment', 'profit', 'expense', 'audit'],
    framework: {
      task: 'Create accurate financial communication that ensures transparency and supports informed decision-making.',
      context: 'Financial communications require precision, compliance with regulations, and clear presentation of complex data for various stakeholders.',
      reference: 'Follow financial reporting standards: accuracy, transparency, regulatory compliance, clear data presentation, and appropriate level of detail for audience.',
      evaluation: 'Success measured by: data accuracy, regulatory compliance, stakeholder understanding, clarity of financial implications, and actionable insights.'
    }
  },
  {
    name: 'Technology',
    keywords: ['tech', 'technology', 'software', 'code', 'development', 'programming', 'system', 'app', 'website', 'digital'],
    framework: {
      task: 'Create technical content that is accurate, implementable, and follows industry best practices.',
      context: 'Technical content must be precise, scalable, and maintainable while being accessible to the intended technical audience.',
      reference: 'Apply software engineering principles: clean code practices, proper documentation, security considerations, scalability, and industry standards.',
      evaluation: 'Success measured by: code quality, functionality, maintainability, security, performance, and adherence to best practices.'
    }
  },
  {
    name: 'Legal',
    keywords: ['legal', 'contract', 'compliance', 'policy', 'terms', 'agreement', 'regulation', 'law', 'liability', 'privacy'],
    framework: {
      task: 'Create legally sound content that protects organizational interests while ensuring compliance.',
      context: 'Legal content must be precise, comprehensive, and compliant with applicable laws and regulations while being understandable to stakeholders.',
      reference: 'Follow legal writing standards: precise language, comprehensive coverage, regulatory compliance, risk mitigation, and clear obligations.',
      evaluation: 'Success measured by: legal accuracy, compliance coverage, risk mitigation, clarity of obligations, and enforceability.'
    }
  },
  {
    name: 'Operations',
    keywords: ['operations', 'process', 'workflow', 'procedure', 'logistics', 'supply chain', 'efficiency', 'quality', 'management'],
    framework: {
      task: 'Create operational content that improves efficiency, quality, and standardization of processes.',
      context: 'Operational content directly impacts productivity, quality control, and organizational efficiency across teams and departments.',
      reference: 'Apply operational excellence principles: process standardization, quality control, efficiency optimization, clear procedures, and measurable outcomes.',
      evaluation: 'Success measured by: process clarity, efficiency gains, quality improvements, standardization level, and measurable operational metrics.'
    }
  }
];

export function detectDepartment(prompt: string): Department | null {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const dept of departments) {
    for (const keyword of dept.keywords) {
      if (lowerPrompt.includes(keyword)) {
        return dept;
      }
    }
  }
  
  return null;
}

export function applyDepartmentFramework(prompt: string, department: Department): string {
  const { task, context, reference, evaluation } = department.framework;
  
  return `You are a ${department.name} professional creating high-quality content.

**TASK:** ${task}

**CONTEXT:** ${context}

**REFERENCE:** ${reference}

**EVALUATION METHOD:** ${evaluation}

**USER REQUEST:** ${prompt}

Create professional, actionable content that meets ${department.name} standards and achieves the intended objective.`;
}