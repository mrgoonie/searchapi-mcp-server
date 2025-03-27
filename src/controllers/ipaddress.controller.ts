import ipApiService from '../services/vendor.ip-api.com.service.js';
import { Logger } from '../utils/logger.util.js';
import { ControllerResponse } from '../types/common.types.js';
import { formatIpDetails } from './ipaddress.formatter.js';
import { handleControllerError } from '../utils/error-handler.util.js';

async function get(ipAddress?: string): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/ipaddress.controller.ts',
		'get',
	);
	methodLogger.debug(`Getting IP address details...`);

	try {
		const ipData = await ipApiService.get(ipAddress);
		methodLogger.debug(`Got the response from the service`, ipData);

		const formattedContent = formatIpDetails(ipData);
		// Return the standard ControllerResponse structure
		return { content: formattedContent };
	} catch (error) {
		// Use the standardized error handler
		handleControllerError(error, {
			entityType: 'IP Address Details',
			operation: 'retrieving',
			source: 'controllers/ipaddress.controller.ts@get',
			additionalInfo: { ipAddress },
		});
		// handleControllerError always throws, so no return/throw is needed after it.
	}
}

export default { get };
