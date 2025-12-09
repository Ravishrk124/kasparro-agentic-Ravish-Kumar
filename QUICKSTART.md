# 🎯 Quick Start Guide

## Run the System (3 Ways)

### 1️⃣ Mock Mode (Recommended - No API Key Needed)
```bash
npm install
npm start
```
✅ Runs instantly with predefined responses  
✅ Generates all 4 JSON outputs in `output/` directory

### 2️⃣ OpenRouter (Free Tier)
```bash
# Get free key: https://openrouter.ai/keys
echo "LLM_PROVIDER=openrouter" > .env
echo "LLM_API_KEY=your_key" >> .env
echo "LLM_MODEL=google/gemini-flash-1.5" >> .env
npm start
```

### 3️⃣ OpenAI (Paid)
```bash
echo "LLM_PROVIDER=openai" > .env
echo "LLM_API_KEY=your_key" >> .env
echo "LLM_MODEL=gpt-4o-mini" >> .env
npm start
```

## Generated Outputs

After running `npm start`, check `output/` directory:
- `all_questions.json` - 18 categorized questions
- `faq.json` - 5 FAQ items with answers
- `product_page.json` - Complete product description
- `comparison_page.json` - Product comparison

## 📚 Documentation

- **[README.md](README.md)** - Project overview and architecture
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[docs/projectdocumentation.md](docs/projectdocumentation.md)** - Complete system design
- **[SUBMISSION.md](SUBMISSION.md)** - Submission summary

## System Architecture

```
DataParserAgent → QuestionGenerationAgent → ContentGenerationAgent
      └────────→ ComparisonAgent

All agents orchestrated via DAG with MessageBus communication
```

**Built for the Kasparro AI Engineering Challenge**
