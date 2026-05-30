# FAQ

[[Home]] · [[User Guide]] · [[Troubleshooting]]

---

## General

**What does this app do?**  
It turns rough prompts into professional, structured AI prompts with grammar correction and domain-specific templates.

**Do I need an OpenAI API key?**  
No for basic English enhancement. Yes for translation, AI enhancement, Whisper Auto mode, and Generate Output.

**Is this open source?**  
No. Public for portfolio review only. See [[License and Usage]].

---

## API key

**Where is my key stored?**  
In your browser's `localStorage` only. Not sent anywhere except OpenAI.

**Is it safe?**  
Fine for personal demo use. Production apps should use a backend proxy.

**Why "Invalid API key"?**  
Check your key at platform.openai.com. Ensure it starts with `sk-` and has credits.

---

## Enhancement

**Why is enhancement basic without a key?**  
Template-based enhancement still runs; AI refinement requires OpenAI.

**What's the difference between Generated Output and AI Generated Output?**  
Generated Output is a template preview. AI Generated Output is real content from OpenAI.

**What is "Enhance More"?**  
A second pass that adds more structure and detail to your prompt.

---

## Languages

**How many languages are supported?**  
30+ for detection. Translation requires an API key.

**Why is translation blocked?**  
Non-English output uses OpenAI translation. Add an API key to enable it.

---

## Speech

**Microphone not working?**  
Allow mic permission in browser settings. Use Chrome or Edge for best Web Speech support.

**When does Whisper run?**  
When language is **Auto** and an API key is set.

---

## GitHub / portfolio

**Who built this?**  
Poonam Tiwari — Senior Software Engineer

**Can I use this code?**  
Not without written permission. See [[License and Usage]].
