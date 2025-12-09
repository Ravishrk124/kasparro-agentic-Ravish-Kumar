/**
 * Message Bus
 * Facilitates communication between agents through event-driven messaging
 */

export class MessageBus {
    constructor() {
        this.messages = new Map(); // agentName -> messages
        this.results = new Map(); // agentName -> result
    }

    /**
     * Publish a result from an agent
     * @param {string} agentName - Name of the agent
     * @param {*} result - Result data
     */
    publish(agentName, result) {
        this.results.set(agentName, result);
        console.log(`[MessageBus] Published result from ${agentName}`);
    }

    /**
     * Subscribe to get result from an agent
     * @param {string} agentName - Name of the agent
     * @returns {*} Result data or undefined
     */
    subscribe(agentName) {
        return this.results.get(agentName);
    }

    /**
     * Check if an agent has published its result
     * @param {string} agentName - Name of the agent
     * @returns {boolean} Whether result exists
     */
    hasResult(agentName) {
        return this.results.has(agentName);
    }

    /**
     * Get all results
     * @returns {Map} All results
     */
    getAllResults() {
        return new Map(this.results);
    }

    /**
     * Clear all messages and results
     */
    clear() {
        this.messages.clear();
        this.results.clear();
    }
}
