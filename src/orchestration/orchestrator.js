/**
 * Orchestrator
 * Coordinates agent execution based on workflow graph
 */

import { WorkflowGraph } from './workflowGraph.js';
import { MessageBus } from './messageBus.js';

export class Orchestrator {
    constructor() {
        this.graph = new WorkflowGraph();
        this.messageBus = new MessageBus();
        this.context = {}; // Shared context for pipeline
    }

    /**
     * Register an agent with the orchestrator
     * @param {BaseAgent} agent - Agent to register
     */
    registerAgent(agent) {
        this.graph.addNode(agent);
        console.log(`[Orchestrator] Registered agent: ${agent.getName()}`);
    }

    /**
     * Set pipeline context (initial input)
     * @param {Object} context - Context data
     */
    setContext(context) {
        this.context = { ...this.context, ...context };
    }

    /**
     * Execute the workflow
     * @returns {Promise<Object>} Aggregated results from all agents
     */
    async execute() {
        console.log('\n[Orchestrator] Starting workflow execution...\n');

        // Validate and build execution order
        this.graph.validate();
        const executionOrder = this.graph.getExecutionOrder();

        console.log(`[Orchestrator] Execution order: ${executionOrder.join(' → ')}\n`);

        // Execute agents in order
        for (const agentName of executionOrder) {
            await this.executeAgent(agentName);
        }

        console.log('\n[Orchestrator] Workflow execution completed\n');

        return this.messageBus.getAllResults();
    }

    /**
     * Execute a single agent
     * @param {string} agentName - Name of agent to execute
     */
    async executeAgent(agentName) {
        const agent = this.graph.getAgent(agentName);

        if (!agent) {
            throw new Error(`Agent not found: ${agentName}`);
        }

        console.log(`[Orchestrator] Executing ${agentName}...`);

        try {
            // Prepare input based on dependencies
            const input = this.prepareInput(agent);

            // Execute agent
            const result = await agent.execute(input);

            // Publish result to message bus
            this.messageBus.publish(agentName, result);

            console.log(`[Orchestrator] ✓ ${agentName} completed\n`);
        } catch (error) {
            console.error(`[Orchestrator] ✗ ${agentName} failed:`, error.message);
            throw error;
        }
    }

    /**
     * Prepare input for an agent based on its dependencies
     * @param {BaseAgent} agent - Agent instance
     * @returns {*} Prepared input
     */
    prepareInput(agent) {
        const agentName = agent.getName();
        const dependencies = agent.getDependencies();

        // Special handling for different agents
        switch (agentName) {
            case 'DataParserAgent':
                // Data parser gets the file path from context
                return this.context.productDataPath;

            case 'QuestionGenerationAgent':
                // Question generator gets parsed product from DataParserAgent
                return this.messageBus.subscribe('DataParserAgent');

            case 'ContentGenerationAgent':
                // Content generator gets product and questions
                return {
                    product: this.messageBus.subscribe('DataParserAgent'),
                    questions: this.messageBus.subscribe('QuestionGenerationAgent'),
                };

            case 'ComparisonAgent':
                // Comparison agent gets product from DataParserAgent
                return this.messageBus.subscribe('DataParserAgent');

            default:
                // Generic: if has dependencies, get results from them
                if (dependencies.length > 0) {
                    const inputs = {};
                    dependencies.forEach((dep) => {
                        inputs[dep] = this.messageBus.subscribe(dep);
                    });
                    return Object.keys(inputs).length === 1
                        ? Object.values(inputs)[0]
                        : inputs;
                }
                return this.context;
        }
    }

    /**
     * Get result from a specific agent
     * @param {string} agentName - Agent name
     * @returns {*} Agent result
     */
    getResult(agentName) {
        return this.messageBus.subscribe(agentName);
    }

    /**
     * Reset orchestrator state
     */
    reset() {
        this.messageBus.clear();
        this.context = {};
    }
}
