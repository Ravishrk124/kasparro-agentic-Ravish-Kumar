/**
 * LLM Service
 * Handles communication with LLM APIs (OpenAI, OpenRouter, or Mock mode)
 */

import OpenAI from 'openai';
import { config } from '../config/config.js';

export class LLMService {
    constructor() {
        this.provider = config.llm.provider;
        this.model = config.llm.model;

        if (this.provider === 'openai') {
            this.client = new OpenAI({
                apiKey: config.llm.apiKey,
            });
        } else if (this.provider === 'openrouter') {
            this.client = new OpenAI({
                apiKey: config.llm.apiKey,
                baseURL: 'https://openrouter.ai/api/v1',
                defaultHeaders: {
                    'HTTP-Referer': 'https://github.com/ravishkumar',
                    'X-Title': 'Kasparro AI Content System',
                },
            });
        } else if (this.provider === 'mock') {
            this.client = null;
            console.log('[LLMService] Running in MOCK mode - using predefined responses');
        }
    }

    /**
     * Generate completion from LLM
     * @param {string} systemPrompt - System instructions
     * @param {string} userPrompt - User query
     * @param {Object} options - Additional options
     * @returns {Promise<string>} LLM response
     */
    async generateCompletion(systemPrompt, userPrompt, options = {}) {
        if (this.provider === 'mock') {
            return this.getMockCompletion(systemPrompt, userPrompt);
        }

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                temperature: options.temperature || config.llm.temperature,
                max_tokens: options.maxTokens || config.llm.maxTokens,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('LLM Service Error:', error.message);
            throw new Error(`Failed to generate completion: ${error.message}`);
        }
    }

    /**
     * Generate structured JSON response
     * @param {string} systemPrompt - System instructions
     * @param {string} userPrompt - User query
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Parsed JSON response
     */
    async generateJSON(systemPrompt, userPrompt, options = {}) {
        if (this.provider === 'mock') {
            return this.getMockJSON(systemPrompt, userPrompt);
        }

        const jsonPrompt = `${systemPrompt}\n\nIMPORTANT: Respond with valid JSON only. No additional text.`;

        const response = await this.generateCompletion(jsonPrompt, userPrompt, {
            ...options,
            temperature: 0.5, // Lower temperature for more consistent JSON
        });

        try {
            // Clean response (remove markdown code blocks if present)
            let cleaned = response.trim();
            if (cleaned.startsWith('```json')) {
                cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/```\n?/g, '');
            }

            return JSON.parse(cleaned);
        } catch (error) {
            console.error('JSON Parse Error:', error.message);
            console.error('Response:', response);
            throw new Error('Failed to parse LLM response as JSON');
        }
    }

    /**
     * Get mock completion for testing without API calls
     * @param {string} systemPrompt - System prompt
     * @param {string} userPrompt - User prompt
     * @returns {string} Mock response
     */
    getMockCompletion(systemPrompt, userPrompt) {
        if (userPrompt.includes('recommendation')) {
            return 'GlowBoost Vitamin C Serum offers excellent value for those seeking brightening benefits at ₹699, while competitors may offer additional ingredients at a higher price point. Choose based on your specific skin concerns and budget.';
        }
        return 'This is a mock response for testing purposes.';
    }

    /**
     * Get mock JSON for testing without API calls
     * @param {string} systemPrompt - System prompt
     * @param {string} userPrompt - User prompt
     * @returns {Object} Mock JSON response
     */
    getMockJSON(systemPrompt, userPrompt) {
        // Questions generation
        if (userPrompt.includes('Generate user questions') || userPrompt.includes('QUESTIONS TO ANSWER')) {
            if (systemPrompt.includes('questions about products')) {
                return {
                    questions: [
                        { question: "What is GlowBoost Vitamin C Serum?", category: "Informational" },
                        { question: "What concentration of Vitamin C does this serum contain?", category: "Informational" },
                        { question: "What are the key ingredients in this product?", category: "Ingredients" },
                        { question: "Are there any side effects I should know about?", category: "Safety" },
                        { question: "Is this serum suitable for sensitive skin?", category: "Safety" },
                        { question: "Can I use this serum during pregnancy?", category: "Safety" },
                        { question: "How do I apply GlowBoost Vitamin C Serum?", category: "Usage" },
                        { question: "When should I use this in my skincare routine?", category: "Usage" },
                        { question: "Can I use this with retinol or other actives?", category: "Usage" },
                        { question: "Where can I purchase GlowBoost Vitamin C Serum?", category: "Purchase" },
                        { question: "What is the price of this product?", category: "Purchase" },
                        { question: "Is there a money-back guarantee?", category: "Purchase" },
                        { question: "How does this compare to other Vitamin C serums?", category: "Comparison" },
                        { question: "What makes GlowBoost different from competitors?", category: "Comparison" },
                        { question: "Is 10% Vitamin C concentration effective?", category: "Comparison" },
                        { question: "Why is hyaluronic acid included in the formula?", category: "Ingredients" },
                        { question: "Is the Vitamin C in this serum stable?", category: "Ingredients" },
                        { question: "Are there any parabens or sulfates in this product?", category: "Ingredients" }
                    ]
                };
            }

            // FAQ answers
            return {
                faqs: [
                    {
                        question: "What is GlowBoost Vitamin C Serum?",
                        answer: "GlowBoost Vitamin C Serum is a premium skincare product formulated with 10% Vitamin C and Hyaluronic Acid, specifically designed for oily and combination skin types. It targets brightening and helps fade dark spots for a more radiant complexion."
                    },
                    {
                        question: "Are there any side effects I should know about?",
                        answer: "Most users tolerate this serum well. However, those with sensitive skin may experience mild tingling upon initial application. This is normal and typically subsides as your skin adjusts. If irritation persists, discontinue use and consult a dermatologist."
                    },
                    {
                        question: "How do I apply GlowBoost Vitamin C Serum?",
                        answer: "Apply 2-3 drops of the serum in the morning after cleansing your face. Gently massage into skin and allow it to absorb before applying sunscreen. Consistent daily use is key for best results."
                    },
                    {
                        question: "What is the price of this product?",
                        answer: "GlowBoost Vitamin C Serum is priced at ₹699, offering excellent value for a high-quality Vitamin C serum with proven ingredients like Hyaluronic Acid."
                    },
                    {
                        question: "Why is hyaluronic acid included in the formula?",
                        answer: "Hyaluronic Acid is included to provide deep hydration and plumping effects, complementing the brightening benefits of Vitamin C. It helps maintain skin moisture while the Vitamin C works to improve skin tone and texture."
                    }
                ]
            };
        }

        // Fictional product generation
        if (userPrompt.includes('Create a fictional competing product')) {
            return {
                product: {
                    name: "RadiantGlow Advanced C Serum",
                    concentration: "15% Vitamin C",
                    skinType: ["All Skin Types", "Combination"],
                    keyIngredients: ["Vitamin C", "Niacinamide", "Ferulic Acid"],
                    benefits: ["Brightening", "Anti-aging", "Even skin tone"],
                    howToUse: "Apply 3-4 drops morning and evening after cleansing",
                    sideEffects: "May cause slight redness for very sensitive skin",
                    price: "₹899"
                }
            };
        }

        return {};
    }
}
