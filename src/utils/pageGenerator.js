/**
 * Page Generators
 * High-level functions to generate complete pages using templates and agents
 */

import { TemplateEngine } from '../templates/templateEngine.js';
import { faqTemplate } from '../templates/faqTemplate.js';
import { productTemplate } from '../templates/productTemplate.js';
import { comparisonTemplate } from '../templates/comparisonTemplate.js';
import * as logicBlocks from '../logic/logicBlocks.js';

export class PageGenerator {
    constructor() {
        this.templateEngine = new TemplateEngine();
        this.registerTemplates();
    }

    /**
     * Register all templates
     */
    registerTemplates() {
        this.templateEngine.registerTemplate(faqTemplate);
        this.templateEngine.registerTemplate(productTemplate);
        this.templateEngine.registerTemplate(comparisonTemplate);
    }

    /**
     * Generate FAQ page data
     * @param {Object} faqData - FAQ data from ContentGenerationAgent
     * @param {Product} product - Product instance
     * @returns {Object} FAQ page data
     */
    generateFAQPage(faqData, product) {
        const pageData = {
            pageTitle: 'Frequently Asked Questions',
            productName: product.name,
            introduction: `Common questions about ${product.name}`,
            faqs: faqData.faqs,
            totalQuestions: faqData.faqs.length,
        };

        return this.templateEngine.render('faq_page', pageData, { product });
    }

    /**
     * Generate product page data
     * @param {Product} product - Product instance
     * @returns {Object} Product page data
     */
    generateProductPage(product) {
        // Apply all logic blocks
        const benefits = logicBlocks.extractBenefitsBlock(product);
        const ingredients = logicBlocks.extractIngredientsBlock(product);
        const usage = logicBlocks.extractUsageBlock(product);
        const skinType = logicBlocks.generateSkinTypeBlock(product);
        const safety = logicBlocks.generateSafetyBlock(product);

        const pageData = {
            pageTitle: product.name,
            productName: product.name,
            tagline: `${product.concentration} ${product.keyIngredients[0]} Serum`,
            overview: {
                description: `${product.name} is a premium skincare solution formulated for ${product.skinType.join(' and ')} skin types.`,
                concentration: product.concentration,
                price: product.price,
            },
            benefits: benefits.content,
            ingredients: ingredients.content,
            usage: usage.content,
            skinType: skinType.content,
            safety: safety.content,
        };

        return this.templateEngine.render('product_page', pageData, { product });
    }

    /**
     * Generate comparison page data
     * @param {Object} comparisonData - Comparison data from ComparisonAgent
     * @returns {Object} Comparison page data
     */
    generateComparisonPage(comparisonData) {
        const pageData = {
            pageTitle: `${comparisonData.productA.name} vs ${comparisonData.productB.name}`,
            productA: comparisonData.productA,
            productB: comparisonData.productB,
            comparison: comparisonData.comparison,
            recommendation: comparisonData.recommendation,
        };

        return this.templateEngine.render('comparison_page', pageData);
    }
}
