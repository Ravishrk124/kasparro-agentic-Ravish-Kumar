/**
 * Configuration Management
 * Centralizes all environment and application settings
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

export const config = {
    // LLM Configuration (supports OpenAI, OpenRouter, or Mock)
    llm: {
        provider: process.env.LLM_PROVIDER || 'mock', // 'openai', 'openrouter', or 'mock'
        apiKey: process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || '',
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 2000,
    },

    // Paths
    paths: {
        root: rootDir,
        data: join(rootDir, 'data'),
        output: join(rootDir, process.env.OUTPUT_DIR || 'output'),
        templates: join(__dirname, '../templates'),
    },

    // Application Settings
    app: {
        minQuestionsPerCategory: 2,
        totalQuestionsTarget: 15,
        minFaqItems: 5,
    },

    // Question Categories
    questionCategories: [
        'Informational',
        'Safety',
        'Usage',
        'Purchase',
        'Comparison',
        'Ingredients',
    ],
};

/**
 * Validate configuration
 * @throws {Error} if required configuration is missing
 */
export function validateConfig() {
    if (config.llm.provider === 'mock') {
        console.warn('[Config] Running in MOCK mode - no API calls will be made');
        return;
    }

    if (!config.llm.apiKey) {
        throw new Error(
            'LLM_API_KEY or OPENAI_API_KEY is required. Please set it in your .env file, or use LLM_PROVIDER=mock for testing.'
        );
    }
}
