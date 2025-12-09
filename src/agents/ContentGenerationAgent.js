/**
 * Content Generation Agent
 * Generates answers and content for FAQs and product pages
 */

import { BaseAgent } from './BaseAgent.js';
import { LLMService } from '../utils/llmService.js';
import * as logicBlocks from '../logic/logicBlocks.js';

export class ContentGenerationAgent extends BaseAgent {
    constructor() {
        super('ContentGenerationAgent');
        this.llmService = new LLMService();
        this.dependencies = ['QuestionGenerationAgent'];
    }

    /**
     * Generate FAQ content with answers
     * @param {Object} input - Input containing product and questions
     * @returns {Promise<Object>} FAQ data structure
     */
    async execute(input) {
        this.validate(input);
        const { product, questions } = input;

        this.log('Generating FAQ content...');

        // Select 5+ questions for FAQ
        const selectedQuestions = this.selectFAQQuestions(questions);

        // Generate answers using LLM
        const faqs = await this.generateAnswers(product, selectedQuestions);

        // Apply logic blocks for additional content
        const benefits = logicBlocks.extractBenefitsBlock(product);
        const usage = logicBlocks.extractUsageBlock(product);
        const safety = logicBlocks.generateSafetyBlock(product);

        this.log(`Generated ${faqs.length} FAQ items`);

        return {
            faqs,
            additionalContent: {
                benefits: benefits.content,
                usage: usage.content,
                safety: safety.content,
            },
        };
    }

    /**
     * Select questions for FAQ (ensuring minimum 5, diverse categories)
     * @param {Array} questions - All generated questions
     * @returns {Array} Selected questions
     */
    selectFAQQuestions(questions) {
        const selected = [];
        const categoryCounts = {};

        // Ensure diversity across categories
        for (const question of questions) {
            const category = question.category;
            categoryCounts[category] = categoryCounts[category] || 0;

            if (selected.length < 5 || categoryCounts[category] < 2) {
                selected.push(question);
                categoryCounts[category]++;
            }

            if (selected.length >= 7) break; // Get a few extra for variety
        }

        return selected.slice(0, 5); // Return exactly 5
    }

    /**
     * Generate answers for questions using LLM
     * @param {Product} product - Product instance
     * @param {Array} questions - Questions to answer
     * @returns {Promise<Array>} FAQ items with answers
     */
    async generateAnswers(product, questions) {
        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = this.buildUserPrompt(product, questions);

        const response = await this.llmService.generateJSON(systemPrompt, userPrompt);

        return response.faqs.map((faq, index) => ({
            id: index + 1,
            question: faq.question,
            answer: faq.answer,
            category: questions[index]?.category || 'General',
        }));
    }

    /**
     * Build system prompt for answer generation
     * @returns {string} System prompt
     */
    buildSystemPrompt() {
        return `You are an expert skincare consultant providing helpful, accurate answers.

GUIDELINES:
1. Answer based ONLY on the product information provided
2. Be concise but informative (2-3 sentences per answer)
3. Use a friendly, professional tone
4. Do not invent facts or ingredients not mentioned
5. If safety concerns exist, mention them appropriately

OUTPUT FORMAT (JSON):
{
  "faqs": [
    {
      "question": "question text",
      "answer": "detailed answer"
    }
  ]
}`;
    }

    /**
     * Build user prompt with product data and questions
     * @param {Product} product - Product instance
     * @param {Array} questions - Questions to answer
     * @returns {string} User prompt
     */
    buildUserPrompt(product, questions) {
        const facts = product.extractFacts();

        return `PRODUCT INFORMATION:
Name: ${facts.productName}
Ingredients: ${facts.allIngredients.join(', ')}
Concentration: ${facts.concentration}
Benefits: ${facts.allBenefits.join(', ')}
Skin Types: ${facts.targetSkinTypes.join(', ')}
Usage: ${facts.usageInstructions}
Side Effects: ${facts.safetyInfo}
Price: ${facts.pricing}

QUESTIONS TO ANSWER:
${questions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}

Provide comprehensive, accurate answers based on the product information.`;
    }

    /**
     * Validate input
     * @param {Object} input - Input to validate
     */
    validate(input) {
        super.validate(input);

        if (!input.product || !input.questions) {
            throw new Error('ContentGenerationAgent: Input must contain product and questions');
        }

        if (!Array.isArray(input.questions) || input.questions.length === 0) {
            throw new Error('ContentGenerationAgent: Questions must be a non-empty array');
        }
    }
}
