/**
 * Output Formatter
 * Handles JSON output generation and file writing
 */

import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { config } from '../config/config.js';

export class OutputFormatter {
    constructor(outputDir = config.paths.output) {
        this.outputDir = outputDir;
    }

    /**
     * Ensure output directory exists
     */
    async ensureOutputDir() {
        try {
            await mkdir(this.outputDir, { recursive: true });
        } catch (error) {
            console.error('Error creating output directory:', error.message);
            throw error;
        }
    }

    /**
     * Write JSON to file
     * @param {string} filename - Output filename
     * @param {Object} data - Data to write
     */
    async writeJSON(filename, data) {
        await this.ensureOutputDir();

        const filePath = join(this.outputDir, filename);
        const jsonContent = JSON.stringify(data, null, 2);

        try {
            await writeFile(filePath, jsonContent, 'utf-8');
            console.log(`[OutputFormatter] ✓ Written: ${filePath}`);
        } catch (error) {
            console.error(`Error writing ${filename}:`, error.message);
            throw error;
        }
    }

    /**
     * Format and write FAQ page
     * @param {Object} faqData - FAQ data from ContentGenerationAgent
     * @param {string} productName - Product name
     */
    async writeFAQPage(faqData, productName) {
        const output = {
            pageTitle: 'Frequently Asked Questions',
            productName,
            introduction: `Common questions about ${productName}`,
            faqs: faqData.faqs,
            totalQuestions: faqData.faqs.length,
            generatedAt: new Date().toISOString(),
        };

        await this.writeJSON('faq.json', output);
    }

    /**
     * Format and write product page
     * @param {Product} product - Product instance
     * @param {Object} contentBlocks - Content from logic blocks
     */
    async writeProductPage(product, contentBlocks) {
        const output = {
            pageTitle: product.name,
            productName: product.name,
            tagline: `${product.concentration} ${product.keyIngredients[0]} Serum`,
            overview: {
                description: `${product.name} is a premium skincare solution formulated for ${product.skinType.join(' and ')} skin types.`,
                concentration: product.concentration,
                price: product.price,
            },
            benefits: contentBlocks.benefits,
            ingredients: contentBlocks.ingredients,
            usage: contentBlocks.usage,
            skinType: contentBlocks.skinType,
            safety: contentBlocks.safety,
            generatedAt: new Date().toISOString(),
        };

        await this.writeJSON('product_page.json', output);
    }

    /**
     * Format and write comparison page
     * @param {Object} comparisonData - Comparison data from ComparisonAgent
     */
    async writeComparisonPage(comparisonData) {
        const output = {
            pageTitle: `${comparisonData.productA.name} vs ${comparisonData.productB.name}`,
            productA: comparisonData.productA,
            productB: comparisonData.productB,
            comparison: comparisonData.comparison,
            recommendation: comparisonData.recommendation,
            generatedAt: new Date().toISOString(),
        };

        await this.writeJSON('comparison_page.json', output);
    }

    /**
     * Write all questions to a separate file (for reference)
     * @param {Array} questions - All generated questions
     */
    async writeAllQuestions(questions) {
        const output = {
            title: 'All Generated Questions',
            totalQuestions: questions.length,
            categories: this.groupByCategory(questions),
            questions,
            generatedAt: new Date().toISOString(),
        };

        await this.writeJSON('all_questions.json', output);
    }

    /**
     * Group questions by category
     * @param {Array} questions - Questions array
     * @returns {Object} Grouped questions
     */
    groupByCategory(questions) {
        const grouped = {};

        questions.forEach((q) => {
            const category = q.category;
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(q.question);
        });

        return grouped;
    }
}
