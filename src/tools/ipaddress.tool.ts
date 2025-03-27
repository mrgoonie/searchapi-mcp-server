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
		'Get details about a specific IP address or the current device (if no IP address is provided)',
		IpAddressToolArgs.shape,
		getIpAddressDetails,
	);
}

export default { register };
