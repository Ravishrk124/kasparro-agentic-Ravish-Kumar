/**
 * Template Engine
 * Processes templates and renders final content structures
 */

import * as logicBlocks from '../logic/logicBlocks.js';

export class TemplateEngine {
    constructor() {
        this.templates = new Map();
        this.logicBlocks = logicBlocks;
    }

    /**
     * Register a template
     * @param {TemplateSchema} template - Template schema to register
     */
    registerTemplate(template) {
        this.templates.set(template.name, template);
    }

    /**
     * Get a registered template
     * @param {string} name - Template name
     * @returns {TemplateSchema} Template schema
     */
    getTemplate(name) {
        const template = this.templates.get(name);
        if (!template) {
            throw new Error(`Template not found: ${name}`);
        }
        return template;
    }

    /**
     * Apply logic blocks to data
     * @param {Array<string>} blockNames - Names of logic blocks to apply
     * @param {*} data - Input data
     * @returns {Object} Processed content blocks
     */
    applyLogicBlocks(blockNames, data) {
        const results = {};

        for (const blockName of blockNames) {
            const blockFunction = this.logicBlocks[blockName];

            if (!blockFunction) {
                console.warn(`Logic block not found: ${blockName}`);
                continue;
            }

            try {
                const result = blockFunction(data);
                results[result.blockType] = result.content;
            } catch (error) {
                console.error(`Error applying logic block ${blockName}:`, error.message);
            }
        }

        return results;
    }

    /**
     * Render content using a template
     * @param {string} templateName - Name of template to use
     * @param {Object} data - Data to render
     * @param {Object} options - Rendering options
     * @returns {Object} Rendered content
     */
    render(templateName, data, options = {}) {
        const template = this.getTemplate(templateName);

        // Apply logic blocks if template defines them
        let processedData = { ...data };

        if (template.logicBlocks && template.logicBlocks.length > 0) {
            const blockResults = this.applyLogicBlocks(
                template.logicBlocks,
                options.product || data
            );
            processedData = { ...processedData, ...blockResults };
        }

        // Validate data against template schema
        try {
            template.validateData(processedData);
        } catch (error) {
            console.warn(`Template validation warning for ${templateName}:`, error.message);
            // Continue rendering even with validation warnings
        }

        return processedData;
    }

    /**
     * Render and validate final output
     * @param {string} templateName - Template name
     * @param {Object} data - Input data
     * @param {Object} options - Options
     * @returns {Object} Final validated output
     */
    renderAndValidate(templateName, data, options = {}) {
        const rendered = this.render(templateName, data, options);

        // Additional post-processing can be added here
        return {
            template: templateName,
            generatedAt: new Date().toISOString(),
            data: rendered,
        };
    }
}
