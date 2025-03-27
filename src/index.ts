#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Logger } from './utils/logger.util.js';
import { config } from './utils/config.util.js';
import { createUnexpectedError } from './utils/error.util.js';
import { runCli } from './cli/index.js';

import ipAddressTools from './tools/ipaddress.tool.js';
import ipLookupResources from './resources/ipaddress.resource.js';

// Create file-level logger
const indexLogger = Logger.forContext('index.ts');

// Define version constant for easier management and consistent versioning
const VERSION = '1.1.0';

let serverInstance: McpServer | null = null;
let transportInstance: SSEServerTransport | StdioServerTransport | null = null;

export async function startServer(mode: 'stdio' | 'sse' = 'stdio') {
	const methodLogger = Logger.forContext('index.ts', 'startServer');

	// Load configuration
	config.load();

	// Enable debug logging if DEBUG is set to true
	if (config.getBoolean('DEBUG')) {
		methodLogger.debug('Debug mode enabled');
	}

	// Log the DEBUG value to verify configuration loading
	methodLogger.info(`DEBUG value: ${process.env.DEBUG}`);
	methodLogger.info(
		`IPAPI_API_TOKEN value exists: ${Boolean(process.env.IPAPI_API_TOKEN)}`,
	);
	methodLogger.info(`Config DEBUG value: ${config.get('DEBUG')}`);

	serverInstance = new McpServer({
		name: '@aashari/boilerplate-mcp-server',
		version: VERSION,
	});

	if (mode === 'stdio') {
		transportInstance = new StdioServerTransport();
	} else {
		throw createUnexpectedError('SSE mode is not supported yet');
	}

	methodLogger.info(
		`Starting server with ${mode.toUpperCase()} transport...`,
	);

	// register tools
	ipAddressTools.register(serverInstance);
	methodLogger.debug('Registered IP address tools');

	// register resources
	ipLookupResources.register(serverInstance);
	methodLogger.debug('Registered IP lookup resources');

	return serverInstance.connect(transportInstance).catch((err) => {
		methodLogger.error(`Failed to start server`, err);
		process.exit(1);
	});
}

// Main entry point - this will run when executed directly
async function main() {
	const methodLogger = Logger.forContext('index.ts', 'main');

	// Load configuration
	config.load();

	// Log the DEBUG value to verify configuration loading
	methodLogger.info(`DEBUG value: ${process.env.DEBUG}`);
	methodLogger.info(
		`IPAPI_API_TOKEN value exists: ${Boolean(process.env.IPAPI_API_TOKEN)}`,
	);
	methodLogger.info(`Config DEBUG value: ${config.get('DEBUG')}`);

	// Check if arguments are provided (CLI mode)
	if (process.argv.length > 2) {
		// CLI mode: Pass arguments to CLI runner
		methodLogger.info('Starting in CLI mode');
		await runCli(process.argv.slice(2));
		methodLogger.info('CLI execution completed');
	} else {
		// MCP Server mode: Start server with default STDIO
		methodLogger.info('Starting in server mode');
		await startServer();
		methodLogger.info('Server is now running');
	}
}

// If this file is being executed directly (not imported), run the main function
if (require.main === module) {
	main().catch((err) => {
		indexLogger.error('Unhandled error in main process', err);
		process.exit(1);
	});
}

// Export key utilities for library users
export { config };
export { Logger };
