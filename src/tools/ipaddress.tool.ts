import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { IpAddressToolArgs, IpAddressToolArgsType } from './ipaddress.types.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';

import ipAddressController from '../controllers/ipaddress.controller.js';

/**
 * Get IP Address details using the controller.
 * Maps tool arguments to controller options and formats the response.
 */
async function getIpAddressDetails(
	args: IpAddressToolArgsType,
	_extra: RequestHandlerExtra,
) {
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
 * Register IP address tools with the MCP server
 */
function register(server: McpServer) {
	const methodLogger = Logger.forContext(
		'tools/ipaddress.tool.ts',
		'register',
	);
	methodLogger.debug(`Registering IP address tools...`);

	server.tool(
		'get-ip-details',
		`Get details about a specific IP address or the current device's public IP address.

            PURPOSE: Retrieves geolocation information (country, city, region, coordinates), ISP, and organization details associated with an IP address. Provides network and geographical context for an IP, which is useful for security analysis, debugging, or location verification.

            WHEN TO USE:
            - To find the geographical location of a given IP address (country, region, city, coordinates).
            - To identify the ISP or organization owning an IP address.
            - To get your own public IP address details (by omitting the 'ipAddress' argument).
            - When analyzing network traffic or connections for geographical context.
            - When verifying a user's approximate location based on their IP.
            - When investigating suspicious IP addresses in logs.

            WHEN NOT TO USE:
            - For internal/private IP addresses (10.x.x.x, 192.168.x.x, etc.) as this tool queries a public database.
            - When you need historical IP data (this provides current lookup only).
            - For precise geolocation (IP geolocation has limited accuracy, especially in rural areas).
            - For operations other than retrieving IP geolocation details.
            - When you need to process large batches of IPs (use appropriate rate limiting).

            RETURNS: Formatted Markdown containing:
            - Location information (country, region, city, postal code, coordinates)
            - Network details (ISP, organization, AS number)
            - A link to view the location on a map
            - Timestamp of when the information was retrieved

            With extended data (when includeExtendedData=true), additional information may include:
            - Mobile network detection
            - Proxy/VPN detection
            - Hosting provider detection
            - Reverse DNS information

            EXAMPLES:
            - Get details for a specific IP: { ipAddress: "8.8.8.8" }
            - Get details with extended data: { ipAddress: "8.8.8.8", includeExtendedData: true }
            - Get details for current device with HTTPS: { useHttps: true }
            - Get basic details for current device: {}

            ERRORS:
            - Invalid IP format: If the provided 'ipAddress' is not a valid IP address format.
            - Private/Reserved IP: If the IP address is in a private or reserved range.
            - API errors: If the external ip-api.com service fails or rejects the request.
            - Rate limiting: If too many requests are made in a short period.`,
		IpAddressToolArgs.shape,
		getIpAddressDetails,
	);
}

export default { register };
