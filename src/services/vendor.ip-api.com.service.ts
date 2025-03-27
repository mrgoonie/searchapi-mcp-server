import { Logger } from '../utils/logger.util.js';
import { config } from '../utils/config.util.js';
import { IPDetail } from './vendor.ip-api.com.type.js';
import {
	createApiError,
	createUnexpectedError,
	McpError,
} from '../utils/error.util.js';
import { fetchApi } from '../utils/transport.util.js';

const ENDPOINT = 'http://ip-api.com/json';

async function get(ipAddress?: string): Promise<IPDetail> {
	const methodLogger = Logger.forContext(
		'services/vendor.ip-api.com.service.ts',
		'get',
	);
	methodLogger.debug(`Calling the API via transport util...`);

	// Get API token from configuration
	const apiToken = config.get('IPAPI_API_TOKEN');

	// Build URL with token if available
	let url = `${ENDPOINT}/${ipAddress ?? ''}`;
	if (apiToken) {
		url += `?key=${apiToken}`;
		methodLogger.debug(`Using API token`);
	}

	try {
		// Use the centralized fetchApi utility
		// Explicitly type the expected response structure for fetchApi
		const data = await fetchApi<
			{ status: string; message?: string } & IPDetail
		>(url);

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
