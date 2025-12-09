/**
 * Base Agent Abstract Class
 * Defines the interface that all agents must implement
 */

export class BaseAgent {
    constructor(name) {
        if (new.target === BaseAgent) {
            throw new Error('BaseAgent is abstract and cannot be instantiated directly');
        }
        this.name = name;
        this.dependencies = [];
    }

    /**
     * Get the agent's name
     * @returns {string} Agent name
     */
    getName() {
        return this.name;
    }

    /**
     * Get agent dependencies
     * @returns {Array<string>} List of agent names this agent depends on
     */
    getDependencies() {
        return this.dependencies;
    }

    /**
     * Validate input data
     * @param {*} input - Input data to validate
     * @throws {Error} if validation fails
     */
    validate(input) {
        if (input === null || input === undefined) {
            throw new Error(`${this.name}: Input cannot be null or undefined`);
        }
    }

    /**
     * Execute the agent's primary function
     * Must be implemented by subclasses
     * @param {*} input - Input data
     * @returns {Promise<*>} Output data
     */
    async execute(input) {
        throw new Error(`${this.name}: execute() must be implemented by subclass`);
    }

    /**
     * Log agent activity
     * @param {string} message - Log message
     */
    log(message) {
        console.log(`[${this.name}] ${message}`);
    }
}
