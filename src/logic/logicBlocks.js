/**
 * Content Logic Blocks
 * Reusable, composable functions that transform product data into content segments
 * Each block is a pure function: (data) => content_segment
 */

/**
 * Extract and format product benefits
 * @param {Product} product - Product instance
 * @returns {Object} Benefits content block
 */
export function extractBenefitsBlock(product) {
    return {
        blockType: 'benefits',
        content: {
            title: 'Key Benefits',
            benefits: product.benefits.map((benefit, index) => ({
                id: index + 1,
                benefit,
                description: `${product.name} delivers ${benefit.toLowerCase()} through its specialized formula.`,
            })),
            summary: `Experience ${product.benefits.join(', ').toLowerCase()} with regular use.`,
        },
    };
}

/**
 * Extract and format usage instructions
 * @param {Product} product - Product instance
 * @returns {Object} Usage content block
 */
export function extractUsageBlock(product) {
    return {
        blockType: 'usage',
        content: {
            title: 'How to Use',
            instructions: product.howToUse,
            steps: parseUsageSteps(product.howToUse),
            frequency: extractFrequency(product.howToUse),
            timing: extractTiming(product.howToUse),
        },
    };
}

/**
 * Generate safety and side effects information
 * @param {Product} product - Product instance
 * @returns {Object} Safety content block
 */
export function generateSafetyBlock(product) {
    return {
        blockType: 'safety',
        content: {
            title: 'Safety Information',
            sideEffects: product.sideEffects || 'No known side effects for most users.',
            precautions: generatePrecautions(product),
            warnings: product.sideEffects
                ? ['Discontinue use if irritation persists', 'Consult a dermatologist if you have concerns']
                : [],
        },
    };
}

/**
 * Extract and analyze ingredients
 * @param {Product} product - Product instance
 * @returns {Object} Ingredients content block
 */
export function extractIngredientsBlock(product) {
    return {
        blockType: 'ingredients',
        content: {
            title: 'Key Ingredients',
            mainIngredient: {
                name: product.keyIngredients[0],
                concentration: product.concentration,
            },
            allIngredients: product.keyIngredients.map((ingredient) => ({
                name: ingredient,
                purpose: getIngredientPurpose(ingredient, product.benefits),
            })),
        },
    };
}

/**
 * Compare two products' ingredients
 * @param {Product} productA - First product
 * @param {Product} productB - Second product
 * @returns {Object} Ingredient comparison block
 */
export function compareIngredientsBlock(productA, productB) {
    const commonIngredients = productA.keyIngredients.filter((ing) =>
        productB.keyIngredients.includes(ing)
    );
    const uniqueToA = productA.keyIngredients.filter(
        (ing) => !productB.keyIngredients.includes(ing)
    );
    const uniqueToB = productB.keyIngredients.filter(
        (ing) => !productA.keyIngredients.includes(ing)
    );

    return {
        blockType: 'ingredientComparison',
        content: {
            common: commonIngredients,
            uniqueToProductA: uniqueToA,
            uniqueToProductB: uniqueToB,
            analysis: generateIngredientAnalysis(commonIngredients, uniqueToA, uniqueToB),
        },
    };
}

/**
 * Compare pricing between products
 * @param {Product} productA - First product
 * @param {Product} productB - Second product
 * @returns {Object} Price comparison block
 */
export function generatePriceComparisonBlock(productA, productB) {
    const priceA = parsePrice(productA.price);
    const priceB = parsePrice(productB.price);
    const difference = Math.abs(priceA - priceB);
    const cheaper = priceA < priceB ? productA.name : productB.name;

    return {
        blockType: 'priceComparison',
        content: {
            productA: { name: productA.name, price: productA.price, numericPrice: priceA },
            productB: { name: productB.name, price: productB.price, numericPrice: priceB },
            difference: `₹${difference}`,
            analysis: `${cheaper} is more affordable by ₹${difference}.`,
            valueProposition: generateValueAnalysis(productA, productB, priceA, priceB),
        },
    };
}

/**
 * Categorize benefits by type
 * @param {Product} product - Product instance
 * @returns {Object} Categorized benefits block
 */
export function categorizeBenefitsBlock(product) {
    const categories = {
        cosmetic: ['brightening', 'glow', 'radiant', 'smooth'],
        therapeutic: ['fades', 'reduces', 'treats', 'heals'],
        protective: ['protects', 'shields', 'defends'],
    };

    const categorized = {
        cosmetic: [],
        therapeutic: [],
        protective: [],
        other: [],
    };

    product.benefits.forEach((benefit) => {
        const lowerBenefit = benefit.toLowerCase();
        let categorized_flag = false;

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some((keyword) => lowerBenefit.includes(keyword))) {
                categorized[category].push(benefit);
                categorized_flag = true;
                break;
            }
        }

        if (!categorized_flag) {
            categorized.other.push(benefit);
        }
    });

    return {
        blockType: 'categorizedBenefits',
        content: categorized,
    };
}

/**
 * Generate skin type suitability information
 * @param {Product} product - Product instance
 * @returns {Object} Skin type block
 */
export function generateSkinTypeBlock(product) {
    return {
        blockType: 'skinType',
        content: {
            title: 'Suitable For',
            targetSkinTypes: product.skinType,
            recommendation: `Specially formulated for ${product.skinType.join(' and ')} skin types.`,
            additionalInfo: generateSkinTypeInfo(product.skinType),
        },
    };
}

// Helper functions

function parseUsageSteps(instructions) {
    // Simple parsing - can be enhanced
    return [
        'Cleanse your face',
        instructions,
        'Follow with moisturizer if needed',
    ];
}

function extractFrequency(instructions) {
    if (instructions.toLowerCase().includes('morning')) return 'Daily (Morning)';
    if (instructions.toLowerCase().includes('night')) return 'Daily (Night)';
    if (instructions.toLowerCase().includes('twice')) return 'Twice Daily';
    return 'As directed';
}

function extractTiming(instructions) {
    if (instructions.toLowerCase().includes('morning')) return 'Morning';
    if (instructions.toLowerCase().includes('night') || instructions.toLowerCase().includes('evening'))
        return 'Night';
    return 'Anytime';
}

function generatePrecautions(product) {
    const precautions = ['For external use only', 'Avoid contact with eyes'];

    if (product.sideEffects && product.sideEffects.toLowerCase().includes('sensitive')) {
        precautions.push('Perform a patch test before first use');
    }

    if (product.keyIngredients.some(ing => ing.toLowerCase().includes('vitamin c'))) {
        precautions.push('Store in a cool, dark place to maintain potency');
    }

    return precautions;
}

function getIngredientPurpose(ingredient, benefits) {
    const purposes = {
        'vitamin c': 'Brightening and antioxidant protection',
        'hyaluronic acid': 'Deep hydration and plumping',
        'niacinamide': 'Pore refining and skin barrier support',
        'retinol': 'Anti-aging and skin renewal',
    };

    return purposes[ingredient.toLowerCase()] || 'Supports overall skin health';
}

function generateIngredientAnalysis(common, uniqueA, uniqueB) {
    let analysis = '';

    if (common.length > 0) {
        analysis += `Both products share ${common.join(', ')}, providing similar core benefits. `;
    }

    if (uniqueA.length > 0) {
        analysis += `Product A uniquely contains ${uniqueA.join(', ')}. `;
    }

    if (uniqueB.length > 0) {
        analysis += `Product B uniquely contains ${uniqueB.join(', ')}.`;
    }

    return analysis;
}

function parsePrice(priceString) {
    // Extract numeric value from price string (e.g., "₹699" => 699)
    const match = priceString.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
}

function generateValueAnalysis(productA, productB, priceA, priceB) {
    if (Math.abs(priceA - priceB) < 100) {
        return 'Both products are similarly priced, making the choice dependent on specific ingredient preferences.';
    }

    const cheaper = priceA < priceB ? productA : productB;
    const expensive = priceA < priceB ? productB : productA;

    return `${cheaper.name} offers better value for budget-conscious consumers, while ${expensive.name} may justify the premium through specialized ingredients or formulation.`;
}

function generateSkinTypeInfo(skinTypes) {
    const info = {
        'Oily': 'Helps control excess sebum without clogging pores',
        'Combination': 'Balances different skin zones effectively',
        'Dry': 'Provides intensive hydration and nourishment',
        'Sensitive': 'Gentle formula minimizes irritation risk',
    };

    return skinTypes.map(type => info[type] || 'Suitable for daily use').join('. ');
}
