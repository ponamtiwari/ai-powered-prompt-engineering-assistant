# User Guide

Step-by-step guide for using **AI-Powered Prompt Engineering Assistant**.

---

## Getting Started

### Open the application

**Development:**
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

**Production build:**
```bash
npm run build && npm run preview
```

### Browser requirements

- Modern browser: Chrome, Firefox, Safari, or Edge (latest versions)
- Microphone permission required for voice input
- Internet connection required for OpenAI features (optional for basic enhancement)

---

## Step 1: Enter Your Prompt

### Option A — Type your prompt

1. Click inside the **Your Prompt** text area
2. Type your rough idea, for example:
   - *"write email for new joinee joining letter"*
   - *"create react todo app with typescript"*
   - *"marketing campaign for product launch"*

### Option B — Use voice input

1. Click the **microphone icon** in the top-right of the text area
2. Select your language from the dropdown (or choose **Auto** if you have an API key)
3. Click the mic again to start recording
4. Speak your prompt clearly
5. Click the mic again to stop — your speech appears as text

**Tip:** For Auto-detect voice, add your OpenAI API key first (see Step 2).

---

## Step 2: Add OpenAI API Key (Optional)

An API key unlocks:

- AI-powered prompt enhancement
- Non-English prompt translation
- Whisper voice transcription (Auto mode)
- Real AI output generation

### How to add a key

1. Click **Add API Key** in the top-right header
2. Paste your OpenAI API key (starts with `sk-`)
3. Click **Save**
4. Header changes to **API Key Set** (green)

**Note:** Your key is stored only in your browser. It is never sent to any server except OpenAI.

---

## Step 3: Review Grammar Suggestions

As you type, the app may show a **Grammar & Spelling Suggestions** panel:

| Action | Result |
|--------|--------|
| **Accept All Changes** | Replaces your text with corrected version |
| **Keep Original** | Dismisses suggestions, keeps your text |

Each suggestion shows:

- Issue type (spelling, grammar, punctuation, etc.)
- Severity (error, warning, suggestion)
- Explanation and examples
- Confidence percentage and processing time

---

## Step 4: Enhance Your Prompt

1. Click the blue **Enhance Prompt** button
2. Wait for processing (spinner shows "Enhancing...")
3. The **Enhanced Prompt** section appears with your structured prompt

The enhanced prompt includes:

- Clear task definition
- Context and requirements
- Professional formatting
- Domain-specific structure (email, code, HR, etc.)

---

## Step 5: Enhance More (Optional)

For a deeper, more detailed prompt:

1. Click **Enhance More** in the Enhanced Prompt header
2. The prompt is refined with additional structure and detail
3. Repeat for progressively richer prompts (uses AI on later passes if API key is set)

---

## Step 6: Use Your Enhanced Prompt

### Copy

Click **Copy** to copy the enhanced prompt to your clipboard.

### Download

Use **Download** buttons to save as:

- **TXT** — Plain text file
- **DOCX** — Word-compatible document

### Continue with AI

1. Click **Continue with AI** (purple button)
2. Choose your platform:
   - ChatGPT, Gemini, Bolt.new, DeepSeek, Lovable, or Cline
3. The prompt is automatically copied
4. The platform opens in a new tab — paste with `Ctrl+V` (or `Cmd+V` on Mac)

---

## Step 7: Generate Output (Optional)

The app shows two output sections:

### Generated Output (template preview)

- Appears automatically after enhancement
- Shows a **sample structure** of what the prompt could produce
- Does **not** use OpenAI — it is a template preview

### AI Generated Output (real content)

1. Ensure your API key is set
2. Click **Generate Output** (green button)
3. Wait for OpenAI to process the enhanced prompt
4. Real AI-generated content appears in **AI Generated Output**
5. Copy or download the result

---

## Language Support

### Input language

The app auto-detects your input language and shows a language indicator below the prompt title.

### Output language

- **English input** → English enhanced prompt (no API key needed)
- **Non-English input** → Requires API key for translation
- **Voice language selection** → Can override output language via speech dropdown

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Add an OpenAI API key to translate..." | Add API key for non-English prompts |
| "Invalid API key" | Check key at platform.openai.com |
| "Rate limit exceeded" | Wait a few minutes and retry |
| Microphone not working | Allow mic permission in browser settings |
| Speech not supported | Use Chrome/Edge or type manually |
| Enhancement seems basic | Add API key for AI-powered enhancement |

---

## Example Workflow

**Goal:** Write a professional welcome email for a new employee

1. Type: *"write welcome email for new employee sarah marketing department"*
2. Accept grammar suggestions if shown
3. Click **Enhance Prompt**
4. Review the structured email prompt in **Enhanced Prompt**
5. Click **Continue with AI** → **ChatGPT**
6. Paste in ChatGPT and get your email

**Alternative:** Click **Generate Output** to get the email directly in the app.

---

## Privacy

- Prompts are processed locally (grammar) or sent to OpenAI (when API key is used)
- No data is stored on a project server
- API keys remain in your browser's local storage
- Clear browser data to remove stored API keys
