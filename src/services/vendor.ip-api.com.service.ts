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
 * @namespace VendorIpApiService
 * @description Service layer for interacting directly with the ip-api.com vendor API.
 *              Responsible for constructing API requests based on provided parameters
 *              and handling the raw response from the `fetchIpApi` utility.
 */

/**
 * @function get
 * @description Fetches details for a specific IP address or the current device's IP from ip-api.com.
 *              It uses the `fetchIpApi` utility and handles the specific success/failure status returned by ip-api.com.
 * @memberof VendorIpApiService
 * @param {string} [ipAddress] - Optional IP address to look up. If omitted, fetches details for the current device's public IP.
 * @param {IPApiRequestOptions} [options={}] - Optional request options for the ip-api.com service, such as `useHttps`, `fields`, and `lang`.
 * @returns {Promise<IPDetail>} A promise that resolves to the detailed IP information if the API call is successful.
 * @throws {McpError} Throws an `McpError` (specifically `ApiError` or `UnexpectedError`) if:
 *  - The `fetchIpApi` call fails (network error, non-2xx response).
 *  - The ip-api.com response status is not 'success'.
 *  - An unexpected error occurs during processing.
 * @example
 * // Get basic details for 8.8.8.8
 * const details = await get('8.8.8.8');
 * // Get extended details using HTTPS
 * const extendedDetails = await get('1.1.1.1', { useHttps: true, fields: [...] });
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
