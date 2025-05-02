import { Logger } from '../utils/logger.util.js';
import {
	GoogleSearchRequestOptions,
	GoogleSearchResponse,
	GoogleImageSearchRequestOptions,
	GoogleImageSearchResponse,
	YouTubeSearchRequestOptions,
	YouTubeSearchResponse,
	SearchApiBaseResponse,
} from './vendor.searchapi.site.types.js';
import {
	createApiError,
	createUnexpectedError,
	McpError,
} from '../utils/error.util.js';

// Create a contextualized logger for this file
const serviceLogger = Logger.forContext(
	'services/vendor.searchapi.site.service.ts',
);

// Log service initialization
serviceLogger.debug('SearchAPI.site service initialized');

// Base URL for SearchAPI.site API
const BASE_URL = 'https://searchapi.site';

/**
 * Makes a request to the SearchAPI.site API
 * @param endpoint - API endpoint path
 * @param body - Request body
 * @param apiKey - SearchAPI.site API key
 * @returns Response data
 */
async function makeRequest<T>(
	endpoint: string,
	body: Record<string, any>,
	apiKey: string,
): Promise<T> {
	const methodLogger = Logger.forContext(
		'services/vendor.searchapi.site.service.ts',
		'makeRequest',
	);

	const url = `${BASE_URL}${endpoint}`;
	methodLogger.debug(`Making request to ${url}`);

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': apiKey,
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw createApiError(
				`SearchAPI.site API error: ${response.status} ${response.statusText} - ${errorText}`,
			);
		}

		const data = (await response.json()) as SearchApiBaseResponse;

		if (!data.success) {
			throw createApiError(
				`SearchAPI.site API error: ${data.message || 'Unknown error'}`,
			);
		}

		methodLogger.debug(
			'Received successful response from SearchAPI.site API',
		);
		return data as T;
	} catch (error) {
		// Log the error caught at the service level
		methodLogger.error(
			`Service error making request to SearchAPI.site`,
			error,
		);

		// Rethrow McpErrors
		if (error instanceof McpError) {
			throw error;
		}

		// Wrap any other unexpected errors
		throw createUnexpectedError(
			'Unexpected service error while making request to SearchAPI.site',
			error,
		);
	}
}

/**
 * Performs a Google search using SearchAPI.site
 * @param options - Google search options
 * @param apiKey - SearchAPI.site API key
 * @returns Google search results
 */
async function googleSearch(
	options: GoogleSearchRequestOptions,
	apiKey: string,
): Promise<GoogleSearchResponse> {
	const methodLogger = Logger.forContext(
		'services/vendor.searchapi.site.service.ts',
		'googleSearch',
	);
	methodLogger.debug(`Performing Google search for query: ${options.query}`);

	const requestBody: Record<string, any> = {
		query: options.query,
	};

	// Add optional parameters if provided
	if (options.limit !== undefined) {
		requestBody.limit = options.limit;
	}

	if (options.offset !== undefined) {
		requestBody.offset = options.offset;
	}

	if (options.sort) {
		requestBody.sort = options.sort;
	}

	if (options.from_date) {
		requestBody.from_date = options.from_date;
	}

	if (options.to_date) {
		requestBody.to_date = options.to_date;
	}

	return makeRequest<GoogleSearchResponse>(
		'/api/v1/google',
		requestBody,
		apiKey,
	);
}

/**
 * Performs a Google image search using SearchAPI.site
 * @param options - Google image search options
 * @param apiKey - SearchAPI.site API key
 * @returns Google image search results
 */
async function googleImageSearch(
	options: GoogleImageSearchRequestOptions,
	apiKey: string,
): Promise<GoogleImageSearchResponse> {
	const methodLogger = Logger.forContext(
		'services/vendor.searchapi.site.service.ts',
		'googleImageSearch',
	);
	methodLogger.debug(
		`Performing Google image search for query: ${options.query}`,
	);

	const requestBody: Record<string, any> = {
		query: options.query,
	};

	// Add optional parameters if provided
	if (options.limit !== undefined) {
		requestBody.limit = options.limit;
	}

	if (options.offset !== undefined) {
		requestBody.offset = options.offset;
	}

	if (options.sort) {
		requestBody.sort = options.sort;
	}

	if (options.from_date) {
		requestBody.from_date = options.from_date;
	}

	if (options.to_date) {
		requestBody.to_date = options.to_date;
	}

	return makeRequest<GoogleImageSearchResponse>(
		'/api/v1/google/images',
		requestBody,
		apiKey,
	);
}

/**
 * Performs a YouTube search using SearchAPI.site
 * @param options - YouTube search options
 * @param apiKey - SearchAPI.site API key
 * @returns YouTube search results
 */
async function youtubeSearch(
	options: YouTubeSearchRequestOptions,
	apiKey: string,
): Promise<YouTubeSearchResponse> {
	const methodLogger = Logger.forContext(
		'services/vendor.searchapi.site.service.ts',
		'youtubeSearch',
	);
	methodLogger.debug(`Performing YouTube search for query: ${options.query}`);

	const requestBody: Record<string, any> = {
		query: options.query,
	};

	// Add optional parameters if provided
	if (options.maxResults !== undefined) {
		requestBody.maxResults = options.maxResults;
	}

	if (options.pageToken) {
		requestBody.pageToken = options.pageToken;
	}

	if (options.order) {
		requestBody.order = options.order;
	}

	if (options.publishedAfter !== undefined) {
		requestBody.publishedAfter = options.publishedAfter;
	}

	if (options.videoDuration) {
		requestBody.videoDuration = options.videoDuration;
	}

	return makeRequest<YouTubeSearchResponse>(
		'/api/v1/google/youtube',
		requestBody,
		apiKey,
	);
}

export default {
	googleSearch,
	googleImageSearch,
	youtubeSearch,
};
