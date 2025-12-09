/**
 * Data Parser Agent
 * Responsible for parsing and validating raw product data
 */

import { BaseAgent } from './BaseAgent.js';
import { Product } from '../models/productModel.js';
import { readFile } from 'fs/promises';

export class DataParserAgent extends BaseAgent {
    constructor() {
        super('DataParserAgent');
    }

    /**
     * Parse product data from file or object
     * @param {string|Object} input - File path or product data object
     * @returns {Promise<Product>} Parsed and validated product
     */
    async execute(input) {
        this.validate(input);
        this.log('Starting data parsing...');

        let rawData;

        // Handle file path input
        if (typeof input === 'string') {
            this.log(`Reading product data from: ${input}`);
            const fileContent = await readFile(input, 'utf-8');
            rawData = JSON.parse(fileContent);
        } else {
            rawData = input;
        }

        // Create and validate Product instance
        const product = new Product(rawData);
        this.log(`Successfully parsed product: ${product.name}`);

        return product;
    }

    /**
     * Validate input
     * @param {*} input - Input to validate
     */
    validate(input) {
        super.validate(input);

        if (typeof input !== 'string' && typeof input !== 'object') {
            throw new Error(
                'DataParserAgent: Input must be a file path (string) or product data object'
            );
        }
    }
}
