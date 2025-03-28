/**
 * Interface for IP API base response
 */
export interface IPApiBaseResponse {
	/** Status of the API response (success/fail) */
	status: string;
	/** Error message (only present on error) */
	message?: string;
}

/**
 * Interface for IP detail response from ip-api.com
 */
export interface IPDetail extends IPApiBaseResponse {
	/** Full country name */
	country: string;
	/** Two-letter country code (ISO 3166-1 alpha-2) */
	countryCode: string;
	/** Region/state code */
	region: string;
	/** Region/state name */
	regionName: string;
	/** City name */
	city: string;
	/** Zip/postal code */
	zip: string;
	/** Latitude */
	lat: number;
	/** Longitude */
	lon: number;
	/** Timezone (tz database) */
	timezone: string;
	/** Internet Service Provider name */
	isp: string;
	/** Organization name */
	org: string;
	/** AS number and name */
	as: string;
	/** IP address queried */
	query: string;
}

/**
 * Interface for IP API request options
 */
export interface IPApiRequestOptions {
	/** Use https for the request (pro feature) */
	useHttps?: boolean;
	/** Fields to include in the response */
	fields?: string[];
	/** Language for names (e.g., 'en' for English) */
	lang?: string;
}

/**
 * Interface for batch request options
 */
export interface IPApiBatchRequestOptions extends IPApiRequestOptions {
	/** Array of IP addresses to query */
	ipAddresses: string[];
}
