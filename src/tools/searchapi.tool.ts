import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import {
	GoogleSearchToolArgs,
	GoogleSearchToolArgsType,
	GoogleImageSearchToolArgs,
	GoogleImageSearchToolArgsType,
	YouTubeSearchToolArgs,
	YouTubeSearchToolArgsType,
} from './searchapi.types.js';
import { formatErrorForMcpTool, createApiError } from '../utils/error.util.js';
import searchApiController from '../controllers/searchapi.controller.js';

function assertNonEmptyQuery(
	query: string | undefined,
	toolName: string,
): void {
	if (!query || !query.trim()) {
		throw createApiError(
			`Missing required "query" for ${toolName}. Provide a non-empty search query.`,
			400,
		);
	}
}

/**
 * @function handleGoogleSearch
 * @description MCP Tool handler to perform a Google search using SearchAPI.site
 * @param {GoogleSearchToolArgsType} args - Arguments provided to the tool
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} Formatted response for the MCP
 */
async function handleGoogleSearch(args: GoogleSearchToolArgsType) {
	const methodLogger = Logger.forContext(
		'tools/searchapi.tool.ts',
		'handleGoogleSearch',
	);
	methodLogger.debug(`Performing Google search for query: ${args.query}`);

	try {
		assertNonEmptyQuery(args.query, 'search_google');

		// Map tool arguments to controller options
		const controllerOptions = {
			query: args.query,
			limit: args.limit,
			offset: args.offset,
			sort: args.sort,
			from_date: args.from_date,
			to_date: args.to_date,
		};

		// Call the controller with the mapped options
		const result =
			await searchApiController.googleSearch(controllerOptions);
		methodLogger.debug(`Got the response from the controller`, result);

		// Format the response for the MCP tool
		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error(
			`Error performing Google search for query: ${args.query}`,
			error,
		);
		return formatErrorForMcpTool(error);
	}
}

/**
 * @function handleGoogleImageSearch
 * @description MCP Tool handler to perform a Google image search using SearchAPI.site
 * @param {GoogleImageSearchToolArgsType} args - Arguments provided to the tool
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} Formatted response for the MCP
 */
async function handleGoogleImageSearch(args: GoogleImageSearchToolArgsType) {
	const methodLogger = Logger.forContext(
		'tools/searchapi.tool.ts',
		'handleGoogleImageSearch',
	);
	methodLogger.debug(
		`Performing Google image search for query: ${args.query}`,
	);

	try {
		assertNonEmptyQuery(args.query, 'search_google_images');

		// Map tool arguments to controller options
		const controllerOptions = {
			query: args.query,
			limit: args.limit,
			offset: args.offset,
			sort: args.sort,
			from_date: args.from_date,
			to_date: args.to_date,
		};

		// Call the controller with the mapped options
		const result =
			await searchApiController.googleImageSearch(controllerOptions);
		methodLogger.debug(`Got the response from the controller`, result);

		// Format the response for the MCP tool
		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error(
			`Error performing Google image search for query: ${args.query}`,
			error,
		);
		return formatErrorForMcpTool(error);
	}
}

/**
 * @function handleYouTubeSearch
 * @description MCP Tool handler to perform a YouTube search using SearchAPI.site
 * @param {YouTubeSearchToolArgsType} args - Arguments provided to the tool
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} Formatted response for the MCP
 */
async function handleYouTubeSearch(args: YouTubeSearchToolArgsType) {
	const methodLogger = Logger.forContext(
		'tools/searchapi.tool.ts',
		'handleYouTubeSearch',
	);
	methodLogger.debug(`Performing YouTube search for query: ${args.query}`);

	try {
		assertNonEmptyQuery(args.query, 'search_youtube');

		// Map tool arguments to controller options
		const controllerOptions = {
			query: args.query,
			maxResults: args.maxResults,
			pageToken: args.pageToken,
			order: args.order,
			publishedAfter: args.publishedAfter,
			videoDuration: args.videoDuration,
		};

		// Call the controller with the mapped options
		const result =
			await searchApiController.youtubeSearch(controllerOptions);
		methodLogger.debug(`Got the response from the controller`, result);

		// Format the response for the MCP tool
		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error(
			`Error performing YouTube search for query: ${args.query}`,
			error,
		);
		return formatErrorForMcpTool(error);
	}
}

/**
 * @function register
 * @description Registers the SearchAPI.site tools with the MCP server
 * @param {McpServer} server - The MCP server instance
 */
function register(server: McpServer) {
	const methodLogger = Logger.forContext(
		'tools/searchapi.tool.ts',
		'register',
	);
	methodLogger.debug(`Registering SearchAPI.site tools...`);

	// Register Google search tool
	server.tool(
		'search_google',
		`Performs a Google search using SearchAPI.site.
Requires a non-empty "query" string; multiple keywords can be separated by commas.
Returns formatted search results including titles, snippets, and links.
Optional filters:
- "limit" (1-100) and "offset" to page through results
- "sort" such as "date:d" to rank newest first (omit for relevance ranking)
- "from_date" and "to_date" (YYYY-MM-DD) to restrict results to a date range
`,
		GoogleSearchToolArgs.shape,
		handleGoogleSearch,
	);

	// Register Google image search tool
	server.tool(
		'search_google_images',
		`Performs a Google image search using SearchAPI.site.
Requires a non-empty "query" string.
Returns formatted image search results including titles, thumbnails, and source links.
Optional filters:
- "limit" (1-100) and "offset" to page through results
- "sort" such as "date:d" to rank newest first (omit for relevance ranking)
- "from_date" and "to_date" (YYYY-MM-DD) to restrict results to a date range
`,
		GoogleImageSearchToolArgs.shape,
		handleGoogleImageSearch,
	);

	// Register YouTube search tool
	server.tool(
		'search_youtube',
		`Performs a YouTube search using SearchAPI.site.
Requires a search query and your SearchAPI.site API key.
Returns formatted YouTube search results including video titles, thumbnails, descriptions, and links.
Supports optional parameters for pagination, sorting, filtering by date and duration.
`,
		YouTubeSearchToolArgs.shape,
		handleYouTubeSearch,
	);

	methodLogger.debug('Successfully registered SearchAPI.site tools.');
}

export default { register };
