/**
 * Comparison Agent
 * Creates fictional Product B and generates comparison content
 */

import { BaseAgent } from './BaseAgent.js';
import { LLMService } from '../utils/llmService.js';
import { Product } from '../models/productModel.js';
import * as logicBlocks from '../logic/logicBlocks.js';

export class ComparisonAgent extends BaseAgent {
    constructor() {
        super('ComparisonAgent');
        this.llmService = new LLMService();
        this.dependencies = ['DataParserAgent'];
    }

    /**
     * Generate comparison content
     * @param {Product} productA - Real product
     * @returns {Promise<Object>} Comparison data
     */
    async execute(productA) {
        this.validate(productA);
        this.log('Generating comparison content...');

        // Create fictional Product B
        const productB = await this.createFictionalProduct(productA);

        // Generate comparison using logic blocks
        const ingredientComparison = logicBlocks.compareIngredientsBlock(productA, productB);
        const priceComparison = logicBlocks.generatePriceComparisonBlock(productA, productB);

        // Generate recommendation using LLM
        const recommendation = await this.generateRecommendation(productA, productB);

        this.log(`Created comparison: ${productA.name} vs ${productB.name}`);

        return {
            productA: productA.toJSON(),
            productB: productB.toJSON(),
            comparison: {
                ingredients: ingredientComparison.content,
                price: priceComparison.content,
            },
            recommendation,
        };
    }

    /**
     * Create a fictional competing product
     * @param {Product} realProduct - Real product to base comparison on
     * @returns {Promise<Product>} Fictional product
     */
    async createFictionalProduct(realProduct) {
        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = this.buildUserPrompt(realProduct);

        const response = await this.llmService.generateJSON(systemPrompt, userPrompt);

        // Create Product instance from generated data
        return new Product(response.product);
    }

    /**
     * Generate purchase recommendation based on comparison
     * @param {Product} productA - First product
     * @param {Product} productB - Second product
     * @returns {Promise<string>} Recommendation text
     */
    async generateRecommendation(productA, productB) {
        const systemPrompt = `You are a skincare expert providing product recommendations.
Analyze both products and provide a balanced recommendation based on ingredients, price, and benefits.
Be objective and highlight which product might be better for different use cases.
Keep the recommendation to 2-3 sentences.`;

        const userPrompt = `Compare these products and provide a recommendation:

PRODUCT A: ${productA.name}
- Price: ${productA.price}
- Ingredients: ${productA.keyIngredients.join(', ')}
- Benefits: ${productA.benefits.join(', ')}
- Skin Types: ${productA.skinType.join(', ')}

PRODUCT B: ${productB.name}
- Price: ${productB.price}
- Ingredients: ${productB.keyIngredients.join(', ')}
- Benefits: ${productB.benefits.join(', ')}
- Skin Types: ${productB.skinType.join(', ')}`;

        return await this.llmService.generateCompletion(systemPrompt, userPrompt);
    }

    /**
     * Build system prompt for fictional product creation
     * @returns {string} System prompt
     */
    buildSystemPrompt() {
        return `You are a product data specialist. Create a realistic fictional competing skincare product.

REQUIREMENTS:
1. The product should be similar but not identical to the reference
2. Use different brand name and product name
3. Vary the concentration slightly
4. Include some overlapping and some different ingredients
5. Provide realistic benefits
6. Set a different price point (higher or lower)
7. Target similar or overlapping skin types
8. Include realistic side effects or "None known"

OUTPUT FORMAT (JSON):
{
  "product": {
    "name": "product name",
    "concentration": "percentage or strength",
    "skinType": ["type1", "type2"],
    "keyIngredients": ["ingredient1", "ingredient2"],
    "benefits": ["benefit1", "benefit2"],
    "howToUse": "usage instructions",
    "sideEffects": "side effects or None known",
    "price": "₹XXX"
  }
}`;
    }

    /**
     * Build user prompt with reference product
     * @param {Product} product - Reference product
     * @returns {string} User prompt
     */
    buildUserPrompt(product) {
        return `Create a fictional competing product similar to this reference:

REFERENCE PRODUCT:
Name: ${product.name}
Concentration: ${product.concentration}
Ingredients: ${product.keyIngredients.join(', ')}
Benefits: ${product.benefits.join(', ')}
Skin Types: ${product.skinType.join(', ')}
Usage: ${product.howToUse}
Price: ${product.price}

Create a realistic competitor with similar characteristics but unique details.`;
    }

    /**
     * Validate product input
     * @param {Product} product - Product to validate
     */
    validate(product) {
        super.validate(product);

        if (!product.name) {
            throw new Error('ComparisonAgent: Product must have a name');
        }
    }
}
