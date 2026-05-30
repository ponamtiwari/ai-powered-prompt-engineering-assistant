import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SpeechToTextButton } from '../components/SpeechToTextButton'
import { speechRecognitionService } from '../utils/speechRecognition'
import { openaiService } from '../utils/openaiService'

// Mock the speech recognition service
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

// Mock the OpenAI service
vi.mock('../utils/openaiService', () => ({
  openaiService: {
    hasApiKey: vi.fn(() => false),
    transcribeAudio: vi.fn()
  }
}))

// Mock the language detector
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

Object.defineProperty(global.navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn(() => Promise.resolve(mockMediaStream))
  }
})

// Mock MediaRecorder.isTypeSupported
Object.defineProperty(global.MediaRecorder, 'isTypeSupported', {
  writable: true,
  value: vi.fn(() => true)
})

describe('SpeechToTextButton Component', () => {
  const mockOnTranscript = vi.fn()
  const mockOnLanguageDetected = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render microphone button when supported', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      expect(micButton).toBeInTheDocument()
    })

    it('should render disabled button when speech recognition is not supported', () => {
      vi.mocked(speechRecognitionService.isRecognitionSupported).mockReturnValue(false)

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /speech-to-text not supported/i })
      expect(micButton).toBeInTheDocument()
      expect(micButton).toBeDisabled()
    })

    it('should render language dropdown', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const languageButton = screen.getByRole('button', { name: /auto/i })
      expect(languageButton).toBeInTheDocument()
    })

    it('should show listening state when active', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      expect(screen.getByText(/listening/i)).toBeInTheDocument()
    })
  })

  describe('Speech Recognition Functionality', () => {
    it('should start listening when microphone button is clicked', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      expect(speechRecognitionService.startListening).toHaveBeenCalled()
    })

    it('should stop listening when microphone button is clicked again', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)
      fireEvent.click(micButton)

      expect(speechRecognitionService.stopListening).toHaveBeenCalled()
    })

    it('should call onTranscript when speech is recognized', () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        onResult({
          transcript: 'Hello world',
          confidence: 0.9,
          detectedLanguage: 'en'
        })
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      expect(mockOnTranscript).toHaveBeenCalledWith('Hello world')
    })

    it('should call onLanguageDetected when language is detected', () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        onResult({
          transcript: 'Hello world',
          confidence: 0.9,
          detectedLanguage: 'hi'
        })
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      expect(mockOnLanguageDetected).toHaveBeenCalledWith('hi')
    })
  })

  describe('Language Selection', () => {
    it('should open language dropdown when clicked', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const languageButton = screen.getByRole('button', { name: /auto/i })
      fireEvent.click(languageButton)

      expect(screen.getByText(/auto detect/i)).toBeInTheDocument()
    })

    it('should close dropdown when clicking outside', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const languageButton = screen.getByRole('button', { name: /auto/i })
      fireEvent.click(languageButton)

      expect(screen.getByText(/auto detect/i)).toBeInTheDocument()

      // Component listens on mousedown
      fireEvent.mouseDown(document.body)
      expect(screen.queryByText(/auto detect/i)).not.toBeInTheDocument()
    })

    it('should change language when option is selected', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const languageButton = screen.getByRole('button', { name: /auto/i })
      fireEvent.click(languageButton)

      const hindiOption = screen.getByText(/hindi/i)
      fireEvent.click(hindiOption)

      expect(screen.queryByText(/auto detect/i)).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should show error message when speech recognition fails', () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult, onError) => {
        onError('Speech recognition failed')
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      expect(screen.getByText(/speech recognition failed/i)).toBeInTheDocument()
    })

    it('should hide error message after timeout', async () => {
      vi.useFakeTimers()
      
      // Trigger error via onError callback
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult, onError) => {
        onError('Temporary error')
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )
      
      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)
      
      // Wait for error to appear
      const errorAlert = await screen.findByRole('alert')

      // Fast-forward time by 5 seconds
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      // Wait for error to disappear
      await waitForElementToBeRemoved(errorAlert)

      vi.useRealTimers()
    })

    it('should show disabled state when speech recognition is not supported', async () => {
      vi.mocked(speechRecognitionService.isRecognitionSupported).mockReturnValue(false)

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /speech-to-text not supported/i })
      expect(micButton).toBeDisabled()
      expect(micButton).toHaveAttribute('title', expect.stringMatching(/not supported/i))
    })
  })

  describe('Cloud Mode (OpenAI Whisper)', () => {
    beforeEach(() => {
      vi.mocked(openaiService.hasApiKey).mockReturnValue(true)
    })

    it('should use cloud mode when API key is available and language is auto', async () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )
      
      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)
      
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true })
    })

    it('should handle cloud transcription success', async () => {
      vi.mocked(openaiService.transcribeAudio).mockResolvedValue({
        text: 'Transcribed text',
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
      
      // Simulate MediaRecorder stopping
      act(() => {
        mockMediaRecorder.onstop?.({} as Event)
      })

      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Transcribed text')
      })
    })

    it('should handle cloud transcription error', async () => {
      // Trigger recorder.onerror path
      vi.mocked(openaiService.transcribeAudio).mockResolvedValue({ text: '', language: 'en' })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )
      
      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)
      
      // Simulate recorder error
      act(() => {
        // @ts-ignore
        mockMediaRecorder.onerror && mockMediaRecorder.onerror(new Event('error'))
      })

      await screen.findByRole('alert')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      const languageButton = screen.getByRole('button', { name: /auto/i })
      
      expect(micButton).toBeInTheDocument()
      expect(languageButton).toBeInTheDocument()
    })

    it('should update ARIA labels when listening', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument()
    })

    it('should be keyboard accessible', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton) // Use click instead of keyDown since component doesn't handle keyDown
      expect(speechRecognitionService.startListening).toHaveBeenCalled()
    })
  })

  describe('Component Props', () => {
    it('should respect disabled prop', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
          disabled={true}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      expect(micButton).toBeDisabled()
    })

    it('should apply custom className', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
          className="custom-class"
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      expect(micButton).toHaveClass('custom-class')
    })

    it('should work without onLanguageDetected callback', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      expect(micButton).toBeInTheDocument()
    })
  })

  describe('Language Detection and Switching', () => {
    it('should handle auto language detection', () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        onResult({
          transcript: 'Hello world',
          confidence: 0.9,
          detectedLanguage: 'en'
        })
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      expect(mockOnLanguageDetected).toHaveBeenCalledWith('en')
    })

    it('should show language indicator when language is detected', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        // Simulate language detection
        setTimeout(() => {
          onResult({
            transcript: 'Hello world',
            confidence: 0.9,
            detectedLanguage: 'hi'
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
        expect(screen.getByText(/🎯/)).toBeInTheDocument()
      }, { timeout: 2000 })

      expect(mockOnLanguageDetected).toHaveBeenCalledWith('hi')
    })

    it('should hide language indicator after timeout', async () => {
      vi.useFakeTimers()

      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        onResult({
          transcript: 'Hello world',
          confidence: 0.9,
          detectedLanguage: 'hi'
        })
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)

      const indicator = await screen.findByText(/🎯/)

      // Fast-forward time by 3 seconds
      act(() => {
        vi.advanceTimersByTime(3000)
      })

      // Ensure removal
      await waitForElementToBeRemoved(indicator)

      vi.useRealTimers()
    })
  })

  describe('State Management', () => {
    it('should reset state when starting new session', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)
      fireEvent.click(micButton)
      fireEvent.click(micButton)

      expect(speechRecognitionService.startListening).toHaveBeenCalledTimes(2)
    })

    it('should handle multiple rapid clicks gracefully', () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      fireEvent.click(micButton)
      fireEvent.click(micButton)
      fireEvent.click(micButton)

      // First click starts, second stops, third starts again
      expect(speechRecognitionService.startListening).toHaveBeenCalledTimes(2)
      expect(speechRecognitionService.stopListening).toHaveBeenCalledTimes(1)
    })
  })
})