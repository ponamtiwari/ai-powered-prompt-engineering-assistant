import { advancedGrammarCorrector } from './advancedGrammarCorrector';
import { detectLanguage } from './languageDetector';

// Test suite for the enhanced grammar correction system
export interface GrammarTestCase {
  input: string;
  language: string;
  expectedCorrections: number;
  description: string;
}

export const grammarTestCases: GrammarTestCase[] = [
  // English tests
  {
    input: "I need to write a email for new joinee announcement.",
    language: "en",
    expectedCorrections: 2,
    description: "English: Article correction and spelling fix"
  },
  {
    input: "He are going to the store and she were coming with him.",
    language: "en", 
    expectedCorrections: 2,
    description: "English: Subject-verb agreement errors"
  },
  {
    input: "I don't have no time for this meeting.",
    language: "en",
    expectedCorrections: 1,
    description: "English: Double negative detection"
  },
  {
    input: "There going to they're house with their friends.",
    language: "en",
    expectedCorrections: 2,
    description: "English: Contextual spelling (there/their/they're)"
  },
  
  // Spanish tests
  {
    input: "El casa es muy grande y la coche es rojo.",
    language: "es",
    expectedCorrections: 2,
    description: "Spanish: Gender agreement errors"
  },
  {
    input: "Por que no vienes a la fiesta?",
    language: "es",
    expectedCorrections: 1,
    description: "Spanish: Por qué vs porque usage"
  },
  
  // French tests
  {
    input: "Le eau est froide et la école est fermée.",
    language: "fr",
    expectedCorrections: 2,
    description: "French: Elision errors"
  },
  {
    input: "Je ne sais pas ou tu vas.",
    language: "fr",
    expectedCorrections: 1,
    description: "French: Ou vs où distinction"
  },
  
  // German tests
  {
    input: "der hund läuft schnell durch die straße.",
    language: "de",
    expectedCorrections: 2,
    description: "German: Noun capitalization"
  },
  
  // Hindi tests
  {
    input: "मैं एक ईमेल लिखना चाहता हूं नए कर्मचारी के लिए।",
    language: "hi",
    expectedCorrections: 0,
    description: "Hindi: Correct sentence (no errors expected)"
  },
  
  // Mixed language test
  {
    input: "Hello, मैं write करना चाहता हूं email।",
    language: "en",
    expectedCorrections: 1,
    description: "Mixed language: Code-switching detection"
  }
];

export async function runGrammarTests(): Promise<{ passed: number; failed: number; results: Array<{ test: GrammarTestCase; result: any; passed: boolean }> }> {
  const results = [];
  let passed = 0;
  let failed = 0;

  for (const testCase of grammarTestCases) {
    try {
      const language = detectLanguage(testCase.input);
      const result = await advancedGrammarCorrector.correctText(testCase.input, language);
      
      const actualCorrections = result.suggestions.length;
      const testPassed = actualCorrections >= testCase.expectedCorrections;
      
      if (testPassed) {
        passed++;
      } else {
        failed++;
      }
      
      results.push({
        test: testCase,
        result: {
          original: result.original,
          corrected: result.corrected,
          suggestions: result.suggestions,
          confidence: result.confidence,
          processingTime: result.processingTime,
          actualCorrections,
          expectedCorrections: testCase.expectedCorrections
        },
        passed: testPassed
      });
      
      console.log(`✓ ${testCase.description}: ${testPassed ? 'PASSED' : 'FAILED'} (${actualCorrections}/${testCase.expectedCorrections} corrections)`);
      
    } catch (error) {
      failed++;
      results.push({
        test: testCase,
        result: { error: error instanceof Error ? error.message : String(error) },
        passed: false
      });
      
      console.log(`✗ ${testCase.description}: ERROR - ${error}`);
    }
  }

  return { passed, failed, results };
}

// Function to test localized templates
export async function testLocalizedTemplates(): Promise<void> {
  const testPrompts = [
    { text: "Write an email for new employee announcement", language: "en" },
    { text: "Escribir un correo para anuncio de nuevo empleado", language: "es" },
    { text: "Écrire un e-mail pour l'annonce d'un nouvel employé", language: "fr" },
    { text: "नए कर्मचारी की घोषणा के लिए ईमेल लिखें", language: "hi" }
  ];

  console.log("\n🌍 Testing Localized Templates:");
  console.log("================================");

  for (const prompt of testPrompts) {
    try {
      const language = detectLanguage(prompt.text);
      const result = await advancedGrammarCorrector.correctText(prompt.text, language);
      
      console.log(`\n📝 ${language.nativeName} (${language.code}):`);
      console.log(`   Input: "${result.original}"`);
      console.log(`   Output: "${result.corrected}"`);
      console.log(`   Suggestions: ${result.suggestions.length}`);
      console.log(`   Confidence: ${Math.round(result.confidence * 100)}%`);
      console.log(`   Time: ${result.processingTime}ms`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }
  }
}

// Quick test function for development
export async function quickGrammarTest(text: string): Promise<void> {
  console.log(`\n🔍 Quick Test: "${text}"`);
  console.log("=" .repeat(50));
  
  try {
    const language = detectLanguage(text);
    const result = await advancedGrammarCorrector.correctText(text, language);
    
    console.log(`Language: ${language.nativeName} (${language.code})`);
    console.log(`Original: "${result.original}"`);
    console.log(`Corrected: "${result.corrected}"`);
    console.log(`Confidence: ${Math.round(result.confidence * 100)}%`);
    console.log(`Processing Time: ${result.processingTime}ms`);
    console.log(`Suggestions (${result.suggestions.length}):`);
    
    result.suggestions.forEach((suggestion, index) => {
      console.log(`  ${index + 1}. [${suggestion.severity.toUpperCase()}] ${suggestion.type}`);
      console.log(`     Rule: ${suggestion.rule}`);
      console.log(`     Explanation: ${suggestion.explanation}`);
      if (suggestion.examples && suggestion.examples.length > 0) {
        console.log(`     Examples: ${suggestion.examples.join(', ')}`);
      }
    });
    
  } catch (error) {
    console.log(`❌ Error: ${error}`);
  }
}
