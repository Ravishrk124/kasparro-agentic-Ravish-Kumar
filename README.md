# Multi-Agent Content Generation System

> **Kasparro AI Engineering Challenge** - Production-grade agentic automation for structured content generation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## 🎯 Overview

A modular, production-ready multi-agent system that transforms product data into structured, machine-readable content pages. Built with clear agent boundaries, DAG-based orchestration, reusable logic blocks, and a custom template engine.

### Key Features

✅ **Multi-Agent Architecture** - Independent agents with single responsibilities  
✅ **DAG-Based Orchestration** - Automatic dependency resolution and execution ordering  
✅ **Reusable Logic Blocks** - Pure functions for data transformation  
✅ **Custom Template Engine** - Declarative templates with validation  
✅ **Machine-Readable Output** - Clean JSON for all generated pages  

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/kasparro-ai-agentic-content-generation-system-ravish-kumar.git
cd kasparro-ai-agentic-content-generation-system-ravish-kumar

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Configuration

Edit `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OUTPUT_DIR=./output
```

### Run the Pipeline

```bash
npm start
```

## 📁 Project Structure

```
├── src/
│   ├── agents/              # Agent implementations
│   │   ├── BaseAgent.js
│   │   ├── DataParserAgent.js
│   │   ├── QuestionGenerationAgent.js
│   │   ├── ContentGenerationAgent.js
│   │   └── ComparisonAgent.js
│   ├── orchestration/       # Workflow coordination
│   │   ├── orchestrator.js
│   │   ├── workflowGraph.js
│   │   └── messageBus.js
│   ├── logic/               # Content logic blocks
│   │   └── logicBlocks.js
│   ├── templates/           # Template engine
│   │   ├── templateEngine.js
│   │   ├── templateSchema.js
│   │   ├── faqTemplate.js
│   │   ├── productTemplate.js
│   │   └── comparisonTemplate.js
│   ├── models/              # Data models
│   │   └── productModel.js
│   ├── utils/               # Utilities
│   │   ├── llmService.js
│   │   ├── outputFormatter.js
│   │   └── pageGenerator.js
│   ├── config/              # Configuration
│   │   └── config.js
│   └── index.js             # Main entry point
├── data/                    # Input data
│   └── productData.json
├── output/                  # Generated JSON outputs
├── tests/                   # Test suites
└── docs/                    # Documentation
    └── projectdocumentation.md
```

## 📊 System Architecture

The system uses a coordinator-worker pattern with DAG-based orchestration:

```
Product Data → DataParser → Orchestrator → [Agents] → Template Engine → JSON Output
                                ↓
                           MessageBus (Communication)
                                ↓
                    QuestionGeneration, ContentGeneration, Comparison
```

### Agents

1. **DataParserAgent** - Parses and validates product data
2. **QuestionGenerationAgent** - Generates 15+ categorized questions using LLM
3. **ContentGenerationAgent** - Creates FAQ answers with logic blocks
4. **ComparisonAgent** - Generates fictional Product B and comparison content

### Orchestration Flow

```
DataParserAgent
    ↓
    ├─→ QuestionGenerationAgent → ContentGenerationAgent
    └─→ ComparisonAgent
```

## 📦 Generated Outputs

All outputs are in `output/` directory:

- **`faq.json`** - FAQ page with 5+ Q&As
- **`product_page.json`** - Complete product description
- **`comparison_page.json`** - Product A vs Product B comparison
- **`all_questions.json`** - All 15+ generated questions (reference)

## 🧪 Testing

```bash
# Run test suite
npm test

# Run with coverage
npm run test:coverage
```

## 📖 Documentation

See [`docs/projectdocumentation.md`](docs/projectdocumentation.md) for:
- Problem statement
- Solution overview
- System design details
- Architecture diagrams
- Scopes & assumptions

## 🏗️ System Design Highlights

### Agent Boundaries
- Each agent has a single, well-defined responsibility
- No global state - all communication via MessageBus
- Clear input/output contracts

### Content Logic Blocks
8 reusable pure functions:
- `extractBenefitsBlock`
- `extractUsageBlock`
- `generateSafetyBlock`
- `extractIngredientsBlock`
- `compareIngredientsBlock`
- `generatePriceComparisonBlock`
- `categorizeBenefitsBlock`
- `generateSkinTypeBlock`

### Template System
- Declarative template definitions
- Schema validation
- Logic block integration
- Type-safe field definitions

## 🎓 Assignment Compliance

✅ Modular agentic system (not monolithic)  
✅ 15+ categorized user questions  
✅ Custom template definitions (FAQ, Product, Comparison)  
✅ Reusable content logic blocks  
✅ 3 pages generated autonomously  
✅ Machine-readable JSON output  
✅ Full agent-based pipeline  

## 👨‍💻 Author

**Ravish Kumar**  
Full-Stack + AI Developer  
[LinkedIn](https://linkedin.com/in/ravish-kumar) | [GitHub](https://github.com/ravishkumar)

## 📄 License

MIT License - see LICENSE file for details

---

Built for the **Kasparro Applied AI Engineer Challenge**
