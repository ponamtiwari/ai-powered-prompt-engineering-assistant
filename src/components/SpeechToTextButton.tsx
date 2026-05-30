import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, Globe, ChevronDown, Check } from 'lucide-react';
import { speechRecognitionService, SpeechRecognitionResult } from '../utils/speechRecognition';
import { supportedLanguages } from '../utils/languageDetector';
import { openaiService } from '../utils/openaiService';
import { detectLanguage } from '../utils/languageDetector';

interface SpeechToTextButtonProps {
  onTranscript: (text: string) => void;
  onOutputLanguageChange?: (languageCode: string) => void;
  onLanguageDetected?: (language: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SpeechToTextButton({ onTranscript, onOutputLanguageChange, onLanguageDetected, disabled = false, className = '' }: SpeechToTextButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');
  const [showLanguageIndicator, setShowLanguageIndicator] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'auto' | 'en' | 'hi' | 'ur' | 'gu' | 'bn' | 'ta' | 'te' | 'mr' | 'kn' | 'ml' | 'pa' | 'ne' | 'si' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ar' | 'zh' | 'ja' | 'ko' | 'th' | 'vi' | 'id' | 'tr' | 'pl' | 'nl' | 'sv' | 'tl' | 'sw'>('auto');
  const [isCloudMode, setIsCloudMode] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // MediaRecorder for cloud transcription (OpenAI Whisper)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setIsSupported(speechRecognitionService.isRecognitionSupported());
  }, []);

  useEffect(() => {
    onOutputLanguageChange?.(selectedLanguage);
  }, [selectedLanguage, onOutputLanguageChange]);

  const handleStartListening = () => {
    if (!isSupported) {
      setError('Speech-to-Text not supported in this browser. Please type your prompt.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    // Decide mode: Cloud whisper if API key and Auto; else browser Web Speech
    const useCloud = selectedLanguage === 'auto' && openaiService.hasApiKey();

    if (isListening) {
      if (isCloudMode && mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // no-op
        }
      } else {
        speechRecognitionService.stopListening();
      }
      setIsListening(false);
      return;
    }

    setError('');
    setShowError(false);
    setDetectedLanguage('');
    setShowLanguageIndicator(false);

    if (useCloud) {
      // Cloud mode: record audio and transcribe with OpenAI (auto language)
      setIsCloudMode(true);
      setIsListening(true);
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaStreamRef.current = stream;
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
        const recorder = new MediaRecorder(stream, { mimeType });
        chunksRef.current = [];
        recorder.ondataavailable = evt => {
          if (evt.data && evt.data.size > 0) {
            chunksRef.current.push(evt.data);
          }
        };
        recorder.onerror = () => {
          setError('Recording error. Please try again.');
          setShowError(true);
          setIsListening(false);
          setTimeout(() => setShowError(false), 5000);
        };
        recorder.onstop = async () => {
          try {
            const audioBlob = new Blob(chunksRef.current, { type: mimeType });
            // Cleanup stream tracks
            if (mediaStreamRef.current) {
              mediaStreamRef.current.getTracks().forEach(t => t.stop());
            }
            const { text, language } = await openaiService.transcribeAudio(audioBlob);
            if (text && text.trim()) {
              onTranscript(text.trim());
              const langCode = (language || detectLanguage(text).code || 'en').toLowerCase();
              setDetectedLanguage(langCode);
              setShowLanguageIndicator(true);
              if (onLanguageDetected) {
                onLanguageDetected(langCode);
              }
              setTimeout(() => setShowLanguageIndicator(false), 3000);
            }
          } catch (e: unknown) {
            const message = e instanceof Error
              ? e.message
              : (typeof e === 'object' && e && 'message' in e && typeof (e as { message?: unknown }).message === 'string'
                  ? (e as { message: string }).message
                  : 'Transcription failed.');
            setError(message);
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
          } finally {
            setIsListening(false);
            setIsCloudMode(false);
            mediaRecorderRef.current = null;
            mediaStreamRef.current = null;
            chunksRef.current = [];
          }
        };
        mediaRecorderRef.current = recorder;
        recorder.start();
      }).catch(() => {
        setError('Microphone access denied or not available.');
        setShowError(true);
        setIsListening(false);
        setIsCloudMode(false);
        setTimeout(() => setShowError(false), 5000);
      });
    } else {
      // Browser Web Speech fallback
      setIsCloudMode(false);
      // Configure recognition language based on selection
      const languageMap: Record<string, string> = {
        auto: navigator.language || 'en-US',
        // English
        en: 'en-US',
        // Indian Languages
        hi: 'hi-IN',
        gu: 'gu-IN',
        bn: 'bn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        ur: 'ur-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        pa: 'pa-IN',
        // South Asian
        ne: 'ne-NP',
        si: 'si-LK',
        // European Languages
        es: 'es-ES',
        fr: 'fr-FR',
        de: 'de-DE',
        it: 'it-IT',
        pt: 'pt-PT',
        ru: 'ru-RU',
        pl: 'pl-PL',
        nl: 'nl-NL',
        sv: 'sv-SE',
        // Asian Languages
        zh: 'zh-CN',
        ja: 'ja-JP',
        ko: 'ko-KR',
        th: 'th-TH',
        vi: 'vi-VN',
        id: 'id-ID',
        // Southeast Asian
        tl: 'tl-PH',
        // Middle Eastern & African
        ar: 'ar-SA',
        tr: 'tr-TR',
        sw: 'sw-KE',
      };
      const speechLang = languageMap[selectedLanguage] || (navigator.language || 'en-US');

      speechRecognitionService.startListening(
        (result: SpeechRecognitionResult) => {
          if (result.transcript.trim()) {
            onTranscript(result.transcript.trim());
            
            // Handle auto-detected language
            if (result.detectedLanguage && result.detectedLanguage !== detectedLanguage) {
              setDetectedLanguage(result.detectedLanguage);
              setShowLanguageIndicator(true);
              
              // Notify parent component about detected language
              if (onLanguageDetected) {
                onLanguageDetected(result.detectedLanguage);
              }
              
              // Hide language indicator after 3 seconds
              setTimeout(() => setShowLanguageIndicator(false), 3000);

              // Smart Auto: if user selected Auto and we detect hi/ur, restart with correct locale
              if (selectedLanguage === 'auto' && (result.detectedLanguage === 'hi' || result.detectedLanguage === 'ur')) {
                const newLang = result.detectedLanguage === 'hi' ? 'hi-IN' : 'ur-IN';
                speechRecognitionService.setLanguage(newLang);
                // Restart session to receive native script
                speechRecognitionService.stopListening();
                setIsListening(false);
                setTimeout(() => {
                  setIsListening(true);
                  speechRecognitionService.startListening(
                    (res2: SpeechRecognitionResult) => {
                      if (res2.transcript.trim()) {
                        onTranscript(res2.transcript.trim());
                      }
                    },
                    (err2: string) => {
                      setError(err2);
                      setShowError(true);
                      setIsListening(false);
                      setTimeout(() => setShowError(false), 5000);
                    },
                    () => setIsListening(false),
                    { autoDetectLanguage: false, continuous: false, interimResults: false, maxAlternatives: 1, language: newLang }
                  );
                }, 150);
              }
            }
          }
        },
        (errorMessage: string) => {
          setError(errorMessage);
          setShowError(true);
          setIsListening(false);
          setTimeout(() => setShowError(false), 5000);
        },
        () => {
          setIsListening(false);
        },
        {
          autoDetectLanguage: false,
          continuous: false,
          interimResults: false,
          maxAlternatives: 1,
          language: speechLang
        }
      );

      setIsListening(true);
    }
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Language options with better formatting
  const languageOptions = [
    { value: 'auto', label: 'Auto Detect', group: 'Auto' },
    { value: 'en', label: '🇺🇸 English', group: 'Popular' },
    { value: 'hi', label: 'Hindi (हिंदी)', group: 'Indian' },
    { value: 'gu', label: 'Gujarati (ગુજરાતી)', group: 'Indian' },
    { value: 'bn', label: 'Bengali (বাংলা)', group: 'Indian' },
    { value: 'ta', label: 'Tamil (தமிழ்)', group: 'Indian' },
    { value: 'te', label: 'Telugu (తెలుగు)', group: 'Indian' },
    { value: 'mr', label: 'Marathi (मराठी)', group: 'Indian' },
    { value: 'ur', label: 'Urdu (اردو)', group: 'Indian' },
    { value: 'kn', label: 'Kannada (ಕನ್ನಡ)', group: 'Indian' },
    { value: 'ml', label: 'Malayalam (മലയാളം)', group: 'Indian' },
    { value: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)', group: 'Indian' },
    { value: 'es', label: 'Spanish (Español)', group: 'European' },
    { value: 'fr', label: 'French (Français)', group: 'European' },
    { value: 'de', label: 'German (Deutsch)', group: 'European' },
    { value: 'it', label: 'Italian (Italiano)', group: 'European' },
    { value: 'pt', label: '🇵🇹 Portuguese (Português)', group: 'European' },
    { value: 'ru', label: '🇷🇺 Russian (Русский)', group: 'European' },
    { value: 'zh', label: '🇨🇳 Chinese (中文)', group: 'Asian' },
    { value: 'ja', label: '🇯🇵 Japanese (日本語)', group: 'Asian' },
    { value: 'ko', label: '🇰🇷 Korean (한국어)', group: 'Asian' },
    { value: 'ar', label: '🇸🇦 Arabic (العربية)', group: 'Other' },
    { value: 'tr', label: '🇹🇷 Turkish (Türkçe)', group: 'Other' }
  ];

  const selectedOption = languageOptions.find(opt => opt.value === selectedLanguage);

  // Render unsupported state
  if (!isSupported) {
    return (
      <div className="relative">
        <button
          disabled
          className="p-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
          title="Speech-to-Text not supported in this browser"
        >
          <MicOff className="w-5 h-5" />
        </button>
        {showError && (
          <div role="alert" className="absolute top-full left-0 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg z-10 min-w-64">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2">
      {/* Custom Language Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => !disabled && !isListening && setShowLanguageDropdown(!showLanguageDropdown)}
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs border rounded-lg bg-white transition-all duration-200 min-w-[80px] ${
            disabled || isListening 
              ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:shadow-sm cursor-pointer'
          }`}
          title="Select speech input language"
          disabled={isListening || disabled}
        >
          <Globe className="w-3 h-3 flex-shrink-0" />
          <span className="truncate text-xs">{selectedOption?.label.split(' ')[0] || '🌐'}</span>
          <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {showLanguageDropdown && !disabled && !isListening && (
          <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
            <div className="p-1 max-h-80 overflow-y-auto">
              {/* Group languages by category */}
              {[
                { group: 'Auto', options: languageOptions.filter(opt => opt.group === 'Auto') },
                { group: 'Popular', options: languageOptions.filter(opt => opt.group === 'Popular') },
                { group: 'Indian Languages', options: languageOptions.filter(opt => opt.group === 'Indian') },
                { group: 'European', options: languageOptions.filter(opt => opt.group === 'European') },
                { group: 'Asian', options: languageOptions.filter(opt => opt.group === 'Asian') },
                { group: 'Other', options: languageOptions.filter(opt => opt.group === 'Other') }
              ].map(({ group, options }) => (
                <div key={group} className="mb-1">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 rounded-md mx-1">
                    {group}
                  </div>
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const nextLang = option.value as typeof selectedLanguage;
                        setSelectedLanguage(nextLang);
                        onOutputLanguageChange?.(nextLang);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-gray-50 transition-colors mx-1 ${
                        selectedLanguage === option.value 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {option.label}
                      </span>
                      {selectedLanguage === option.value && (
                        <Check className="w-3 h-3 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Microphone Button */}
      <button
        onClick={handleStartListening}
        disabled={disabled}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isListening
            ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse'
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        } ${className}`}
        title={isListening ? 'Stop recording' : 'Start voice input'}
      >
        {isListening ? (
          <div className="flex items-center gap-1">
            <Volume2 className="w-5 h-5" />
          </div>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Auto-detected Language Indicator */}
      {showLanguageIndicator && detectedLanguage && (
        <div className="absolute -bottom-8 left-0 text-xs font-medium px-2 py-1 rounded border bg-green-50 border-green-200 text-green-600">
          🎯 {supportedLanguages.find(l => l.code === detectedLanguage)?.nativeName || 'Auto-detected'}
        </div>
      )}

      {/* Listening indicator */}
      {isListening && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
      )}

      {/* Error message */}
      {showError && error && (
        <div role="alert" className="absolute top-full left-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg z-10 min-w-64">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Listening status */}
      {isListening && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg shadow-lg z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-800">Listening...</p>
          </div>
        </div>
      )}
    </div>
  );
}