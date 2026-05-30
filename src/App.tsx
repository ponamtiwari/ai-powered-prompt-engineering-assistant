import { useState, useCallback } from 'react';
import { Sparkles, Wand2, Copy, CheckCircle2, ArrowUp, Key, Play, AlertCircle, ExternalLink, Bot, Zap } from 'lucide-react';
import { enhanceMore, generateEnhancedOutput, enhancePromptWithAI, createAIEnhancementPrompt } from './utils/enhanceMore';
import { openaiService } from './utils/openaiService';
import { localizePrompt, requiresTranslationApiKey } from './utils/promptLanguageBuilder';
import { correctGrammarMultilingual, hasGrammarErrors, EnhancedGrammarCorrection } from './utils/enhancedGrammarCorrector';
import { detectInputLanguage, getLanguageByCode } from './utils/languageDetector';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LanguageIndicator } from './components/LanguageIndicator';
import { DownloadButtons } from './components/DownloadButtons';
import { SpeechToTextButton } from './components/SpeechToTextButton';

import type { Language } from './utils/languageDetector';

function App() {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [grammarCorrection, setGrammarCorrection] = useState<EnhancedGrammarCorrection | null>(null);
  const [showGrammarSuggestion, setShowGrammarSuggestion] = useState<boolean>(false);
  const [inputLanguage, setInputLanguage] = useState<Language | null>(null);
  const [preferredOutputLanguageCode, setPreferredOutputLanguageCode] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [apiOutput, setApiOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancingMore, setIsEnhancingMore] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<{ enhanced: boolean; output: boolean; platform: boolean }>({ enhanced: false, output: false, platform: false });
  const [canEnhanceMore, setCanEnhanceMore] = useState<boolean>(false);
  const [enhanceMoreCount, setEnhanceMoreCount] = useState<number>(0);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [showAIPlatformModal, setShowAIPlatformModal] = useState<boolean>(false);
  const [platformNotification, setPlatformNotification] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(openaiService.hasApiKey());
  const [apiError, setApiError] = useState<string>('');

  // Handle input change with grammar correction
  const handleInputChange = useCallback(async (value: string) => {
    setInputPrompt(value);
    
    if (value.trim().length > 0) {
      const correction = await correctGrammarMultilingual(value);
      setInputLanguage(correction.language);
      
      if (hasGrammarErrors(correction.original, correction.corrected)) {
        setGrammarCorrection(correction);
        setShowGrammarSuggestion(true);
      } else {
        setGrammarCorrection(correction);
        setShowGrammarSuggestion(false);
      }
    } else {
      setGrammarCorrection(null);
      setInputLanguage(null);
      setShowGrammarSuggestion(false);
    }
  }, []);

  const acceptGrammarCorrection = useCallback(() => {
    if (grammarCorrection) {
      setInputPrompt(grammarCorrection.corrected);
      setGrammarCorrection(null);
      setShowGrammarSuggestion(false);
      
      // Re-evaluate the corrected text after a brief delay
      setTimeout(() => {
        handleInputChange(grammarCorrection.corrected);
      }, 100);
    }
  }, [grammarCorrection, handleInputChange]);

  const dismissGrammarSuggestion = useCallback(() => {
    setGrammarCorrection(null);
    setShowGrammarSuggestion(false);
  }, []);

  const resolveOutputLanguage = useCallback((text: string): Language => {
    if (preferredOutputLanguageCode && preferredOutputLanguageCode !== 'auto') {
      return getLanguageByCode(preferredOutputLanguageCode);
    }
    return inputLanguage || detectInputLanguage(text);
  }, [preferredOutputLanguageCode, inputLanguage]);

  const enhancePrompt = useCallback(async () => {
    const promptToUse = grammarCorrection?.corrected || inputPrompt;
    const language = resolveOutputLanguage(promptToUse);
    
    if (!promptToUse.trim()) return;

    if (requiresTranslationApiKey(language)) {
      setApiError(`Add an OpenAI API key to translate prompts into ${language.name}.`);
      setShowApiKeyModal(true);
      return;
    }

    setIsLoading(true);
    setCanEnhanceMore(false);
    setShowGrammarSuggestion(false);
    setApiError('');
    
    try {
      const englishEnhanced = await enhancePromptWithAI(promptToUse, language);
      const enhanced = await localizePrompt(englishEnhanced, language);
        
      setEnhancedPrompt(enhanced);
      setCanEnhanceMore(true);
      setEnhanceMoreCount(0); // Reset enhance more count for new enhancement
      
      // Generate output if it's a request for specific content
      const generatedOutput = generateEnhancedOutput(promptToUse, enhanced);
      setOutput(generatedOutput);
      setApiOutput(''); // Clear previous API output
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Enhancement failed';
      setApiError(message);
      console.error('Enhancement failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [inputPrompt, grammarCorrection, resolveOutputLanguage]);

  const handleEnhanceMore = useCallback(async () => {
    if (!enhancedPrompt) return;

    const language = resolveOutputLanguage(inputPrompt);

    if (requiresTranslationApiKey(language)) {
      setApiError(`Add an OpenAI API key to translate prompts into ${language.name}.`);
      setShowApiKeyModal(true);
      return;
    }

    setIsEnhancingMore(true);
    setEnhanceMoreCount(prev => prev + 1);
    
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      let moreEnhancedEnglish: string;
      
      if (enhanceMoreCount === 0) {
        moreEnhancedEnglish = enhanceMore(inputPrompt, enhancedPrompt);
      } else if (hasApiKey) {
        try {
          const aiEnhancementPrompt = createAIEnhancementPrompt(
            inputPrompt,
            enhancedPrompt,
            enhanceMoreCount,
            language
          );
          moreEnhancedEnglish = await openaiService.enhancePromptRequest(aiEnhancementPrompt);
        } catch (aiError: unknown) {
          console.warn('AI enhancement failed, using predefined logic:', aiError);
          moreEnhancedEnglish = enhanceMore(inputPrompt, enhancedPrompt);
        }
      } else {
        moreEnhancedEnglish = enhanceMore(inputPrompt, enhancedPrompt);
      }

      const moreEnhanced = await localizePrompt(moreEnhancedEnglish, language);
      
      setEnhancedPrompt(moreEnhanced);
      
      // Update output with the more enhanced version
      const updatedOutput = generateEnhancedOutput(inputPrompt, moreEnhanced);
      setOutput(updatedOutput);
      setApiOutput(''); // Clear previous API output when enhancing more
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Further enhancement failed';
      setApiError(message);
      console.error('Further enhancement failed:', error);
    } finally {
      setIsEnhancingMore(false);
    }
  }, [inputPrompt, enhancedPrompt, enhanceMoreCount, hasApiKey, resolveOutputLanguage]);

  const handleApiKeySave = useCallback((apiKey: string) => {
    openaiService.setApiKey(apiKey);
    setHasApiKey(true);
    setApiError('');
    console.log('API key saved successfully');
  }, []);

  const generateApiOutput = useCallback(async () => {
    if (!hasApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    if (!enhancedPrompt) {
      setApiError('Please enhance your prompt first');
      return;
    }

    setIsGenerating(true);
    setApiError('');

    const language = resolveOutputLanguage(inputPrompt || enhancedPrompt);

    try {
      const result = await openaiService.generateOutput(enhancedPrompt, language);
      setApiOutput(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Generation failed';
      setApiError(message);
      if (message.includes('Invalid API key')) {
        setHasApiKey(false);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [enhancedPrompt, inputPrompt, hasApiKey, resolveOutputLanguage]);

  const copyToClipboard = async (text: string, type: 'enhanced' | 'output' | 'platform') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };

  const handleAIPlatformSearch = useCallback(async (platform: string) => {
    if (!enhancedPrompt) return;
    
    let url = '';
    let platformName = '';
    
    // Copy the prompt and show notification
    const copySuccess = await copyToClipboard(enhancedPrompt, 'platform');
    
    if (!copySuccess) {
      setPlatformNotification('Failed to copy prompt to clipboard');
      setTimeout(() => setPlatformNotification(''), 3000);
      return;
    }
    
    switch (platform) {
      case 'chatgpt':
        url = 'https://chat.openai.com/';
        platformName = 'ChatGPT';
        break;
      case 'gemini':
        url = 'https://gemini.google.com/app';
        platformName = 'Gemini';
        break;
      case 'bolt':
        url = 'https://bolt.new/';
        platformName = 'Bolt.new';
        break;
      case 'deepseek':
        url = 'https://chat.deepseek.com/';
        platformName = 'DeepSeek';
        break;
      case 'lovable':
        url = 'https://lovable.dev/';
        platformName = 'Lovable';
        break;
      case 'cline':
        // For Cline, we don't open a URL since it's a VS Code extension
        setPlatformNotification('✅ Enhanced prompt copied! Paste it in Cline (VS Code extension)');
        setTimeout(() => setPlatformNotification(''), 5000);
        setShowAIPlatformModal(false);
        return;
      default:
        return;
    }
    
    // Show notification with instructions
    setPlatformNotification(`✅ Enhanced prompt copied! Opening ${platformName} - paste the prompt there`);
    setTimeout(() => setPlatformNotification(''), 5000);
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowAIPlatformModal(false);
  }, [enhancedPrompt, copyToClipboard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prompt Enhancement Assistant</h1>
                <p className="text-sm text-gray-600">Simple prompt proofreading and enhancement</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowApiKeyModal(true)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                hasApiKey 
                  ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Key className="w-4 h-4" />
              {hasApiKey ? 'API Key Set' : 'Add API Key'}
            </button>
          </div>
        </div>
      </div>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
      />

      {/* AI Platform Modal */}
      {showAIPlatformModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Continue with AI</h3>
                  <p className="text-xs text-gray-600">Choose your AI platform</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Copy className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-800">
                    <strong>Auto-Copy:</strong> Prompt copied → Paste (Ctrl+V) in platform
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {/* ChatGPT */}
                <button
                  onClick={() => handleAIPlatformSearch('chatgpt')}
                  className="flex flex-col items-center gap-1 p-3 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">GPT</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-900">ChatGPT</span>
                    <p className="text-xs text-gray-500">OpenAI</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </button>

                {/* Gemini */}
                <button
                  onClick={() => handleAIPlatformSearch('gemini')}
                  className="flex flex-col items-center gap-1 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-900">Gemini</span>
                    <p className="text-xs text-gray-500">Google</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </button>

                {/* Bolt.new */}
                <button
                  onClick={() => handleAIPlatformSearch('bolt')}
                  className="flex flex-col items-center gap-1 p-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">⚡</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-900">Bolt.new</span>
                    <p className="text-xs text-gray-500">StackBlitz</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </button>

                {/* DeepSeek */}
                <button
                  onClick={() => handleAIPlatformSearch('deepseek')}
                  className="flex flex-col items-center gap-1 p-3 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">DS</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-900">DeepSeek</span>
                    <p className="text-xs text-gray-500">AI Chat</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </button>

                {/* Lovable */}
                <button
                  onClick={() => handleAIPlatformSearch('lovable')}
                  className="flex flex-col items-center gap-1 p-3 border-2 border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">💝</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-900">Lovable</span>
                    <p className="text-xs text-gray-500">AI Builder</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </button>

                {/* Cline */}
                <button
                  onClick={() => handleAIPlatformSearch('cline')}
                  className="flex flex-col items-center gap-1 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-900">Cline</span>
                    <p className="text-xs text-gray-500">VS Code</p>
                  </div>
                  <Copy className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setShowAIPlatformModal(false)}
                className="w-full px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* API Error Display */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 font-medium">⚠️ {apiError}</p>
              </div>
            </div>
          )}

          {/* Platform Notification */}
          {platformNotification && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-green-700 font-medium">{platformNotification}</p>
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Prompt</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Enter your prompt and I'll enhance it for clarity and effectiveness
              </p>
              
              {/* Language Indicator */}
              {inputLanguage && (
                <div className="mt-3">
                  <LanguageIndicator language={inputLanguage} />
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="relative">
                <textarea
                  value={inputPrompt}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter your prompt here or use voice input..."
                  className="w-full h-32 px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                />
                <div className="absolute top-3 right-3">
                  <SpeechToTextButton
                    onTranscript={(text) => handleInputChange(text)}
                    onOutputLanguageChange={setPreferredOutputLanguageCode}
                    disabled={isLoading || isEnhancingMore || isGenerating}
                  />
                </div>
              </div>
              
              {/* Enhanced Grammar Suggestion */}
              {showGrammarSuggestion && grammarCorrection && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-900">Grammar & Spelling Suggestions</h4>
                        <div className="flex items-center gap-2 text-xs text-blue-700">
                          {grammarCorrection.confidence && (
                            <span className="bg-blue-100 px-2 py-1 rounded">
                              {Math.round(grammarCorrection.confidence * 100)}% confidence
                            </span>
                          )}
                          {grammarCorrection.processingTime && (
                            <span className="bg-blue-100 px-2 py-1 rounded">
                              {grammarCorrection.processingTime}ms
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced suggestions with rich explanations */}
                      {grammarCorrection.suggestions && grammarCorrection.suggestions.length > 0 && (
                        <div className="space-y-3 mb-3">
                          {grammarCorrection.suggestions.map((suggestion, index) => (
                            <div key={index} className="bg-white border border-blue-200 rounded p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                                    suggestion.severity === 'error' ? 'bg-red-100 text-red-700' :
                                    suggestion.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {suggestion.type}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    suggestion.severity === 'error' ? 'bg-red-50 text-red-600' :
                                    suggestion.severity === 'warning' ? 'bg-yellow-50 text-yellow-600' :
                                    'bg-blue-50 text-blue-600'
                                  }`}>
                                    {suggestion.severity}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">{suggestion.rule}</span>
                              </div>
                              
                              <div className="mb-2">
                                <span className="text-sm text-gray-600">Suggestion: </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {suggestion.type} issue detected
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-700 mb-2">{suggestion.explanation}</p>
                              
                              {suggestion.examples && suggestion.examples.length > 0 && (
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium">Examples: </span>
                                  <span>{suggestion.examples.join(', ')}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Legacy corrections display */}
                      {(!grammarCorrection.suggestions || grammarCorrection.suggestions.length === 0) && (
                        <div className="space-y-2 mb-3">
                          {grammarCorrection.corrections.map((suggestion, index) => (
                            <p key={index} className="text-sm text-blue-700">{suggestion}</p>
                          ))}
                        </div>
                      )}
                      
                      <div className="bg-white border border-blue-200 rounded p-3 mb-3">
                        <p className="text-sm text-gray-600 mb-1">Final corrected text:</p>
                        <p className="text-sm font-medium text-gray-900">{grammarCorrection.corrected}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={acceptGrammarCorrection}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Accept All Changes
                        </button>
                        <button
                          onClick={dismissGrammarSuggestion}
                          className="px-3 py-1.5 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors"
                        >
                          Keep Original
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center mt-4">
                <button
                  onClick={enhancePrompt}
                  disabled={!inputPrompt.trim() || isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Enhance Prompt
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Prompt */}
          {enhancedPrompt && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Enhanced Prompt</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {canEnhanceMore && (
                      <button
                        onClick={handleEnhanceMore}
                        disabled={isEnhancingMore}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {isEnhancingMore ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <ArrowUp className="w-4 h-4" />
                            Enhance More
                          </>
                        )}
                      </button>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(enhancedPrompt, 'enhanced')}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {copied.enhanced || copied.platform ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowAIPlatformModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <Bot className="w-4 h-4" />
                        <Zap className="w-3 h-3" />
                        Continue with AI
                      </button>
                      <DownloadButtons 
                        content={enhancedPrompt} 
                        originalPrompt={inputPrompt}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {enhancedPrompt}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Generated Output */}
          {output && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Generated Output</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(output, 'output')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {copied.output ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <DownloadButtons 
                      content={output} 
                      originalPrompt={inputPrompt}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                {/* Generate Output Button */}
                {enhancedPrompt && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={generateApiOutput}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Generate Output
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="whitespace-pre-wrap text-sm text-gray-800">
                    {output}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Generated Output */}
          {apiOutput && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Generated Output</h3>
                    {(inputLanguage || enhancedPrompt) && (
                      <LanguageIndicator language={resolveOutputLanguage(inputPrompt || enhancedPrompt)} className="ml-2" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(apiOutput, 'output')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {copied.output ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <DownloadButtons 
                      content={apiOutput} 
                      originalPrompt={inputPrompt}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="whitespace-pre-wrap text-sm text-gray-800">
                    {apiOutput}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;