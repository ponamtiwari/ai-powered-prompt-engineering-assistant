// Simple grammar and spelling correction utility
export function correctGrammar(text: string): string {
  if (!text || text.trim().length === 0) return text;

  let corrected = text;

  // Common spelling corrections
  const spellingCorrections: Record<string, string> = {
    // Email related
    'emale': 'email',
    'emaul': 'email',
    'emial': 'email',
    'emai': 'email',
    'e-mail': 'email',
    
    // Application related
    'appication': 'application',
    'aplication': 'application',
    'aplications': 'applications',
    'applicaton': 'application',
    
    // Joining related
    'joiining': 'joining',
    'joing': 'joining',
    'joinig': 'joining',
    'joinin': 'joining',
    
    // Common words
    'recieve': 'receive',
    'recieved': 'received',
    'seperate': 'separate',
    'definately': 'definitely',
    'occured': 'occurred',
    'occurence': 'occurrence',
    'accomodate': 'accommodate',
    'begining': 'beginning',
    'calender': 'calendar',
    'cemetary': 'cemetery',
    'changable': 'changeable',
    'collegue': 'colleague',
    'concious': 'conscious',
    'embarass': 'embarrass',
    'enviroment': 'environment',
    'existance': 'existence',
    'foriegn': 'foreign',
    'goverment': 'government',
    'harrass': 'harass',
    'independant': 'independent',
    'judgement': 'judgment',
    'knowlege': 'knowledge',
    'liason': 'liaison',
    'maintainance': 'maintenance',
    'neccessary': 'necessary',
    'occassion': 'occasion',
    'perseverence': 'perseverance',
    'priviledge': 'privilege',
    'publically': 'publicly',
    'questionaire': 'questionnaire',
    'recomend': 'recommend',
    'relevent': 'relevant',
    'responsability': 'responsibility',
    'rythm': 'rhythm',
    'succesful': 'successful',
    'tommorow': 'tomorrow',
    'untill': 'until',
    'vaccuum': 'vacuum',
    'wierd': 'weird',
    
    // Technical terms
    'sofware': 'software',
    'programing': 'programming',
    'databse': 'database',
    'algoritm': 'algorithm',
    'developement': 'development',
    'managment': 'management',
    'requirment': 'requirement',
    'requirments': 'requirements',
    'performace': 'performance',
    'secuirty': 'security',
    'integeration': 'integration',
    'implmentation': 'implementation',
    
    // Business terms
    'bussiness': 'business',
    'profesional': 'professional',
    'organziation': 'organization',
    'comunication': 'communication',
    'colaboration': 'collaboration',
    'anouncement': 'announcement',
    'employe': 'employee',
    'employes': 'employees',
    'departement': 'department',
    'responsibilty': 'responsibility',
    'oportunity': 'opportunity',
    'experiance': 'experience',
    'qualifcation': 'qualification',
    'qualifcations': 'qualifications',
  };

  // Apply spelling corrections (case-insensitive)
  Object.entries(spellingCorrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, (match) => {
      // Preserve original case
      if (match === match.toUpperCase()) return correct.toUpperCase();
      if (match[0] === match[0].toUpperCase()) {
        return correct.charAt(0).toUpperCase() + correct.slice(1);
      }
      return correct;
    });
  });

  // Grammar corrections
  const grammarCorrections: Array<[RegExp, string]> = [
    // Fix "a" vs "an"
    [/\ba ([aeiouAEIOU])/g, 'an $1'],
    [/\ban ([^aeiouAEIOU])/g, 'a $1'],
    
    // Fix common grammar patterns
    [/\bcan you create an (.+) for (.+)/gi, 'Can you create a $1 for $2'],
    [/\bi want to (.+)/gi, 'I want to $1'],
    [/\bplease (.+)/gi, 'Please $1'],
    [/\bhelp me (.+)/gi, 'Help me $1'],
    [/\bmake me (.+)/gi, 'Make me $1'],
    [/\bwrite me (.+)/gi, 'Write me $1'],
    [/\bcreate me (.+)/gi, 'Create me $1'],
    [/\bgenerate me (.+)/gi, 'Generate me $1'],
    
    // Fix sentence structure
    [/^([a-z])/g, (match) => match.toUpperCase()], // Capitalize first letter
    [/\s+/g, ' '], // Remove extra spaces
    [/\s+([.!?])/g, '$1'], // Remove space before punctuation
  ];

  grammarCorrections.forEach(([pattern, replacement]) => {
    corrected = corrected.replace(pattern, replacement);
  });

  // Clean up extra spaces and trim
  corrected = corrected.replace(/\s+/g, ' ').trim();

  return corrected;
}

export function hasGrammarErrors(original: string, corrected: string): boolean {
  return original.trim() !== corrected.trim();
}

export function getGrammarSuggestions(original: string, corrected: string): string[] {
  const suggestions: string[] = [];
  
  if (original !== corrected) {
    // Find specific changes
    const originalWords = original.toLowerCase().split(/\s+/);
    const correctedWords = corrected.toLowerCase().split(/\s+/);
    
    const changes = new Set<string>();
    
    originalWords.forEach((word, index) => {
      if (correctedWords[index] && word !== correctedWords[index]) {
        changes.add(`"${word}" → "${correctedWords[index]}"`);
      }
    });
    
    if (changes.size > 0) {
      suggestions.push(`Spelling/Grammar corrections: ${Array.from(changes).join(', ')}`);
    }
    
    if (original[0] !== original[0].toUpperCase() && corrected[0] === corrected[0].toUpperCase()) {
      suggestions.push('Capitalized first letter');
    }
  }
  
  return suggestions;
}