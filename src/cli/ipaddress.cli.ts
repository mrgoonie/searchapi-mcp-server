import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';

import ipAddressController from '../controllers/ipaddress.controller.js';

/**
 * Register IP address CLI commands
 * @param program The Commander program instance
 */
function register(program: Command) {
	const methodLogger = Logger.forContext('cli/ipaddress.cli.ts', 'register');
	methodLogger.debug(`Registering IP address CLI commands...`);

	program
		.command('get-ip-details')
		.description(
			'Get details about a specific IP address or the current device',
		)
		.argument('[ipAddress]', 'IP address to lookup (optional)')
		.action(async (ipAddress?: string) => {
			const actionLogger = Logger.forContext(
				'cli/ipaddress.cli.ts',
				'get-ip-details',
			);
			try {
				actionLogger.debug(
					`Fetching IP details for ${ipAddress || 'current device'}...`,
				);
				const result = await ipAddressController.get(ipAddress);
				actionLogger.debug(`IP details fetched successfully`, result);
				console.log(result.content);
			} catch (error) {
				handleCliError(error);
			}
		});
}

export default { register };
