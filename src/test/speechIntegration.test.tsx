import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SpeechToTextButton } from '../components/SpeechToTextButton'
import { speechRecognitionService } from '../utils/speechRecognition'
import { openaiService } from '../utils/openaiService'
import { detectLanguage } from '../utils/languageDetector'

// Mock dependencies
vi.mock('../utils/speechRecognition', () => ({
  speechRecognitionService: {
    isRecognitionSupported: vi.fn(() => true),
    isCurrentlyListening: vi.fn(() => false),
    startListening: vi.fn(),
    stopListening: vi.fn(),
    setLanguage: vi.fn(),
    getSupportedLanguages: vi.fn(() => ['en-US', 'hi-IN', 'es-ES'])
  }
}))

vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false),
    transcribeAudio: vi.fn()
  }
}))

vi.mock('../utils/languageDetector', () => ({
  detectLanguage: vi.fn(() => ({ code: 'en', name: 'English', nativeName: 'English' })),
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' }
  ]
}))

// Mock MediaRecorder and getUserMedia
const mockMediaRecorder = {
  start: vi.fn(),
  stop: vi.fn(),
  ondataavailable: null,
  onerror: null,
  onstop: null
}

const mockMediaStream = {
  getTracks: vi.fn(() => [{ stop: vi.fn() }])
}

Object.defineProperty(global, 'MediaRecorder', {
  writable: true,
  value: vi.fn(() => mockMediaRecorder)
})

Object.defineProperty(global, 'navigator', {
  writable: true,
  value: {
    mediaDevices: {
      getUserMedia: vi.fn(() => Promise.resolve(mockMediaStream))
    },
    language: 'en-US'
  }
})

describe('Speech-to-Text Integration Tests', () => {
  const mockOnTranscript = vi.fn()
  const mockOnLanguageDetected = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockMediaRecorder.start.mockClear()
    mockMediaRecorder.stop.mockClear()
    mockMediaRecorder.ondataavailable = null
    mockMediaRecorder.onerror = null
    mockMediaRecorder.onstop = null
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('End-to-End Speech Recognition Workflow', () => {
    it('should complete full speech-to-text pipeline with browser recognition', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        // Simulate successful speech recognition
        setTimeout(() => {
          onResult({
            transcript: 'Hello world, this is a test',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'en'
          })
        }, 100)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Hello world, this is a test')
      })

      expect(mockOnLanguageDetected).toHaveBeenCalledWith('en')
      expect(speechRecognitionService.startListening).toHaveBeenCalled()
    })

    it('should complete full speech-to-text pipeline with cloud recognition', async () => {
      vi.mocked(openaiService.hasApiKey).mockReturnValue(true)
      vi.mocked(openaiService.transcribeAudio).mockResolvedValue({
        text: 'Hello world from cloud',
        language: 'en'
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      // Simulate MediaRecorder events
      await waitFor(() => {
        if (mockMediaRecorder.onstop) {
          mockMediaRecorder.onstop()
        }
      })

      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Hello world from cloud')
      })

      expect(mockOnLanguageDetected).toHaveBeenCalledWith('en')
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true })
    })

    it('should handle mixed language detection and switching', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      let callCount = 0
      
      mockStartListening.mockImplementation((onResult) => {
        callCount++
        if (callCount === 1) {
          // First call - detect Hindi
          setTimeout(() => {
            onResult({
              transcript: 'नमस्ते',
              confidence: 0.9,
              language: 'en-US',
              detectedLanguage: 'hi'
            })
          }, 100)
        } else {
          // Second call - Hindi with proper language
          setTimeout(() => {
            onResult({
              transcript: 'नमस्ते दुनिया',
              confidence: 0.9,
              language: 'hi-IN',
              detectedLanguage: 'hi'
            })
          }, 100)
        }
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('नमस्ते')
      })

      // Should trigger language switching
      await waitFor(() => {
        expect(speechRecognitionService.setLanguage).toHaveBeenCalledWith('hi-IN')
      })

      // Should restart with Hindi language
      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('नमस्ते दुनिया')
      })
    })
  })

  describe('Language Selection Integration', () => {
    it('should integrate language selection with speech recognition', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'Hola mundo',
            confidence: 0.9,
            language: 'es-ES',
            detectedLanguage: 'es'
          })
        }, 100)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      // Select Spanish language
      const languageButton = screen.getByRole('button', { name: /select speech input language/i })
      fireEvent.click(languageButton)

      await waitFor(() => {
        const spanishOption = screen.getByText('Spanish (Español)')
        fireEvent.click(spanishOption)
      })

      // Start speech recognition
      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Hola mundo')
      })

      expect(mockOnLanguageDetected).toHaveBeenCalledWith('es')
    })

    it('should handle auto language detection with cloud mode', async () => {
      vi.mocked(openaiService.hasApiKey).mockReturnValue(true)
      vi.mocked(openaiService.transcribeAudio).mockResolvedValue({
        text: 'Bonjour le monde',
        language: 'fr'
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      // Ensure auto language is selected (default)
      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      // Simulate MediaRecorder events
      await waitFor(() => {
        if (mockMediaRecorder.onstop) {
          mockMediaRecorder.onstop()
        }
      })

      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Bonjour le monde')
      })

      expect(mockOnLanguageDetected).toHaveBeenCalledWith('fr')
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle microphone access denial gracefully', async () => {
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(
        new Error('Permission denied')
      )

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      await waitFor(() => {
        expect(screen.getByText('Microphone access denied or not available.')).toBeInTheDocument()
      })

      expect(mockOnTranscript).not.toHaveBeenCalled()
    })

    it('should handle speech recognition errors and fallback', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult, onError) => {
        setTimeout(() => {
          onError('Network error occurred during speech recognition.')
        }, 100)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      await waitFor(() => {
        expect(screen.getByText('Network error occurred during speech recognition.')).toBeInTheDocument()
      })

      expect(mockOnTranscript).not.toHaveBeenCalled()
    })

    it('should handle cloud transcription errors and show user feedback', async () => {
      vi.mocked(openaiService.hasApiKey).mockReturnValue(true)
      vi.mocked(openaiService.transcribeAudio).mockRejectedValue(
        new Error('API rate limit exceeded')
      )

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      // Simulate MediaRecorder events
      await waitFor(() => {
        if (mockMediaRecorder.onstop) {
          mockMediaRecorder.onstop()
        }
      })

      await waitFor(() => {
        expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument()
      })

      expect(mockOnTranscript).not.toHaveBeenCalled()
    })
  })

  describe('State Management Integration', () => {
    it('should maintain consistent state across multiple interactions', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'First recording',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'en'
          })
        }, 100)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      // First recording
      fireEvent.click(micButton)
      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('First recording')
      })

      // Second recording
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'Second recording',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'en'
          })
        }, 100)
      })

      fireEvent.click(micButton)
      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Second recording')
      })

      expect(mockOnTranscript).toHaveBeenCalledTimes(2)
    })

    it('should handle rapid state changes gracefully', async () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      // Rapid clicks
      fireEvent.click(micButton)
      fireEvent.click(micButton)
      fireEvent.click(micButton)

      // Should not crash and should handle gracefully
      expect(speechRecognitionService.startListening).toHaveBeenCalled()
    })
  })

  describe('Performance Integration', () => {
    it('should handle long speech recognition sessions', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'This is a very long speech recognition result that contains multiple sentences and should be processed efficiently by the system.',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'en'
          })
        }, 100)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith(
          'This is a very long speech recognition result that contains multiple sentences and should be processed efficiently by the system.'
        )
      })

      expect(mockOnLanguageDetected).toHaveBeenCalledWith('en')
    })

    it('should handle concurrent speech recognition requests', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'Concurrent test',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'en'
          })
        }, 100)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      // Multiple rapid interactions
      fireEvent.click(micButton)
      fireEvent.click(micButton)
      fireEvent.click(micButton)

      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalled()
      })

      // Should handle gracefully without errors
      expect(speechRecognitionService.startListening).toHaveBeenCalled()
    })
  })

  describe('Accessibility Integration', () => {
    it('should maintain accessibility throughout the speech recognition flow', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'Accessibility test',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'en'
          })
        }, 100)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      // Test keyboard navigation
      micButton.focus()
      expect(micButton).toHaveFocus()

      fireEvent.keyDown(micButton, { key: 'Enter' })
      
      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Accessibility test')
      })

      // Should maintain focus and accessibility
      expect(micButton).toBeInTheDocument()
    })

    it('should provide proper feedback for screen readers', async () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      // Check initial state
      expect(micButton).toHaveAttribute('title', 'Start voice input')
      
      // Start listening
      fireEvent.click(micButton)
      
      // Check updated state
      expect(micButton).toHaveAttribute('title', 'Stop recording')
    })
  })

  describe('Cross-Browser Compatibility Integration', () => {
    it('should handle different browser implementations', async () => {
      // Test with webkit prefix
      delete (window as any).SpeechRecognition
      Object.defineProperty(window, 'webkitSpeechRecognition', {
        writable: true,
        value: vi.fn(() => ({
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
        }))
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      // Should work with webkit implementation
      expect(speechRecognitionService.startListening).toHaveBeenCalled()
    })

    it('should handle unsupported browsers gracefully', () => {
      // Remove all speech recognition support
      delete (window as any).SpeechRecognition
      delete (window as any).webkitSpeechRecognition
      
      vi.mocked(speechRecognitionService.isRecognitionSupported).mockReturnValue(false)

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button')
      expect(micButton).toBeDisabled()
      
      fireEvent.click(micButton)
      expect(screen.getByText('Speech-to-Text not supported in this browser. Please type your prompt.')).toBeInTheDocument()
    })
  })
})
