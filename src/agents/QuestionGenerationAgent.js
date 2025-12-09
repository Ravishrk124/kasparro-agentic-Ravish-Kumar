/**
 * Question Generation Agent
 * Generates categorized user questions from product data
 */

import { BaseAgent } from './BaseAgent.js';
import { LLMService } from '../utils/llmService.js';
import { config } from '../config/config.js';

export class QuestionGenerationAgent extends BaseAgent {
    constructor() {
        super('QuestionGenerationAgent');
        this.llmService = new LLMService();
        this.dependencies = ['DataParserAgent'];
    }

    /**
     * Generate categorized questions from product
     * @param {Product} product - Product instance
     * @returns {Promise<Array>} Array of categorized questions
     */
    async execute(product) {
        this.validate(product);
        this.log('Generating user questions...');

        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = this.buildUserPrompt(product);

        const response = await this.llmService.generateJSON(systemPrompt, userPrompt);

        // Ensure we have at least 15 questions
        if (!response.questions || response.questions.length < 15) {
            throw new Error('Failed to generate minimum 15 questions');
        }

        this.log(`Generated ${response.questions.length} questions across ${new Set(response.questions.map(q => q.category)).size} categories`);

        return response.questions;
    }

    /**
     * Build system prompt for question generation
     * @returns {string} System prompt
     */
    buildSystemPrompt() {
        return `You are an expert content strategist specializing in skincare products. 
Your task is to generate realistic, diverse user questions about products.

CATEGORIES: ${config.questionCategories.join(', ')}

REQUIREMENTS:
1. Generate at least 15 questions total
2. Distribute questions across all categories
3. Questions should be natural and user-focused
4. Cover different aspects: ingredients, usage, benefits, safety, pricing, comparisons
5. Be specific to the product details provided

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "question": "question text here",
      "category": "category name"
    }
  ]
}`;
    }

    /**
     * Build user prompt with product data
     * @param {Product} product - Product instance
     * @returns {string} User prompt
     */
    buildUserPrompt(product) {
        const facts = product.extractFacts();

        return `Generate user questions for this product:

PRODUCT: ${facts.productName}
CONCENTRATION: ${facts.concentration}
INGREDIENTS: ${facts.allIngredients.join(', ')}
BENEFITS: ${facts.allBenefits.join(', ')}
SKIN TYPES: ${facts.targetSkinTypes.join(', ')}
USAGE: ${facts.usageInstructions}
SIDE EFFECTS: ${facts.safetyInfo}
PRICE: ${facts.pricing}

Generate at least 15 diverse, realistic questions users might ask about this product.`;
    }

    /**
     * Validate product input
     * @param {Product} product - Product to validate
     */
    validate(product) {
        super.validate(product);

        if (!product.name) {
            throw new Error('QuestionGenerationAgent: Product must have a name');
        }
    }
}
