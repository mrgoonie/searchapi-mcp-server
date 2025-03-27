import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { IpAddressToolArgs, IpAddressToolArgsType } from './ipaddress.type.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';

import ipAddressController from '../controllers/ipaddress.controller.js';

async function getIpAddressDetails(
	args: IpAddressToolArgsType,
	_extra: RequestHandlerExtra,
) {
	const methodLogger = Logger.forContext(
		'tools/ipaddress.tool.ts',
		'getIpAddressDetails',
	);
	methodLogger.debug(`Getting IP address details...`);

	try {
		const message = await ipAddressController.get(args.ipAddress);
		methodLogger.debug(`Got the response from the controller`, message);
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

function register(server: McpServer) {
	const methodLogger = Logger.forContext(
		'tools/ipaddress.tool.ts',
		'register',
	);
	methodLogger.debug(`Registering tools...`);
	server.tool(
		'get-ip-details',
		`Get details about a specific IP address or the current device's public IP address.

            PURPOSE: Retrieves geolocation information (country, city, region, coordinates), ISP, and organization details associated with an IP address.

            WHEN TO USE:
            - To find the geographical location of a given IP address.
            - To identify the ISP or organization owning an IP address.
            - To get your own public IP address details (by omitting the 'ipAddress' argument).

            WHEN NOT TO USE:
            - For internal/private IP addresses (this tool queries a public database).
            - When you need historical IP data (this provides current lookup).
            - For operations other than retrieving IP geolocation details.

            RETURNS: Formatted Markdown containing details such as country, city, region, latitude, longitude, ISP, organization, and the queried IP itself.

            EXAMPLES:
            - Get details for a specific IP: { ipAddress: "8.8.8.8" }
            - Get details for the current device's IP: {}

            ERRORS:
            - Invalid IP format: If the provided 'ipAddress' is not a valid IP.
            - Private/Reserved IP: If the IP address is in a private range.
            - API errors: If the external ip-api.com service fails.`,
		IpAddressToolArgs.shape,
		getIpAddressDetails,
	);
}

export default { register };
