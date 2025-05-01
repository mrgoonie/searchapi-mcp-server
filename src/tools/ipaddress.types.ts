import { z } from 'zod';

const IpAddressToolArgs = z.object({
	ipAddress: z
		.string()
		.optional()
		.describe('IP address to lookup (omit for current IP)'),
	includeExtendedData: z
		.boolean()
		.optional()
		.describe(
			'Includes extended data like ASN, mobile and proxy detection',
		),
	useHttps: z
		.boolean()
		.optional()
		.describe('Uses HTTPS for API requests (may require paid API key)'),
});

type IpAddressToolArgsType = z.infer<typeof IpAddressToolArgs>;

export { IpAddressToolArgs, type IpAddressToolArgsType };
