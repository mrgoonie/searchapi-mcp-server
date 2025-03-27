import { Logger } from './logger.util.js';
import {
	createApiError,
	createUnexpectedError,
	McpError,
} from './error.util.js';

/**
 * Interface for HTTP request options
 */
export interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	headers?: Record<string, string>;
	body?: unknown;
}

/**
 * Generic function to fetch data from an API endpoint.
 * Handles basic HTTP error checking and logging.
 * @param url The full URL to fetch data from.
 * @param options Request options (method, headers, body).
 * @returns Response data as type T.
 * @throws {McpError} If the fetch fails or the response is not ok.
 */
export async function fetchApi<T>(
	url: string,
	options: RequestOptions = {},
): Promise<T> {
	const methodLogger = Logger.forContext(
		'utils/transport.util.ts',
		'fetchApi',
	);

	// Prepare request options
	const requestOptions: RequestInit = {
		method: options.method || 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...options.headers, // Allow overriding default headers
		},
		body: options.body ? JSON.stringify(options.body) : undefined,
	};

	methodLogger.debug(`Calling API: ${requestOptions.method} ${url}`);

	try {
		const response = await fetch(url, requestOptions);

		// Log the raw response status and headers
		methodLogger.debug(
			`Raw response received: ${response.status} ${response.statusText}`,
			{
				url,
				status: response.status,
				statusText: response.statusText,
				headers: {
					// Log simplified headers
					contentType: response.headers.get('content-type'),
					contentLength: response.headers.get('content-length'),
				},
			},
		);

		if (!response.ok) {
			const errorText = await response.text();
			methodLogger.error(
				`API error: ${response.status} ${response.statusText}`,
				errorText,
			);

			// Create a generic API error
			throw createApiError(
				`API request failed: ${response.status} ${response.statusText}`,
				response.status,
				errorText,
			);
		}

		// Attempt to parse JSON
		const responseData = await response.json();
		methodLogger.debug(`Response body parsed successfully.`);
		// methodLogger.debug(`Response body:`, responseData); // Optionally log full body

		return responseData as T;
	} catch (error) {
		methodLogger.error(`Request failed for ${url}`, error);

		// Rethrow known McpErrors (like the one from createApiError)
		if (error instanceof McpError) {
			throw error;
		}

		// Handle network or fetch-specific errors
		if (error instanceof TypeError) {
			throw createApiError(
				`Network error during API call: ${error.message}`,
				undefined, // No specific HTTP status for network errors
				error,
			);
		}
		// Handle JSON parsing errors
		if (error instanceof SyntaxError) {
			throw createApiError(
				`Failed to parse API response JSON: ${error.message}`,
				undefined, // No specific HTTP status for parsing errors
				error,
			);
		}

		// Wrap unknown errors
		throw createUnexpectedError(
			`Unexpected error during API call: ${error instanceof Error ? error.message : String(error)}`,
			error,
		);
	}
}
