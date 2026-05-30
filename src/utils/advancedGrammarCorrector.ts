import { Language, detectInputLanguage, getLanguageByCode, isClearlyEnglish } from './languageDetector';
import { openaiService } from './openaiService';

export interface GrammarSuggestion {
  type: 'spelling' | 'grammar' | 'style' | 'punctuation' | 'syntax';
  severity: 'error' | 'warning' | 'suggestion';
  original: string;
  corrected: string;
  explanation: string;
  rule: string;
  position?: { start: number; end: number };
  examples?: string[];
}

export interface AdvancedGrammarCorrection {
  original: string;
  corrected: string;
  language: Language;
  suggestions: GrammarSuggestion[];
  confidence: number;
  processingTime: number;
}

// Advanced multilingual grammar rules and patterns
const advancedGrammarRules: { [key: string]: GrammarRule[] } = {
  en: [
    // Article rules
    {
      pattern: /\ba\s+([aeiouAEIOU]\w*)/g,
      replacement: 'an $1',
      type: 'grammar',
      severity: 'error',
      rule: 'article_vowel',
      explanation: 'Use "an" before words starting with vowel sounds',
      examples: ['an apple', 'an hour', 'an honest person']
    },
    {
      pattern: /\ban\s+([bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]\w*)/g,
      replacement: 'a $1',
      type: 'grammar',
      severity: 'error',
      rule: 'article_consonant',
      explanation: 'Use "a" before words starting with consonant sounds',
      examples: ['a book', 'a university', 'a one-time offer']
    },
    // Subject-verb agreement
    {
      pattern: /\b(he|she|it)\s+(are|were)\b/gi,
      replacement: (match, subject) => `${subject} ${subject.toLowerCase() === 'it' ? 'is' : 'was'}`,
      type: 'grammar',
      severity: 'error',
      rule: 'subject_verb_agreement',
      explanation: 'Singular subjects require singular verbs',
      examples: ['he is', 'she was', 'it is']
    },
    // Comma splices
    {
      pattern: /([a-z]+)\s*,\s*([a-z]+\s+[a-z]+)/gi,
      replacement: '$1, and $2',
      type: 'punctuation',
      severity: 'warning',
      rule: 'comma_splice',
      explanation: 'Use coordinating conjunctions to join independent clauses',
      examples: ['I went home, and I ate dinner', 'She studied hard, but she failed']
    },
    // Passive voice detection
    {
      pattern: /\b(was|were|is|are|been)\s+([\w]+ed|[\w]+en)\b/gi,
      replacement: null, // No automatic replacement for passive voice
      type: 'style',
      severity: 'suggestion',
      rule: 'passive_voice',
      explanation: 'Consider using active voice for clearer, more direct writing',
      examples: ['The team completed the project (active) vs. The project was completed by the team (passive)']
    },
    // Double negatives
    {
      pattern: /\b(don't|doesn't|didn't|won't|can't|couldn't|shouldn't|wouldn't)\s+(no|none|nothing|nobody|nowhere|never|not)\b/gi,
      replacement: null,
      type: 'grammar',
      severity: 'error',
      rule: 'double_negative',
      explanation: 'Avoid double negatives in formal English',
      examples: ['I don\'t have anything (not: I don\'t have nothing)']
    }
  ],
  
  // Spanish grammar rules
  es: [
    {
      pattern: /\b(el|la)\s+(a|e|i|o|u)/gi,
      replacement: (match, article, vowel) => article === 'la' && vowel === 'a' ? 'el a' : match,
      type: 'grammar',
      severity: 'error',
      rule: 'feminine_article_vowel',
      explanation: 'Use "el" instead of "la" before feminine nouns starting with stressed "a"',
      examples: ['el agua', 'el águila', 'el hacha']
    },
    {
      pattern: /\b(ser|estar)\s+/gi,
      replacement: null,
      type: 'grammar',
      severity: 'suggestion',
      rule: 'ser_estar_usage',
      explanation: 'Choose between "ser" (permanent) and "estar" (temporary) carefully',
      examples: ['Ella es doctora (permanent)', 'Ella está enferma (temporary)']
    }
  ],
  
  // French grammar rules
  fr: [
    {
      pattern: /\b(le|la)\s+([aeiouAEIOU])/gi,
      replacement: 'l\'$2',
      type: 'grammar',
      severity: 'error',
      rule: 'elision',
      explanation: 'Use elision (l\') before words starting with vowels',
      examples: ['l\'eau', 'l\'école', 'l\'ami']
    },
    {
      pattern: /\b(ce|de|le|me|ne|se|te)\s+([aeiouAEIOU])/gi,
      replacement: (match, word, vowel) => {
        const elisions: { [key: string]: string } = {
          'ce': 'c\'', 'de': 'd\'', 'le': 'l\'', 'me': 'm\'', 
          'ne': 'n\'', 'se': 's\'', 'te': 't\''
        };
        return elisions[word.toLowerCase()] + vowel;
      },
      type: 'grammar',
      severity: 'error',
      rule: 'pronoun_elision',
      explanation: 'Use elision with pronouns before vowels',
      examples: ['j\'ai', 'qu\'il', 'n\'est']
    }
  ],
  
  // German grammar rules
  de: [
    {
      pattern: /\b(der|die|das)\s+([A-Z][a-z]+)/g,
      replacement: null,
      type: 'grammar',
      severity: 'suggestion',
      rule: 'noun_capitalization',
      explanation: 'All German nouns must be capitalized',
      examples: ['der Hund', 'die Katze', 'das Haus']
    },
    {
      pattern: /\bß/g,
      replacement: null,
      type: 'spelling',
      severity: 'suggestion',
      rule: 'eszett_usage',
      explanation: 'Use ß (Eszett) correctly in German spelling',
      examples: ['Straße', 'weiß', 'Fuß']
    }
  ],
  
  // Hindi grammar rules (Devanagari)
  hi: [
    {
      pattern: /\b(का|की|के)\s+/g,
      replacement: null,
      type: 'grammar',
      severity: 'suggestion',
      rule: 'possessive_agreement',
      explanation: 'Possessive markers must agree with the possessed noun\'s gender and number',
      examples: ['लड़के का नाम (masculine)', 'लड़की का नाम (feminine)', 'लड़कों के नाम (plural)']
    },
    {
      pattern: /\b(है|हैं|था|थी|थे)\s+/g,
      replacement: null,
      type: 'grammar',
      severity: 'suggestion',
      rule: 'copula_agreement',
      explanation: 'The copula (linking verb) must agree with subject in gender, number, and person',
      examples: ['वह अच्छा है (masculine)', 'वह अच्छी है (feminine)', 'वे अच्छे हैं (plural)']
    }
  ],
  
  // Japanese grammar rules
  ja: [
    {
      pattern: /\b(です|である)\s+/g,
      replacement: null,
      type: 'grammar',
      severity: 'suggestion',
      rule: 'politeness_level',
      explanation: 'Maintain consistent politeness level throughout the text',
      examples: ['です/ます form (polite)', 'だ/である form (casual)']
    },
    {
      pattern: /\b(は|が)\s+/g,
      replacement: null,
      type: 'grammar',
      severity: 'suggestion',
      rule: 'particle_usage',
      explanation: 'Use は (wa) for topics and が (ga) for subjects correctly',
      examples: ['私は学生です (topic)', '誰が来ましたか (subject)']
    }
  ],
  
  // Chinese grammar rules
  zh: [
    {
      pattern: /\b(的|地|得)\s+/g,
      replacement: null,
      type: 'grammar',
      severity: 'suggestion',
      rule: 'de_particle_usage',
      explanation: 'Use 的 (possessive), 地 (adverbial), and 得 (complement) particles correctly',
      examples: ['我的书 (possessive)', '慢慢地走 (adverbial)', '跑得快 (complement)']
    }
  ]
};

interface GrammarRule {
  pattern: RegExp;
  replacement: string | ((match: string, ...groups: string[]) => string) | null;
  type: 'spelling' | 'grammar' | 'style' | 'punctuation' | 'syntax';
  severity: 'error' | 'warning' | 'suggestion';
  rule: string;
  explanation: string;
  examples: string[];
}

// Enhanced spelling dictionaries with context-aware corrections
const contextAwareSpellingCorrections: { [key: string]: ContextSpellingRule[] } = {
  en: [
    {
      pattern: /\b(there|their|they're)\b/gi,
      corrections: [
        { word: 'there', context: ['is', 'are', 'was', 'were'], explanation: 'Location or existence' },
        { word: 'their', context: ['house', 'car', 'book', 'own'], explanation: 'Possession' },
        { word: 'they\'re', context: ['going', 'coming', 'happy'], explanation: 'Contraction of "they are"' }
      ]
    },
    {
      pattern: /\b(your|you're)\b/gi,
      corrections: [
        { word: 'your', context: ['house', 'car', 'book', 'name'], explanation: 'Possession' },
        { word: 'you\'re', context: ['going', 'welcome', 'right'], explanation: 'Contraction of "you are"' }
      ]
    },
    {
      pattern: /\b(its|it's)\b/gi,
      corrections: [
        { word: 'its', context: ['own', 'color', 'size', 'shape'], explanation: 'Possession (no apostrophe)' },
        { word: 'it\'s', context: ['time', 'raining', 'cold'], explanation: 'Contraction of "it is" or "it has"' }
      ]
    }
  ],
  
  es: [
    {
      pattern: /\b(por que|porque|por qué|porqué)\b/gi,
      corrections: [
        { word: 'por qué', context: ['?', 'pregunta'], explanation: 'Interrogative (why?)' },
        { word: 'porque', context: ['razón', 'causa'], explanation: 'Because (causal)' },
        { word: 'por que', context: ['el motivo'], explanation: 'For which (relative)' },
        { word: 'porqué', context: ['el', 'un'], explanation: 'The reason (noun)' }
      ]
    }
  ],
  
  fr: [
    {
      pattern: /\b(ou|où)\b/gi,
      corrections: [
        { word: 'ou', context: ['bien', 'alors'], explanation: 'Or (conjunction)' },
        { word: 'où', context: ['est', 'vas', 'habites'], explanation: 'Where (interrogative/relative)' }
      ]
    }
  ]
};

interface ContextSpellingRule {
  pattern: RegExp;
  corrections: Array<{
    word: string;
    context: string[];
    explanation: string;
  }>;
}

// Localized feedback messages
const localizedMessages: { [key: string]: LocalizedMessages } = {
  en: {
    grammarFixed: 'Grammar corrected',
    spellingFixed: 'Spelling corrected',
    styleImproved: 'Style improved',
    punctuationFixed: 'Punctuation corrected',
    syntaxFixed: 'Syntax corrected',
    noErrors: 'No errors found',
    confidenceHigh: 'High confidence correction',
    confidenceMedium: 'Medium confidence suggestion',
    confidenceLow: 'Low confidence suggestion',
    processingComplete: 'Grammar check complete'
  },
  es: {
    grammarFixed: 'Gramática corregida',
    spellingFixed: 'Ortografía corregida',
    styleImproved: 'Estilo mejorado',
    punctuationFixed: 'Puntuación corregida',
    syntaxFixed: 'Sintaxis corregida',
    noErrors: 'No se encontraron errores',
    confidenceHigh: 'Corrección de alta confianza',
    confidenceMedium: 'Sugerencia de confianza media',
    confidenceLow: 'Sugerencia de baja confianza',
    processingComplete: 'Revisión gramatical completada'
  },
  fr: {
    grammarFixed: 'Grammaire corrigée',
    spellingFixed: 'Orthographe corrigée',
    styleImproved: 'Style amélioré',
    punctuationFixed: 'Ponctuation corrigée',
    syntaxFixed: 'Syntaxe corrigée',
    noErrors: 'Aucune erreur trouvée',
    confidenceHigh: 'Correction haute confiance',
    confidenceMedium: 'Suggestion confiance moyenne',
    confidenceLow: 'Suggestion faible confiance',
    processingComplete: 'Vérification grammaticale terminée'
  },
  de: {
    grammarFixed: 'Grammatik korrigiert',
    spellingFixed: 'Rechtschreibung korrigiert',
    styleImproved: 'Stil verbessert',
    punctuationFixed: 'Zeichensetzung korrigiert',
    syntaxFixed: 'Syntax korrigiert',
    noErrors: 'Keine Fehler gefunden',
    confidenceHigh: 'Korrektur mit hoher Sicherheit',
    confidenceMedium: 'Vorschlag mit mittlerer Sicherheit',
    confidenceLow: 'Vorschlag mit geringer Sicherheit',
    processingComplete: 'Grammatikprüfung abgeschlossen'
  },
  hi: {
    grammarFixed: 'व्याकरण सुधारा गया',
    spellingFixed: 'वर्तनी सुधारी गई',
    styleImproved: 'शैली में सुधार',
    punctuationFixed: 'विराम चिह्न सुधारे गए',
    syntaxFixed: 'वाक्य संरचना सुधारी गई',
    noErrors: 'कोई त्रुटि नहीं मिली',
    confidenceHigh: 'उच्च विश्वास सुधार',
    confidenceMedium: 'मध्यम विश्वास सुझाव',
    confidenceLow: 'कम विश्वास सुझाव',
    processingComplete: 'व्याकरण जांच पूर्ण'
  },
  ja: {
    grammarFixed: '文法を修正しました',
    spellingFixed: 'スペルを修正しました',
    styleImproved: 'スタイルを改善しました',
    punctuationFixed: '句読点を修正しました',
    syntaxFixed: '構文を修正しました',
    noErrors: 'エラーは見つかりませんでした',
    confidenceHigh: '高信頼度の修正',
    confidenceMedium: '中信頼度の提案',
    confidenceLow: '低信頼度の提案',
    processingComplete: '文法チェック完了'
  },
  zh: {
    grammarFixed: '语法已更正',
    spellingFixed: '拼写已更正',
    styleImproved: '文体已改善',
    punctuationFixed: '标点已更正',
    syntaxFixed: '句法已更正',
    noErrors: '未发现错误',
    confidenceHigh: '高置信度更正',
    confidenceMedium: '中等置信度建议',
    confidenceLow: '低置信度建议',
    processingComplete: '语法检查完成'
  }
};

// Additional localized rule explanations
const localizedRuleExplanations: { [key: string]: { [rule: string]: string } } = {
  en: {
    article_vowel: 'Use "an" before words starting with vowel sounds',
    article_consonant: 'Use "a" before words starting with consonant sounds',
    subject_verb_agreement: 'Singular subjects require singular verbs',
    double_negative: 'Avoid double negatives in formal English',
    passive_voice: 'Consider using active voice for clearer writing',
    sentence_length_optimization: 'Long sentences broken for better readability',
    contextual_spelling: 'Word choice based on surrounding context'
  },
  es: {
    article_vowel: 'Use "an" antes de palabras que comienzan con sonidos vocálicos',
    article_consonant: 'Use "a" antes de palabras que comienzan con sonidos consonánticos',
    gender_agreement: 'El artículo debe concordar en género con el sustantivo',
    ser_estar_usage: 'Elija entre "ser" (permanente) y "estar" (temporal) cuidadosamente',
    sentence_length_optimization: 'Oración larga dividida para mayor claridad',
    contextual_spelling: 'Elección de palabra basada en el contexto'
  },
  fr: {
    elision: 'Utilisez l\'élision (l\') avant les mots commençant par des voyelles',
    pronoun_elision: 'Utilisez l\'élision avec les pronoms avant les voyelles',
    liaison: 'Liaison recommandée: prononcez la consonne finale',
    sentence_length_optimization: 'Phrase longue divisée pour une meilleure clarté',
    contextual_spelling: 'Choix de mot basé sur le contexte'
  },
  de: {
    noun_capitalization: 'Tous les noms allemands doivent être capitalisés',
    eszett_usage: 'Utilisez ß (Eszett) correctement dans l\'orthographe allemande',
    sentence_length_optimization: 'Langer Satz für bessere Klarheit unterteilt',
    contextual_spelling: 'Wortwahl basierend auf dem Kontext'
  },
  hi: {
    possessive_agreement: 'स्वामित्व चिह्नक संज्ञा के लिंग और संख्या से मेल खाना चाहिए',
    copula_agreement: 'संयोजक क्रिया कर्ता के लिंग, संख्या और पुरुष से मेल खाना चाहिए',
    sentence_length_optimization: 'लंबे वाक्य को स्पष्टता के लिए विभाजित किया गया',
    contextual_spelling: 'संदर्भ के आधार पर शब्द चयन'
  },
  ja: {
    politeness_level: '文全体で一貫した敬語レベルを維持する',
    particle_usage: 'は（話題）とが（主語）を正しく使い分ける',
    sentence_length_optimization: '長い文を明確さのために分割',
    contextual_spelling: '文脈に基づく単語選択'
  },
  zh: {
    de_particle_usage: '的（所有）、地（副词）、得（补语）助词を正しく使用',
    measure_word: '量词的使用是否正确',
    sentence_length_optimization: '长句为了清晰而分割',
    contextual_spelling: '基于上下文的词汇选择'
  }
};

interface LocalizedMessages {
  grammarFixed: string;
  spellingFixed: string;
  styleImproved: string;
  punctuationFixed: string;
  syntaxFixed: string;
  noErrors: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  processingComplete: string;
}

export class AdvancedGrammarCorrector {
  private startTime: number = 0;
  private appliedCorrections: Set<string> = new Set();

  async correctText(text: string, targetLanguage?: Language): Promise<AdvancedGrammarCorrection> {
    // Reset applied corrections for each new text analysis
    this.appliedCorrections.clear();
    this.startTime = Date.now();
    
    if (!text || text.trim().length === 0) {
      const language = targetLanguage || detectInputLanguage(text);
      return {
        original: text,
        corrected: text,
        language,
        suggestions: [],
        confidence: 1.0,
        processingTime: Date.now() - this.startTime
      };
    }

    const language = targetLanguage || detectInputLanguage(text);
    let correctedText = text;
    const suggestions: GrammarSuggestion[] = [];

    // Apply rule-based corrections
    const ruleBasedSuggestions = this.applyGrammarRules(correctedText, language);
    suggestions.push(...ruleBasedSuggestions);
    
    // Apply corrected text from rule-based suggestions
    for (const suggestion of ruleBasedSuggestions) {
      if (suggestion.corrected !== suggestion.original) {
        correctedText = this.applyUniqueCorrection(correctedText, suggestion.original, suggestion.corrected);
      }
    }

    // Apply context-aware spelling corrections
    const spellingCorrections = this.applyContextAwareSpelling(correctedText, language);
    suggestions.push(...spellingCorrections);
    
    // Apply spelling corrections to text
    for (const suggestion of spellingCorrections) {
      if (suggestion.corrected !== suggestion.original) {
        correctedText = this.applyUniqueCorrection(correctedText, suggestion.original, suggestion.corrected);
      }
    }

    // Apply advanced language-specific corrections
    const advancedCorrections = await this.applyAdvancedCorrections(correctedText, language);
    suggestions.push(...advancedCorrections);
    
    // Apply advanced corrections to text
    for (const suggestion of advancedCorrections) {
      if (suggestion.corrected !== suggestion.original) {
        correctedText = this.applyUniqueCorrection(correctedText, suggestion.original, suggestion.corrected);
      }
    }

    // Apply complex sentence restructuring
    const restructuredResult = await this.analyzeAndRestructureSentences(correctedText, language);
    if (restructuredResult.restructured !== correctedText) {
      correctedText = restructuredResult.restructured;
      suggestions.push(...restructuredResult.suggestions);
    }

    // Use AI for complex grammar checking if available (English input only — avoids cross-language hallucination)
    if (openaiService.hasApiKey() && (language.code === 'en' || isClearlyEnglish(text))) {
      try {
        const aiCorrections = await this.getAICorrections(correctedText, getLanguageByCode('en'));
        if (aiCorrections.suggestions.length > 0) {
          suggestions.push(...aiCorrections.suggestions);
          correctedText = aiCorrections.correctedText;
        }
      } catch (error) {
        console.warn('AI grammar correction failed, using rule-based corrections only:', error);
      }
    }

    // Remove duplicate suggestions and ensure unique corrections
    const uniqueSuggestions = this.removeDuplicateSuggestions(suggestions);
    
    // Preserve original intent
    const intentCheck = this.preserveOriginalIntent(text, correctedText, language);
    if (intentCheck.intentScore < 0.7) {
      console.warn('Intent preservation warning: significant meaning change detected');
      // Use less aggressive corrections if intent is compromised
      correctedText = this.applyConservativeCorrections(text, uniqueSuggestions);
    }
    
    const confidence = this.calculateConfidence(uniqueSuggestions);
    const processingTime = Date.now() - this.startTime;

    return {
      original: text,
      corrected: correctedText,
      language,
      suggestions: uniqueSuggestions,
      confidence,
      processingTime
    };
  }

  private applyStringReplacementToMatch(match: RegExpMatchArray, replacement: string): string {
    let result = replacement;
    for (let i = 1; i < match.length; i++) {
      result = result.replace(new RegExp(`\\$${i}`, 'g'), match[i] ?? '');
    }
    return result;
  }

  private applyUniqueCorrection(text: string, original: string, corrected: string): string {
    const correctionKey = `${original}→${corrected}`;
    
    if (this.appliedCorrections.has(correctionKey)) {
      return text; // Skip duplicate correction
    }
    
    this.appliedCorrections.add(correctionKey);
    return text.replace(original, corrected);
  }

  private removeDuplicateSuggestions(suggestions: GrammarSuggestion[]): GrammarSuggestion[] {
    const seen = new Set<string>();
    const unique: GrammarSuggestion[] = [];
    
    for (const suggestion of suggestions) {
      const key = `${suggestion.type}:${suggestion.rule}:${suggestion.original}:${suggestion.corrected}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(suggestion);
      }
    }
    
    return unique;
  }

  private async analyzeAndRestructureSentences(text: string, language: Language): Promise<{ restructured: string; suggestions: GrammarSuggestion[] }> {
    const suggestions: GrammarSuggestion[] = [];
    let restructured = text;

    // Split into sentences for analysis
    const sentences = this.splitIntoSentences(text, language);
    const restructuredSentences: string[] = [];

    for (const sentence of sentences) {
      const analysis = await this.analyzeSentenceComplexity(sentence, language);
      
      if (analysis.needsRestructuring) {
        const restructuredSentence = await this.restructureSentence(sentence, language);
        restructuredSentences.push(restructuredSentence.text);
        suggestions.push(...restructuredSentence.suggestions);
      } else {
        restructuredSentences.push(sentence);
      }
    }

    restructured = restructuredSentences.join(' ').trim();
    
    return { restructured, suggestions };
  }

  private splitIntoSentences(text: string, language: Language): string[] {
    // Language-specific sentence splitting
    const patterns: { [key: string]: RegExp } = {
      en: /[.!?]+\s+/g,
      es: /[.!?¡¿]+\s+/g,
      fr: /[.!?]+\s+/g,
      de: /[.!?]+\s+/g,
      hi: /[।!?]+\s+/g,
      ja: /[。！？]+\s*/g,
      zh: /[。！？]+\s*/g,
      ar: /[.!?؟]+\s+/g
    };

    const pattern = patterns[language.code] || patterns.en;
    const sentences = text.split(pattern).filter(s => s.trim().length > 0);
    
    return sentences.map(s => s.trim());
  }

  private async analyzeSentenceComplexity(sentence: string, language: Language): Promise<{ needsRestructuring: boolean; complexity: number; issues: string[] }> {
    const issues: string[] = [];
    let complexity = 0;

    // Word count analysis
    const wordCount = sentence.split(/\s+/).length;
    if (wordCount > 25) {
      complexity += 2;
      issues.push('sentence_too_long');
    }

    // Clause analysis
    const clauseCount = this.countClauses(sentence, language);
    if (clauseCount > 3) {
      complexity += 1;
      issues.push('too_many_clauses');
    }

    // Passive voice detection (for supported languages)
    if (this.hasExcessivePassiveVoice(sentence, language)) {
      complexity += 1;
      issues.push('excessive_passive_voice');
    }

    // Nested structure detection
    const nestingLevel = this.calculateNestingLevel(sentence);
    if (nestingLevel > 2) {
      complexity += 1;
      issues.push('excessive_nesting');
    }

    return {
      needsRestructuring: complexity >= 2,
      complexity,
      issues
    };
  }

  private countClauses(sentence: string, language: Language): number {
    const conjunctions: { [key: string]: string[] } = {
      en: ['and', 'but', 'or', 'because', 'since', 'although', 'while', 'when', 'if', 'that', 'which', 'who'],
      es: ['y', 'pero', 'o', 'porque', 'desde', 'aunque', 'mientras', 'cuando', 'si', 'que', 'cual', 'quien'],
      fr: ['et', 'mais', 'ou', 'parce que', 'depuis', 'bien que', 'pendant', 'quand', 'si', 'que', 'qui'],
      de: ['und', 'aber', 'oder', 'weil', 'seit', 'obwohl', 'während', 'wenn', 'dass', 'der', 'die', 'das'],
      hi: ['और', 'लेकिन', 'या', 'क्योंकि', 'जब', 'अगर', 'जो', 'कि'],
      ja: ['と', 'が', 'けれど', 'ので', 'から', 'ときに', 'もし', 'という'],
      zh: ['和', '但是', '或者', '因为', '当', '如果', '的', '了'],
      ar: ['و', 'لكن', 'أو', 'لأن', 'عندما', 'إذا', 'التي', 'الذي']
    };

    const langConjunctions = conjunctions[language.code] || conjunctions.en;
    const lowerSentence = sentence.toLowerCase();
    
    let clauseCount = 1; // Start with 1 for the main clause
    
    for (const conjunction of langConjunctions) {
      const regex = new RegExp(`\\b${conjunction}\\b`, 'gi');
      const matches = lowerSentence.match(regex);
      if (matches) {
        clauseCount += matches.length;
      }
    }

    return clauseCount;
  }

  private hasExcessivePassiveVoice(sentence: string, language: Language): boolean {
    const passivePatterns: { [key: string]: RegExp } = {
      en: /\b(was|were|is|are|been)\s+\w+ed\b/gi,
      es: /\b(fue|fueron|es|son|sido)\s+\w+ado\b|\b(fue|fueron|es|son|sido)\s+\w+ido\b/gi,
      fr: /\b(a été|ont été|est|sont)\s+\w+é\b/gi,
      de: /\b(wurde|wurden|wird|werden)\s+\w+t\b/gi
    };

    const pattern = passivePatterns[language.code];
    if (!pattern) return false;

    const matches = sentence.match(pattern);
    const wordCount = sentence.split(/\s+/).length;
    
    return matches ? (matches.length / wordCount) > 0.3 : false;
  }

  private calculateNestingLevel(sentence: string): number {
    let level = 0;
    let maxLevel = 0;
    
    for (const char of sentence) {
      if (char === '(' || char === '[' || char === '{') {
        level++;
        maxLevel = Math.max(maxLevel, level);
      } else if (char === ')' || char === ']' || char === '}') {
        level--;
      }
    }
    
    // Also check for comma-separated nested phrases
    const commaCount = (sentence.match(/,/g) || []).length;
    if (commaCount > 3) {
      maxLevel += 1;
    }
    
    return maxLevel;
  }

  private async restructureSentence(sentence: string, language: Language): Promise<{ text: string; suggestions: GrammarSuggestion[] }> {
    const suggestions: GrammarSuggestion[] = [];
    let restructuredText = sentence;

    // Apply language-specific restructuring rules
    switch (language.code) {
      case 'en':
        restructuredText = await this.restructureEnglishSentence(sentence, suggestions);
        break;
      case 'es':
        restructuredText = await this.restructureSpanishSentence(sentence, suggestions);
        break;
      case 'fr':
        restructuredText = await this.restructureFrenchSentence(sentence, suggestions);
        break;
      case 'de':
        restructuredText = await this.restructureGermanSentence(sentence, suggestions);
        break;
      case 'hi':
        restructuredText = await this.restructureHindiSentence(sentence, suggestions);
        break;
      default:
        // Use AI-powered restructuring for other languages
        if (openaiService.hasApiKey()) {
          try {
            const aiResult = await this.getAIRestructuring(sentence, language);
            restructuredText = aiResult.text;
            suggestions.push(...aiResult.suggestions);
          } catch (error) {
            console.warn('AI restructuring failed, keeping original sentence:', error);
          }
        }
    }

    return { text: restructuredText, suggestions };
  }

  private async restructureEnglishSentence(sentence: string, suggestions: GrammarSuggestion[]): Promise<string> {
    let restructured = sentence;

    // Break down overly long sentences
    if (sentence.split(/\s+/).length > 25) {
      // Find natural break points
      const breakPoints = [', and', ', but', ', which', ', that', '; however', '; therefore'];
      
      for (const breakPoint of breakPoints) {
        if (sentence.includes(breakPoint)) {
          const parts = sentence.split(breakPoint);
          if (parts.length === 2 && parts[0].trim().length > 10 && parts[1].trim().length > 10) {
            restructured = `${parts[0].trim()}. ${parts[1].trim().charAt(0).toUpperCase()}${parts[1].trim().slice(1)}`;
            
            suggestions.push({
              type: 'style',
              severity: 'suggestion',
              original: sentence,
              corrected: restructured,
              explanation: 'Long sentence broken into shorter, clearer sentences for better readability.',
              rule: 'sentence_length_optimization',
              examples: ['Instead of one long sentence, use two shorter ones for clarity.']
            });
            
            break;
          }
        }
      }
    }

    // Convert passive to active voice where appropriate
    const passivePattern = /\b(was|were|is|are|been)\s+(\w+ed|\w+en)\s+(by\s+\w+)/gi;
    const passiveMatch = restructured.match(passivePattern);
    
    if (passiveMatch) {
      suggestions.push({
        type: 'style',
        severity: 'suggestion',
        original: sentence,
        corrected: restructured,
        explanation: 'Consider converting passive voice to active voice for more direct, engaging writing.',
        rule: 'passive_to_active_conversion',
        examples: ['Active: "The team completed the project" vs Passive: "The project was completed by the team"']
      });
    }

    return restructured;
  }

  private async restructureSpanishSentence(sentence: string, suggestions: GrammarSuggestion[]): Promise<string> {
    let restructured = sentence;

    // Spanish-specific restructuring rules
    if (sentence.split(/\s+/).length > 30) {
      // Spanish allows longer sentences, but break at natural points
      const breakPoints = [', y', ', pero', ', aunque', '; sin embargo', '; por lo tanto'];
      
      for (const breakPoint of breakPoints) {
        if (sentence.includes(breakPoint)) {
          const parts = sentence.split(breakPoint);
          if (parts.length === 2) {
            restructured = `${parts[0].trim()}. ${parts[1].trim().charAt(0).toUpperCase()}${parts[1].trim().slice(1)}`;
            
            suggestions.push({
              type: 'style',
              severity: 'suggestion',
              original: sentence,
              corrected: restructured,
              explanation: 'Oración larga dividida en oraciones más cortas para mayor claridad.',
              rule: 'spanish_sentence_optimization',
              examples: ['En lugar de una oración larga, usa dos más cortas para mayor claridad.']
            });
            
            break;
          }
        }
      }
    }

    return restructured;
  }

  private async restructureFrenchSentence(sentence: string, suggestions: GrammarSuggestion[]): Promise<string> {
    let restructured = sentence;

    // French-specific restructuring
    if (sentence.split(/\s+/).length > 28) {
      const breakPoints = [', et', ', mais', ', bien que', '; cependant', '; par conséquent'];
      
      for (const breakPoint of breakPoints) {
        if (sentence.includes(breakPoint)) {
          const parts = sentence.split(breakPoint);
          if (parts.length === 2) {
            restructured = `${parts[0].trim()}. ${parts[1].trim().charAt(0).toUpperCase()}${parts[1].trim().slice(1)}`;
            
            suggestions.push({
              type: 'style',
              severity: 'suggestion',
              original: sentence,
              corrected: restructured,
              explanation: 'Phrase longue divisée en phrases plus courtes pour une meilleure clarté.',
              rule: 'french_sentence_optimization',
              examples: ['Au lieu d\'une phrase longue, utilisez deux phrases plus courtes pour plus de clarté.']
            });
            
            break;
          }
        }
      }
    }

    return restructured;
  }

  private async restructureGermanSentence(sentence: string, suggestions: GrammarSuggestion[]): Promise<string> {
    let restructured = sentence;

    // German allows complex sentence structures, but optimize for clarity
    if (sentence.split(/\s+/).length > 35) {
      const breakPoints = [', und', ', aber', ', obwohl', '; jedoch', '; daher'];
      
      for (const breakPoint of breakPoints) {
        if (sentence.includes(breakPoint)) {
          const parts = sentence.split(breakPoint);
          if (parts.length === 2) {
            restructured = `${parts[0].trim()}. ${parts[1].trim().charAt(0).toUpperCase()}${parts[1].trim().slice(1)}`;
            
            suggestions.push({
              type: 'style',
              severity: 'suggestion',
              original: sentence,
              corrected: restructured,
              explanation: 'Langer Satz in kürzere Sätze unterteilt für bessere Klarheit.',
              rule: 'german_sentence_optimization',
              examples: ['Anstatt eines langen Satzes verwenden Sie zwei kürzere für mehr Klarheit.']
            });
            
            break;
          }
        }
      }
    }

    return restructured;
  }

  private async restructureHindiSentence(sentence: string, suggestions: GrammarSuggestion[]): Promise<string> {
    let restructured = sentence;

    // Hindi-specific restructuring
    if (sentence.split(/\s+/).length > 25) {
      const breakPoints = [', और', ', लेकिन', ', हालांकि', '। हालांकि', '। इसलिए'];
      
      for (const breakPoint of breakPoints) {
        if (sentence.includes(breakPoint)) {
          const parts = sentence.split(breakPoint);
          if (parts.length === 2) {
            restructured = `${parts[0].trim()}। ${parts[1].trim()}`;
            
            suggestions.push({
              type: 'style',
              severity: 'suggestion',
              original: sentence,
              corrected: restructured,
              explanation: 'लंबे वाक्य को स्पष्टता के लिए छोटे वाक्यों में विभाजित किया गया।',
              rule: 'hindi_sentence_optimization',
              examples: ['एक लंबे वाक्य के बजाय, स्पष्टता के लिए दो छोटे वाक्यों का उपयोग करें।']
            });
            
            break;
          }
        }
      }
    }

    return restructured;
  }

  private async getAIRestructuring(sentence: string, language: Language): Promise<{ text: string; suggestions: GrammarSuggestion[] }> {
    const systemPrompt = `You are an expert writing coach for ${language.name}. Analyze and restructure the given sentence to improve clarity, readability, and professional tone while preserving the original meaning. Return JSON with:
    {
      "restructured": "improved sentence",
      "suggestions": [
        {
          "type": "style",
          "severity": "suggestion", 
          "original": "original text",
          "corrected": "improved text",
          "explanation": "explanation in ${language.name}",
          "rule": "restructuring_rule",
          "examples": ["example1", "example2"]
        }
      ]
    }`;

    try {
      const completion = await openaiService.generateOutput(
        `${systemPrompt}\n\nSentence to restructure: "${sentence}"`
      );

      const parsed = JSON.parse(completion);
      return {
        text: parsed.restructured || sentence,
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      console.warn('Failed to parse AI restructuring response:', error);
      return { text: sentence, suggestions: [] };
    }
  }

  // Intent preservation methods
  private preserveOriginalIntent(original: string, corrected: string, language: Language): { preserved: string; intentScore: number } {
    // Calculate semantic similarity to ensure intent is preserved
    const intentScore = this.calculateSemanticSimilarity(original, corrected, language);
    
    // If intent score is too low, prefer less aggressive corrections
    if (intentScore < 0.7) {
      console.warn('Intent preservation warning: significant meaning change detected');
      return { preserved: original, intentScore };
    }
    
    return { preserved: corrected, intentScore };
  }

  private calculateSemanticSimilarity(text1: string, text2: string, language: Language): number {
    // Simple similarity calculation based on word overlap and structure
    const words1 = this.extractKeyWords(text1, language);
    const words2 = this.extractKeyWords(text2, language);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    const wordSimilarity = commonWords.length / Math.max(totalWords, 1);
    
    // Structure similarity (sentence length, punctuation)
    const lengthRatio = Math.min(text1.length, text2.length) / Math.max(text1.length, text2.length);
    const structureSimilarity = lengthRatio * 0.8; // Weight structure less than content
    
    return (wordSimilarity * 0.7) + (structureSimilarity * 0.3);
  }

  private extractKeyWords(text: string, language: Language): string[] {
    // Language-specific stop words to exclude
    const stopWords: { [key: string]: Set<string> } = {
      en: new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']),
      es: new Set(['el', 'la', 'los', 'las', 'y', 'o', 'pero', 'en', 'de', 'a', 'por', 'para', 'con', 'es', 'son', 'fue', 'fueron']),
      fr: new Set(['le', 'la', 'les', 'et', 'ou', 'mais', 'dans', 'sur', 'à', 'pour', 'de', 'avec', 'est', 'sont', 'était', 'étaient']),
      de: new Set(['der', 'die', 'das', 'und', 'oder', 'aber', 'in', 'auf', 'zu', 'für', 'von', 'mit', 'ist', 'sind', 'war', 'waren']),
      hi: new Set(['और', 'या', 'लेकिन', 'में', 'पर', 'के', 'लिए', 'से', 'है', 'हैं', 'था', 'थी', 'थे']),
      ja: new Set(['と', 'や', 'でも', 'に', 'で', 'を', 'が', 'は', 'の', 'です', 'である', 'だった']),
      zh: new Set(['和', '或者', '但是', '在', '的', '了', '是', '了', '过', '着']),
      ar: new Set(['و', 'أو', 'لكن', 'في', 'على', 'إلى', 'من', 'مع', 'هو', 'هي', 'كان', 'كانت'])
    };

    const langStopWords = stopWords[language.code] || stopWords.en;
    
    return text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !langStopWords.has(word))
      .map(word => word.replace(/[^\w]/g, ''))
      .filter(word => word.length > 0);
  }

  private applyConservativeCorrections(original: string, suggestions: GrammarSuggestion[]): string {
    let corrected = original;
    
    // Only apply high-confidence, low-impact corrections
    const conservativeSuggestions = suggestions.filter(s => 
      s.severity === 'error' || (s.severity === 'warning' && s.type === 'spelling')
    );
    
    for (const suggestion of conservativeSuggestions) {
      if (suggestion.corrected !== suggestion.original) {
        corrected = corrected.replace(suggestion.original, suggestion.corrected);
      }
    }
    
    return corrected;
  }

  private applyGrammarRules(text: string, language: Language): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];
    const rules = advancedGrammarRules[language.code] || advancedGrammarRules.en;

    for (const rule of rules) {
      const matches = Array.from(text.matchAll(rule.pattern));
      
      for (const match of matches) {
        if (rule.replacement) {
          const corrected = typeof rule.replacement === 'function'
            ? rule.replacement(match[0], ...match.slice(1))
            : this.applyStringReplacementToMatch(match, rule.replacement);

          if (corrected !== match[0]) {
            suggestions.push({
              type: rule.type,
              severity: rule.severity,
              original: match[0],
              corrected: corrected,
              explanation: rule.explanation,
              rule: rule.rule,
              position: { start: match.index || 0, end: (match.index || 0) + match[0].length },
              examples: rule.examples
            });
          }
        } else {
          // Rule for detection only (no automatic correction)
          suggestions.push({
            type: rule.type,
            severity: rule.severity,
            original: match[0],
            corrected: match[0], // No change
            explanation: rule.explanation,
            rule: rule.rule,
            position: { start: match.index || 0, end: (match.index || 0) + match[0].length },
            examples: rule.examples
          });
        }
      }
    }

    return suggestions;
  }

  private applyContextAwareSpelling(text: string, language: Language): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];
    const contextRules = contextAwareSpellingCorrections[language.code] || [];

    for (const contextRule of contextRules) {
      const matches = Array.from(text.matchAll(contextRule.pattern));
      
      for (const match of matches) {
        const context = this.getWordContext(text, match.index || 0, match[0].length);
        const bestCorrection = this.findBestContextualCorrection(match[0], context, contextRule.corrections);
        
        if (bestCorrection && bestCorrection.word.toLowerCase() !== match[0].toLowerCase()) {
          suggestions.push({
            type: 'spelling',
            severity: 'warning',
            original: match[0],
            corrected: bestCorrection.word,
            explanation: bestCorrection.explanation,
            rule: 'contextual_spelling',
            position: { start: match.index || 0, end: (match.index || 0) + match[0].length },
            examples: [`Context suggests: ${bestCorrection.word}`]
          });
        }
      }
    }

    return suggestions;
  }

  private getWordContext(text: string, position: number, length: number): string[] {
    const beforeText = text.substring(Math.max(0, position - 50), position);
    const afterText = text.substring(position + length, Math.min(text.length, position + length + 50));
    
    const beforeWords = beforeText.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const afterWords = afterText.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    return [...beforeWords.slice(-3), ...afterWords.slice(0, 3)];
  }

  private findBestContextualCorrection(word: string, context: string[], corrections: Array<{ word: string; context: string[]; explanation: string }>): { word: string; explanation: string } | null {
    let bestMatch = null;
    let maxScore = 0;

    for (const correction of corrections) {
      const score = correction.context.reduce((acc, contextWord) => {
        return acc + (context.some(c => c.includes(contextWord.toLowerCase())) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = correction;
      }
    }

    return bestMatch;
  }

  private async applyAdvancedCorrections(text: string, language: Language): Promise<GrammarSuggestion[]> {
    const suggestions: GrammarSuggestion[] = [];

    // Language-specific advanced corrections
    switch (language.code) {
      case 'en':
        suggestions.push(...this.applyEnglishAdvancedRules(text));
        break;
      case 'es':
        suggestions.push(...this.applySpanishAdvancedRules(text));
        break;
      case 'fr':
        suggestions.push(...this.applyFrenchAdvancedRules(text));
        break;
      case 'de':
        suggestions.push(...this.applyGermanAdvancedRules(text));
        break;
      case 'hi':
        suggestions.push(...this.applyHindiAdvancedRules(text));
        break;
      case 'ja':
        suggestions.push(...this.applyJapaneseAdvancedRules(text));
        break;
      case 'zh':
        suggestions.push(...this.applyChineseAdvancedRules(text));
        break;
    }

    return suggestions;
  }

  private applyEnglishAdvancedRules(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];

    // Check for sentence fragments
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    for (const sentence of sentences) {
      if (!this.hasSubjectAndVerb(sentence.trim())) {
        suggestions.push({
          type: 'grammar',
          severity: 'warning',
          original: sentence.trim(),
          corrected: sentence.trim(),
          explanation: 'This appears to be a sentence fragment. Consider adding a subject and verb.',
          rule: 'sentence_fragment',
          examples: ['Complete: "The dog barks." Fragment: "The dog in the park."']
        });
      }
    }

    // Check for run-on sentences
    for (const sentence of sentences) {
      if (sentence.split(',').length > 4) {
        suggestions.push({
          type: 'style',
          severity: 'suggestion',
          original: sentence.trim(),
          corrected: sentence.trim(),
          explanation: 'This sentence may be too long. Consider breaking it into shorter sentences.',
          rule: 'run_on_sentence',
          examples: ['Instead of one long sentence, use two or three shorter ones.']
        });
      }
    }

    return suggestions;
  }

  private applySpanishAdvancedRules(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];

    // Check for gender agreement
    const genderMismatch = /\b(un|el)\s+(casa|mesa|silla|puerta)\b/gi;
    const matches = Array.from(text.matchAll(genderMismatch));
    
    for (const match of matches) {
      const article = match[1].toLowerCase();
      const correctArticle = article === 'un' ? 'una' : 'la';
      
      suggestions.push({
        type: 'grammar',
        severity: 'error',
        original: match[0],
        corrected: match[0].replace(match[1], correctArticle),
        explanation: 'El artículo debe concordar en género con el sustantivo',
        rule: 'gender_agreement',
        examples: ['una casa', 'la mesa', 'una silla']
      });
    }

    return suggestions;
  }

  private applyFrenchAdvancedRules(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];

    // Check for liaison errors
    const liaisonErrors = /\b(les|des|mes|tes|ses)\s+([aeiouAEIOU])/gi;
    const matches = Array.from(text.matchAll(liaisonErrors));
    
    for (const match of matches) {
      suggestions.push({
        type: 'style',
        severity: 'suggestion',
        original: match[0],
        corrected: match[0],
        explanation: 'Liaison recommandée: prononcez la consonne finale',
        rule: 'liaison',
        examples: ['les‿amis [lezami]', 'des‿enfants [dezɑ̃fɑ̃]']
      });
    }

    return suggestions;
  }

  private applyGermanAdvancedRules(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];

    // Check for case usage
    const caseErrors = /\b(der|die|das|den|dem|des)\s+([a-z][a-zA-Z]+)/g;
    const matches = Array.from(text.matchAll(caseErrors));
    
    for (const match of matches) {
      if (match[2][0] === match[2][0].toLowerCase()) {
        suggestions.push({
          type: 'grammar',
          severity: 'error',
          original: match[0],
          corrected: match[1] + ' ' + match[2].charAt(0).toUpperCase() + match[2].slice(1),
          explanation: 'Deutsche Substantive werden großgeschrieben',
          rule: 'noun_capitalization',
          examples: ['der Hund', 'die Katze', 'das Haus']
        });
      }
    }

    return suggestions;
  }

  private applyHindiAdvancedRules(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];

    // Check for postposition usage
    const postpositionCheck = /\b(में|पर|से|को|का|की|के)\s+/g;
    const matches = Array.from(text.matchAll(postpositionCheck));
    
    for (const match of matches) {
      suggestions.push({
        type: 'grammar',
        severity: 'suggestion',
        original: match[0],
        corrected: match[0],
        explanation: 'परसर्ग का सही प्रयोग सुनिश्चित करें',
        rule: 'postposition_usage',
        examples: ['घर में (in the house)', 'मेज़ पर (on the table)']
      });
    }

    return suggestions;
  }

  private applyJapaneseAdvancedRules(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];

    // Check for particle usage
    const particleCheck = /\b(は|が|を|に|で|から|まで|と)\s+/g;
    const matches = Array.from(text.matchAll(particleCheck));
    
    for (const match of matches) {
      suggestions.push({
        type: 'grammar',
        severity: 'suggestion',
        original: match[0],
        corrected: match[0],
        explanation: '助詞の適切な使用を確認してください',
        rule: 'particle_usage',
        examples: ['私は学生です', '本を読みます', '学校に行きます']
      });
    }

    return suggestions;
  }

  private applyChineseAdvancedRules(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];

    // Check for measure word usage
    const measureWordCheck = /\b(一|二|三|四|五|六|七|八|九|十)\s+([^个条本张片只])/g;
    const matches = Array.from(text.matchAll(measureWordCheck));
    
    for (const match of matches) {
      suggestions.push({
        type: 'grammar',
        severity: 'suggestion',
        original: match[0],
        corrected: match[0],
        explanation: '请检查量词的使用是否正确',
        rule: 'measure_word',
        examples: ['一本书', '两条鱼', '三张纸']
      });
    }

    return suggestions;
  }

  private hasSubjectAndVerb(sentence: string): boolean {
    // Simplified check for English sentences
    const commonVerbs = /\b(is|are|was|were|have|has|had|do|does|did|will|would|can|could|should|may|might|must|go|goes|went|come|comes|came|make|makes|made|take|takes|took|get|gets|got|see|sees|saw|know|knows|knew|think|thinks|thought|say|says|said|give|gives|gave)\b/i;
    const hasVerb = commonVerbs.test(sentence);
    const hasSubject = sentence.trim().length > 2; // Very basic check
    
    return hasVerb && hasSubject;
  }

  private async getAICorrections(text: string, language: Language): Promise<{ correctedText: string; suggestions: GrammarSuggestion[] }> {
    const systemPrompt = `You are an expert English grammar and spelling checker. The user's text is written in English.
Analyze ONLY for English grammar, spelling, punctuation, and style errors.
NEVER translate the text into another language. NEVER replace English words with non-English words.
If the text is already correct, return it unchanged with an empty suggestions array.
Return a JSON response with:
    {
      "correctedText": "the corrected English text",
      "suggestions": [
        {
          "type": "grammar|spelling|style|punctuation|syntax",
          "severity": "error|warning|suggestion",
          "original": "original text",
          "corrected": "corrected text",
          "explanation": "brief explanation in English",
          "rule": "rule_name",
          "examples": ["example1", "example2"]
        }
      ]
    }`;

    try {
      const completion = await openaiService.generateOutput(
        `${systemPrompt}\n\nText to analyze: "${text}"`
      );

      const parsed = JSON.parse(completion);
      return {
        correctedText: parsed.correctedText || text,
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      console.warn('Failed to parse AI grammar response:', error);
      return { correctedText: text, suggestions: [] };
    }
  }

  private calculateConfidence(suggestions: GrammarSuggestion[]): number {
    if (suggestions.length === 0) return 1.0;

    const weights = {
      error: 0.9,
      warning: 0.7,
      suggestion: 0.5
    };

    const totalWeight = suggestions.reduce((acc, suggestion) => {
      return acc + weights[suggestion.severity];
    }, 0);

    return Math.min(1.0, totalWeight / suggestions.length);
  }

  getLocalizedMessage(messageKey: keyof LocalizedMessages, language: Language): string {
    const messages = localizedMessages[language.code] || localizedMessages.en;
    return messages[messageKey];
  }

  getLocalizedRuleExplanation(rule: string, language: Language): string {
    const explanations = localizedRuleExplanations[language.code] || localizedRuleExplanations.en;
    return explanations[rule] || rule;
  }

  // Context-aware enhancement method
  async enhanceWithContext(text: string, language: Language, context?: { domain?: string; tone?: string; audience?: string }): Promise<AdvancedGrammarCorrection> {
    const baseResult = await this.correctText(text, language);
    
    if (!context) {
      return baseResult;
    }

    // Apply context-specific enhancements
    const contextEnhancements = await this.applyContextualEnhancements(baseResult, context, language);
    
    return {
      ...baseResult,
      corrected: contextEnhancements.text,
      suggestions: [...baseResult.suggestions, ...contextEnhancements.suggestions]
    };
  }

  private async applyContextualEnhancements(
    result: AdvancedGrammarCorrection, 
    context: { domain?: string; tone?: string; audience?: string }, 
    language: Language
  ): Promise<{ text: string; suggestions: GrammarSuggestion[] }> {
    const suggestions: GrammarSuggestion[] = [];
    let enhancedText = result.corrected;

    // Domain-specific enhancements
    if (context.domain) {
      const domainResult = await this.applyDomainSpecificEnhancements(enhancedText, context.domain, language);
      enhancedText = domainResult.text;
      suggestions.push(...domainResult.suggestions);
    }

    // Tone adjustments
    if (context.tone) {
      const toneResult = await this.applyToneAdjustments(enhancedText, context.tone, language);
      enhancedText = toneResult.text;
      suggestions.push(...toneResult.suggestions);
    }

    // Audience-specific adjustments
    if (context.audience) {
      const audienceResult = await this.applyAudienceAdjustments(enhancedText, context.audience, language);
      enhancedText = audienceResult.text;
      suggestions.push(...audienceResult.suggestions);
    }

    return { text: enhancedText, suggestions };
  }

  private async applyDomainSpecificEnhancements(text: string, domain: string, language: Language): Promise<{ text: string; suggestions: GrammarSuggestion[] }> {
    const suggestions: GrammarSuggestion[] = [];
    let enhancedText = text;

    // Domain-specific terminology and style adjustments
    const domainEnhancements: { [key: string]: { [lang: string]: Array<{ pattern: RegExp; replacement: string; explanation: string }> } } = {
      business: {
        en: [
          { pattern: /\bvery good\b/gi, replacement: 'excellent', explanation: 'Use more professional terminology in business contexts' },
          { pattern: /\bokay\b/gi, replacement: 'acceptable', explanation: 'Use formal language in business communication' }
        ],
        es: [
          { pattern: /\bmuy bien\b/gi, replacement: 'excelente', explanation: 'Usar terminología más profesional en contextos empresariales' }
        ],
        fr: [
          { pattern: /\btrès bien\b/gi, replacement: 'excellent', explanation: 'Utiliser une terminologie plus professionnelle dans les contextes d\'affaires' }
        ],
        de: [
          { pattern: /\bsehr gut\b/gi, replacement: 'ausgezeichnet', explanation: 'Verwenden Sie professionellere Terminologie in Geschäftskontexten' }
        ],
        hi: [
          { pattern: /\bबहुत अच्छा\b/gi, replacement: 'उत्कृष्ट', explanation: 'व्यावसायिक संदर्भों में अधिक पेशेवर शब्दावली का उपयोग करें' }
        ]
      },
      academic: {
        en: [
          { pattern: /\bi think\b/gi, replacement: 'it is evident that', explanation: 'Use more authoritative language in academic writing' },
          { pattern: /\ba lot of\b/gi, replacement: 'numerous', explanation: 'Use precise quantifiers in academic contexts' }
        ],
        es: [
          { pattern: /\bcreo que\b/gi, replacement: 'es evidente que', explanation: 'Usar lenguaje más autoritativo en escritura académica' }
        ],
        fr: [
          { pattern: /\bje pense que\b/gi, replacement: 'il est évident que', explanation: 'Utiliser un langage plus autoritaire dans l\'écriture académique' }
        ]
      },
      technical: {
        en: [
          { pattern: /\bfix\b/gi, replacement: 'resolve', explanation: 'Use precise technical terminology' },
          { pattern: /\bbreak\b/gi, replacement: 'malfunction', explanation: 'Use specific technical language' }
        ],
        es: [
          { pattern: /\barreglar\b/gi, replacement: 'resolver', explanation: 'Usar terminología técnica precisa' }
        ]
      }
    };

    const langEnhancements = domainEnhancements[domain]?.[language.code];
    if (langEnhancements) {
      for (const enhancement of langEnhancements) {
        if (enhancement.pattern.test(enhancedText)) {
          enhancedText = enhancedText.replace(enhancement.pattern, enhancement.replacement);
          suggestions.push({
            type: 'style',
            severity: 'suggestion',
            original: text,
            corrected: enhancedText,
            explanation: enhancement.explanation,
            rule: `${domain}_terminology`,
            examples: [`${enhancement.pattern.source} → ${enhancement.replacement}`]
          });
        }
      }
    }

    return { text: enhancedText, suggestions };
  }

  private async applyToneAdjustments(text: string, tone: string, language: Language): Promise<{ text: string; suggestions: GrammarSuggestion[] }> {
    const suggestions: GrammarSuggestion[] = [];
    let adjustedText = text;

    // Tone-specific adjustments
    switch (tone) {
      case 'formal':
        adjustedText = await this.makeFormal(adjustedText, language, suggestions);
        break;
      case 'casual':
        adjustedText = await this.makeCasual(adjustedText, language, suggestions);
        break;
      case 'professional':
        adjustedText = await this.makeProfessional(adjustedText, language, suggestions);
        break;
    }

    return { text: adjustedText, suggestions };
  }

  private async makeFormal(text: string, language: Language, suggestions: GrammarSuggestion[]): Promise<string> {
    let formalText = text;

    const formalizations: { [key: string]: Array<{ pattern: RegExp; replacement: string; explanation: string }> } = {
      en: [
        { pattern: /\bcan't\b/gi, replacement: 'cannot', explanation: 'Use full forms in formal writing' },
        { pattern: /\bdon't\b/gi, replacement: 'do not', explanation: 'Avoid contractions in formal contexts' },
        { pattern: /\bwon't\b/gi, replacement: 'will not', explanation: 'Use complete forms for formality' }
      ],
      es: [
        { pattern: /\bno sé\b/gi, replacement: 'desconozco', explanation: 'Usar formas más formales' }
      ],
      fr: [
        { pattern: /\bje sais pas\b/gi, replacement: 'je ne sais pas', explanation: 'Utiliser la négation complète en français formel' }
      ]
    };

    const langFormalizations = formalizations[language.code];
    if (langFormalizations) {
      for (const formal of langFormalizations) {
        if (formal.pattern.test(formalText)) {
          formalText = formalText.replace(formal.pattern, formal.replacement);
          suggestions.push({
            type: 'style',
            severity: 'suggestion',
            original: text,
            corrected: formalText,
            explanation: formal.explanation,
            rule: 'formal_tone',
            examples: [`${formal.pattern.source} → ${formal.replacement}`]
          });
        }
      }
    }

    return formalText;
  }

  private async makeCasual(_text: string, _language: Language, _suggestions: GrammarSuggestion[]): Promise<string> {
    // Implement casual tone adjustments
    return _text; // Placeholder
  }

  private async makeProfessional(_text: string, _language: Language, _suggestions: GrammarSuggestion[]): Promise<string> {
    // Implement professional tone adjustments
    return _text; // Placeholder
  }

  private async applyAudienceAdjustments(text: string, _audience: string, _language: Language): Promise<{ text: string; suggestions: GrammarSuggestion[] }> {
    // Implement audience-specific adjustments
    return { text, suggestions: [] }; // Placeholder
  }
}

// Export singleton instance
export const advancedGrammarCorrector = new AdvancedGrammarCorrector();

// Backward compatibility function
export async function correctGrammarAdvanced(text: string, language?: Language): Promise<AdvancedGrammarCorrection> {
  return await advancedGrammarCorrector.correctText(text, language);
}
