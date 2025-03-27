# Boilerplate MCP Server

This project provides a Model Context Protocol (MCP) server template that serves as a starting point for building your own connections between AI assistants (like Anthropic's Claude, Cursor AI, or other MCP-compatible clients) and external data sources or APIs. It includes a working IP lookup tool example to demonstrate the pattern.

## What is MCP and Why Use This Template?

Model Context Protocol (MCP) is an open standard enabling AI models to connect securely to external tools and data sources. This server implements the MCP standard with a flexible architecture for building custom tools.

**Benefits:**

- **Quick Start:** Begin with a fully-functional MCP server structure including CLI support.
- **Proven Patterns:** Follow established architecture patterns used in production MCP servers.
- **Complete Example:** Includes a working IP lookup tool demonstrating the full pattern from CLI to API.
- **Modern TypeScript:** Built with TypeScript and modern Node.js practices for type safety and maintainability.
- **Testing Support:** Includes test infrastructure for both unit and CLI integration tests.

## Available Tools

This MCP server provides the following example tool for your AI assistant:

- **Get IP Address Details (`get-ip-details`)**

    - **Purpose:** Retrieves geolocation information (country, city, region, coordinates), ISP, and organization details associated with an IP address.
    - **Use When:** You need to find the geographical location of a given IP address, identify the ISP/organization owning an IP, or get your own public IP details.
    - **Conversational Example:** "What's my public IP and where is it located?" or "Look up the location of IP 8.8.8.8"
    - **Parameter Example:** `{}` (no parameters for current device IP) or `{ ipAddress: "8.8.8.8" }` (specific IP)

## Interface Philosophy: Simple Input, Rich Output

This server follows a "Minimal Interface, Maximal Detail" approach:

1. **Simple Tools:** Ask for only essential identifiers or parameters (like `ipAddress`).
2. **Rich Details:** Provides comprehensive information in a well-formatted Markdown response.

## Prerequisites

- **Node.js and npm:** Ensure you have Node.js (which includes npm) installed. Download from [nodejs.org](https://nodejs.org/).
- **IP API Token (Optional):** For enhanced IP lookup capabilities, you can obtain a token from [ip-api.com](https://ip-api.com/) (basic lookups work without a token).

## Quick Start Guide

Follow these steps to connect your AI assistant to this boilerplate server:

### Step 1: Configure the Server (Optional)

The server works without configuration, but for enhanced options:

#### Method A: Global MCP Config File (Recommended)

This keeps configurations separate and organized.

1. **Create the directory** (if needed): `~/.mcp/`
2. **Create/Edit the file:** `~/.mcp/configs.json`
3. **Add the configuration:** Paste the following JSON structure, replacing the placeholders:

    ```json
    {
    	"@aashari/boilerplate-mcp-server": {
    		"environments": {
    			"DEBUG": "true",
    			"IPAPI_API_TOKEN": "<YOUR_OPTIONAL_IP_API_TOKEN>"
    		}
    	}
    	// Add other servers here if needed
    }
    ```

#### Method B: Environment Variables (Alternative)

Set environment variables when running the server.

```bash
DEBUG=true IPAPI_API_TOKEN="<YOUR_OPTIONAL_TOKEN>" npx -y @aashari/boilerplate-mcp-server
```

### Step 2: Connect Your AI Assistant

Configure your MCP client (Claude Desktop, Cursor, etc.) to run this server.

#### Claude Desktop

1. Open Settings (gear icon) > Edit Config.
2. Add or merge into `mcpServers`:

    ```json
    {
    	"mcpServers": {
    		"aashari/boilerplate-mcp-server": {
    			"command": "npx",
    			"args": ["-y", "@aashari/boilerplate-mcp-server"]
    		}
    		// ... other servers
    	}
    }
    ```

3. Save and **Restart Claude Desktop**.
4. **Verify:** Click the "Tools" (hammer) icon; the IP lookup tool should be listed.

#### Cursor AI

1. Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) > **Cursor Settings > MCP**.
2. Click **+ Add new MCP server**.
3. Enter:
    - Name: `aashari/boilerplate-mcp-server`
    - Type: `command`
    - Command: `npx -y @aashari/boilerplate-mcp-server`
4. Click **Add**.
5. **Verify:** Wait for the indicator next to the server name to turn green.

### Step 3: Using the Tools

You can now ask your AI assistant IP-related questions:

- "What's my public IP address and where is it located?"
- "Can you get details for IP 8.8.8.8?"
- "Look up the geolocation of 1.1.1.1"

## Using as a Command-Line Tool (CLI)

You can also use this package directly from your terminal:

#### Quick Use with `npx`

```bash
npx -y @aashari/boilerplate-mcp-server get-ip-details
npx -y @aashari/boilerplate-mcp-server get-ip-details 8.8.8.8
npx -y @aashari/boilerplate-mcp-server --help
```

#### Global Installation (Optional)

1. `npm install -g @aashari/boilerplate-mcp-server`
2. Use the `mcp-server` command:

```bash
mcp-server get-ip-details
mcp-server get-ip-details 8.8.8.8
mcp-server --help # See all commands
```

## Extending the Project

This boilerplate is designed to be extended with your own custom tools:

### Architecture Overview

The project follows a clean layered architecture:

- **CLI / Tool Layer** (`src/cli/*.cli.ts`, `src/tools/*.tool.ts`): User interfaces
- **Controller Layer** (`src/controllers/*.controller.ts`): Business logic
- **Service Layer** (`src/services/*.service.ts`): External API interactions
- **Utils** (`src/utils/*.util.ts`): Shared functionality

### Adding Your Own Tools

1. **Create a Service** in `src/services/` to interact with your API or data source.
2. **Add a Controller** in `src/controllers/` with business logic and type definitions.
3. **Implement a Tool** in `src/tools/` that defines the MCP tool interface.
4. **Add CLI Support** in `src/cli/` to enable command-line use.
5. **Register** your new tool in `src/index.ts`.

## Developer Guide

### Development Scripts

```bash
# Start server in development mode (with Inspector & debug logs)
npm run dev:server

# Run CLI in development mode
npm run dev:cli -- get-ip-details 8.8.8.8

# Production mode (server with Inspector)
npm run start:server

# Production mode (CLI command)
npm run start:cli -- get-ip-details
```

### Testing and Quality Tools

```bash
# Run all tests
npm test

# Run specific CLI tests
npm test -- src/cli/ipaddress.cli.test.ts

# Generate test coverage report
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### MCP Inspector

The MCP Inspector provides a visual interface for debugging and testing your MCP server:

1. Run `npm run dev:server` or `npm run start:server`
2. The Inspector launches a web UI (typically at `http://localhost:5173`)
3. Use the UI to test tools, view requests/responses, and check errors

## Troubleshooting

- **Server Not Connecting (in AI Client):**
    - Confirm the command (`npx ...`) in your client's config is correct
    - Check Node.js/npm installation and PATH
    - Run the `npx` command directly in your terminal for errors
- **IP API Errors:**
    - Basic lookups should work without configuration
    - If using a token, verify `IPAPI_API_TOKEN` is set correctly
    - Some IP ranges (private IPs like 192.168.x.x) may not return results
- **Enable Debug Logs:** Set `DEBUG=true` environment variable for verbose logging

## For Developers: Contributing

Contributions are welcome! If you'd like to contribute:

- **Setup:** Clone repo, `npm install`. Use `npm run dev:server` or `npm run dev:cli -- <command>`.
- **Code Style:** Use `npm run lint` and `npm run format`.
- **Tests:** Add tests via `npm test`.
- **Consistency:** Follow existing patterns and the "Minimal Interface, Maximal Detail" philosophy.

## License

[ISC](https://opensource.org/licenses/ISC)
