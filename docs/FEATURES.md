# Features

Complete feature reference for **AI-Powered Prompt Engineering Assistant**.

---

## 1. Prompt Input

### Text input

- Multi-line textarea for free-form prompt entry
- Real-time processing on every keystroke
- Placeholder guidance for text and voice input

### Speech-to-text

| Mode | When used | Technology |
|------|-----------|------------|
| **Browser speech** | User selects a specific language | Web Speech API |
| **Cloud speech** | Language set to "Auto" + API key present | OpenAI Whisper |

**Supported speech languages include:** English, Hindi, Urdu, Gujarati, Bengali, Tamil, Telugu, Marathi, Kannada, Malayalam, Punjabi, Nepali, Sinhala, Spanish, French, German, Italian, Portuguese, Russian, Arabic, Chinese, Japanese, Korean, Thai, Vietnamese, Indonesian, Turkish, Polish, Dutch, Swedish, Tagalog, Swahili, and Auto-detect.

---

## 2. Grammar & Spelling Correction

### Real-time analysis

As the user types, the app:

- Detects input language automatically
- Applies rule-based grammar and spelling corrections
- Shows suggestions with severity (error, warning, suggestion)
- Displays confidence score and processing time
- Allows **Accept All Changes** or **Keep Original**

### Correction types

| Type | Examples |
|------|----------|
| Spelling | Common typos, professional terms, repeated letters |
| Grammar | Article usage (a/an), subject-verb agreement |
| Punctuation | Comma splices, missing punctuation |
| Style | Informal phrasing improvements |
| Syntax | Sentence structure issues |

### Multilingual dictionaries

Built-in correction dictionaries for English, Hindi, Gujarati, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, and Arabic.

---

## 3. Language Detection

- Pattern-based detection using Unicode script ranges and keyword patterns
- Supports 30+ languages including major Indian languages
- Visual language indicator in the UI
- Output language can follow detected input or user-selected speech language

---

## 4. Prompt Enhancement

### Domain classification

The engine classifies prompts into specialized domains:

**Core domains:** resume, email, design, code

**Professional domains:** QA, finance, content, marketing, sales, HR, legal, operations, project management, customer service, training, research, consulting, healthcare, education, manufacturing, logistics, real estate, insurance, banking, accounting, social media, SEO, analytics, compliance, generic

### Enhancement pipeline

1. **Template enhancement** — Always available; no API key required
2. **AI enhancement** — When OpenAI key is set, GPT-3.5-turbo improves the template output
3. **Translation** — Non-English prompts translated via OpenAI after English template generation
4. **Enhance More** — Second pass with deeper structure; uses AI on subsequent clicks if key available

### Output types

| Section | Content type |
|---------|--------------|
| **Enhanced Prompt** | Structured prompt ready for AI tools |
| **Generated Output** | Template-based sample preview (mock) |
| **AI Generated Output** | Real content from OpenAI when user clicks Generate Output |

---

## 5. OpenAI Integration

Requires user-provided API key (stored in `localStorage`).

| Capability | Model | Purpose |
|------------|-------|---------|
| Prompt enhancement | GPT-3.5-turbo | Improve rough prompts |
| Output generation | GPT-3.5-turbo | Execute enhanced prompt |
| Translation | GPT-3.5-turbo | Localize prompts to target language |
| Grammar (fallback) | GPT-3.5-turbo | Multilingual correction when rules insufficient |
| Transcription | Whisper | Voice-to-text in Auto mode |

---

## 6. Continue with AI

One-click workflow to external platforms:

| Platform | Action |
|----------|--------|
| ChatGPT | Copy prompt → open chat.openai.com |
| Gemini | Copy prompt → open gemini.google.com |
| Bolt.new | Copy prompt → open bolt.new |
| DeepSeek | Copy prompt → open chat.deepseek.com |
| Lovable | Copy prompt → open lovable.dev |
| Cline | Copy prompt → paste in VS Code extension |

---

## 7. Export & Copy

- **Copy to clipboard** — Enhanced prompt, generated output, AI output
- **Download as TXT** — Plain text file
- **Download as DOCX** — HTML-based Word-compatible document

---

## 8. API Key Management

- Modal for entering OpenAI API key
- Key stored locally in browser (`localStorage`)
- Visual indicator: "API Key Set" vs "Add API Key"
- Invalid key detection with user-friendly error messages

---

## 9. Error Handling

| Error | User message |
|-------|--------------|
| Missing API key | Prompt to add key via modal |
| Invalid API key | Clear invalid key warning |
| Rate limit (429) | Retry later message |
| Server error (500) | Service unavailable message |
| Translation required | Key required for non-English enhancement |

---

## 10. Testing Infrastructure

- Unit tests for grammar correction
- Integration tests for full correction pipeline
- Multilingual test suite
- Performance benchmarks
- Edge case coverage
- Speech component and service tests

See [Testing Guide](./TESTING.md) for details.

---

## Planned Features (Stub Components)

The following components exist as placeholders for future development:

- `PromptInput` — Dedicated input component
- `TemplateSelector` — Manual template selection
- `HistoryPanel` — Prompt history
- `ContextQuestions` — Interactive context gathering
- `PromptAnalysis` — Prompt quality analysis
- `EnhancedOutput` — Standalone output component
- `CategoryCard` — Category selection UI
