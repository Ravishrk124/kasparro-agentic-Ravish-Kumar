/**
 * Product Page Template
 * Defines structure for product description pages
 */

import { TemplateSchema, FieldTypes } from './templateSchema.js';

export const productTemplate = new TemplateSchema({
    name: 'product_page',
    description: 'Template for generating product description pages',
    fields: [
        {
            key: 'pageTitle',
            type: FieldTypes.STRING,
            required: true,
        },
        {
            key: 'productName',
            type: FieldTypes.STRING,
            required: true,
        },
        {
            key: 'tagline',
            type: FieldTypes.STRING,
            required: false,
        },
        {
            key: 'overview',
            type: FieldTypes.OBJECT,
            required: true,
            schema: {
                description: FieldTypes.STRING,
                concentration: FieldTypes.STRING,
                price: FieldTypes.STRING,
            },
        },
        {
            key: 'benefits',
            type: FieldTypes.OBJECT,
            required: true,
        },
        {
            key: 'ingredients',
            type: FieldTypes.OBJECT,
            required: true,
        },
        {
            key: 'usage',
            type: FieldTypes.OBJECT,
            required: true,
        },
        {
            key: 'skinType',
            type: FieldTypes.OBJECT,
            required: true,
        },
        {
            key: 'safety',
            type: FieldTypes.OBJECT,
            required: true,
        },
    ],
    logicBlocks: [
        'extractBenefitsBlock',
        'extractIngredientsBlock',
        'extractUsageBlock',
        'generateSkinTypeBlock',
        'generateSafetyBlock',
    ],
});
