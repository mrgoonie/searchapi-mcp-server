import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';

import ipAddressCli from './ipaddress.cli.js';

/**
 * CLI entry point for the Boilerplate MCP Server
 * Handles command registration, parsing, and execution
 */

// Get the version from package.json
const VERSION = '1.1.3'; // This should match the version in src/index.ts
const NAME = '@aashari/boilerplate-mcp-server';
const DESCRIPTION =
	'A boilerplate Model Context Protocol (MCP) server implementation using TypeScript';

/**
 * Run the CLI with the provided arguments
 *
 * @param args Command line arguments to process
 * @returns Promise that resolves when CLI command execution completes
 */
export async function runCli(args: string[]) {
	const cliLogger = Logger.forContext('cli/index.ts', 'runCli');
	cliLogger.debug('Initializing CLI with arguments', args);

	const program = new Command();

	program.name(NAME).description(DESCRIPTION).version(VERSION);

	// Register CLI commands
	cliLogger.debug('Registering CLI commands...');
	ipAddressCli.register(program);
	cliLogger.debug('CLI commands registered successfully');

	// Handle unknown commands
	program.on('command:*', (operands) => {
		cliLogger.error(`Unknown command: ${operands[0]}`);
		console.log('');
		program.help();
		process.exit(1);
	});

	// Parse arguments; default to help if no command provided
	cliLogger.debug('Parsing CLI arguments');
	await program.parseAsync(args.length ? args : ['--help'], { from: 'user' });
	cliLogger.debug('CLI command execution completed');
}
