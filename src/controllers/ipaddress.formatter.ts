// src/controllers/ipaddress.formatter.ts
import { IPDetail } from '../services/vendor.ip-api.com.types.js';
import {
	formatUrl,
	formatDate,
	formatHeading,
	formatBulletList,
	formatSeparator,
} from '../utils/formatter.util.js';

/**
 * Format IP address details into Markdown.
 * @param ipData - Raw IP details from the ip-api.com service.
 * @returns Formatted Markdown string.
 */
export function formatIpDetails(ipData: IPDetail): string {
	const lines: string[] = [];

	// Add a main heading
	lines.push(formatHeading(`IP Address Details: ${ipData.query}`, 1));
	lines.push('');

	// Add a summary section
	lines.push(formatHeading('Location Information', 2));

	// Format the location information in a structured way
	const locationInfo: Record<string, unknown> = {
		Country: `${ipData.country} (${ipData.countryCode})`,
		Region: `${ipData.regionName} (${ipData.region})`,
		City: ipData.city,
		'Zip/Postal Code': ipData.zip,
		Coordinates: `${ipData.lat}, ${ipData.lon}`,
		Timezone: ipData.timezone,
	};

	lines.push(formatBulletList(locationInfo));
	lines.push('');

	// Add network information section
	lines.push(formatHeading('Network Information', 2));

	const networkInfo: Record<string, unknown> = {
		'IP Address': ipData.query,
		ISP: ipData.isp,
		Organization: ipData.org,
		AS: ipData.as,
	};

	lines.push(formatBulletList(networkInfo));

	// Add a map link if coordinates are available
	if (ipData.lat && ipData.lon) {
		lines.push('');
		lines.push(formatHeading('Map', 2));
		const mapUrl = `https://www.openstreetmap.org/?mlat=${ipData.lat}&mlon=${ipData.lon}&zoom=12`;
		lines.push(`${formatUrl(mapUrl, 'View on OpenStreetMap')}`);
	}

	// Add a separator
	lines.push('');
	lines.push(formatSeparator());

	// Add a timestamp footer
	lines.push(`*Details retrieved at ${formatDate(new Date())}*`);

	return lines.join('\n');
}
