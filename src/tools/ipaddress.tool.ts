import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { IpAddressToolArgs, IpAddressToolArgsType } from './ipaddress.types.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';

import ipAddressController from '../controllers/ipaddress.controller.js';

/**
 * @function getIpAddressDetails
 * @description MCP Tool handler to retrieve details for a given IP address (or the current IP).
 *              It calls the ipAddressController to fetch the data and formats the response for the MCP.
 *
 * @param {IpAddressToolArgsType} args - Arguments provided to the tool, including the optional IP address and options.
 * @param {RequestHandlerExtra<any, any>} _extra - Additional request context (unused, typed as any).
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} Formatted response for the MCP.
 * @throws {McpError} Formatted error if the controller or service layer encounters an issue.
 */
async function getIpAddressDetails(args: IpAddressToolArgsType) {
	const methodLogger = Logger.forContext(
		'tools/ipaddress.tool.ts',
		'getIpAddressDetails',
	);
	methodLogger.debug(
		`Getting IP address details for ${args.ipAddress || 'current IP'}...`,
	);

	try {
		// Map tool arguments to controller options
		const controllerOptions = {
			includeExtendedData: args.includeExtendedData,
			useHttps: args.useHttps,
		};

		// Call the controller with the mapped options
		const message = await ipAddressController.get(
			args.ipAddress,
			controllerOptions,
		);
		methodLogger.debug(`Got the response from the controller`, message);

		// Format the response for the MCP tool
		return {
			content: [
				{
					type: 'text' as const,
					text: message.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error(
			`Error getting details for IP: ${args.ipAddress || 'current IP'}`,
			error,
		);
		return formatErrorForMcpTool(error);
	}
}

/**
 * @function registerTools
 * @description Registers the IP address lookup tool ('get-ip-details') with the MCP server.
 *
 * @param {McpServer} server - The MCP server instance.
 */
function registerTools(server: McpServer) {
	const methodLogger = Logger.forContext(
		'tools/ipaddress.tool.ts',
		'registerTools',
	);
	methodLogger.debug(`Registering IP address tools...`);

	server.tool(
		'ip_get_details',
		`Retrieves geolocation and network details for a public IP address (\`ipAddress\`). Falls back to the server's current public IP if omitted. Fetches country, city, coordinates, ISP, etc. Optionally includes extended data (\`includeExtendedData\`) like ASN, mobile/proxy/hosting detection. **Note:** Does not work for private IPs. Relies on ip-api.com. Use \`useHttps\` for paid tier.`,
		IpAddressToolArgs.shape,
		getIpAddressDetails,
	);

	methodLogger.debug('Successfully registered get-ip-details tool.');
}

export default { registerTools };
