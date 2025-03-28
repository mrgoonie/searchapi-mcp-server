/**
 * Interface for IP address lookup options
 */
export interface GetIpOptions {
	/**
	 * Set to true to include extended data like ASN information (when available)
	 */
	includeExtendedData?: boolean;

	/**
	 * Set to true to use https for API calls (when available)
	 */
	useHttps?: boolean;
}

/**
 * Interface for identifying an IP address
 */
export interface IpAddressIdentifier {
	/**
	 * The IP address to lookup (omit for current IP)
	 */
	ip?: string;
}
