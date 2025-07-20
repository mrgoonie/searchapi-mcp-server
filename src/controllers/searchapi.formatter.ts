/**
 * @file searchapi.formatter.ts
 * @description Formatting utilities for SearchAPI responses.
 */

import {
	formatHeading,
	formatSeparator,
	formatUrl,
} from '../utils/formatter.util.js';
import {
	GoogleSearchResult,
	GoogleImageResult,
	YouTubeSearchResponse,
} from '../services/vendor.searchapi.site.types.js';

/**
 * Formats Google search results into a readable markdown format
 * @param results - Array of Google search results
 * @returns Formatted markdown string
 */
export function formatGoogleSearchResults(
	results: GoogleSearchResult[],
): string {
	if (!results || results.length === 0) {
		return 'No search results found.';
	}

	let markdown = formatHeading('Search Results');
	// console.log(JSON.stringify(results, null, 2));

	results.forEach((result, index) => {
		markdown += '\n\n';
		markdown += formatHeading(`${index + 1}. ${result.title}`, 2);
		markdown += '\n';
		markdown += formatUrl(result.link, 'View Result');
		markdown += '\n';
		// markdown += `**Source:** ${result.displayLink}\n\n`;
		markdown += `${result.snippet}\n\n`;
		if (result.meta) {
			markdown += `${JSON.stringify(result.meta, null, 2)}\n\n`;
		}
		if (result.image) {
			markdown +=
				`**Images:**\n\n` +
				result.image.map((image) => `* ${image.src}`).join('\n');
		}

		if (index < results.length - 1) {
			markdown += '\n\n';
			markdown += formatSeparator();
		}
	});

	return markdown;
}

/**
 * Formats Google image search results into a readable markdown format
 * @param results - Array of Google image search results
 * @returns Formatted markdown string
 */
export function formatGoogleImageResults(results: GoogleImageResult[]): string {
	if (!results || results.length === 0) {
		return 'No image results found.';
	}

	let markdown = formatHeading('Image Search Results');

	results.forEach((result, index) => {
		markdown += '\n\n';
		markdown += formatHeading(`${index + 1}. ${result.title}`, 2);
		markdown += '\n';
		markdown += `**Source:** ${result.displayLink}\n\n`;
		markdown += `![${result.title}](${result.thumbnailUrl})\n\n`;
		markdown += `${result.snippet}\n\n`;
		markdown += `${formatUrl(
			result.imageUrl,
			'View Full Image',
		)} | ${formatUrl(result.link, 'View Source')}\n\n`;
		markdown += `Image Size: ${result.imageWidth}x${result.imageHeight}`;

		if (index < results.length - 1) {
			markdown += '\n\n';
			markdown += formatSeparator();
		}
	});

	return markdown;
}

/**
 * Formats YouTube search results into a readable markdown format
 * @param response - YouTube search response
 * @returns Formatted markdown string
 */
export function formatYouTubeResults(response: YouTubeSearchResponse): string {
	const { data } = response;

	if (!data.items || data.items.length === 0) {
		return 'No YouTube results found.';
	}

	let markdown = formatHeading('YouTube Search Results');

	// Add pagination information if available
	if (data.pageInfo) {
		markdown += `\n\nShowing ${data.items.length} of ${data.pageInfo.totalResults} results`;
	}

	data.items.forEach((video, index) => {
		markdown += '\n\n';
		markdown += formatHeading(`${index + 1}. ${video.title}`, 2);
		markdown += '\n';
		markdown += `**Channel:** ${video.channelTitle}\n\n`;

		// Format the published date
		const publishDate = new Date(video.publishedAt);
		markdown += `**Published:** ${publishDate.toLocaleDateString()}\n\n`;

		// Add thumbnail
		if (video.thumbnails && video.thumbnails.medium) {
			markdown += `![${video.title}](${video.thumbnails.medium.url})\n\n`;
		}

		// Add description (truncate if too long)
		if (video.description) {
			const description =
				video.description.length > 200
					? video.description.substring(0, 200) + '...'
					: video.description;
			markdown += `${description}\n\n`;
		}

		markdown += formatUrl(video.videoUrl, 'Watch Video');

		if (index < data.items.length - 1) {
			markdown += '\n\n';
			markdown += formatSeparator();
		}
	});

	// Add pagination links if available
	if (data.nextPageToken || data.prevPageToken) {
		markdown += '\n\n';
		markdown += formatHeading('Pagination', 2);
		markdown += '\n\n';

		if (data.prevPageToken) {
			markdown += `Previous Page Token: \`${data.prevPageToken}\`\n\n`;
		}

		if (data.nextPageToken) {
			markdown += `Next Page Token: \`${data.nextPageToken}\`\n\n`;
		}

		markdown +=
			'Use these tokens with the `pageToken` parameter to navigate through results.';
	}

	return markdown;
}
