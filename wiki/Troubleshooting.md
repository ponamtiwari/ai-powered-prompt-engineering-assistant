# Troubleshooting

[[Home]] · [[FAQ]] · [[User Guide]]

---

## Git / GitHub

| Issue | Fix |
|-------|-----|
| Repository not found | Check username is **ponamtiwari** (one "o") |
| `htdocs already exists` | Don't clone — push from existing folder |
| Push auth failed | Use Personal Access Token, not password |

---

## Application errors

| Error | Solution |
|-------|----------|
| Add API key to translate... | Add OpenAI key for non-English |
| Invalid API key | Verify key at platform.openai.com |
| Rate limit exceeded | Wait and retry |
| Please enhance first | Click Enhance Prompt before Generate Output |
| Enhancement failed | Check console; verify network |

---

## Grammar

| Issue | Solution |
|-------|----------|
| No suggestions shown | Text may already be correct |
| Wrong language detected | Type more text in target language |
| Slow correction | Normal for long text; see performance tests |

---

## Speech

| Issue | Solution |
|-------|----------|
| Not supported | Use Chrome/Edge or type manually |
| No transcript | Check mic permission |
| Auto mode silent | Add API key for Whisper |
| Wrong language | Select language manually in dropdown |

---

## Build / dev

| Issue | Solution |
|-------|----------|
| `npm install` fails | Use Node 18+ |
| Port in use | Vite picks next port or kill existing process |
| Blank page | Check console; run `npm run build` for errors |

---

## Tests

```bash
npm run test:run
npm run test:grammar
```

If tests fail after changes, check mocks in `src/test/setup.ts`.

See [[Developer Guide]] and [[Testing]].
