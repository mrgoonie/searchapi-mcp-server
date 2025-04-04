import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpResource } from '../utils/error.util.js';

import ipAddressController from '../controllers/ipaddress.controller.js';

/**
 * Register IP lookup resources with the MCP server
 * @param server The MCP server instance
 */
function registerResources(server: McpServer) {
	const methodLogger = Logger.forContext(
		'resources/ipaddress.resource.ts',
		'registerResources',
	);
	methodLogger.debug(`Registering IP lookup resources...`);

	// Register resource for current IP details
	server.resource(
		'Current Device IP',
		'ip://current',
		{
			description:
				'Details about your current public IP address including geolocation and network information',
		},
		async (_uri, _extra) => {
			const resourceMethodLogger = Logger.forContext(
				'resources/ipaddress.resource.ts',
				'resourceHandler',
			);
			try {
				resourceMethodLogger.debug(
					'Handling request for current IP details',
				);

				// Include extended data for resource queries by default
				const controllerOptions = {
					includeExtendedData: true,
				};

				const resourceContent = await ipAddressController.get(
					undefined, // No IP specified = current device
					controllerOptions,
				);

				resourceMethodLogger.debug('Successfully retrieved IP details');
				return {
					contents: [
						{
							uri: 'ip://current',
							text: resourceContent.content,
							mimeType: 'text/plain',
							description:
								'Details about your current public IP address including geolocation and network information',
						},
					],
				};
			} catch (error) {
				resourceMethodLogger.error(`Error getting IP details`, error);
				return formatErrorForMcpResource(error, 'ip://current');
			}
		},
	);

	// Register resource for Google DNS IP details as an example
	server.resource(
		'Google DNS IP',
		'ip://8.8.8.8',
		{
			description: "Details about Google's public DNS server IP",
		},
		async (_uri, _extra) => {
			const resourceMethodLogger = Logger.forContext(
				'resources/ipaddress.resource.ts',
				'googleDnsHandler',
			);
			try {
				resourceMethodLogger.debug(
					'Handling request for Google DNS IP details',
				);

				const resourceContent = await ipAddressController.get(
					'8.8.8.8',
					{
						includeExtendedData: true,
					},
				);

				resourceMethodLogger.debug(
					'Successfully retrieved Google DNS IP details',
				);
				return {
					contents: [
						{
							uri: 'ip://8.8.8.8',
							text: resourceContent.content,
							mimeType: 'text/plain',
							description:
								"Details about Google's public DNS server IP",
						},
					],
				};
			} catch (error) {
				resourceMethodLogger.error(
					`Error getting Google DNS IP details`,
					error,
				);
				return formatErrorForMcpResource(error, 'ip://8.8.8.8');
			}
		},
	);
}

export default { registerResources };
