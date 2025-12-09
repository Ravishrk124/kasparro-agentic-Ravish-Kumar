/**
 * Workflow Graph (DAG)
 * Defines the execution order and dependencies between agents
 */

export class WorkflowNode {
    constructor(agentName, agent) {
        this.agentName = agentName;
        this.agent = agent;
        this.dependencies = agent.getDependencies();
    }
}

export class WorkflowGraph {
    constructor() {
        this.nodes = new Map(); // agentName -> WorkflowNode
        this.executionOrder = [];
    }

    /**
     * Add a node (agent) to the graph
     * @param {BaseAgent} agent - Agent instance
     */
    addNode(agent) {
        const node = new WorkflowNode(agent.getName(), agent);
        this.nodes.set(agent.getName(), node);
    }

    /**
     * Build the graph and compute execution order
     * Uses topological sort to determine order based on dependencies
     */
    build() {
        this.executionOrder = this.topologicalSort();
        console.log('[WorkflowGraph] Execution order:', this.executionOrder);
    }

    /**
     * Topological sort to determine execution order
     * @returns {Array<string>} Ordered agent names
     */
    topologicalSort() {
        const visited = new Set();
        const tempVisited = new Set();
        const order = [];

        const visit = (nodeName) => {
            if (tempVisited.has(nodeName)) {
                throw new Error(`Circular dependency detected at ${nodeName}`);
            }

            if (visited.has(nodeName)) {
                return;
            }

            tempVisited.add(nodeName);
            const node = this.nodes.get(nodeName);

            // Visit dependencies first
            if (node && node.dependencies) {
                for (const dep of node.dependencies) {
                    if (this.nodes.has(dep)) {
                        visit(dep);
                    }
                }
            }

            tempVisited.delete(nodeName);
            visited.add(nodeName);
            order.push(nodeName);
        };

        // Visit all nodes
        for (const nodeName of this.nodes.keys()) {
            if (!visited.has(nodeName)) {
                visit(nodeName);
            }
        }

        return order;
    }

    /**
     * Get execution order
     * @returns {Array<string>} Ordered agent names
     */
    getExecutionOrder() {
        if (this.executionOrder.length === 0) {
            this.build();
        }
        return this.executionOrder;
    }

    /**
     * Get agent by name
     * @param {string} agentName - Agent name
     * @returns {BaseAgent} Agent instance
     */
    getAgent(agentName) {
        const node = this.nodes.get(agentName);
        return node ? node.agent : null;
    }

    /**
     * Validate graph completeness
     * @throws {Error} if dependencies are missing
     */
    validate() {
        for (const [nodeName, node] of this.nodes.entries()) {
            for (const dep of node.dependencies) {
                if (!this.nodes.has(dep)) {
                    throw new Error(
                        `Agent ${nodeName} depends on ${dep}, but ${dep} is not registered`
                    );
                }
            }
        }
    }
}
