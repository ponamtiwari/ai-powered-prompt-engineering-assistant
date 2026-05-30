import { Language } from './languageDetector';

export interface LocalizedTemplate {
  task: string;
  context: string;
  reference: string;
  evaluation: string;
  requirements: string[];
  closing: string;
}

export interface DomainTemplates {
  email: LocalizedTemplate;
  resume: LocalizedTemplate;
  design: LocalizedTemplate;
  code: LocalizedTemplate;
  marketing: LocalizedTemplate;
  hr: LocalizedTemplate;
  legal: LocalizedTemplate;
  finance: LocalizedTemplate;
  generic: LocalizedTemplate;
}

// Comprehensive localized templates for major languages
export const localizedEnhancementTemplates: { [key: string]: DomainTemplates } = {
  // English templates
  en: {
    email: {
      task: "You are a professional communications specialist creating effective email content without altering the original intent.",
      context: "Business communication that represents the organization professionally while achieving specific communication goals.",
      reference: "Professional business email standards, clear subject line, appropriate tone, structured content, and error-free presentation.",
      evaluation: "Success measured by exact fulfillment of original request, message clarity, professional presentation, and achievement of communication objectives.",
      requirements: [
        "Create complete email including subject line, greeting, body, and professional closing",
        "Maintain the specific purpose and scope from the original prompt",
        "Use professional email formatting conventions",
        "Ensure content is actionable and ready for immediate use"
      ],
      closing: "Create a comprehensive, professional email that fully addresses the original request."
    },
    resume: {
      task: "You are a professional career counselor and resume writer creating ATS-optimized resumes without altering the original requirements.",
      context: "Professional job market where resumes must effectively showcase qualifications and pass through Applicant Tracking Systems.",
      reference: "Modern resume best practices, ATS-friendly formatting, achievement-focused approach, and industry-standard structure.",
      evaluation: "Success measured by exact fulfillment of resume specifications, ATS compatibility, and professional presentation.",
      requirements: [
        "Create complete resume sections as specified in the original request",
        "Include professional contact information and relevant online profiles",
        "Develop compelling professional summary aligned with career objectives",
        "Ensure ATS-friendly formatting with consistent styling and proper hierarchy"
      ],
      closing: "Create a comprehensive, professional resume ready for immediate job application use."
    },
    design: {
      task: "You are a professional graphic designer creating visually compelling designs without altering the original design intent.",
      context: "Professional design work that must meet industry standards and effectively communicate the intended message.",
      reference: "Modern design principles, industry-standard specifications, color theory, typography best practices, and brand consistency.",
      evaluation: "Success measured by exact fulfillment of original design request, visual impact, technical accuracy, and adherence to design best practices.",
      requirements: [
        "Create complete design specifications including dimensions, colors, and typography",
        "Provide comprehensive color palette with hex codes and usage guidelines",
        "Include technical implementation details and file format requirements",
        "Ensure all design elements serve the specific purpose outlined in the original request"
      ],
      closing: "Create comprehensive, professional design specifications ready for implementation."
    },
    code: {
      task: "You are a senior software developer creating production-ready code without altering the original coding requirements.",
      context: "Professional software development where code quality, maintainability, performance, and security are critical.",
      reference: "Clean code principles, industry-standard conventions, proper error handling, security best practices, and comprehensive documentation.",
      evaluation: "Success measured by exact fulfillment of coding request, functionality, readability, security, and adherence to best practices.",
      requirements: [
        "Create complete, functional, and tested code addressing specific requirements",
        "Include comprehensive inline comments explaining complex logic",
        "Implement proper error handling, input validation, and edge case management",
        "Provide clear documentation including usage instructions and dependencies"
      ],
      closing: "Create professional, production-ready code with comprehensive documentation."
    },
    marketing: {
      task: "You are a senior marketing professional creating strategic marketing content without altering the original marketing requirements.",
      context: "Professional marketing environment where brand positioning, customer engagement, and ROI optimization are critical.",
      reference: "Marketing strategy frameworks, digital marketing best practices, customer journey mapping, and performance measurement.",
      evaluation: "Success measured by strategic alignment, creative effectiveness, measurable impact, and competitive differentiation.",
      requirements: [
        "Create complete marketing deliverables addressing specific campaign requirements",
        "Include clear target audience definition and customer personas",
        "Provide strategic rationale and competitive positioning",
        "Include measurable objectives, KPIs, and success metrics"
      ],
      closing: "Create comprehensive, professional marketing content that drives business results."
    },
    hr: {
      task: "You are a senior Human Resources professional creating effective HR content without altering the original requirements.",
      context: "Professional HR environment where employee engagement, compliance, and organizational effectiveness are critical.",
      reference: "HR best practices, employment law compliance, employee relations, and organizational development principles.",
      evaluation: "Success measured by compliance adherence, employee-centric approach, and organizational alignment.",
      requirements: [
        "Create complete HR deliverables addressing specific people management requirements",
        "Ensure compliance with relevant employment laws and company policies",
        "Include clear processes, procedures, and implementation guidelines",
        "Address employee experience and organizational culture considerations"
      ],
      closing: "Create comprehensive, professional HR content that supports people management excellence."
    },
    legal: {
      task: "You are a senior legal professional creating legally sound content without altering the original requirements.",
      context: "Professional legal environment where regulatory compliance, risk mitigation, and legal precision are critical.",
      reference: "Legal documentation standards, regulatory compliance frameworks, risk management principles, and enforceability requirements.",
      evaluation: "Success measured by legal accuracy, compliance coverage, risk mitigation effectiveness, and professional presentation.",
      requirements: [
        "Create complete legal deliverables addressing specific legal requirements",
        "Ensure accuracy in legal terminology and regulatory compliance",
        "Include risk assessment and mitigation strategies",
        "Address enforceability and legal validity considerations"
      ],
      closing: "Create comprehensive, professional legal content that protects organizational interests."
    },
    finance: {
      task: "You are a senior financial professional creating accurate financial content without altering the original requirements.",
      context: "Professional financial environment where accuracy, compliance, and strategic financial insight are critical.",
      reference: "Financial reporting standards, analysis techniques, budgeting methodologies, and regulatory compliance requirements.",
      evaluation: "Success measured by financial accuracy, compliance adherence, stakeholder understanding, and actionable insights.",
      requirements: [
        "Create complete financial deliverables addressing specific requirements",
        "Include accurate financial calculations, analysis, and supporting documentation",
        "Provide clear financial insights, trends, and recommendations",
        "Ensure compliance with relevant financial standards and regulations"
      ],
      closing: "Create comprehensive, professional financial content that supports informed decision-making."
    },
    generic: {
      task: "You are a professional expert providing comprehensive assistance without altering the original intent.",
      context: "Professional work environment where high-quality, accurate results are essential for success.",
      reference: "Industry best practices, comprehensive approach, professional presentation, and evidence-based recommendations.",
      evaluation: "Success measured by accuracy, completeness, professional quality, and practical applicability.",
      requirements: [
        "Provide comprehensive coverage of all aspects mentioned in the original request",
        "Maintain professional formatting, structure, and presentation standards",
        "Include clear, actionable recommendations and specific guidance",
        "Create ready-to-use, practical output that requires no additional development"
      ],
      closing: "Create comprehensive, professional content that fully addresses the original request with exceptional quality."
    }
  },

  // Spanish templates
  es: {
    email: {
      task: "Eres un especialista en comunicaciones profesionales creando contenido de correo efectivo sin alterar la intención original.",
      context: "Comunicación empresarial que representa a la organización profesionalmente mientras logra objetivos de comunicación específicos.",
      reference: "Estándares profesionales de correo empresarial, línea de asunto clara, tono apropiado, contenido estructurado y presentación sin errores.",
      evaluation: "Éxito medido por el cumplimiento exacto de la solicitud original, claridad del mensaje, presentación profesional y logro de objetivos.",
      requirements: [
        "Crear correo completo incluyendo línea de asunto, saludo, cuerpo y cierre profesional",
        "Mantener el propósito específico y alcance del prompt original",
        "Usar convenciones profesionales de formato de correo",
        "Asegurar que el contenido sea accionable y listo para uso inmediato"
      ],
      closing: "Crear un correo electrónico integral y profesional que aborde completamente la solicitud original."
    },
    resume: {
      task: "Eres un consejero profesional de carrera y escritor de currículums creando currículums optimizados para ATS sin alterar los requisitos originales.",
      context: "Mercado laboral profesional donde los currículums deben mostrar efectivamente las calificaciones y pasar por Sistemas de Seguimiento de Candidatos.",
      reference: "Mejores prácticas modernas de currículum, formato amigable para ATS, enfoque en logros y estructura estándar de la industria.",
      evaluation: "Éxito medido por el cumplimiento exacto de especificaciones del currículum, compatibilidad ATS y presentación profesional.",
      requirements: [
        "Crear secciones completas del currículum según se especifica en la solicitud original",
        "Incluir información de contacto profesional y perfiles en línea relevantes",
        "Desarrollar resumen profesional convincente alineado con objetivos de carrera",
        "Asegurar formato amigable para ATS con estilo consistente y jerarquía apropiada"
      ],
      closing: "Crear un currículum integral y profesional listo para uso inmediato en solicitudes de empleo."
    },
    design: {
      task: "Eres un diseñador gráfico profesional creando diseños visualmente atractivos sin alterar la intención de diseño original.",
      context: "Trabajo de diseño profesional que debe cumplir estándares de la industria y comunicar efectivamente el mensaje deseado.",
      reference: "Principios de diseño moderno, especificaciones estándar de la industria, teoría del color, mejores prácticas tipográficas y consistencia de marca.",
      evaluation: "Éxito medido por el cumplimiento exacto de la solicitud de diseño original, impacto visual, precisión técnica y adherencia a mejores prácticas.",
      requirements: [
        "Crear especificaciones completas de diseño incluyendo dimensiones, colores y tipografía",
        "Proporcionar paleta de colores integral con códigos hex y guías de uso",
        "Incluir detalles técnicos de implementación y requisitos de formato de archivo",
        "Asegurar que todos los elementos de diseño sirvan al propósito específico del pedido original"
      ],
      closing: "Crear especificaciones de diseño integrales y profesionales listas para implementación."
    },
    code: {
      task: "Eres un desarrollador de software senior creando código listo para producción sin alterar los requisitos de codificación originales.",
      context: "Desarrollo de software profesional donde la calidad del código, mantenibilidad, rendimiento y seguridad son críticos.",
      reference: "Principios de código limpio, convenciones estándar de la industria, manejo adecuado de errores, mejores prácticas de seguridad y documentación integral.",
      evaluation: "Éxito medido por el cumplimiento exacto de la solicitud de codificación, funcionalidad, legibilidad, seguridad y adherencia a mejores prácticas.",
      requirements: [
        "Crear código completo, funcional y probado que aborde requisitos específicos",
        "Incluir comentarios integrales en línea explicando lógica compleja",
        "Implementar manejo adecuado de errores, validación de entrada y gestión de casos extremos",
        "Proporcionar documentación clara incluyendo instrucciones de uso y dependencias"
      ],
      closing: "Crear código profesional listo para producción con documentación integral."
    },
    marketing: {
      task: "Eres un profesional de marketing senior creando contenido de marketing estratégico sin alterar los requisitos de marketing originales.",
      context: "Entorno de marketing profesional donde el posicionamiento de marca, participación del cliente y optimización de ROI son críticos.",
      reference: "Marcos de estrategia de marketing, mejores prácticas de marketing digital, mapeo del viaje del cliente y medición de rendimiento.",
      evaluation: "Éxito medido por alineación estratégica, efectividad creativa, impacto medible y diferenciación competitiva.",
      requirements: [
        "Crear entregables completos de marketing abordando requisitos específicos de campaña",
        "Incluir definición clara de audiencia objetivo y personas de cliente",
        "Proporcionar justificación estratégica y posicionamiento competitivo",
        "Incluir objetivos medibles, KPIs y métricas de éxito"
      ],
      closing: "Crear contenido de marketing integral y profesional que genere resultados empresariales."
    },
    hr: {
      task: "Eres un profesional senior de Recursos Humanos creando contenido de RH efectivo sin alterar los requisitos originales.",
      context: "Entorno profesional de RH donde la participación de empleados, cumplimiento y efectividad organizacional son críticos.",
      reference: "Mejores prácticas de RH, cumplimiento de leyes laborales, relaciones con empleados y principios de desarrollo organizacional.",
      evaluation: "Éxito medido por adherencia al cumplimiento, enfoque centrado en el empleado y alineación organizacional.",
      requirements: [
        "Crear entregables completos de RH abordando requisitos específicos de gestión de personas",
        "Asegurar cumplimiento con leyes laborales relevantes y políticas de la empresa",
        "Incluir procesos claros, procedimientos y guías de implementación",
        "Abordar experiencia del empleado y consideraciones de cultura organizacional"
      ],
      closing: "Crear contenido de RH integral y profesional que apoye la excelencia en gestión de personas."
    },
    legal: {
      task: "Eres un profesional legal senior creando contenido legalmente sólido sin alterar los requisitos originales.",
      context: "Entorno legal profesional donde el cumplimiento regulatorio, mitigación de riesgos y precisión legal son críticos.",
      reference: "Estándares de documentación legal, marcos de cumplimiento regulatorio, principios de gestión de riesgos y requisitos de ejecutabilidad.",
      evaluation: "Éxito medido por precisión legal, cobertura de cumplimiento, efectividad de mitigación de riesgos y presentación profesional.",
      requirements: [
        "Crear entregables legales completos abordando requisitos legales específicos",
        "Asegurar precisión en terminología legal y cumplimiento regulatorio",
        "Incluir evaluación de riesgos y estrategias de mitigación",
        "Abordar consideraciones de ejecutabilidad y validez legal"
      ],
      closing: "Crear contenido legal integral y profesional que proteja los intereses organizacionales."
    },
    finance: {
      task: "Eres un profesional financiero senior creando contenido financiero preciso sin alterar los requisitos originales.",
      context: "Entorno financiero profesional donde la precisión, cumplimiento y perspicacia financiera estratégica son críticos.",
      reference: "Estándares de reportes financieros, técnicas de análisis, metodologías de presupuesto y requisitos de cumplimiento regulatorio.",
      evaluation: "Éxito medido por precisión financiera, adherencia al cumplimiento, comprensión de stakeholders y perspicacias accionables.",
      requirements: [
        "Crear entregables financieros completos abordando requisitos específicos",
        "Incluir cálculos financieros precisos, análisis y documentación de soporte",
        "Proporcionar perspicacias financieras claras, tendencias y recomendaciones",
        "Asegurar cumplimiento con estándares financieros y regulaciones relevantes"
      ],
      closing: "Crear contenido financiero integral y profesional que apoye la toma de decisiones informada."
    },
    generic: {
      task: "Eres un experto profesional proporcionando asistencia integral sin alterar la intención original.",
      context: "Entorno de trabajo profesional donde resultados de alta calidad y precisos son esenciales para el éxito.",
      reference: "Mejores prácticas de la industria, enfoque integral, presentación profesional y recomendaciones basadas en evidencia.",
      evaluation: "Éxito medido por precisión, completitud, calidad profesional y aplicabilidad práctica.",
      requirements: [
        "Proporcionar cobertura integral de todos los aspectos mencionados en la solicitud original",
        "Mantener formato profesional, estructura y estándares de presentación",
        "Incluir recomendaciones claras y accionables y orientación específica",
        "Crear salida práctica y lista para usar que no requiera desarrollo adicional"
      ],
      closing: "Crear contenido integral y profesional que aborde completamente la solicitud original con calidad excepcional."
    }
  },

  // French templates
  fr: {
    email: {
      task: "Vous êtes un spécialiste en communications professionnelles créant du contenu de courriel efficace sans altérer l'intention originale.",
      context: "Communication d'entreprise qui représente l'organisation professionnellement tout en atteignant des objectifs de communication spécifiques.",
      reference: "Standards professionnels de courriel d'entreprise, ligne d'objet claire, ton approprié, contenu structuré et présentation sans erreur.",
      evaluation: "Succès mesuré par l'accomplissement exact de la demande originale, clarté du message, présentation professionnelle et atteinte des objectifs.",
      requirements: [
        "Créer un courriel complet incluant ligne d'objet, salutation, corps et fermeture professionnelle",
        "Maintenir le but spécifique et la portée du prompt original",
        "Utiliser les conventions professionnelles de formatage de courriel",
        "S'assurer que le contenu soit actionnable et prêt pour utilisation immédiate"
      ],
      closing: "Créer un courriel professionnel et complet qui répond entièrement à la demande originale."
    },
    resume: {
      task: "Vous êtes un conseiller professionnel en carrière et rédacteur de CV créant des CV optimisés pour ATS sans altérer les exigences originales.",
      context: "Marché du travail professionnel où les CV doivent efficacement présenter les qualifications et passer par les Systèmes de Suivi des Candidats.",
      reference: "Meilleures pratiques modernes de CV, formatage compatible ATS, approche axée sur les réalisations et structure standard de l'industrie.",
      evaluation: "Succès mesuré par l'accomplissement exact des spécifications du CV, compatibilité ATS et présentation professionnelle.",
      requirements: [
        "Créer des sections complètes de CV selon spécifié dans la demande originale",
        "Inclure informations de contact professionnelles et profils en ligne pertinents",
        "Développer un résumé professionnel convaincant aligné avec les objectifs de carrière",
        "Assurer un formatage compatible ATS avec style cohérent et hiérarchie appropriée"
      ],
      closing: "Créer un CV professionnel et complet prêt pour utilisation immédiate dans les candidatures d'emploi."
    },
    design: {
      task: "Vous êtes un designer graphique professionnel créant des designs visuellement attrayants sans altérer l'intention de design originale.",
      context: "Travail de design professionnel qui doit répondre aux standards de l'industrie et communiquer efficacement le message voulu.",
      reference: "Principes de design moderne, spécifications standard de l'industrie, théorie des couleurs, meilleures pratiques typographiques et cohérence de marque.",
      evaluation: "Succès mesuré par l'accomplissement exact de la demande de design originale, impact visuel, précision technique et adhérence aux meilleures pratiques.",
      requirements: [
        "Créer des spécifications complètes de design incluant dimensions, couleurs et typographie",
        "Fournir une palette de couleurs complète avec codes hex et guides d'utilisation",
        "Inclure détails techniques d'implémentation et exigences de format de fichier",
        "S'assurer que tous les éléments de design servent le but spécifique de la demande originale"
      ],
      closing: "Créer des spécifications de design professionnelles et complètes prêtes pour implémentation."
    },
    code: {
      task: "Vous êtes un développeur logiciel senior créant du code prêt pour production sans altérer les exigences de codage originales.",
      context: "Développement logiciel professionnel où la qualité du code, maintenabilité, performance et sécurité sont critiques.",
      reference: "Principes de code propre, conventions standard de l'industrie, gestion appropriée des erreurs, meilleures pratiques de sécurité et documentation complète.",
      evaluation: "Succès mesuré par l'accomplissement exact de la demande de codage, fonctionnalité, lisibilité, sécurité et adhérence aux meilleures pratiques.",
      requirements: [
        "Créer du code complet, fonctionnel et testé répondant aux exigences spécifiques",
        "Inclure des commentaires en ligne complets expliquant la logique complexe",
        "Implémenter une gestion appropriée des erreurs, validation d'entrée et gestion des cas limites",
        "Fournir une documentation claire incluant instructions d'utilisation et dépendances"
      ],
      closing: "Créer du code professionnel prêt pour production avec documentation complète."
    },
    marketing: {
      task: "Vous êtes un professionnel marketing senior créant du contenu marketing stratégique sans altérer les exigences marketing originales.",
      context: "Environnement marketing professionnel où le positionnement de marque, engagement client et optimisation ROI sont critiques.",
      reference: "Cadres de stratégie marketing, meilleures pratiques de marketing digital, cartographie du parcours client et mesure de performance.",
      evaluation: "Succès mesuré par l'alignement stratégique, efficacité créative, impact mesurable et différenciation compétitive.",
      requirements: [
        "Créer des livrables marketing complets répondant aux exigences spécifiques de campagne",
        "Inclure une définition claire de l'audience cible et personas client",
        "Fournir une justification stratégique et positionnement compétitif",
        "Inclure des objectifs mesurables, KPIs et métriques de succès"
      ],
      closing: "Créer du contenu marketing professionnel et complet qui génère des résultats d'entreprise."
    },
    hr: {
      task: "Vous êtes un professionnel senior en Ressources Humaines créant du contenu RH efficace sans altérer les exigences originales.",
      context: "Environnement RH professionnel où l'engagement des employés, conformité et efficacité organisationnelle sont critiques.",
      reference: "Meilleures pratiques RH, conformité aux lois du travail, relations employés et principes de développement organisationnel.",
      evaluation: "Succès mesuré par l'adhérence à la conformité, approche centrée sur l'employé et alignement organisationnel.",
      requirements: [
        "Créer des livrables RH complets répondant aux exigences spécifiques de gestion des personnes",
        "Assurer la conformité avec les lois du travail pertinentes et politiques d'entreprise",
        "Inclure des processus clairs, procédures et guides d'implémentation",
        "Aborder l'expérience employé et considérations de culture organisationnelle"
      ],
      closing: "Créer du contenu RH professionnel et complet qui soutient l'excellence en gestion des personnes."
    },
    legal: {
      task: "Vous êtes un professionnel juridique senior créant du contenu juridiquement solide sans altérer les exigences originales.",
      context: "Environnement juridique professionnel où la conformité réglementaire, mitigation des risques et précision juridique sont critiques.",
      reference: "Standards de documentation juridique, cadres de conformité réglementaire, principes de gestion des risques et exigences d'applicabilité.",
      evaluation: "Succès mesuré par la précision juridique, couverture de conformité, efficacité de mitigation des risques et présentation professionnelle.",
      requirements: [
        "Créer des livrables juridiques complets répondant aux exigences juridiques spécifiques",
        "Assurer la précision en terminologie juridique et conformité réglementaire",
        "Inclure évaluation des risques et stratégies de mitigation",
        "Aborder les considérations d'applicabilité et validité juridique"
      ],
      closing: "Créer du contenu juridique professionnel et complet qui protège les intérêts organisationnels."
    },
    finance: {
      task: "Vous êtes un professionnel financier senior créant du contenu financier précis sans altérer les exigences originales.",
      context: "Environnement financier professionnel où la précision, conformité et perspicacité financière stratégique sont critiques.",
      reference: "Standards de rapports financiers, techniques d'analyse, méthodologies de budgétisation et exigences de conformité réglementaire.",
      evaluation: "Succès mesuré par la précision financière, adhérence à la conformité, compréhension des parties prenantes et perspicacités actionnables.",
      requirements: [
        "Créer des livrables financiers complets répondant aux exigences spécifiques",
        "Inclure des calculs financiers précis, analyse et documentation de support",
        "Fournir des perspicacités financières claires, tendances et recommandations",
        "Assurer la conformité avec les standards financiers et réglementations pertinentes"
      ],
      closing: "Créer du contenu financier professionnel et complet qui soutient la prise de décision éclairée."
    },
    generic: {
      task: "Vous êtes un expert professionnel fournissant une assistance complète sans altérer l'intention originale.",
      context: "Environnement de travail professionnel où des résultats de haute qualité et précis sont essentiels pour le succès.",
      reference: "Meilleures pratiques de l'industrie, approche complète, présentation professionnelle et recommandations basées sur des preuves.",
      evaluation: "Succès mesuré par la précision, complétude, qualité professionnelle et applicabilité pratique.",
      requirements: [
        "Fournir une couverture complète de tous les aspects mentionnés dans la demande originale",
        "Maintenir un formatage professionnel, structure et standards de présentation",
        "Inclure des recommandations claires et actionnables et guidance spécifique",
        "Créer une sortie pratique et prête à utiliser qui ne nécessite pas de développement additionnel"
      ],
      closing: "Créer du contenu professionnel et complet qui répond entièrement à la demande originale avec une qualité exceptionnelle."
    }
  }
};

// Function to get localized template
export function getLocalizedTemplate(domain: keyof DomainTemplates, language: Language): LocalizedTemplate {
  const templates = localizedEnhancementTemplates[language.code] || localizedEnhancementTemplates.en;
  return templates[domain];
}

// Function to format template with user request
export function formatLocalizedTemplate(template: LocalizedTemplate, userRequest: string, languageInstructions: string): string {
  return `${languageInstructions}

**TASK:** ${userRequest}

**CONTEXT:** ${template.context}

**REFERENCE:** ${template.reference}

**EVALUATION METHOD:** ${template.evaluation}

**SPECIFIC REQUIREMENTS:**
${template.requirements.map(req => `- ${req}`).join('\n')}

${template.closing}`;
}
