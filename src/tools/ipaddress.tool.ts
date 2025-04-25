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
		`Get geolocation and network details for an IP address.

            PURPOSE:
            Retrieves geolocation information (country, city, region, coordinates), ISP, and organization details associated with an IP address. Provides network and geographical context for an IP, which is useful for security analysis, debugging, or location verification.

            WHEN TO USE:
            - To find the geographical location of a given IP address (country, region, city, coordinates).
            - To identify the ISP or organization owning an IP address.
            - To get your own public IP address details (by omitting the 'ipAddress' argument).
            - When analyzing network traffic or connections for geographical context.
            - When verifying a user's approximate location based on their IP.
            - When investigating suspicious IP addresses in logs.

            WHEN NOT TO USE:
            - For internal/private IP addresses (e.g., 10.x.x.x, 192.168.x.x) as this tool queries a public database.
            - When you need historical IP data (this provides current lookup only).
            - For precise geolocation (IP geolocation accuracy is limited).
            - For operations other than retrieving IP geolocation details.
            - When processing large batches of IPs without considering rate limits.

            RETURNS:
            Formatted Markdown containing:
            - Location information (country, region, city, postal code, coordinates)
            - Network details (ISP, organization, AS number/name)
            - A link to view the location on a map.
            - Timestamp of when the information was retrieved.
            - With 'includeExtendedData=true', additional details like reverse DNS, mobile/proxy/hosting detection may be included.

            EXAMPLES:
            - Get details for a specific IP: { ipAddress: "8.8.8.8" }
            - Get details with extended data: { ipAddress: "1.1.1.1", includeExtendedData: true }
            - Get details for current device using HTTPS: { useHttps: true }
            - Get basic details for current device: {}

            ERRORS:
            - Invalid IP format: If 'ipAddress' is not a valid IPv4 or IPv6 format.
            - Private/Reserved IP: If the IP address is in a private or reserved range (per ip-api.com rules).
            - API errors: If the external ip-api.com service fails, rejects the request (e.g., bad token), or returns an error status.
            - Rate limiting: If the ip-api.com service rate limits the request.
            - Network errors: If the request to ip-api.com fails due to network issues.`, // Keep Zod schema reference
		IpAddressToolArgs.shape,
		getIpAddressDetails,
	);

	methodLogger.debug('Successfully registered get-ip-details tool.');
}

export default { registerTools };
