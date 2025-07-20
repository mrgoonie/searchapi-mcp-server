/**
 * @file vendor.searchapi.site.types.ts
 * @description Type definitions for the SearchAPI.site service integration.
 */

/**
 * Base response structure from SearchAPI.site
 */
export interface SearchApiBaseResponse {
	success: boolean;
	message: string;
}

/**
 * Common search result interface for all search types
 */
export interface SearchApiResult {
	title: string;
	link: string;
	snippet: string;
	position: number;
}

/**
 * Google search result interface
 */
export interface GoogleSearchResult extends SearchApiResult {
	displayLink: string;
	source: string;
	meta: Record<string, string>;
	image: Array<{ src: string }>;
}

/**
 * Google image search result interface
 */
export interface GoogleImageResult extends SearchApiResult {
	displayLink: string;
	source: string;
	imageUrl: string;
	thumbnailUrl: string;
	imageWidth: number;
	imageHeight: number;
	imageSize: number;
	imageType: string;
}

/**
 * YouTube search result interface
 */
export interface YouTubeSearchResult {
	id: string;
	title: string;
	description: string;
	publishedAt: string;
	thumbnails: {
		default: { url: string; width: number; height: number };
		medium: { url: string; width: number; height: number };
		high: { url: string; width: number; height: number };
	};
	channelTitle: string;
	channelId: string;
	videoUrl: string;
}

/**
 * Google search response interface
 */
export interface GoogleSearchResponse extends SearchApiBaseResponse {
	data: GoogleSearchResult[];
}

/**
 * Google image search response interface
 */
export interface GoogleImageSearchResponse extends SearchApiBaseResponse {
	data: GoogleImageResult[];
}

/**
 * YouTube search response interface
 */
export interface YouTubeSearchResponse extends SearchApiBaseResponse {
	data: {
		items: YouTubeSearchResult[];
		nextPageToken?: string;
		prevPageToken?: string;
		pageInfo: {
			totalResults: number;
			resultsPerPage: number;
		};
	};
}

/**
 * Google search request options
 */
export interface GoogleSearchRequestOptions {
	query: string;
	limit?: number;
	offset?: number;
	sort?: string;
	from_date?: string;
	to_date?: string;
}

/**
 * Google image search request options
 */
export interface GoogleImageSearchRequestOptions {
	query: string;
	limit?: number;
	offset?: number;
	sort?: string;
	from_date?: string;
	to_date?: string;
}

/**
 * YouTube search request options
 */
export interface YouTubeSearchRequestOptions {
	query: string;
	maxResults?: number;
	pageToken?: string;
	order?: 'date' | 'viewCount' | 'rating' | 'relevance';
	publishedAfter?: number;
	videoDuration?: 'short' | 'medium' | 'long' | 'any';
}
