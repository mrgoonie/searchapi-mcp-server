import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import * as searchApiController from '../controllers/searchapi.controller.js';
import { handleCliError } from '../utils/error.util.js';

/**
 * Register SearchAPI.site CLI commands
 * @param program The Commander program instance
 */
function register(program: Command) {
	const cliLogger = Logger.forContext('cli/searchapi.cli.ts', 'register');
	cliLogger.debug(`Registering SearchAPI.site CLI commands...`);

	// Google Search Command
	program
		.command('search-google')
		.description('Perform a Google search using SearchAPI.site')
		.requiredOption('--query <query>', 'The search query to perform')
		.requiredOption('--api-key <apiKey>', 'Your SearchAPI.site API key')
		.action(async (options) => {
			const commandLogger = Logger.forContext(
				'cli/searchapi.cli.ts',
				'search-google',
			);
			try {
				commandLogger.debug('CLI search-google called', options);

				const result = await searchApiController.default.googleSearch({
					query: options.query,
					apiKey: options.apiKey,
				});

				console.log(result.content);
			} catch (error) {
				handleCliError(error);
			}
		});

	// Google Image Search Command
	program
		.command('search-google-images')
		.description('Perform a Google image search using SearchAPI.site')
		.requiredOption('--query <query>', 'The image search query to perform')
		.requiredOption('--api-key <apiKey>', 'Your SearchAPI.site API key')
		.action(async (options) => {
			const commandLogger = Logger.forContext(
				'cli/searchapi.cli.ts',
				'search-google-images',
			);
			try {
				commandLogger.debug('CLI search-google-images called', options);

				const result =
					await searchApiController.default.googleImageSearch({
						query: options.query,
						apiKey: options.apiKey,
					});

				console.log(result.content);
			} catch (error) {
				handleCliError(error);
			}
		});

	// YouTube Search Command
	program
		.command('search-youtube')
		.description('Perform a YouTube search using SearchAPI.site')
		.requiredOption(
			'--query <query>',
			'The YouTube search query to perform',
		)
		.requiredOption('--api-key <apiKey>', 'Your SearchAPI.site API key')
		.option(
			'--max-results <maxResults>',
			'Maximum number of results to return (1-50)',
			(value) => parseInt(value, 10),
		)
		.option(
			'--page-token <pageToken>',
			'Token for pagination to get next/previous page of results',
		)
		.option(
			'--order <order>',
			'Sort order for results',
			/^(date|viewCount|rating|relevance)$/,
		)
		.option(
			'--published-after <days>',
			'Number of days to filter videos from',
			(value) => parseInt(value, 10),
		)
		.option(
			'--video-duration <duration>',
			'Filter by video duration',
			/^(short|medium|long|any)$/,
		)
		.action(async (options) => {
			const commandLogger = Logger.forContext(
				'cli/searchapi.cli.ts',
				'search-youtube',
			);
			try {
				commandLogger.debug('CLI search-youtube called', options);

				const result = await searchApiController.default.youtubeSearch({
					query: options.query,
					apiKey: options.apiKey,
					maxResults: options.maxResults,
					pageToken: options.pageToken,
					order: options.order,
					publishedAfter: options.publishedAfter,
					videoDuration: options.videoDuration,
				});

				console.log(result.content);
			} catch (error) {
				handleCliError(error);
			}
		});

	cliLogger.debug('SearchAPI.site CLI commands registered successfully');
}

export default { register };
