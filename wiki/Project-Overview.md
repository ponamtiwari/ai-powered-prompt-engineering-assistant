# Project Overview

[[Home]] · [[Features]] · [[Architecture]]

---

## About

**AI-Powered Prompt Engineering Assistant** helps users write better prompts for AI tools such as ChatGPT, Gemini, and Claude. Users type or speak a rough idea; the app corrects grammar, classifies the domain, and produces a structured professional prompt.

**Author:** Poonam Tiwari — Senior Software Engineer  
**Type:** Single-page web application (SPA)  
**Deployment:** Client-side browser app with optional OpenAI API

---

## Problem

Users often write vague, error-filled prompts that produce poor AI results:

- Spelling and grammar mistakes
- Missing context and structure
- No domain-specific formatting
- Language barriers for non-English speakers

---

## Solution

Integrated workflow:

```
Correct → Classify → Enhance → Export → Execute
```

1. Real-time grammar correction
2. Domain classification (30+ categories)
3. Template + optional AI enhancement
4. Translation for non-English users
5. Copy, download, or send to external AI platforms

---

## Target users

| User | Benefit |
|------|---------|
| Job seekers | Resume, email, cover letter prompts |
| Developers | Code and technical task prompts |
| Marketers | Campaign and SEO prompts |
| HR / business | Professional communication prompts |
| Multilingual users | Hindi, Gujarati, Arabic, and 30+ languages |

---

## Goals

**Functional:** Grammar correction, domain templates, speech input, OpenAI integration  
**Technical:** Clean React/TypeScript architecture, Vitest coverage, graceful degradation  
**Portfolio:** Demonstrate AI integration, i18n, and quality engineering

---

## Scope

**In scope:** Grammar, enhancement, speech, translation, export, platform shortcuts  
**Out of scope:** User auth, backend proxy, prompt history (stubs exist for future work)

---

## Success metrics

| Metric | Target |
|--------|--------|
| Grammar response | Under 1 second |
| Enhancement without API key | Fully functional |
| Languages detected | 30+ |
| Test coverage | 80%+ on grammar modules |

See also: [[Features]] · [[Roadmap]]
