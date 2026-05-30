import { detectLanguage } from './languageDetector';

// Minimal typings for Web Speech API to avoid using 'any'
type SpeechRecognitionResultItem = {
  0: { transcript: string; confidence: number };
  isFinal: boolean;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultItem>;
};

type WebSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  language: string;
  detectedLanguage?: string;
}

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  autoDetectLanguage?: boolean;
}

export class SpeechRecognitionService {
  private recognition: WebSpeechRecognition | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    // Check for Web Speech API support
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => WebSpeechRecognition; webkitSpeechRecognition?: new () => WebSpeechRecognition; }).SpeechRecognition
      || (window as unknown as { SpeechRecognition?: new () => WebSpeechRecognition; webkitSpeechRecognition?: new () => WebSpeechRecognition; }).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    // Configure recognition settings
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    
    // Auto-detect language or use default
    this.recognition.lang = this.getDefaultLanguage();
  }

  // Note: We keep a single-language configuration. Transcript-based detection is handled separately.

  private getDefaultLanguage(): string {
    // Map common language codes to speech recognition format
    const languageMap: { [key: string]: string } = {
      // English
      'en': 'en-US',
      
      // Indian Languages
      'hi': 'hi-IN',  // Hindi
      'gu': 'gu-IN',  // Gujarati
      'bn': 'bn-IN',  // Bengali
      'te': 'te-IN',  // Telugu
      'mr': 'mr-IN',  // Marathi
      'ta': 'ta-IN',  // Tamil
      'ur': 'ur-IN',  // Urdu
      'kn': 'kn-IN',  // Kannada
      'ml': 'ml-IN',  // Malayalam
      'or': 'or-IN',  // Odia
      'as': 'as-IN',  // Assamese
      'pa': 'pa-IN',  // Punjabi
      
      // European Languages
      'es': 'es-ES',  // Spanish
      'fr': 'fr-FR',  // French
      'de': 'de-DE',  // German
      'it': 'it-IT',  // Italian
      'pt': 'pt-PT',  // Portuguese
      'ru': 'ru-RU',  // Russian
      'nl': 'nl-NL',  // Dutch
      'sv': 'sv-SE',  // Swedish
      'no': 'no-NO',  // Norwegian
      'da': 'da-DK',  // Danish
      'pl': 'pl-PL',  // Polish
      'cs': 'cs-CZ',  // Czech
      'hu': 'hu-HU',  // Hungarian
      'fi': 'fi-FI',  // Finnish
      'el': 'el-GR',  // Greek
      'uk': 'uk-UA',  // Ukrainian
      'ro': 'ro-RO',  // Romanian
      'bg': 'bg-BG',  // Bulgarian
      
      // Asian Languages
      'zh': 'zh-CN',  // Chinese
      'ja': 'ja-JP',  // Japanese
      'ko': 'ko-KR',  // Korean
      'th': 'th-TH',  // Thai
      'vi': 'vi-VN',  // Vietnamese
      'id': 'id-ID',  // Indonesian
      'ms': 'ms-MY',  // Malay
      
      // South Asian Languages
      'ne': 'ne-NP',  // Nepali
      'si': 'si-LK',  // Sinhala
      'my': 'my-MM',  // Burmese

      // Southeast Asian Languages
      'tl': 'tl-PH',  // Filipino
      'km': 'km-KH',  // Khmer
      'lo': 'lo-LA',  // Lao

      // African Languages
      'am': 'am-ET',  // Amharic
      'ha': 'ha-NG',  // Hausa
      'yo': 'yo-NG',  // Yoruba
      'zu': 'zu-ZA',  // Zulu
      'xh': 'xh-ZA',  // Xhosa

      // Native American Languages
      'nv': 'nv-US',  // Navajo

      // Constructed Languages
      'eo': 'eo',     // Esperanto

      // Middle Eastern & African Languages
      'ar': 'ar-SA',  // Arabic
      'fa': 'fa-IR',  // Persian
      'tr': 'tr-TR',  // Turkish
      'he': 'he-IL',  // Hebrew
      'sw': 'sw-KE'   // Swahili
    };

    const browserLang = navigator.language.split('-')[0];
    return languageMap[browserLang] || 'en-US';
  }

  public isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void,
    options?: SpeechRecognitionOptions
  ): void {
    if (!this.isSupported || !this.recognition) {
      onError('Speech recognition is not supported in this browser');
      return;
    }

    if (this.isListening) {
      this.stopListening();
      return;
    }

    // Always ensure we have a valid single language code
    this.reinitializeRecognition();
    this.setupRecognition();

    // Apply options if provided
    if (options?.language) {
      this.recognition.lang = options.language;
    }
    if (options?.continuous !== undefined) {
      this.recognition.continuous = options.continuous;
    }
    if (options?.interimResults !== undefined) {
      this.recognition.interimResults = options.interimResults;
    }

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          
          // Detect language from final transcript for UI indication (does not change recognition.lang)
          let detectedLanguage = undefined;
          if (finalTranscript.trim()) {
            detectedLanguage = this.detectLanguageFromTranscript(finalTranscript);
          }
          
          onResult({
            transcript: finalTranscript,
            confidence: confidence || 0.9,
            language: this.recognition ? this.recognition.lang : this.getDefaultLanguage(),
            detectedLanguage: detectedLanguage
          });
        } else {
          interimTranscript += transcript;
          // Optionally handle interim results
          if (options?.interimResults) {
            onResult({
              transcript: interimTranscript,
              confidence: confidence || 0.5,
              language: this.recognition ? this.recognition.lang : this.getDefaultLanguage(),
              detectedLanguage: undefined
            });
          }
        }
      }
    };

    this.recognition.onerror = (event: { error: string }) => {
      this.isListening = false;
      let errorMessage = 'Speech recognition error occurred';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone access denied or not available.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred during speech recognition.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      onError(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    // Start recognition
    try {
      this.recognition.start();
    } catch {
      this.isListening = false;
      onError('Failed to start speech recognition');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public setLanguage(language: string): void {
    if (this.recognition) {
      this.recognition.lang = language;
      console.log(`Speech recognition language set to: ${language}`);
    }
  }

  public setLanguageFromDetectedLanguage(detectedLanguage: string): void {
    // Map detected language codes to speech recognition language codes
    const languageMap: { [key: string]: string } = {
      // English
      'en': 'en-US',
      
      // Indian Languages
      'hi': 'hi-IN',  // Hindi
      'gu': 'gu-IN',  // Gujarati
      'bn': 'bn-IN',  // Bengali
      'te': 'te-IN',  // Telugu
      'mr': 'mr-IN',  // Marathi
      'ta': 'ta-IN',  // Tamil
      'ur': 'ur-IN',  // Urdu
      'kn': 'kn-IN',  // Kannada
      'ml': 'ml-IN',  // Malayalam
      'or': 'or-IN',  // Odia
      'as': 'as-IN',  // Assamese
      'pa': 'pa-IN',  // Punjabi
      
      // European Languages
      'es': 'es-ES',  // Spanish
      'fr': 'fr-FR',  // French
      'de': 'de-DE',  // German
      'it': 'it-IT',  // Italian
      'pt': 'pt-PT',  // Portuguese
      'ru': 'ru-RU',  // Russian
      'nl': 'nl-NL',  // Dutch
      'sv': 'sv-SE',  // Swedish
      'no': 'no-NO',  // Norwegian
      'da': 'da-DK',  // Danish
      'pl': 'pl-PL',  // Polish
      'cs': 'cs-CZ',  // Czech
      'hu': 'hu-HU',  // Hungarian
      'fi': 'fi-FI',  // Finnish
      'el': 'el-GR',  // Greek
      'uk': 'uk-UA',  // Ukrainian
      'ro': 'ro-RO',  // Romanian
      'bg': 'bg-BG',  // Bulgarian
      
      // Asian Languages
      'zh': 'zh-CN',  // Chinese
      'ja': 'ja-JP',  // Japanese
      'ko': 'ko-KR',  // Korean
      'th': 'th-TH',  // Thai
      'vi': 'vi-VN',  // Vietnamese
      'id': 'id-ID',  // Indonesian
      'ms': 'ms-MY',  // Malay
      
      // South Asian Languages
      'ne': 'ne-NP',  // Nepali
      'si': 'si-LK',  // Sinhala
      'my': 'my-MM',  // Burmese

      // Southeast Asian Languages
      'tl': 'tl-PH',  // Filipino
      'km': 'km-KH',  // Khmer
      'lo': 'lo-LA',  // Lao

      // African Languages
      'am': 'am-ET',  // Amharic
      'ha': 'ha-NG',  // Hausa
      'yo': 'yo-NG',  // Yoruba
      'zu': 'zu-ZA',  // Zulu
      'xh': 'xh-ZA',  // Xhosa

      // Native American Languages
      'nv': 'nv-US',  // Navajo

      // Constructed Languages
      'eo': 'eo',     // Esperanto

      // Middle Eastern & African Languages
      'ar': 'ar-SA',  // Arabic
      'fa': 'fa-IR',  // Persian
      'tr': 'tr-TR',  // Turkish
      'he': 'he-IL',  // Hebrew
      'sw': 'sw-KE'   // Swahili
    };

    const speechLang = languageMap[detectedLanguage] || 'en-US';
    console.log(`Setting speech recognition language from ${detectedLanguage} to ${speechLang}`);
    this.setLanguage(speechLang);
    
    // Reinitialize recognition to ensure language change takes effect
    this.reinitializeRecognition();
  }

  private reinitializeRecognition(): void {
    if (this.isSupported) {
      // Stop any current listening
      if (this.isListening) {
        this.stopListening();
      }
      
      const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => WebSpeechRecognition; webkitSpeechRecognition?: new () => WebSpeechRecognition; }).SpeechRecognition
        || (window as unknown as { SpeechRecognition?: new () => WebSpeechRecognition; webkitSpeechRecognition?: new () => WebSpeechRecognition; }).webkitSpeechRecognition;
      if (SpeechRecognition) {
        // Create new recognition instance
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
        console.log('Speech recognition reinitialized with new language');
      }
    }
  }

  private detectLanguageFromTranscript(transcript: string): string {
    try {
      // If native scripts are present, use standard detector
      const hasDevanagari = /[\u0900-\u097F]/.test(transcript);
      const hasArabic = /[\u0600-\u06FF\u0750-\u077F]/.test(transcript);
      if (hasDevanagari || hasArabic) {
        const detectedLang = detectLanguage(transcript);
        console.log(`Auto-detected language from transcript: ${detectedLang.code} (${detectedLang.name})`);
        return detectedLang.code;
      }

      // Otherwise, try to detect romanized Hindi/Urdu from common tokens
      const romanized = transcript.toLowerCase();
      const hindiTokens = [
        'kya','aap','aapka','apka','mere','meri','mera','liye','ke liye','k liye','hain','hai','likh','sakta','sakti','sakte','kripya','kripa','dhanyavad','shukriya'
      ];
      const urduTokens = [
        'kya','aap','apka','aapka','mujhay','mujhe','liye','ke liye','hain','hai','likh','sakta','sakti','sakte','meherbani','shukriya','baraye','krdo','kijiye','karo','kro'
      ];
      const countTokens = (tokens: string[]) => tokens.reduce((acc, t) => acc + (romanized.includes(t) ? 1 : 0), 0);
      const hiScore = countTokens(hindiTokens);
      const urScore = countTokens(urduTokens);
      if (hiScore >= 2 || urScore >= 2) {
        const winner = urScore > hiScore ? 'ur' : 'hi';
        console.log(`Heuristically detected romanized ${winner.toUpperCase()} from transcript.`);
        return winner;
      }

      // Fallback to generic detection (likely English)
      const detectedLang = detectLanguage(transcript);
      return detectedLang.code;
    } catch (error) {
      console.warn('Failed to detect language from transcript:', error);
      return 'en'; // Fallback to English
    }
  }

  public getSupportedLanguages(): string[] {
    // Common speech recognition language codes
    return [
      // English variants
      'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN',
      
      // Indian Languages
      'hi-IN', 'gu-IN', 'bn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'ur-IN', 
      'kn-IN', 'ml-IN', 'or-IN', 'as-IN', 'pa-IN',
      
      // European Languages
      'es-ES', 'es-MX', 'es-AR', 'es-CO',
      'fr-FR', 'fr-CA', 'fr-BE',
      'de-DE', 'de-AT', 'de-CH',
      'it-IT', 'pt-PT', 'pt-BR',
      'ru-RU', 'pl-PL', 'cs-CZ', 'hu-HU', 'fi-FI',
      'nl-NL', 'sv-SE', 'no-NO', 'da-DK',
      'el-GR', 'uk-UA', 'ro-RO', 'bg-BG',
      
      // Asian Languages
      'zh-CN', 'zh-TW', 'zh-HK',
      'ja-JP', 'ko-KR',
      'th-TH', 'vi-VN', 'id-ID', 'ms-MY',
      
      // South Asian Languages
      'ne-NP', 'si-LK', 'my-MM',
      
      // Southeast Asian Languages
      'tl-PH', 'km-KH', 'lo-LA',
      
      // Middle Eastern & African Languages
      'ar-SA', 'ar-EG', 'ar-AE',
      'fa-IR', 'tr-TR', 'he-IL',
      'sw-KE', 'am-ET', 'ha-NG', 'yo-NG', 'zu-ZA', 'xh-ZA',
      
      // Native American Languages
      'nv-US',
      
      // Constructed Languages
      'eo'
    ];
  }
}

export const speechRecognitionService = new SpeechRecognitionService();