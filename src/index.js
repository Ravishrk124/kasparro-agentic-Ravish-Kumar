#!/usr/bin/env node

/**
 * Main Entry Point
 * Orchestrates the multi-agent content generation pipeline
 */

import { join } from 'path';
import { config, validateConfig } from './config/config.js';
import { Orchestrator } from './orchestration/orchestrator.js';
import { DataParserAgent } from './agents/DataParserAgent.js';
import { QuestionGenerationAgent } from './agents/QuestionGenerationAgent.js';
import { ContentGenerationAgent } from './agents/ContentGenerationAgent.js';
import { ComparisonAgent } from './agents/ComparisonAgent.js';
import { OutputFormatter } from './utils/outputFormatter.js';
import { PageGenerator } from './utils/pageGenerator.js';

/**
 * Main pipeline execution
 */
async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   Multi-Agent Content Generation System                   ║');
    console.log('║   Kasparro AI Engineering Challenge                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    try {
        // Validate configuration
        console.log('[Main] Validating configuration...');
        validateConfig();
        console.log('[Main] ✓ Configuration validated\n');

        // Initialize orchestrator
        const orchestrator = new Orchestrator();

        // Register agents
        console.log('[Main] Registering agents...');
        orchestrator.registerAgent(new DataParserAgent());
        orchestrator.registerAgent(new QuestionGenerationAgent());
        orchestrator.registerAgent(new ContentGenerationAgent());
        orchestrator.registerAgent(new ComparisonAgent());
        console.log('[Main] ✓ All agents registered\n');

        // Set context with product data path
        const productDataPath = join(config.paths.data, 'productData.json');
        orchestrator.setContext({ productDataPath });

        // Execute workflow
        const results = await orchestrator.execute();

        // Generate pages
        console.log('[Main] Generating pages...\n');
        const pageGenerator = new PageGenerator();
        const outputFormatter = new OutputFormatter();

        // Get results from agents
        const product = orchestrator.getResult('DataParserAgent');
        const questions = orchestrator.getResult('QuestionGenerationAgent');
        const faqData = orchestrator.getResult('ContentGenerationAgent');
        const comparisonData = orchestrator.getResult('ComparisonAgent');

        // Write all questions (for reference)
        await outputFormatter.writeAllQuestions(questions);

        // Generate and write FAQ page
        console.log('[Main] Generating FAQ page...');
        await outputFormatter.writeFAQPage(faqData, product.name);
        console.log('[Main] ✓ FAQ page generated\n');

        // Generate and write Product page
        console.log('[Main] Generating Product page...');
        const productPageData = pageGenerator.generateProductPage(product);
        await outputFormatter.writeProductPage(product, productPageData);
        console.log('[Main] ✓ Product page generated\n');

        // Generate and write Comparison page
        console.log('[Main] Generating Comparison page...');
        await outputFormatter.writeComparisonPage(comparisonData);
        console.log('[Main] ✓ Comparison page generated\n');

        // Success summary
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║   ✓ Pipeline Execution Completed Successfully             ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        console.log('Generated outputs:');
        console.log(`  • ${config.paths.output}/all_questions.json (${questions.length} questions)`);
        console.log(`  • ${config.paths.output}/faq.json (${faqData.faqs.length} Q&As)`);
        console.log(`  • ${config.paths.output}/product_page.json`);
        console.log(`  • ${config.paths.output}/comparison_page.json`);
        console.log('');

    } catch (error) {
        console.error('\n╔════════════════════════════════════════════════════════════╗');
        console.error('║   ✗ Pipeline Execution Failed                             ║');
        console.error('╚════════════════════════════════════════════════════════════╝\n');
        console.error('Error:', error.message);
        console.error('\nStack trace:');
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the pipeline
main();
