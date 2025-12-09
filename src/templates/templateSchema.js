/**
 * Template Schema Definition
 * Provides type definitions and validation schema for templates
 */

export const FieldTypes = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    ARRAY: 'array',
    OBJECT: 'object',
};

export class TemplateSchema {
    constructor(definition) {
        this.name = definition.name;
        this.description = definition.description;
        this.fields = definition.fields || [];
        this.logicBlocks = definition.logicBlocks || [];
        this.validate();
    }

    /**
     * Validate template schema
     */
    validate() {
        if (!this.name) {
            throw new Error('Template schema must have a name');
        }

        if (!Array.isArray(this.fields)) {
            throw new Error('Template fields must be an array');
        }

        // Validate each field
        this.fields.forEach((field) => {
            if (!field.key) {
                throw new Error('Each field must have a key');
            }
            if (!field.type || !Object.values(FieldTypes).includes(field.type)) {
                throw new Error(`Field ${field.key} has invalid type`);
            }
        });
    }

    /**
     * Validate data against schema
     * @param {Object} data - Data to validate
     * @returns {boolean} Whether data is valid
     */
    validateData(data) {
        for (const field of this.fields) {
            if (field.required && !(field.key in data)) {
                throw new Error(`Required field missing: ${field.key}`);
            }

            if (field.key in data) {
                const value = data[field.key];

                // Type validation
                switch (field.type) {
                    case FieldTypes.STRING:
                        if (typeof value !== 'string') {
                            throw new Error(`Field ${field.key} must be a string`);
                        }
                        break;
                    case FieldTypes.NUMBER:
                        if (typeof value !== 'number') {
                            throw new Error(`Field ${field.key} must be a number`);
                        }
                        break;
                    case FieldTypes.ARRAY:
                        if (!Array.isArray(value)) {
                            throw new Error(`Field ${field.key} must be an array`);
                        }
                        break;
                    case FieldTypes.OBJECT:
                        if (typeof value !== 'object' || value === null) {
                            throw new Error(`Field ${field.key} must be an object`);
                        }
                        break;
                }
            }
        }

        return true;
    }
}
