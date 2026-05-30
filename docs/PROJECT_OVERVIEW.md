# Project Overview

## About the Project

**AI-Powered Prompt Engineering Assistant** is a client-side web application that helps users craft effective prompts for large language models (LLMs). It bridges the gap between informal user intent and structured, high-quality prompts that produce better AI results.

The application was built by **Poonam Tiwari** as a portfolio project demonstrating skills in modern frontend development, AI integration, multilingual text processing, and automated testing.

---

## Problem Statement

Many users struggle to write clear, structured prompts for AI tools. Common issues include:

- Spelling and grammar errors that reduce clarity
- Vague or incomplete instructions
- Lack of domain-specific structure (e.g., HR emails vs. code requests)
- Language barriers for non-English speakers
- No easy way to move enhanced prompts into ChatGPT, Gemini, or other platforms

This project solves these problems through an integrated workflow: **correct → classify → enhance → export → execute**.

---

## Solution

The app provides a single interface where users can:

1. Type or speak a rough prompt
2. Receive real-time grammar and spelling suggestions
3. Generate a domain-aware, professionally structured prompt
4. Optionally refine further with AI
5. Copy, download, or send the prompt to external AI platforms
6. Generate real AI output when an OpenAI API key is configured

---

## Target Users

| User Type | Benefit |
|-----------|---------|
| **Job seekers** | Create resume, cover letter, and email prompts quickly |
| **Developers** | Structure code and technical task prompts |
| **Marketers & content writers** | Generate campaign, SEO, and copywriting prompts |
| **HR & business professionals** | Draft professional communications |
| **Multilingual users** | Work in Hindi, Gujarati, Arabic, and 30+ other languages |
| **AI power users** | Save time on prompt engineering before using ChatGPT or Gemini |

---

## Project Goals

### Functional goals

- Accurate grammar correction without requiring an API key (English)
- Intelligent prompt classification across 30+ business domains
- Reliable prompt enhancement using templates and optional AI
- Speech-to-text for hands-free input
- Seamless handoff to external AI platforms

### Technical goals

- Clean React + TypeScript architecture
- Modular utility layer for grammar, language, and enhancement logic
- Comprehensive Vitest test coverage for core features
- Graceful degradation when OpenAI is unavailable
- Responsive UI with clear loading and error states

### Portfolio goals

- Demonstrate full-stack-ready thinking (even without a backend)
- Show AI/LLM integration experience
- Highlight internationalization and NLP workflows
- Present production-quality code organization and documentation

---

## Scope

### In scope

- Real-time grammar correction (local rules + optional OpenAI)
- Multilingual language detection and translation (via OpenAI)
- Domain-based prompt templates
- Speech input (Web Speech API + Whisper)
- OpenAI-powered enhancement and output generation
- Export to TXT and DOCX
- Integration shortcuts for ChatGPT, Gemini, Bolt, DeepSeek, Lovable, Cline

### Out of scope (current version)

- User authentication and accounts
- Server-side API proxy for OpenAI keys
- Prompt history persistence (stub components exist for future work)
- Backend database (Supabase dependency present but unused)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Grammar correction response | Under 1 second for typical input |
| Enhancement without API key | Fully functional via templates |
| Supported languages | 30+ for detection; translation requires OpenAI |
| Test coverage goal | 80%+ on grammar modules |
| Browser support | Modern Chrome, Firefox, Safari, Edge |

---

## Author

**Poonam Tiwari**  
Full-Stack Developer  

This project is intended for portfolio review, technical interviews, and demonstration of AI-assisted application development skills.
