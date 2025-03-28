import { Logger } from '../utils/logger.util.js';
import { IPDetail, IPApiRequestOptions } from './vendor.ip-api.com.types.js';
import {
	createApiError,
	createUnexpectedError,
	McpError,
} from '../utils/error.util.js';
import { fetchIpApi } from '../utils/transport.util.js';

// Create a contextualized logger for this file
const serviceLogger = Logger.forContext(
	'services/vendor.ip-api.com.service.ts',
);

// Log service initialization
serviceLogger.debug('IP API service initialized');

/**
 * Get details for an IP address
 * @param ipAddress Optional IP address to lookup (omit for current IP)
 * @param options Optional request options
 * @returns Promise containing the IP details
 * @throws {McpError} If the request fails or the API returns an error
 */
async function get(
	ipAddress?: string,
	options: IPApiRequestOptions = {},
): Promise<IPDetail> {
	const methodLogger = Logger.forContext(
		'services/vendor.ip-api.com.service.ts',
		'get',
	);
	methodLogger.debug(`Calling IP API for IP: ${ipAddress || 'current'}`);

	try {
		// Use the centralized fetchIpApi utility
		const data = await fetchIpApi<
			{ status: string; message?: string } & IPDetail
		>(ipAddress || '', {
			useHttps: options.useHttps,
			fields: options.fields,
			lang: options.lang,
		});

		// Handle API-level success/failure specific to ip-api.com
		if (data.status !== 'success') {
			throw createApiError(
				`IP API error: ${data.message || 'Unknown error'}`,
			);
		}

		methodLogger.debug(`Received successful data from IP API`);
		return data; // Already validated as IPDetail structure implicitly by status check
	} catch (error) {
		// Log the error caught at the service level
		methodLogger.error(`Service error fetching IP data`, error);

		// Rethrow McpErrors (could be from fetchApi or the status check)
		if (error instanceof McpError) {
			throw error;
		}

		// Wrap any other unexpected errors
		throw createUnexpectedError(
			'Unexpected service error while fetching IP data',
			error,
		);
	}
}

export default { get };
