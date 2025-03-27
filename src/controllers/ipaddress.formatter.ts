// src/controllers/ipaddress.formatter.ts
import { IPDetail } from '../services/vendor.ip-api.com.type.js';
import { formatHeading, formatBulletList, formatDate } from '../utils/formatter.util.js'; // Import from the newly created util

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

    // Use formatBulletList for the properties
    // First cast to unknown, then to Record<string, unknown> to avoid TypeScript error
    lines.push(formatBulletList(ipData as unknown as Record<string, unknown>));

    // Add a timestamp footer
    lines.push('');
    lines.push(`*Details retrieved at ${formatDate(new Date())}*`);

    return lines.join('\n');
} 