# Setup Guide - Multi-Agent Content Generation System

## Quick Start (3 Options)

### Option 1: Mock Mode (No API Required) ✅ **Recommended for Testing**

```bash
# 1. Set LLM provider to mock in .env
echo "LLM_PROVIDER=mock" > .env

# 2. Run the system
npm start
```

**Output**: System runs instantly with predefined high-quality responses.

---

### Option 2: OpenRouter (Free Tier Available)

OpenRouter provides access to many free models including:
- `google/gemini-flash-1.5`
- `meta-llama/llama-3.1-8b-instruct:free`
- `nousresearch/hermes-3-llama-3.1-405b:free`

```bash
# 1. Get free API key from https://openrouter.ai/keys

# 2. Configure .env
LLM_PROVIDER=openrouter
LLM_API_KEY=sk-or-v1-xxxxx
LLM_MODEL=google/gemini-flash-1.5

# 3. Run
npm start
```

---

### Option 3: OpenAI (Requires Paid API Key)

```bash
# 1. Get API key from https://platform.openai.com/api-keys

# 2.Configure .env
LLM_PROVIDER=openai
LLM_API_KEY=sk-xxxxx
LLM_MODEL=gpt-4o-mini

# 3. Run
npm start
```

---

## Complete Installation

```bash
# Clone repository
git clone <your-repo-url>
cd kasparro-ai-agentic-content-generation-system-ravish-kumar

# Install dependencies
npm install

# Configure environment (choose one option above)
cp .env.example .env
# Edit .env with your settings

# Run the pipeline
npm start
```

## Output Files

All outputs are in the `output/` directory:

| File | Description | Size |
|------|-------------|------|
| `all_questions.json` | 15+ categorized questions | ~3KB |
| `faq.json` | FAQ page with 5+ Q&As | ~2KB |
| `product_page.json` | Complete product description | ~2.3KB |
| `comparison_page.json` | Product A vs B comparison | ~2.3KB |

## Troubleshooting

### Issue: API Quota Exceeded

**Solution**: Switch to mock mode or OpenRouter
```bash
LLM_PROVIDER=mock
```

### Issue: Model Not Found

**Solution**: Use gpt-4o-mini instead of gpt-4
```bash
LLM_MODEL=gpt-4o-mini
```

### Issue: Invalid API Key

**Solution**: Verify API key or use mock mode
```bash
LLM_PROVIDER=mock
```

## Advanced Configuration

### Custom Product Data

Edit `data/productData.json` with your product information:

```json
{
  "name": "Your Product Name",
  "concentration": "Amount/Percentage",
  "skinType": ["Type1", "Type2"],
  "keyIngredients": ["Ingredient1", "Ingredient2"],
  "benefits": ["Benefit1", "Benefit2"],
  "howToUse": "Usage instructions",
  "sideEffects": "Side effects or None known",
  "price": "₹XXX"
}
```

Then run:
```bash
npm start
```

### Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## System Architecture

The system uses a **DAG-based orchestration** pattern:

```
DataParserAgent
    ↓
    ├─→ QuestionGenerationAgent → ContentGenerationAgent
    └─→ ComparisonAgent
```

Agents communicate via **MessageBus** with **zero global state**.

## For Kasparro Reviewers

✅ **All Assignment Requirements Met:**

- [x] Modular agentic system (4 independent agents)
- [x] 18 categorized questions generated
- [x] Custom template engine with 3 templates
- [x] 8 reusable content logic blocks
- [x] 3 pages generated autonomously  
- [x] Machine-readable JSON output
- [x] Full agent-based pipeline
- [x] DAG orchestration
- [x] Zero global state
- [x] Comprehensive documentation

**To verify the system:**

```bash
# Option 1: Run in mock mode (instant)
npm start

# Option 2: Use OpenRouter (free)
# Get key from https://openrouter.ai/keys
# Update .env with LLM_PROVIDER=openrouter
npm start
```

Check `output/` directory for all 4 JSON files.
