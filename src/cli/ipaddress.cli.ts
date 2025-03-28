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
			`Get geolocation and network details about an IP address or the current device.

        PURPOSE: Retrieve comprehensive information about an IP address including geographical location, ISP, organization, and network details.
        
        Use Case: Useful for identifying the location of an IP address, determining network ownership, or checking your own public IP information.
        
        Output: Formatted Markdown containing location data (country, region, city), network information (ISP, organization, AS number), coordinates, and a link to view the location on a map.
        
        Examples:
  $ mcp-ipaddress get-ip-details
  $ mcp-ipaddress get-ip-details 8.8.8.8
  $ mcp-ipaddress get-ip-details 1.1.1.1`,
		)
		.argument(
			'[ipAddress]',
			'IP address to lookup (optional, omit for current device)',
		)
		.option(
			'--extended',
			'Include extended data like ASN, mobile and proxy detection',
		)
		.option(
			'--https',
			'Use HTTPS for API requests (may require paid API key)',
		)
		.action(
			async (
				ipAddress?: string,
				cmdOptions?: { extended?: boolean; https?: boolean },
			) => {
				const actionLogger = Logger.forContext(
					'cli/ipaddress.cli.ts',
					'get-ip-details',
				);
				try {
					actionLogger.debug(
						`Fetching IP details for ${ipAddress || 'current device'}...`,
						cmdOptions,
					);

					// Map CLI options to controller options
					const controllerOptions = {
						includeExtendedData: cmdOptions?.extended || false,
						useHttps: cmdOptions?.https || false,
					};

					const result = await ipAddressController.get(
						ipAddress,
						controllerOptions,
					);
					actionLogger.debug(
						`IP details fetched successfully`,
						result,
					);
					console.log(result.content);
				} catch (error) {
					handleCliError(error);
				}
			},
		);
}

export default { register };
