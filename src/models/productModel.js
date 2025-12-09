/**
 * Product Data Model
 * Defines the structure and validation for product data
 */

export class Product {
    constructor(data) {
        this.name = data.name;
        this.concentration = data.concentration;
        this.skinType = Array.isArray(data.skinType) ? data.skinType : [data.skinType];
        this.keyIngredients = Array.isArray(data.keyIngredients)
            ? data.keyIngredients
            : [data.keyIngredients];
        this.benefits = Array.isArray(data.benefits) ? data.benefits : [data.benefits];
        this.howToUse = data.howToUse;
        this.sideEffects = data.sideEffects;
        this.price = data.price;

        // Validate required fields
        this.validate();
    }

    /**
     * Validate product data
     * @throws {Error} if validation fails
     */
    validate() {
        const requiredFields = [
            'name',
            'concentration',
            'skinType',
            'keyIngredients',
            'benefits',
            'howToUse',
            'price',
        ];

        for (const field of requiredFields) {
            if (!this[field] || (Array.isArray(this[field]) && this[field].length === 0)) {
                throw new Error(`Product validation failed: ${field} is required`);
            }
        }
    }

    /**
     * Get a plain object representation
     * @returns {Object} Product data as plain object
     */
    toJSON() {
        return {
            name: this.name,
            concentration: this.concentration,
            skinType: this.skinType,
            keyIngredients: this.keyIngredients,
            benefits: this.benefits,
            howToUse: this.howToUse,
            sideEffects: this.sideEffects,
            price: this.price,
        };
    }

    /**
     * Extract key facts from product data for agent processing
     * @returns {Object} Structured facts
     */
    extractFacts() {
        return {
            productName: this.name,
            mainIngredient: this.keyIngredients[0],
            allIngredients: this.keyIngredients,
            concentration: this.concentration,
            targetSkinTypes: this.skinType,
            primaryBenefit: this.benefits[0],
            allBenefits: this.benefits,
            usageInstructions: this.howToUse,
            safetyInfo: this.sideEffects,
            pricing: this.price,
        };
    }
}
