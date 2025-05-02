/**
 * @file searchapi.types.ts
 * @description Type definitions for the SearchAPI controller.
 */

/**
 * Base options for all search requests
 */
export interface BaseSearchOptions {
	apiKey: string;
}

/**
 * Options for Google search
 */
export interface GoogleSearchOptions extends BaseSearchOptions {
	query: string;
}

/**
 * Options for Google image search
 */
export interface GoogleImageSearchOptions extends BaseSearchOptions {
	query: string;
}

/**
 * Options for YouTube search
 */
export interface YouTubeSearchOptions extends BaseSearchOptions {
	query: string;
	maxResults?: number;
	pageToken?: string;
	order?: 'date' | 'viewCount' | 'rating' | 'relevance';
	publishedAfter?: number;
	videoDuration?: 'short' | 'medium' | 'long' | 'any';
}
