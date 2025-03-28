import ipApiService from '../services/vendor.ip-api.com.service.js';
import { Logger } from '../utils/logger.util.js';
import { ControllerResponse } from '../types/common.types.js';
import { formatIpDetails } from './ipaddress.formatter.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import { applyDefaults } from '../utils/defaults.util.js';
import { GetIpOptions } from './ipaddress.types.js';
import { IPApiRequestOptions } from '../services/vendor.ip-api.com.types.js';

/**
 * Get IP address details from the IP API.
 * @param ipAddress Optional IP address to lookup (omit for current IP)
 * @param options Optional configuration for the request
 * @returns Controller response with formatted content
 */
async function get(
	ipAddress?: string,
	options: GetIpOptions = {},
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/ipaddress.controller.ts',
		'get',
	);
	methodLogger.debug(
		`Getting IP address details for ${ipAddress || 'current device'}...`,
	);

	try {
		// Define controller defaults
		const defaults: Partial<GetIpOptions> = {
			includeExtendedData: false,
			useHttps: false,
		};

		// Apply defaults to provided options
		const mergedOptions = applyDefaults<GetIpOptions>(options, defaults);
		methodLogger.debug('Using options after defaults:', mergedOptions);

		// Map controller options to service options
		const serviceOptions: IPApiRequestOptions = {
			useHttps: mergedOptions.useHttps,
		};

		// If extended data is requested, include additional fields
		if (mergedOptions.includeExtendedData) {
			serviceOptions.fields = [
				'status',
				'message',
				'country',
				'countryCode',
				'region',
				'regionName',
				'city',
				'zip',
				'lat',
				'lon',
				'timezone',
				'isp',
				'org',
				'as',
				'asname',
				'reverse',
				'mobile',
				'proxy',
				'hosting',
				'query',
			];
		}

		// Call the service with the mapped options
		const ipData = await ipApiService.get(ipAddress, serviceOptions);
		methodLogger.debug(`Got the response from the service`, ipData);

		// Format the data using the formatter
		const formattedContent = formatIpDetails(ipData);

		// Return the standard ControllerResponse structure
		return { content: formattedContent };
	} catch (error) {
		// Use the standardized error handler with return
		return handleControllerError(error, {
			entityType: 'IP Address Details',
			operation: 'retrieving',
			source: 'controllers/ipaddress.controller.ts@get',
			additionalInfo: { ipAddress },
		});
	}
}

export default { get };
