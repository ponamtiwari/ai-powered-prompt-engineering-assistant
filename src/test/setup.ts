import '@testing-library/jest-dom'

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalConsoleError.call(console, ...args)
  }

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('AI grammar correction failed') ||
       args[0].includes('Failed to parse AI'))
    ) {
      return
    }
    originalConsoleWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Global test utilities
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock Speech Recognition API
Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: class MockSpeechRecognition {
    continuous = false
    interimResults = false
    lang = 'en-US'
    start() {}
    stop() {}
    abort() {}
    addEventListener() {}
    removeEventListener() {}
  }
})

Object.defineProperty(window, 'SpeechRecognition', {
  writable: true,
  value: class MockSpeechRecognition {
    continuous = false
    interimResults = false
    lang = 'en-US'
    start() {}
    stop() {}
    abort() {}
    addEventListener() {}
    removeEventListener() {}
  }
})
