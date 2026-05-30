# Features

[[Home]] · [[User Guide]] · [[Architecture]]

---

## 1. Prompt input

- Multi-line text area with real-time processing
- **Speech-to-text:** Web Speech API or OpenAI Whisper (Auto mode + API key)

---

## 2. Grammar correction

Real-time analysis as you type:

- Spelling, grammar, punctuation, style, syntax
- Accept all changes or keep original
- Confidence score and processing time
- Multilingual dictionaries (EN, HI, GU, ES, FR, DE, IT, PT, RU, JA, KO, AR)

---

## 3. Language detection

- 30+ languages via Unicode scripts and keyword patterns
- Visual language indicator in UI
- Output follows detected or selected language

---

## 4. Prompt enhancement

### Domain classification (30+ domains)

**Core:** resume, email, design, code  
**Professional:** QA, finance, marketing, HR, legal, SEO, healthcare, banking, and more

### Pipeline

1. Template enhancement (no API key required)
2. AI enhancement (GPT-3.5-turbo when key set)
3. Translation (OpenAI for non-English)
4. Enhance More (deeper second pass)

### Output sections

| Section | Source |
|---------|--------|
| Enhanced Prompt | Structured prompt for AI tools |
| Generated Output | Template preview (mock sample) |
| AI Generated Output | Real OpenAI content |

---

## 5. Continue with AI

One-click copy + open:

- ChatGPT, Gemini, Bolt.new, DeepSeek, Lovable, Cline

---

## 6. Export

- Copy to clipboard
- Download `.txt` or `.docx`

---

## 7. API key management

- Stored in browser `localStorage`
- Required for: translation, Whisper Auto mode, AI enhancement, Generate Output

See [[API Integration]] for details.

---

## 8. Testing

Vitest suites for grammar, multilingual, performance, edge cases, and speech.

See [[Testing]].
