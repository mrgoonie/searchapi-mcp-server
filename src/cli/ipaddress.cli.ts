import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import { handleCliError } from '../utils/error.util.js';

import ipAddressController from '../controllers/ipaddress.controller.js';

/**
 * Register IP address CLI commands
 * @param program The Commander program instance
 */
function register(program: Command) {
	const cliLogger = Logger.forContext('cli/ipaddress.cli.ts', 'register');
	cliLogger.debug(`Registering IP address CLI commands...`);

	program
		.command('get-ip-details')
		.description(
			`Gets geolocation and network details about an IP address or the current device.`,
		)
		.argument('[ipAddress]', 'IP address to lookup (omit for current IP)')
		.option(
			'--include-extended',
			'Includes extended data like ASN, mobile and proxy detection',
		)
		.option(
			'--use-https',
			'Uses HTTPS for API requests (Requires paid API tier)',
		)
		.action(
			async (
				ipAddress?: string,
				cmdOptions?: { includeExtended?: boolean; useHttps?: boolean },
			) => {
				const commandLogger = Logger.forContext(
					'cli/ipaddress.cli.ts',
					'get-ip-details',
				);
				try {
					commandLogger.debug(
						`Processing IP details request for ${ipAddress || 'current device'}`,
						cmdOptions,
					);

					// Map CLI options to controller options
					const controllerOptions = {
						includeExtendedData:
							cmdOptions?.includeExtended || false,
						useHttps: cmdOptions?.useHttps || false,
					};

					commandLogger.debug(
						'Calling controller with options',
						controllerOptions,
					);
					const result = await ipAddressController.get(
						ipAddress,
						controllerOptions,
					);
					commandLogger.debug(`IP details retrieved successfully`);
					console.log(result.content);
				} catch (error) {
					handleCliError(error);
				}
			},
		);

	cliLogger.debug('IP address CLI commands registered successfully');
}

export default { register };
