import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { SpeechRecognitionService, SpeechRecognitionResult, SpeechRecognitionOptions } from '../utils/speechRecognition'
import { detectLanguage } from '../utils/languageDetector'

// Mock the language detector
vi.mock('../utils/languageDetector', () => ({
  detectLanguage: vi.fn(() => ({ code: 'en', name: 'English', nativeName: 'English' }))
}))

// Mock Web Speech API
const mockRecognition = {
  continuous: false,
  interimResults: false,
  maxAlternatives: 1,
  lang: 'en-US',
  start: vi.fn(),
  stop: vi.fn(),
  onstart: null,
  onresult: null,
  onerror: null,
  onend: null
}

const MockSpeechRecognition = vi.fn(() => mockRecognition)

// Mock window objects
Object.defineProperty(window, 'SpeechRecognition', {
  writable: true,
  value: MockSpeechRecognition
})

Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: MockSpeechRecognition
})

Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    language: 'en-US'
  }
})

describe('SpeechRecognitionService', () => {
  let service: SpeechRecognitionService
  let mockOnResult: vi.Mock
  let mockOnError: vi.Mock
  let mockOnEnd: vi.Mock

  beforeEach(() => {
    vi.clearAllMocks()
    service = new SpeechRecognitionService()
    mockOnResult = vi.fn()
    mockOnError = vi.fn()
    mockOnEnd = vi.fn()
    
    // Reset mock recognition
    mockRecognition.start.mockClear()
    mockRecognition.stop.mockClear()
    mockRecognition.onstart = null
    mockRecognition.onresult = null
    mockRecognition.onerror = null
    mockRecognition.onend = null
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with speech recognition support', () => {
      expect(service.isRecognitionSupported()).toBe(true)
    })

    it('should handle missing speech recognition API', () => {
      // Remove speech recognition from window
      delete (window as any).SpeechRecognition
      delete (window as any).webkitSpeechRecognition
      
      const serviceWithoutSupport = new SpeechRecognitionService()
      expect(serviceWithoutSupport.isRecognitionSupported()).toBe(false)
    })

    it('should not be listening initially', () => {
      expect(service.isCurrentlyListening()).toBe(false)
    })
  })

  describe('Language Support', () => {
    it('should return supported languages', () => {
      const languages = service.getSupportedLanguages()
      expect(Array.isArray(languages)).toBe(true)
      expect(languages.length).toBeGreaterThan(0)
      expect(languages).toContain('en-US')
      expect(languages).toContain('hi-IN')
    })

    it('should set language correctly', () => {
      service.setLanguage('hi-IN')
      expect(mockRecognition.lang).toBe('hi-IN')
    })

    it('should map detected language to speech recognition format', () => {
      service.setLanguageFromDetectedLanguage('hi')
      expect(mockRecognition.lang).toBe('hi-IN')
    })

    it('should fallback to en-US for unknown languages', () => {
      service.setLanguageFromDetectedLanguage('unknown')
      expect(mockRecognition.lang).toBe('en-US')
    })
  })

  describe('Speech Recognition Control', () => {
    it('should start listening successfully', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      expect(mockRecognition.start).toHaveBeenCalled()
      expect(service.isCurrentlyListening()).toBe(true)
    })

    it('should stop listening', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      service.stopListening()
      
      expect(mockRecognition.stop).toHaveBeenCalled()
      expect(service.isCurrentlyListening()).toBe(false)
    })

    it('should handle start listening when already listening', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      expect(mockRecognition.stop).toHaveBeenCalled()
      expect(mockRecognition.start).toHaveBeenCalledTimes(2)
    })

    it('should apply options when starting', () => {
      const options: SpeechRecognitionOptions = {
        language: 'es-ES',
        continuous: true,
        interimResults: true,
        maxAlternatives: 3
      }
      
      service.startListening(mockOnResult, mockOnError, mockOnEnd, options)
      
      expect(mockRecognition.lang).toBe('es-ES')
      expect(mockRecognition.continuous).toBe(true)
      expect(mockRecognition.interimResults).toBe(true)
      expect(mockRecognition.maxAlternatives).toBe(3)
    })
  })

  describe('Speech Recognition Events', () => {
    it('should handle successful speech recognition', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      // Simulate speech recognition result
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'Hello world', confidence: 0.9 },
          isFinal: true
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'Hello world',
        confidence: 0.9,
        language: 'en-US',
        detectedLanguage: 'en'
      })
    })

    it('should handle interim results when enabled', () => {
      const options: SpeechRecognitionOptions = {
        interimResults: true
      }
      
      service.startListening(mockOnResult, mockOnError, mockOnEnd, options)
      
      // Simulate interim result
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'Hello', confidence: 0.5 },
          isFinal: false
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'Hello',
        confidence: 0.5,
        language: 'en-US',
        detectedLanguage: undefined
      })
    })

    it('should handle multiple results', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      const mockEvent = {
        resultIndex: 0,
        results: [
          {
            0: { transcript: 'Hello', confidence: 0.8 },
            isFinal: true
          },
          {
            0: { transcript: ' world', confidence: 0.9 },
            isFinal: true
          }
        ]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'Hello world',
        confidence: 0.9,
        language: 'en-US',
        detectedLanguage: 'en'
      })
    })

    it('should handle recognition start event', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      if (mockRecognition.onstart) {
        mockRecognition.onstart()
      }
      
      expect(service.isCurrentlyListening()).toBe(true)
    })

    it('should handle recognition end event', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      if (mockRecognition.onend) {
        mockRecognition.onend()
      }
      
      expect(service.isCurrentlyListening()).toBe(false)
      expect(mockOnEnd).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle no-speech error', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'no-speech' })
      }
      
      expect(mockOnError).toHaveBeenCalledWith('No speech detected. Please try again.')
      expect(service.isCurrentlyListening()).toBe(false)
    })

    it('should handle audio-capture error', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'audio-capture' })
      }
      
      expect(mockOnError).toHaveBeenCalledWith('Microphone access denied or not available.')
      expect(service.isCurrentlyListening()).toBe(false)
    })

    it('should handle not-allowed error', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'not-allowed' })
      }
      
      expect(mockOnError).toHaveBeenCalledWith('Microphone permission denied. Please allow microphone access.')
      expect(service.isCurrentlyListening()).toBe(false)
    })

    it('should handle network error', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'network' })
      }
      
      expect(mockOnError).toHaveBeenCalledWith('Network error occurred during speech recognition.')
      expect(service.isCurrentlyListening()).toBe(false)
    })

    it('should handle service-not-allowed error', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'service-not-allowed' })
      }
      
      expect(mockOnError).toHaveBeenCalledWith('Speech recognition service not allowed.')
      expect(service.isCurrentlyListening()).toBe(false)
    })

    it('should handle unknown error', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      if (mockRecognition.onerror) {
        mockRecognition.onerror({ error: 'unknown-error' })
      }
      
      expect(mockOnError).toHaveBeenCalledWith('Speech recognition error: unknown-error')
      expect(service.isCurrentlyListening()).toBe(false)
    })

    it('should handle start failure', () => {
      mockRecognition.start.mockImplementation(() => {
        throw new Error('Start failed')
      })
      
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      expect(mockOnError).toHaveBeenCalledWith('Failed to start speech recognition')
      expect(service.isCurrentlyListening()).toBe(false)
    })

    it('should handle unsupported browser', () => {
      // Create service without speech recognition support
      delete (window as any).SpeechRecognition
      delete (window as any).webkitSpeechRecognition
      
      const unsupportedService = new SpeechRecognitionService()
      unsupportedService.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      expect(mockOnError).toHaveBeenCalledWith('Speech recognition is not supported in this browser')
    })
  })

  describe('Language Detection', () => {
    it('should detect Devanagari script as Hindi', () => {
      vi.mocked(detectLanguage).mockReturnValue({ code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' })
      
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'नमस्ते दुनिया', confidence: 0.9 },
          isFinal: true
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'नमस्ते दुनिया',
        confidence: 0.9,
        language: 'en-US',
        detectedLanguage: 'hi'
      })
    })

    it('should detect Arabic script', () => {
      vi.mocked(detectLanguage).mockReturnValue({ code: 'ar', name: 'Arabic', nativeName: 'العربية' })
      
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'مرحبا بالعالم', confidence: 0.9 },
          isFinal: true
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'مرحبا بالعالم',
        confidence: 0.9,
        language: 'en-US',
        detectedLanguage: 'ar'
      })
    })

    it('should detect romanized Hindi from tokens', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'aap kaise hain', confidence: 0.9 },
          isFinal: true
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'aap kaise hain',
        confidence: 0.9,
        language: 'en-US',
        detectedLanguage: 'hi'
      })
    })

    it('should detect romanized Urdu from tokens', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'aap kaise hain meherbani', confidence: 0.9 },
          isFinal: true
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'aap kaise hain meherbani',
        confidence: 0.9,
        language: 'en-US',
        detectedLanguage: 'ur'
      })
    })

    it('should fallback to generic detection for English', () => {
      vi.mocked(detectLanguage).mockReturnValue({ code: 'en', name: 'English', nativeName: 'English' })
      
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'Hello world', confidence: 0.9 },
          isFinal: true
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'Hello world',
        confidence: 0.9,
        language: 'en-US',
        detectedLanguage: 'en'
      })
    })

    it('should handle language detection error gracefully', () => {
      vi.mocked(detectLanguage).mockImplementation(() => {
        throw new Error('Detection failed')
      })
      
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'Hello world', confidence: 0.9 },
          isFinal: true
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'Hello world',
        confidence: 0.9,
        language: 'en-US',
        detectedLanguage: 'en' // Fallback to English
      })
    })
  })

  describe('Recognition Reinitialization', () => {
    it('should reinitialize recognition when language changes', () => {
      const originalRecognition = mockRecognition
      service.setLanguageFromDetectedLanguage('hi')
      
      // Should create new recognition instance
      expect(MockSpeechRecognition).toHaveBeenCalledTimes(2) // Once in constructor, once in reinitialize
    })

    it('should stop current listening before reinitializing', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      service.setLanguageFromDetectedLanguage('hi')
      
      expect(mockRecognition.stop).toHaveBeenCalled()
    })
  })

  describe('Default Language Mapping', () => {
    it('should map browser language to speech recognition format', () => {
      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
          language: 'es-ES'
        }
      })
      
      const serviceWithSpanish = new SpeechRecognitionService()
      expect(serviceWithSpanish.getSupportedLanguages()).toContain('es-ES')
    })

    it('should fallback to en-US for unknown browser language', () => {
      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: {
          language: 'unknown-XX'
        }
      })
      
      const serviceWithUnknown = new SpeechRecognitionService()
      expect(serviceWithUnknown.getSupportedLanguages()).toContain('en-US')
    })
  })

  describe('Confidence Handling', () => {
    it('should use provided confidence value', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'Hello world', confidence: 0.7 },
          isFinal: true
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'Hello world',
        confidence: 0.7,
        language: 'en-US',
        detectedLanguage: 'en'
      })
    })

    it('should use default confidence when not provided', () => {
      service.startListening(mockOnResult, mockOnError, mockOnEnd)
      
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'Hello world', confidence: undefined },
          isFinal: true
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'Hello world',
        confidence: 0.9, // Default for final results
        language: 'en-US',
        detectedLanguage: 'en'
      })
    })

    it('should use lower confidence for interim results', () => {
      const options: SpeechRecognitionOptions = {
        interimResults: true
      }
      
      service.startListening(mockOnResult, mockOnError, mockOnEnd, options)
      
      const mockEvent = {
        resultIndex: 0,
        results: [{
          0: { transcript: 'Hello', confidence: undefined },
          isFinal: false
        }]
      }
      
      if (mockRecognition.onresult) {
        mockRecognition.onresult(mockEvent)
      }
      
      expect(mockOnResult).toHaveBeenCalledWith({
        transcript: 'Hello',
        confidence: 0.5, // Default for interim results
        language: 'en-US',
        detectedLanguage: undefined
      })
    })
  })
})
