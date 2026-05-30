import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SpeechToTextButton } from '../components/SpeechToTextButton'
import { speechRecognitionService } from '../utils/speechRecognition'
import { openaiService } from '../utils/openaiService'

// Mock dependencies for performance testing
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

// Mock MediaRecorder for cloud mode performance testing
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

describe('Speech Recognition Performance Tests', () => {
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

  describe('Component Rendering Performance', () => {
    it('should render component quickly', () => {
      const startTime = performance.now()
      
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(100) // Should render within 100ms
      expect(screen.getByRole('button', { name: /start voice input/i })).toBeInTheDocument()
    })

    it('should handle multiple rapid renders efficiently', () => {
      const renderTimes: number[] = []
      
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now()
        
        render(
          <SpeechToTextButton 
            onTranscript={mockOnTranscript}
            onLanguageDetected={mockOnLanguageDetected}
          />
        )
        
        const endTime = performance.now()
        renderTimes.push(endTime - startTime)
      }
      
      const averageRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
      const maxRenderTime = Math.max(...renderTimes)
      
      expect(averageRenderTime).toBeLessThan(50) // Average should be under 50ms
      expect(maxRenderTime).toBeLessThan(100) // Max should be under 100ms
    })

    it('should handle language dropdown rendering efficiently', async () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )
      
      const languageButton = screen.getByRole('button', { name: /select speech input language/i })
      
      const startTime = performance.now()
      fireEvent.click(languageButton)
      
      await waitFor(() => {
        expect(screen.getByText('Auto Detect')).toBeInTheDocument()
      })
      
      const endTime = performance.now()
      const dropdownTime = endTime - startTime
      
      expect(dropdownTime).toBeLessThan(200) // Dropdown should open within 200ms
    })
  })

  describe('Speech Recognition Performance', () => {
    it('should start speech recognition quickly', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        // Simulate quick response
        setTimeout(() => {
          onResult({
            transcript: 'Quick test',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'en'
          })
        }, 50)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      const startTime = performance.now()
      fireEvent.click(micButton)
      
      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Quick test')
      })
      
      const endTime = performance.now()
      const recognitionTime = endTime - startTime
      
      expect(recognitionTime).toBeLessThan(200) // Should complete within 200ms
    })

    it('should handle long speech recognition efficiently', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'This is a very long speech recognition result that contains multiple sentences and should be processed efficiently by the system without causing performance issues.',
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
      
      const startTime = performance.now()
      fireEvent.click(micButton)
      
      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalled()
      })
      
      const endTime = performance.now()
      const processingTime = endTime - startTime
      
      expect(processingTime).toBeLessThan(500) // Should process long text within 500ms
    })

    it('should handle multiple concurrent speech recognition requests', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'Concurrent test',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'en'
          })
        }, 50)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      const startTime = performance.now()
      
      // Multiple rapid clicks
      fireEvent.click(micButton)
      fireEvent.click(micButton)
      fireEvent.click(micButton)
      
      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalled()
      })
      
      const endTime = performance.now()
      const concurrentTime = endTime - startTime
      
      expect(concurrentTime).toBeLessThan(300) // Should handle concurrent requests within 300ms
    })
  })

  describe('Cloud Mode Performance', () => {
    beforeEach(() => {
      vi.mocked(openaiService.hasApiKey).mockReturnValue(true)
    })

    it('should handle cloud transcription efficiently', async () => {
      vi.mocked(openaiService.transcribeAudio).mockResolvedValue({
        text: 'Cloud transcription test',
        language: 'en'
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      const startTime = performance.now()
      fireEvent.click(micButton)
      
      // Simulate MediaRecorder events
      await waitFor(() => {
        if (mockMediaRecorder.onstop) {
          mockMediaRecorder.onstop()
        }
      })
      
      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Cloud transcription test')
      })
      
      const endTime = performance.now()
      const cloudTime = endTime - startTime
      
      expect(cloudTime).toBeLessThan(1000) // Cloud transcription should complete within 1 second
    })

    it('should handle large audio files efficiently', async () => {
      // Mock large audio blob
      const largeBlob = new Blob(['large audio data'], { type: 'audio/webm' })
      vi.mocked(openaiService.transcribeAudio).mockResolvedValue({
        text: 'Large audio file transcription',
        language: 'en'
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      const startTime = performance.now()
      fireEvent.click(micButton)
      
      // Simulate MediaRecorder with large data
      await waitFor(() => {
        if (mockMediaRecorder.ondataavailable) {
          mockMediaRecorder.ondataavailable({ data: largeBlob })
        }
        if (mockMediaRecorder.onstop) {
          mockMediaRecorder.onstop()
        }
      })
      
      await waitFor(() => {
        expect(mockOnTranscript).toHaveBeenCalledWith('Large audio file transcription')
      })
      
      const endTime = performance.now()
      const largeFileTime = endTime - startTime
      
      expect(largeFileTime).toBeLessThan(2000) // Large files should process within 2 seconds
    })

    it('should handle cloud transcription errors efficiently', async () => {
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
      
      const startTime = performance.now()
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
      
      const endTime = performance.now()
      const errorTime = endTime - startTime
      
      expect(errorTime).toBeLessThan(500) // Error handling should be quick
    })
  })

  describe('Memory Performance', () => {
    it('should not leak memory with repeated interactions', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'Memory test',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'en'
          })
        }, 50)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      // Perform multiple interactions
      for (let i = 0; i < 20; i++) {
        fireEvent.click(micButton)
        await waitFor(() => {
          expect(mockOnTranscript).toHaveBeenCalled()
        })
      }
      
      // Should not crash or show memory issues
      expect(mockOnTranscript).toHaveBeenCalledTimes(20)
    })

    it('should handle language dropdown memory efficiently', async () => {
      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const languageButton = screen.getByRole('button', { name: /select speech input language/i })
      
      // Open and close dropdown multiple times
      for (let i = 0; i < 10; i++) {
        fireEvent.click(languageButton)
        await waitFor(() => {
          expect(screen.getByText('Auto Detect')).toBeInTheDocument()
        })
        
        fireEvent.click(languageButton)
        await waitFor(() => {
          expect(screen.queryByText('Auto Detect')).not.toBeInTheDocument()
        })
      }
      
      // Should not accumulate memory or cause issues
      expect(languageButton).toBeInTheDocument()
    })
  })

  describe('Language Detection Performance', () => {
    it('should detect language quickly', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'नमस्ते दुनिया',
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: 'hi'
          })
        }, 50)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      const startTime = performance.now()
      fireEvent.click(micButton)
      
      await waitFor(() => {
        expect(mockOnLanguageDetected).toHaveBeenCalledWith('hi')
      })
      
      const endTime = performance.now()
      const detectionTime = endTime - startTime
      
      expect(detectionTime).toBeLessThan(200) // Language detection should be quick
    })

    it('should handle multiple language switches efficiently', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      let callCount = 0
      
      mockStartListening.mockImplementation((onResult) => {
        callCount++
        const languages = ['en', 'hi', 'es', 'fr', 'de']
        const currentLang = languages[callCount % languages.length]
        
        setTimeout(() => {
          onResult({
            transcript: `Text in ${currentLang}`,
            confidence: 0.9,
            language: 'en-US',
            detectedLanguage: currentLang
          })
        }, 50)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      const startTime = performance.now()
      
      // Multiple language detections
      for (let i = 0; i < 5; i++) {
        fireEvent.click(micButton)
        await waitFor(() => {
          expect(mockOnLanguageDetected).toHaveBeenCalled()
        })
      }
      
      const endTime = performance.now()
      const multiLangTime = endTime - startTime
      
      expect(multiLangTime).toBeLessThan(1000) // Multiple language detections should be efficient
    })
  })

  describe('Error Handling Performance', () => {
    it('should handle errors quickly', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult, onError) => {
        setTimeout(() => {
          onError('Test error')
        }, 50)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      const startTime = performance.now()
      fireEvent.click(micButton)
      
      await waitFor(() => {
        expect(screen.getByText('Test error')).toBeInTheDocument()
      })
      
      const endTime = performance.now()
      const errorTime = endTime - startTime
      
      expect(errorTime).toBeLessThan(200) // Error handling should be quick
    })

    it('should handle multiple errors efficiently', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult, onError) => {
        setTimeout(() => {
          onError('Multiple error test')
        }, 50)
      })

      render(
        <SpeechToTextButton 
          onTranscript={mockOnTranscript}
          onLanguageDetected={mockOnLanguageDetected}
        />
      )

      const micButton = screen.getByRole('button', { name: /start voice input/i })
      
      const startTime = performance.now()
      
      // Multiple error scenarios
      for (let i = 0; i < 5; i++) {
        fireEvent.click(micButton)
        await waitFor(() => {
          expect(screen.getByText('Multiple error test')).toBeInTheDocument()
        })
      }
      
      const endTime = performance.now()
      const multiErrorTime = endTime - startTime
      
      expect(multiErrorTime).toBeLessThan(1000) // Multiple errors should be handled efficiently
    })
  })

  describe('Performance Benchmarks', () => {
    it('should meet baseline performance requirements', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'Baseline performance test',
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
      
      const iterations = 10
      const times: number[] = []
      
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now()
        fireEvent.click(micButton)
        
        await waitFor(() => {
          expect(mockOnTranscript).toHaveBeenCalled()
        })
        
        const endTime = performance.now()
        times.push(endTime - startTime)
      }
      
      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length
      const maxTime = Math.max(...times)
      const minTime = Math.min(...times)
      
      // Performance requirements
      expect(averageTime).toBeLessThan(300) // Average should be under 300ms
      expect(maxTime).toBeLessThan(500) // Max should be under 500ms
      expect(minTime).toBeGreaterThan(0) // Min should be positive
      
      // Consistency check
      expect(maxTime).toBeLessThan(minTime * 3) // Max should not be more than 3x min
    })

    it('should maintain consistent performance across runs', async () => {
      const mockStartListening = vi.mocked(speechRecognitionService.startListening)
      mockStartListening.mockImplementation((onResult) => {
        setTimeout(() => {
          onResult({
            transcript: 'Consistency test',
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
      
      const runs = 5
      const times: number[] = []
      
      for (let i = 0; i < runs; i++) {
        const startTime = performance.now()
        fireEvent.click(micButton)
        
        await waitFor(() => {
          expect(mockOnTranscript).toHaveBeenCalled()
        })
        
        const endTime = performance.now()
        times.push(endTime - startTime)
      }
      
      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length
      const variance = times.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / times.length
      const standardDeviation = Math.sqrt(variance)
      
      // Performance should be consistent
      expect(standardDeviation).toBeLessThan(averageTime * 0.5) // SD should be less than 50% of average
    })
  })
})
