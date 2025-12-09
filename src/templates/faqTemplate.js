/**
 * FAQ Page Template
 * Defines structure for FAQ page output
 */

import { TemplateSchema, FieldTypes } from './templateSchema.js';

export const faqTemplate = new TemplateSchema({
    name: 'faq_page',
    description: 'Template for generating FAQ pages',
    fields: [
        {
            key: 'pageTitle',
            type: FieldTypes.STRING,
            required: true,
            default: 'Frequently Asked Questions',
        },
        {
            key: 'productName',
            type: FieldTypes.STRING,
            required: true,
        },
        {
            key: 'introduction',
            type: FieldTypes.STRING,
            required: false,
        },
        {
            key: 'faqs',
            type: FieldTypes.ARRAY,
            required: true,
            items: {
                question: FieldTypes.STRING,
                answer: FieldTypes.STRING,
                category: FieldTypes.STRING,
            },
        },
        {
            key: 'totalQuestions',
            type: FieldTypes.NUMBER,
            required: false,
        },
    ],
    logicBlocks: ['extractBenefitsBlock', 'extractUsageBlock', 'generateSafetyBlock'],
});
