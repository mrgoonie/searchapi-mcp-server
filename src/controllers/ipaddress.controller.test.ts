import ipAddressController from './ipaddress.controller.js';
import { ErrorType, McpError } from '../utils/error.util.js';

describe('IP Address Controller', () => {
	describe('get: current IP address', () => {
		it('should return a valid IP address', async () => {
			// Call the function with the real API
			const result = await ipAddressController.get();

			// Verify the result is a valid IP address format
			expect(result.content).toContain('# IP Address Details:');
			expect(result.content).toContain('- **status**: success');
			expect(result.content).toContain('- **query**:');
		}, 10000); // Increase timeout for API call
	});

	describe('get: specific IP address', () => {
		it('should return details for a valid IP address', async () => {
			// Use a known public IP address for testing
			const ipAddress = '8.8.8.8'; // Google's public DNS

			// Call the function with the real API
			const result = await ipAddressController.get(ipAddress);

			// Verify the response contains expected fields
			expect(result.content).toContain('# IP Address Details:');
			expect(result.content).toContain('- **status**: success');
			expect(result.content).toContain(`- **query**: ${ipAddress}`);
		}, 10000); // Increase timeout for API call

		it('should handle invalid IP addresses', async () => {
			// Use an invalid IP address
			const invalidIp = 'invalid-ip';

			// Call the function with the real API and expect it to throw an McpError
			await expect(ipAddressController.get(invalidIp)).rejects.toThrow(
				McpError,
			);

			// Try to get the error to verify its properties
			try {
				await ipAddressController.get(invalidIp);
			} catch (error) {
				// Verify the error is an McpError with the correct type
				expect(error).toBeInstanceOf(McpError);
				expect((error as McpError).type).toBe(ErrorType.API_ERROR);
				expect((error as McpError).message).toContain('IP API error');
			}
		}, 10000); // Increase timeout for API call
	});
});
