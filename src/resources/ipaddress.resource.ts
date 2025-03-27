import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpResource } from '../utils/error.util.js';

import ipAddressController from '../controllers/ipaddress.controller.js';

/**
 * Register IP lookup resources with the MCP server
 * @param server The MCP server instance
 */
function register(server: McpServer) {
	const methodLogger = Logger.forContext(
		'resources/ipaddress.resource.ts',
		'register',
	);
	methodLogger.debug(`Registering IP lookup resources...`);

	server.resource(
		'Current Device IP',
		'ip://current',
		{
			description: 'Details about your current IP address',
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
				const resourceContent = await ipAddressController.get();
				resourceMethodLogger.debug('Successfully retrieved IP details');
				return {
					contents: [
						{
							uri: 'ip://current',
							text: resourceContent.content,
							mimeType: 'text/plain',
							description:
								'Details about your current IP address',
						},
					],
				};
			} catch (error) {
				resourceMethodLogger.error(`Error getting IP details`, error);
				return formatErrorForMcpResource(error, 'ip://current');
			}
		},
	);
}

export default { register };
