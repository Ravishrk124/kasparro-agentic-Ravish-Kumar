/**
 * Comparison Page Template
 * Defines structure for product comparison pages
 */

import { TemplateSchema, FieldTypes } from './templateSchema.js';

export const comparisonTemplate = new TemplateSchema({
    name: 'comparison_page',
    description: 'Template for generating product comparison pages',
    fields: [
        {
            key: 'pageTitle',
            type: FieldTypes.STRING,
            required: true,
        },
        {
            key: 'productA',
            type: FieldTypes.OBJECT,
            required: true,
            schema: {
                name: FieldTypes.STRING,
                price: FieldTypes.STRING,
                concentration: FieldTypes.STRING,
                skinType: FieldTypes.ARRAY,
                ingredients: FieldTypes.ARRAY,
                benefits: FieldTypes.ARRAY,
            },
        },
        {
            key: 'productB',
            type: FieldTypes.OBJECT,
            required: true,
            schema: {
                name: FieldTypes.STRING,
                price: FieldTypes.STRING,
                concentration: FieldTypes.STRING,
                skinType: FieldTypes.ARRAY,
                ingredients: FieldTypes.ARRAY,
                benefits: FieldTypes.ARRAY,
            },
        },
        {
            key: 'comparison',
            type: FieldTypes.OBJECT,
            required: true,
            schema: {
                ingredients: FieldTypes.OBJECT,
                price: FieldTypes.OBJECT,
                benefits: FieldTypes.ARRAY,
            },
        },
        {
            key: 'recommendation',
            type: FieldTypes.STRING,
            required: false,
        },
    ],
    logicBlocks: ['compareIngredientsBlock', 'generatePriceComparisonBlock'],
});
