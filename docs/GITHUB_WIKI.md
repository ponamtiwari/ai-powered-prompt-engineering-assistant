# GitHub Wiki Source

This folder contains the **source files** for the [GitHub Wiki](https://github.com/ponamtiwari/ai-powered-prompt-engineering-assistant/wiki).

Wiki pages use GitHub wiki link syntax: `[[Page Name]]`

---

## Wiki pages

| File | Wiki URL |
|------|----------|
| `Home.md` | Wiki home |
| `Project-Overview.md` | Project overview |
| `Features.md` | Features |
| `Architecture.md` | Architecture |
| `User-Guide.md` | User guide |
| `Developer-Guide.md` | Developer guide |
| `API-Integration.md` | API integration |
| `Testing.md` | Testing |
| `License-and-Usage.md` | License and usage |
| `FAQ.md` | FAQ |
| `Troubleshooting.md` | Troubleshooting |
| `Roadmap.md` | Roadmap |
| `_Sidebar.md` | Wiki sidebar navigation |
| `_Footer.md` | Wiki footer |

---

## Publish wiki to GitHub

### Step 1 — Enable Wikis (browser)

1. Open https://github.com/ponamtiwari/ai-powered-prompt-engineering-assistant/settings
2. Under **Features**, check **Wikis**
3. Save

### Step 2 — Push wiki files (Terminal)

From the project root:

```bash
./scripts/push-wiki.sh
```

Or manually:

```bash
cd /tmp
git clone https://github.com/ponamtiwari/ai-powered-prompt-engineering-assistant.wiki.git
cp /Applications/XAMPP/xamppfiles/htdocs/Prompt/wiki/*.md ai-powered-prompt-engineering-assistant.wiki/
cd ai-powered-prompt-engineering-assistant.wiki
git add .
git commit -m "Publish project wiki"
git push
```

### Step 3 — View wiki

https://github.com/ponamtiwari/ai-powered-prompt-engineering-assistant/wiki

---

## Updating the wiki

1. Edit files in this `wiki/` folder
2. Commit to main repository
3. Run `./wiki/push-wiki.sh` to sync to GitHub Wiki

---

**Author:** Poonam Tiwari — Senior Software Engineer
