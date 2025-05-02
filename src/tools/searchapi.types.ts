/**
 * @file searchapi.types.ts
 * @description Type definitions for the SearchAPI.site MCP tool.
 */

import { z } from 'zod';

/**
 * Schema for Google search tool arguments
 */
export const GoogleSearchToolArgs = z.object({
	query: z.string().describe('The search query to perform'),
	apiKey: z.string().optional().describe('Your SearchAPI.site API key'),
});

/**
 * Type for Google search tool arguments
 */
export type GoogleSearchToolArgsType = z.infer<typeof GoogleSearchToolArgs>;

/**
 * Schema for Google image search tool arguments
 */
export const GoogleImageSearchToolArgs = z.object({
	query: z.string().describe('The image search query to perform'),
	apiKey: z.string().optional().describe('Your SearchAPI.site API key'),
});

/**
 * Type for Google image search tool arguments
 */
export type GoogleImageSearchToolArgsType = z.infer<
	typeof GoogleImageSearchToolArgs
>;

/**
 * Schema for YouTube search tool arguments
 */
export const YouTubeSearchToolArgs = z.object({
	query: z.string().describe('The YouTube search query to perform'),
	apiKey: z.string().optional().describe('Your SearchAPI.site API key'),
	maxResults: z
		.number()
		.min(1)
		.max(50)
		.optional()
		.describe('Maximum number of results to return (1-50)'),
	pageToken: z
		.string()
		.optional()
		.describe('Token for pagination to get next/previous page of results'),
	order: z
		.enum(['date', 'viewCount', 'rating', 'relevance'])
		.optional()
		.describe('Sort order for results'),
	publishedAfter: z
		.number()
		.optional()
		.describe('Number of days to filter videos from'),
	videoDuration: z
		.enum(['short', 'medium', 'long', 'any'])
		.optional()
		.describe('Filter by video duration'),
});

/**
 * Type for YouTube search tool arguments
 */
export type YouTubeSearchToolArgsType = z.infer<typeof YouTubeSearchToolArgs>;
