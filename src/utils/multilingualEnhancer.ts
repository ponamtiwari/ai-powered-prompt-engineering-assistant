import { Language, getLanguageInstructions } from './languageDetector';
import { Department } from './departmentFramework';

interface FrameworkTemplate {
  task: string;
  context: string;
  reference: string;
  evaluation: string;
}

export function enhancePromptMultilingual(prompt: string, language: Language): string {
  // Use professional classification rules first
  const promptType = classifyPromptProfessional(prompt);
  
  // Apply appropriate enhancement based on classification
  switch (promptType) {
    case 'resume':
      return createResumeEnhancedPromptMultilingual(prompt, language);
    case 'email':
      return createEmailEnhancedPromptMultilingual(prompt, language);
    case 'design':
      return createDesignEnhancedPromptMultilingual(prompt, language);
    case 'code':
      return createCodeEnhancedPromptMultilingual(prompt, language);
    default:
      return createGenericEnhancedPromptMultilingual(prompt, language);
  }
}

// Professional prompt classification following strict rules
function classifyPromptProfessional(prompt: string): 'resume' | 'email' | 'design' | 'code' | 'generic' {
  
  // Resume / CV classification
  if (/\b(resume|cv|curriculum vitae)\b/i.test(prompt)) {
    return 'resume';
  }
  
  // Email / Announcement / Newsletter / Message classification
  if (/\b(email|announcement|newsletter|message|communication|letter|memo|notice)\b/i.test(prompt)) {
    return 'email';
  }
  
  // Design / Banner / Logo / Graphic / Visual / Layout / Image classification
  if (/\b(design|banner|logo|graphic|visual|layout|image|mockup|ui|ux|interface)\b/i.test(prompt)) {
    return 'design';
  }
  
  // Code / Website / App / Function / Script / Program / Software classification
  if (/\b(code|website|app|function|script|program|software|api|database|algorithm|develop)\b/i.test(prompt)) {
    return 'code';
  }
  
  return 'generic';
}

// Legacy function - kept for backward compatibility but not actively used
function applyDepartmentFrameworkMultilingual(prompt: string, department: Department, language: Language): string {
  const languageInstruction = getLanguageInstructions(language);
  
  const frameworks: { [key: string]: FrameworkTemplate } = {
    en: {
      task: `You are a ${department.name} professional creating high-quality content.`,
      context: department.framework.context,
      reference: department.framework.reference,
      evaluation: department.framework.evaluation
    },
    hi: {
      task: `आप एक ${getDepartmentNameHindi(department.name)} पेशेवर हैं जो उच्च गुणवत्ता की सामग्री बना रहे हैं।`,
      context: `${department.name} संचार कंपनी की संस्कृति और व्यावसायिक मानकों को प्रभावित करता है।`,
      reference: `${department.name} की सर्वोत्तम प्रथाओं का पालन करें: स्पष्ट संचार, व्यावसायिक टोन, और गुणवत्ता मानक।`,
      evaluation: `सफलता को स्पष्टता, व्यावसायिकता, और उद्देश्य की प्राप्ति से मापा जाता है।`
    },
    gu: {
      task: `તમે એક ${getDepartmentNameGujarati(department.name)} વ્યાવસાયિક છો જે ઉચ્ચ ગુણવત્તાની સામગ્રી બનાવી રહ્યા છો।`,
      context: `${department.name} સંચાર કંપનીની સંસ્કૃતિ અને વ્યાવસાયિક ધોરણોને અસર કરે છે।`,
      reference: `${department.name} ની શ્રેષ્ઠ પ્રથાઓનું પાલન કરો: સ્પષ્ટ સંચાર, વ્યાવસાયિક ટોન, અને ગુણવત્તા ધોરણો।`,
      evaluation: `સફળતાને સ્પષ્ટતા, વ્યાવસાયિકતા, અને ઉદ્દેશ્યની પ્રાપ્તિથી માપવામાં આવે છે।`
    },
    es: {
      task: `Eres un profesional de ${getDepartmentNameSpanish(department.name)} creando contenido de alta calidad.`,
      context: `La comunicación de ${department.name} impacta la cultura empresarial y los estándares profesionales.`,
      reference: `Sigue las mejores prácticas de ${department.name}: comunicación clara, tono profesional y estándares de calidad.`,
      evaluation: `El éxito se mide por claridad, profesionalismo y logro de objetivos.`
    },
    fr: {
      task: `Vous êtes un professionnel de ${getDepartmentNameFrench(department.name)} créant du contenu de haute qualité.`,
      context: `La communication ${department.name} impacte la culture d'entreprise et les standards professionnels.`,
      reference: `Suivez les meilleures pratiques ${department.name}: communication claire, ton professionnel et standards de qualité.`,
      evaluation: `Le succès se mesure par la clarté, le professionnalisme et l'atteinte des objectifs.`
    },
    de: {
      task: `Sie sind ein ${getDepartmentNameGerman(department.name)}-Fachmann, der hochwertige Inhalte erstellt.`,
      context: `${department.name}-Kommunikation beeinflusst die Unternehmenskultur und professionelle Standards.`,
      reference: `Befolgen Sie ${department.name}-Best-Practices: klare Kommunikation, professioneller Ton und Qualitätsstandards.`,
      evaluation: `Der Erfolg wird durch Klarheit, Professionalität und Zielerreichung gemessen.`
    },
    it: {
      task: `Sei un professionista di ${getDepartmentNameItalian(department.name)} che crea contenuti di alta qualità.`,
      context: `La comunicazione ${department.name} influisce sulla cultura aziendale e gli standard professionali.`,
      reference: `Segui le migliori pratiche ${department.name}: comunicazione chiara, tono professionale e standard di qualità.`,
      evaluation: `Il successo si misura per chiarezza, professionalità e raggiungimento degli obiettivi.`
    },
    pt: {
      task: `Você é um profissional de ${getDepartmentNamePortuguese(department.name)} criando conteúdo de alta qualidade.`,
      context: `A comunicação ${department.name} impacta a cultura empresarial e padrões profissionais.`,
      reference: `Siga as melhores práticas ${department.name}: comunicação clara, tom profissional e padrões de qualidade.`,
      evaluation: `O sucesso é medido pela clareza, profissionalismo e alcance de objetivos.`
    },
    ru: {
      task: `Вы профессионал ${getDepartmentNameRussian(department.name)}, создающий высококачественный контент.`,
      context: `Коммуникация ${department.name} влияет на корпоративную культуру и профессиональные стандарты.`,
      reference: `Следуйте лучшим практикам ${department.name}: четкая коммуникация, профессиональный тон и стандарты качества.`,
      evaluation: `Успех измеряется ясностью, профессионализмом и достижением целей.`
    },
    ar: {
      task: `أنت محترف في ${getDepartmentNameArabic(department.name)} تقوم بإنشاء محتوى عالي الجودة.`,
      context: `تؤثر اتصالات ${department.name} على ثقافة الشركة والمعايير المهنية.`,
      reference: `اتبع أفضل ممارسات ${department.name}: تواصل واضح، نبرة مهنية ومعايير جودة.`,
      evaluation: `يُقاس النجاح بالوضوح والمهنية وتحقيق الأهداف.`
    },
    zh: {
      task: `您是一位${getDepartmentNameChinese(department.name)}专业人士，正在创建高质量内容。`,
      context: `${department.name}沟通影响企业文化和专业标准。`,
      reference: `遵循${department.name}最佳实践：清晰沟通、专业语调和质量标准。`,
      evaluation: `成功通过清晰度、专业性和目标实现来衡量。`
    },
    ja: {
      task: `あなたは高品質なコンテンツを作成する${getDepartmentNameJapanese(department.name)}の専門家です。`,
      context: `${department.name}のコミュニケーションは企業文化と専門基準に影響を与えます。`,
      reference: `${department.name}のベストプラクティスに従う：明確なコミュニケーション、プロフェッショナルなトーン、品質基準。`,
      evaluation: `成功は明確性、プロフェッショナリズム、目標達成で測定されます。`
    }
  };

  const framework = frameworks[language.code] || frameworks.en;
  
  return `${languageInstruction}

**TASK:** ${framework.task}

**CONTEXT:** ${framework.context}

**REFERENCE:** ${framework.reference}

**EVALUATION METHOD:** ${framework.evaluation}

**USER REQUEST:** ${prompt}

Create professional, actionable content that meets ${department.name} standards and achieves the intended objective.`;
}

function createGenericEnhancedPromptMultilingual(prompt: string, language: Language): string {
  const languageInstruction = getLanguageInstructions(language);
  
  const templates: { [key: string]: FrameworkTemplate } = {
    en: {
      task: "You are a professional expert providing comprehensive assistance.",
      context: "Create professional, high-quality content that meets industry standards and achieves the intended objective.",
      reference: "Apply best practices, maintain professional tone, ensure clarity and actionability.",
      evaluation: "Success measured by clarity, professionalism, actionability, and achievement of stated objectives."
    },
    hi: {
      task: "आप एक पेशेवर विशेषज्ञ हैं जो व्यापक सहायता प्रदान कर रहे हैं।",
      context: "व्यावसायिक, उच्च गुणवत्ता की सामग्री बनाएं जो उद्योग मानकों को पूरा करे।",
      reference: "सर्वोत्तम प्रथाओं को लागू करें, व्यावसायिक टोन बनाए रखें, स्पष्टता सुनिश्चित करें।",
      evaluation: "सफलता को स्पष्टता, व्यावसायिकता और उद्देश्यों की प्राप्ति से मापा जाता है।"
    },
    gu: {
      task: "તમે એક વ્યાવસાયિક નિષ્ણાત છો જે વ્યાપક સહાય પ્રદાન કરી રહ્યા છો।",
      context: "વ્યાવસાયિક, ઉચ્ચ ગુણવત્તાની સામગ્રી બનાવો જે ઉદ્યોગ ધોરણોને પૂર્ણ કરે।",
      reference: "શ્રેષ્ઠ પ્રથાઓ લાગુ કરો, વ્યાવસાયિક ટોન જાળવો, સ્પષ્ટતા સુનિશ્ચિત કરો।",
      evaluation: "સફળતાને સ્પષ્ટતા, વ્યાવસાયિકતા અને ઉદ્દેશ્યોની પ્રાપ્તિથી માપવામાં આવે છે।"
    },
    es: {
      task: "Eres un experto profesional proporcionando asistencia integral.",
      context: "Crea contenido profesional de alta calidad que cumpla con los estándares de la industria.",
      reference: "Aplica mejores prácticas, mantén un tono profesional, asegura claridad y accionabilidad.",
      evaluation: "El éxito se mide por claridad, profesionalismo y logro de objetivos establecidos."
    },
    fr: {
      task: "Vous êtes un expert professionnel fournissant une assistance complète.",
      context: "Créez du contenu professionnel de haute qualité qui répond aux normes de l'industrie.",
      reference: "Appliquez les meilleures pratiques, maintenez un ton professionnel, assurez clarté et actionnabilité.",
      evaluation: "Le succès se mesure par la clarté, le professionnalisme et l'atteinte des objectifs."
    },
    de: {
      task: "Sie sind ein professioneller Experte, der umfassende Unterstützung bietet.",
      context: "Erstellen Sie professionelle, hochwertige Inhalte, die Industriestandards erfüllen.",
      reference: "Wenden Sie bewährte Praktiken an, bewahren Sie einen professionellen Ton, sorgen Sie für Klarheit und Umsetzbarkeit.",
      evaluation: "Der Erfolg wird durch Klarheit, Professionalität und Zielerreichung gemessen."
    },
    it: {
      task: "Sei un esperto professionale che fornisce assistenza completa.",
      context: "Crea contenuti professionali di alta qualità che soddisfano gli standard del settore.",
      reference: "Applica le migliori pratiche, mantieni un tono professionale, assicura chiarezza e praticità.",
      evaluation: "Il successo si misura per chiarezza, professionalità e raggiungimento degli obiettivi."
    },
    pt: {
      task: "Você é um especialista profissional fornecendo assistência abrangente.",
      context: "Crie conteúdo profissional de alta qualidade que atenda aos padrões da indústria.",
      reference: "Aplique as melhores práticas, mantenha tom profissional, garanta clareza e praticidade.",
      evaluation: "O sucesso é medido pela clareza, profissionalismo e alcance de objetivos."
    },
    ru: {
      task: "Вы профессиональный эксперт, предоставляющий комплексную помощь.",
      context: "Создавайте профессиональный высококачественный контент, соответствующий отраслевым стандартам.",
      reference: "Применяйте лучшие практики, поддерживайте профессиональный тон, обеспечивайте ясность и практичность.",
      evaluation: "Успех измеряется ясностью, профессионализмом и достижением целей."
    },
    ar: {
      task: "أنت خبير محترف تقدم المساعدة الشاملة.",
      context: "أنشئ محتوى مهني عالي الجودة يلبي معايير الصناعة.",
      reference: "طبق أفضل الممارسات، حافظ على نبرة مهنية، اضمن الوضوح والقابلية للتطبيق.",
      evaluation: "يُقاس النجاح بالوضوح والمهنية وتحقيق الأهداف."
    },
    zh: {
      task: "您是提供全面协助的专业专家。",
      context: "创建符合行业标准的专业高质量内容。",
      reference: "应用最佳实践，保持专业语调，确保清晰度和可操作性。",
      evaluation: "成功通过清晰度、专业性和目标实现来衡量。"
    },
    ja: {
      task: "あなたは包括的な支援を提供する専門エキスパートです。",
      context: "業界標準を満たす専門的で高品質なコンテンツを作成してください。",
      reference: "ベストプラクティスを適用し、プロフェッショナルなトーンを維持し、明確性と実行可能性を確保してください。",
      evaluation: "成功は明確性、プロフェッショナリズム、目標達成で測定されます。"
    }
  };

  const template = templates[language.code] || templates.en;
  
  return `${languageInstruction}

**TASK:** ${template.task}

**CONTEXT:** ${template.context}

**REFERENCE:** ${template.reference}

**EVALUATION METHOD:** ${template.evaluation}

**USER REQUEST:** ${prompt}

Create comprehensive, professional content that fully addresses the request.`;
}

// Professional enhancement functions for each prompt type
function createEmailEnhancedPromptMultilingual(prompt: string, language: Language): string {
  const languageInstruction = getLanguageInstructions(language);
  
  const templates: { [key: string]: FrameworkTemplate } = {
    en: {
      task: "You are a professional communications specialist creating effective email content without altering the original intent.",
      context: "Business communication that represents the organization professionally while achieving specific communication goals.",
      reference: "Professional business email standards, clear subject line, appropriate tone, structured content, and error-free presentation.",
      evaluation: "Success measured by exact fulfillment of original request, message clarity, professional presentation, and achievement of communication objectives."
    },
    hi: {
      task: "आप एक पेशेवर संचार विशेषज्ञ हैं जो मूल इरादे को बदले बिना प्रभावी ईमेल सामग्री बना रहे हैं।",
      context: "व्यावसायिक संचार जो संगठन का पेशेवर प्रतिनिधित्व करता है।",
      reference: "पेशेवर व्यावसायिक ईमेल मानक, स्पष्ट विषय पंक्ति, उपयुक्त टोन।",
      evaluation: "सफलता को मूल अनुरोध की सटीक पूर्ति से मापा जाता है।"
    }
    // Add other languages as needed
  };

  const template = templates[language.code] || templates.en;
  
  return `${languageInstruction}

**TASK:** ${prompt}

**CONTEXT:** ${template.context}

**REFERENCE:** ${template.reference}

**EVALUATION METHOD:** ${template.evaluation}

**SPECIFIC REQUIREMENTS:**
- Create complete email including subject line, greeting, body, and professional closing
- Maintain the specific purpose and scope from the original prompt
- Use professional email formatting conventions
- Ensure content is actionable and ready for immediate use

Create a comprehensive, professional email that fully addresses the original request.`;
}

function createDesignEnhancedPromptMultilingual(prompt: string, language: Language): string {
  const languageInstruction = getLanguageInstructions(language);
  
  const templates: { [key: string]: FrameworkTemplate } = {
    en: {
      task: "You are a professional graphic designer creating visually compelling designs without altering the original design intent.",
      context: "Professional design work that must meet industry standards and effectively communicate the intended message.",
      reference: "Modern design principles, industry-standard specifications, color theory, typography best practices, and brand consistency.",
      evaluation: "Success measured by exact fulfillment of original design request, visual impact, technical accuracy, and adherence to design best practices."
    },
    hi: {
      task: "आप एक पेशेवर ग्राफिक डिजाइनर हैं जो मूल डिजाइन इरादे को बदले बिना आकर्षक डिजाइन बना रहे हैं।",
      context: "पेशेवर डिजाइन कार्य जो उद्योग मानकों को पूरा करता है।",
      reference: "आधुनिक डिजाइन सिद्धांत, उद्योग-मानक विनिर्देश।",
      evaluation: "सफलता को मूल डिजाइन अनुरोध की सटीक पूर्ति से मापा जाता है।"
    }
    // Add other languages as needed
  };

  const template = templates[language.code] || templates.en;
  
  return `${languageInstruction}

**TASK:** ${prompt}

**CONTEXT:** ${template.context}

**REFERENCE:** ${template.reference}

**EVALUATION METHOD:** ${template.evaluation}

**SPECIFIC REQUIREMENTS:**
- Create complete design specifications including dimensions, colors, and typography
- Provide comprehensive color palette with hex codes and usage guidelines
- Include technical implementation details and file format requirements
- Ensure all design elements serve the specific purpose outlined in the original request

Create comprehensive, professional design specifications ready for implementation.`;
}

function createCodeEnhancedPromptMultilingual(prompt: string, language: Language): string {
  const languageInstruction = getLanguageInstructions(language);
  
  const templates: { [key: string]: FrameworkTemplate } = {
    en: {
      task: "You are a senior software developer creating production-ready code without altering the original coding requirements.",
      context: "Professional software development where code quality, maintainability, performance, and security are critical.",
      reference: "Clean code principles, industry-standard conventions, proper error handling, security best practices, and comprehensive documentation.",
      evaluation: "Success measured by exact fulfillment of coding request, functionality, readability, security, and adherence to best practices."
    },
    hi: {
      task: "आप एक वरिष्ठ सॉफ्टवेयर डेवलपर हैं जो मूल कोडिंग आवश्यकताओं को बदले बिना उत्पादन-तैयार कोड बना रहे हैं।",
      context: "पेशेवर सॉफ्टवेयर विकास जहाँ कोड गुणवत्ता महत्वपूर्ण है।",
      reference: "स्वच्छ कोड सिद्धांत, उद्योग-मानक सम्मेलन।",
      evaluation: "सफलता को कोडिंग अनुरोध की सटीक पूर्ति से मापा जाता है।"
    }
    // Add other languages as needed
  };

  const template = templates[language.code] || templates.en;
  
  return `${languageInstruction}

**TASK:** ${prompt}

**CONTEXT:** ${template.context}

**REFERENCE:** ${template.reference}

**EVALUATION METHOD:** ${template.evaluation}

**SPECIFIC REQUIREMENTS:**
- Create complete, functional, and tested code addressing specific requirements
- Include comprehensive inline comments explaining complex logic
- Implement proper error handling, input validation, and edge case management
- Provide clear documentation including usage instructions and dependencies

Create professional, production-ready code with comprehensive documentation.`;
}

function createResumeEnhancedPromptMultilingual(prompt: string, language: Language): string {
  const languageInstruction = getLanguageInstructions(language);
  
  const templates: { [key: string]: FrameworkTemplate } = {
    en: {
      task: "You are a professional career counselor and resume writer creating ATS-optimized resumes without altering the original requirements.",
      context: "Professional job market where resumes must effectively showcase qualifications and pass through Applicant Tracking Systems.",
      reference: "Modern resume best practices, ATS-friendly formatting, achievement-focused approach, and industry-standard structure.",
      evaluation: "Success measured by exact fulfillment of resume specifications, ATS compatibility, and professional presentation."
    },
    hi: {
      task: "आप एक पेशेवर करियर सलाहकार और रिज्यूमे लेखक हैं जो मूल आवश्यकताओं को बदले बिना ATS-अनुकूलित रिज्यूमे बना रहे हैं।",
      context: "पेशेवर नौकरी बाजार जहाँ रिज्यूमे को योग्यताओं को प्रभावी रूप से दिखाना चाहिए।",
      reference: "आधुनिक रिज्यूमे सर्वोत्तम प्रथाएं, ATS-अनुकूल स्वरूपण।",
      evaluation: "सफलता को रिज्यूमे विनिर्देशों की सटीक पूर्ति से मापा जाता है।"
    }
    // Add other languages as needed
  };

  const template = templates[language.code] || templates.en;
  
  return `${languageInstruction}

**TASK:** ${prompt}

**CONTEXT:** ${template.context}

**REFERENCE:** ${template.reference}

**EVALUATION METHOD:** ${template.evaluation}

**SPECIFIC REQUIREMENTS:**
- Create complete resume sections as specified in the original request
- Include professional contact information and relevant online profiles
- Develop compelling professional summary aligned with career objectives
- Ensure ATS-friendly formatting with consistent styling and proper hierarchy

Create a comprehensive, professional resume ready for immediate job application use.`;
}

// Helper functions for department names in different languages
function getDepartmentNameHindi(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': 'मानव संसाधन',
    'Marketing': 'विपणन',
    'Finance': 'वित्त',
    'Technology': 'प्रौद्योगिकी',
    'Legal': 'कानूनी',
    'Operations': 'संचालन'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNameGujarati(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': 'માનવ સંસાધન',
    'Marketing': 'માર્કેટિંગ',
    'Finance': 'નાણાં',
    'Technology': 'ટેકનોલોજી',
    'Legal': 'કાનૂની',
    'Operations': 'કામગીરી'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNameSpanish(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': 'Recursos Humanos',
    'Marketing': 'Marketing',
    'Finance': 'Finanzas',
    'Technology': 'Tecnología',
    'Legal': 'Legal',
    'Operations': 'Operaciones'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNameFrench(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': 'Ressources Humaines',
    'Marketing': 'Marketing',
    'Finance': 'Finance',
    'Technology': 'Technologie',
    'Legal': 'Juridique',
    'Operations': 'Opérations'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNameGerman(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': 'Personalwesen',
    'Marketing': 'Marketing',
    'Finance': 'Finanzen',
    'Technology': 'Technologie',
    'Legal': 'Recht',
    'Operations': 'Betrieb'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNameItalian(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': 'Risorse Umane',
    'Marketing': 'Marketing',
    'Finance': 'Finanza',
    'Technology': 'Tecnologia',
    'Legal': 'Legale',
    'Operations': 'Operazioni'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNamePortuguese(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': 'Recursos Humanos',
    'Marketing': 'Marketing',
    'Finance': 'Finanças',
    'Technology': 'Tecnologia',
    'Legal': 'Jurídico',
    'Operations': 'Operações'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNameRussian(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': 'Кадры',
    'Marketing': 'Маркетинг',
    'Finance': 'Финансы',
    'Technology': 'Технологии',
    'Legal': 'Юридический',
    'Operations': 'Операции'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNameArabic(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': 'الموارد البشرية',
    'Marketing': 'التسويق',
    'Finance': 'المالية',
    'Technology': 'التكنولوجيا',
    'Legal': 'القانونية',
    'Operations': 'العمليات'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNameChinese(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': '人力资源',
    'Marketing': '市场营销',
    'Finance': '财务',
    'Technology': '技术',
    'Legal': '法务',
    'Operations': '运营'
  };
  return translations[deptName] || deptName;
}

function getDepartmentNameJapanese(deptName: string): string {
  const translations: { [key: string]: string } = {
    'HR': '人事',
    'Marketing': 'マーケティング',
    'Finance': '財務',
    'Technology': '技術',
    'Legal': '法務',
    'Operations': '運営'
  };
  return translations[deptName] || deptName;
}