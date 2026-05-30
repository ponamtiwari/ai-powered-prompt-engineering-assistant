import { Language, detectInputLanguage, isClearlyEnglish } from './languageDetector';
import { openaiService } from './openaiService';
import { advancedGrammarCorrector, AdvancedGrammarCorrection } from './advancedGrammarCorrector';

export interface GrammarCorrection {
  original: string;
  corrected: string;
  language: Language;
  corrections: string[];
}

// Enhanced interface for backward compatibility
export interface EnhancedGrammarCorrection extends GrammarCorrection {
  suggestions: Array<{
    type: string;
    severity: string;
    explanation: string;
    rule: string;
    examples?: string[];
  }>;
  confidence: number;
  processingTime: number;
}

// Enhanced multilingual spelling corrections
const multilingualCorrections: { [key: string]: Record<string, string> } = {
  en: {
    // Email related
    'emale': 'email', 'emaul': 'email', 'emial': 'email', 'emai': 'email', 'e-mail': 'email',
    
    // Application related
    'appication': 'application', 'aplication': 'application', 'aplications': 'applications',
    'applicaton': 'application',
    
    // Joining related
    'joiining': 'joining', 'joing': 'joining', 'joinig': 'joining', 'joinin': 'joining',
    
    // Writing related
    'writeee': 'write', 'writee': 'write', 'writte': 'write', 'wriet': 'write', 'wrtie': 'write',
    'writeing': 'writing', 'writting': 'writing', 'writen': 'written',
    
    // Common typos with repeated letters
    'andd': 'and', 'thee': 'the', 'forr': 'for', 'withh': 'with', 'thiss': 'this',
    'thatt': 'that', 'whenn': 'when', 'wheree': 'where', 'whatt': 'what',
    'howw': 'how', 'whyy': 'why', 'whoo': 'who', 'willl': 'will', 'cann': 'can',
    'makee': 'make', 'takee': 'take', 'givee': 'give', 'havee': 'have',
    'doee': 'do', 'gooo': 'go', 'seee': 'see', 'gett': 'get', 'putt': 'put',
    
    // Missing articles and prepositions
    'an email': 'an email', 'a email': 'an email',
    
    // Professional terms
    'profesional': 'professional', 'professionnal': 'professional', 'proffesional': 'professional',
    'managment': 'management', 'manegement': 'management',
    'requirment': 'requirement', 'requirments': 'requirements',
    'experiance': 'experience', 'expirience': 'experience',
    'responsability': 'responsibility', 'responsibilty': 'responsibility',
    'oportunity': 'opportunity', 'oppertunity': 'opportunity',
    
    // Common words
    'recieve': 'receive', 'recieved': 'received', 'seperate': 'separate',
    'definately': 'definitely', 'occured': 'occurred', 'occurence': 'occurrence',
    'accomodate': 'accommodate', 'begining': 'beginning', 'calender': 'calendar',
    'cemetary': 'cemetery', 'changable': 'changeable', 'collegue': 'colleague',
    'concious': 'conscious', 'embarass': 'embarrass', 'enviroment': 'environment',
    'existance': 'existence', 'foriegn': 'foreign', 'goverment': 'government',
    'harrass': 'harass', 'independant': 'independent', 'judgement': 'judgment',
    'knowlege': 'knowledge', 'liason': 'liaison', 'maintainance': 'maintenance',
    'neccessary': 'necessary', 'occassion': 'occasion', 'perseverence': 'perseverance',
    'priviledge': 'privilege', 'publically': 'publicly', 'questionaire': 'questionnaire',
    'recomend': 'recommend', 'relevent': 'relevant', 'rythm': 'rhythm',
    'succesful': 'successful', 'tommorow': 'tomorrow', 'untill': 'until',
    'vaccuum': 'vacuum', 'wierd': 'weird',
    
    // Technical terms
    'sofware': 'software', 'programing': 'programming', 'databse': 'database',
    'algoritm': 'algorithm', 'developement': 'development', 'performace': 'performance',
    'secuirty': 'security', 'integeration': 'integration', 'implmentation': 'implementation',
    
    // Business terms
    'bussiness': 'business', 'organziation': 'organization', 'comunication': 'communication',
    'colaboration': 'collaboration', 'anouncement': 'announcement', 'employe': 'employee',
    'employes': 'employees', 'departement': 'department', 'qualifcation': 'qualification',
    'qualifcations': 'qualifications'
  },
  
  hi: {
    'ईमेल': 'ईमेल', 'इमेल': 'ईमेल', 'इ-मेल': 'ई-मेल',
    'आवेदन': 'आवेदन', 'अवेदन': 'आवेदन',
    'व्यावसायिक': 'व्यावसायिक', 'व्यवसायिक': 'व्यावसायिक',
    'लिखना': 'लिखना', 'लिखने': 'लिखने', 'लिखें': 'लिखें',
    'काम': 'काम', 'कम': 'काम', 'कार्य': 'कार्य'
  },
  
  gu: {
    'ઈમેલ': 'ઈમેલ', 'ઇમેલ': 'ઈમેલ', 'ઇ-મેલ': 'ઈ-મેલ',
    'અરજી': 'અરજી', 'અરજિ': 'અરજી',
    'વ્યાવસાયિક': 'વ્યાવસાયિક', 'વ્યવસાયિક': 'વ્યાવસાયિક',
    'લખવું': 'લખવું', 'લખવુ': 'લખવું', 'લખો': 'લખો',
    'કામ': 'કામ', 'કમ': 'કામ', 'કાર્ય': 'કાર્ય'
  },
  
  es: {
    'escribir': 'escribir', 'escrivir': 'escribir', 'escrebir': 'escribir',
    'profesional': 'profesional', 'profecional': 'profesional',
    'aplicacion': 'aplicación', 'aplicasion': 'aplicación',
    'correo': 'correo', 'coreo': 'correo', 'correo electronico': 'correo electrónico'
  },
  
  fr: {
    'ecrire': 'écrire', 'ecrir': 'écrire', 'ecrirre': 'écrire',
    'professionnel': 'professionnel', 'profesionnel': 'professionnel',
    'application': 'application', 'aplication': 'application',
    'courrier': 'courrier', 'courriel': 'courriel'
  },
  
  de: {
    'schreiben': 'schreiben', 'shreiben': 'schreiben', 'schrieben': 'schreiben',
    'professionell': 'professionell', 'profesionell': 'professionell',
    'anwendung': 'anwendung', 'anwedung': 'anwendung',
    'email': 'e-mail', 'e-mail': 'e-mail'
  },
  
  it: {
    'scrivere': 'scrivere', 'scriverre': 'scrivere',
    'professionale': 'professionale', 'profesionale': 'professionale',
    'applicazione': 'applicazione', 'aplicazione': 'applicazione',
    'email': 'email', 'e-mail': 'e-mail'
  },
  
  pt: {
    'escrever': 'escrever', 'escrevver': 'escrever',
    'profissional': 'profissional', 'profesional': 'profissional',
    'aplicação': 'aplicação', 'aplicacao': 'aplicação',
    'email': 'email', 'e-mail': 'e-mail'
  },
  
  ru: {
    'писать': 'писать', 'пысать': 'писать', 'писат': 'писать',
    'профессиональный': 'профессиональный', 'професиональный': 'профессиональный',
    'заявление': 'заявление', 'заявленые': 'заявление',
    'электронная почта': 'электронная почта', 'имейл': 'электронная почта'
  },
  
  ja: {
    '書く': '書く', 'かく': '書く', '書き': '書き',
    'プロフェッショナル': 'プロフェッショナル', 'プロ': 'プロフェッショナル',
    'アプリケーション': 'アプリケーション', 'アプリ': 'アプリケーション',
    'メール': 'メール', 'Eメール': 'Eメール'
  },
  
  ko: {
    '쓰다': '쓰다', '쓰기': '쓰기', '작성': '작성',
    '전문적': '전문적', '전문': '전문적',
    '신청': '신청', '지원': '지원',
    '이메일': '이메일', '메일': '이메일'
  },
  
  ar: {
    'كتابة': 'كتابة', 'كتابه': 'كتابة', 'كتب': 'كتب',
    'مهني': 'مهني', 'مهنى': 'مهني',
    'طلب': 'طلب', 'تطبيق': 'تطبيق',
    'بريد إلكتروني': 'بريد إلكتروني', 'ايميل': 'بريد إلكتروني'
  }
};

export async function correctGrammarMultilingual(text: string): Promise<EnhancedGrammarCorrection> {
  const inputLanguage = detectInputLanguage(text);
  const advancedResult = await advancedGrammarCorrector.correctText(text, inputLanguage);
  
  // Convert to legacy format for backward compatibility
  const corrections = advancedResult.suggestions.map(suggestion => {
    if (suggestion.explanation) {
      return `${suggestion.type}: ${suggestion.explanation}`;
    }
    return `${suggestion.original} → ${suggestion.corrected}`;
  });

  // Add processing time and confidence info
  if (advancedResult.processingTime > 0) {
    corrections.push(`Processing time: ${advancedResult.processingTime}ms`);
  }
  
  if (advancedResult.confidence < 1.0) {
    corrections.push(`Confidence: ${Math.round(advancedResult.confidence * 100)}%`);
  }

  return {
    original: advancedResult.original,
    corrected: advancedResult.corrected,
    language: advancedResult.language,
    corrections,
    suggestions: advancedResult.suggestions.map(s => ({
      type: s.type,
      severity: s.severity,
      explanation: s.explanation,
      rule: s.rule,
      examples: s.examples
    })),
    confidence: advancedResult.confidence,
    processingTime: advancedResult.processingTime
  };
}

// Legacy function for backward compatibility
export async function correctGrammarMultilingualLegacy(text: string): Promise<GrammarCorrection> {
  if (!text || text.trim().length === 0) {
    const language = detectInputLanguage(text);
    return {
      original: text,
      corrected: text,
      language,
      corrections: []
    };
  }

  const language = detectInputLanguage(text);
  let corrected = text;
  const corrections: string[] = [];

  // Apply language-specific spelling corrections
  const langCorrections = multilingualCorrections[language.code] || multilingualCorrections.en;
  
  Object.entries(langCorrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    const matches = corrected.match(regex);
    
    if (matches) {
      corrected = corrected.replace(regex, (match) => {
        // Preserve original case
        if (match === match.toUpperCase()) return correct.toUpperCase();
        if (match[0] === match[0].toUpperCase()) {
          return correct.charAt(0).toUpperCase() + correct.slice(1);
        }
        return correct;
      });
      
      corrections.push(`"${wrong}" → "${correct}"`);
    }
  });

  // Apply universal grammar corrections
  const grammarCorrections: Array<[RegExp, string, string]> = [
    // English-specific corrections
    [/\ba ([aeiouAEIOU])/g, 'an $1', 'Article correction: "a" → "an" before vowels'],
    [/\ban ([^aeiouAEIOU])/g, 'a $1', 'Article correction: "an" → "a" before consonants'],
    
    // Fix missing words and grammar patterns
    [/\bwrite\s+and\s+email\b/gi, 'write an email', 'Grammar correction: "write and email" → "write an email"'],
    [/\bfor\s+applications\s+/gi, 'for application ', 'Grammar correction: "applications" → "application" (singular)'],
    
    // Universal corrections
    [/^([a-z])/g, (match: string) => match.toUpperCase(), 'Capitalized first letter'],
    [/\s+/g, ' ', 'Removed extra spaces'],
    [/\s+([.!?])/g, '$1', 'Removed space before punctuation'],
    [/([.!?])\s*([a-z])/g, '$1 $2', 'Added space after punctuation'],
  ];

  grammarCorrections.forEach(([pattern, replacement, description]) => {
    const beforeCorrection = corrected;
    if (typeof replacement === 'string') {
      corrected = corrected.replace(pattern, replacement);
    } else {
      corrected = corrected.replace(pattern, replacement as any);
    }
    
    if (beforeCorrection !== corrected && description) {
      corrections.push(description);
    }
  });

  // Clean up extra spaces and trim
  corrected = corrected.replace(/\s+/g, ' ').trim();

  // If API key exists, refine using AI for the detected language
  if (openaiService.hasApiKey()) {
    try {
      const ai = await openaiService.correctTextMultilingual(corrected, language.code);
      if (ai.corrected && ai.corrected.trim() && ai.corrected !== corrected) {
        corrections.push('AI refinement applied');
        corrected = ai.corrected;
      }
      if (ai.suggestions && ai.suggestions.length > 0) {
        ai.suggestions.forEach(s => corrections.push(s));
      }
    } catch (err) {
      // Soft-fail to local correction only
      console.warn('AI grammar correction unavailable, using local rules:', err);
    }
  }

  return {
    original: text,
    corrected,
    language,
    corrections: [...new Set(corrections)] // Remove duplicates
  };
}

export function hasGrammarErrors(original: string, corrected: string): boolean {
  return original.trim() !== corrected.trim();
}

export function getGrammarSuggestions(corrections: string[]): string[] {
  return corrections.length > 0 ? corrections : ['Grammar and spelling checked'];
}