import searchApiService from '../services/vendor.searchapi.site.service.js';
import { Logger } from '../utils/logger.util.js';
import { ControllerResponse } from '../types/common.types.js';
import {
	formatGoogleSearchResults,
	formatGoogleImageResults,
	formatYouTubeResults,
} from './searchapi.formatter.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import { applyDefaults } from '../utils/defaults.util.js';
import {
	GoogleSearchOptions,
	GoogleImageSearchOptions,
	YouTubeSearchOptions,
} from './searchapi.types.js';

/**
 * @namespace SearchApiController
 * @description Controller responsible for handling SearchAPI.site search operations.
 *              It orchestrates calls to the SearchAPI.site service, applies defaults,
 *              maps options, and formats the response using the formatter.
 */

/**
 * @function googleSearch
 * @description Performs a Google search using SearchAPI.site
 * @memberof SearchApiController
 * @param {GoogleSearchOptions} options - Search options including query and API key
 * @returns {Promise<ControllerResponse>} A promise that resolves to the standard controller response containing the formatted search results in Markdown
 * @throws {McpError} Throws an McpError (handled by `handleControllerError`) if the service call fails or returns an error
 */
async function googleSearch(
	options: GoogleSearchOptions,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/searchapi.controller.ts',
		'googleSearch',
	);
	methodLogger.debug(`Performing Google search for query: ${options.query}`);

	try {
		// Validate required parameters
		if (!options.query) {
			throw new Error('Query is required for Google search');
		}

		if (!options.apiKey) {
			throw new Error('API key is required for SearchAPI.site');
		}

		// Call the service with the options
		const searchResponse = await searchApiService.googleSearch(
			{ query: options.query },
			options.apiKey,
		);
		methodLogger.debug(`Got the response from the service`, searchResponse);

		// Format the data using the formatter
		const formattedContent = formatGoogleSearchResults(searchResponse.data);

		// Return the standard ControllerResponse structure
		return { content: formattedContent };
	} catch (error) {
		// Use the standardized error handler with return
		return handleControllerError(error, {
			entityType: 'Google Search Results',
			operation: 'searching',
			source: 'controllers/searchapi.controller.ts@googleSearch',
			additionalInfo: { query: options.query },
		});
	}
}

/**
 * @function googleImageSearch
 * @description Performs a Google image search using SearchAPI.site
 * @memberof SearchApiController
 * @param {GoogleImageSearchOptions} options - Search options including query and API key
 * @returns {Promise<ControllerResponse>} A promise that resolves to the standard controller response containing the formatted image search results in Markdown
 * @throws {McpError} Throws an McpError (handled by `handleControllerError`) if the service call fails or returns an error
 */
async function googleImageSearch(
	options: GoogleImageSearchOptions,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/searchapi.controller.ts',
		'googleImageSearch',
	);
	methodLogger.debug(
		`Performing Google image search for query: ${options.query}`,
	);

	try {
		// Validate required parameters
		if (!options.query) {
			throw new Error('Query is required for Google image search');
		}

		if (!options.apiKey) {
			throw new Error('API key is required for SearchAPI.site');
		}

		// Call the service with the options
		const searchResponse = await searchApiService.googleImageSearch(
			{ query: options.query },
			options.apiKey,
		);
		methodLogger.debug(`Got the response from the service`, searchResponse);

		// Format the data using the formatter
		const formattedContent = formatGoogleImageResults(searchResponse.data);

		// Return the standard ControllerResponse structure
		return { content: formattedContent };
	} catch (error) {
		// Use the standardized error handler with return
		return handleControllerError(error, {
			entityType: 'Google Image Search Results',
			operation: 'searching',
			source: 'controllers/searchapi.controller.ts@googleImageSearch',
			additionalInfo: { query: options.query },
		});
	}
}

/**
 * @function youtubeSearch
 * @description Performs a YouTube search using SearchAPI.site
 * @memberof SearchApiController
 * @param {YouTubeSearchOptions} options - Search options including query, API key, and optional parameters
 * @returns {Promise<ControllerResponse>} A promise that resolves to the standard controller response containing the formatted YouTube search results in Markdown
 * @throws {McpError} Throws an McpError (handled by `handleControllerError`) if the service call fails or returns an error
 */
async function youtubeSearch(
	options: YouTubeSearchOptions,
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/searchapi.controller.ts',
		'youtubeSearch',
	);
	methodLogger.debug(`Performing YouTube search for query: ${options.query}`);

	try {
		// Validate required parameters
		if (!options.query) {
			throw new Error('Query is required for YouTube search');
		}

		if (!options.apiKey) {
			throw new Error('API key is required for SearchAPI.site');
		}

		// Define controller defaults
		const defaults: Partial<YouTubeSearchOptions> = {
			maxResults: 10,
			order: 'relevance',
			videoDuration: 'any',
		};

		// Apply defaults to provided options
		const mergedOptions = applyDefaults<YouTubeSearchOptions>(
			options,
			defaults,
		);
		methodLogger.debug('Using options after defaults:', mergedOptions);

		// Call the service with the options
		const searchResponse = await searchApiService.youtubeSearch(
			{
				query: mergedOptions.query,
				maxResults: mergedOptions.maxResults,
				pageToken: mergedOptions.pageToken,
				order: mergedOptions.order,
				publishedAfter: mergedOptions.publishedAfter,
				videoDuration: mergedOptions.videoDuration,
			},
			mergedOptions.apiKey,
		);
		methodLogger.debug(`Got the response from the service`, searchResponse);

		// Format the data using the formatter
		const formattedContent = formatYouTubeResults(searchResponse);

		// Return the standard ControllerResponse structure
		return { content: formattedContent };
	} catch (error) {
		// Use the standardized error handler with return
		return handleControllerError(error, {
			entityType: 'YouTube Search Results',
			operation: 'searching',
			source: 'controllers/searchapi.controller.ts@youtubeSearch',
			additionalInfo: { query: options.query },
		});
	}
}

export default {
	googleSearch,
	googleImageSearch,
	youtubeSearch,
};
