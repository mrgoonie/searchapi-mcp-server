# SearchAPI.site - MCP Server

This project provides a Model Context Protocol (MCP) server that connects AI assistants to external data sources (Google, Bing, etc.) via [SearchAPI.site](https://searchapi.site). 

**Author:** Claude

- [Glama](https://glama.ai/mcp/servers/@mrgoonie/searchapi-mcp-server)
- [Github](https://github.com/mrgoonie/searchapi-mcp-server)
- [NPM](https://www.npmjs.com/package/searchapi-mcp-server)

<a href="https://glama.ai/mcp/servers/@mrgoonie/searchapi-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@mrgoonie/searchapi-mcp-server/badge" alt="SearchAPI Server MCP server" />
</a>

### Available platforms
- [x] Google - Web Search
- [x] Google - Image Search
- [x] Google - YouTube Search
- [ ] Google - Maps Search
- [x] Bing - Web Search
- [ ] Bing - Image Search
- [ ] Reddit
- [ ] X/Twitter
- [ ] Facebook Search
- [ ] Facebook Group Search
- [ ] Instagram
- [ ] TikTok

## SearchAPI.site

- [Website](https://searchapi.site)
- [API Docs](https://searchapi.site/api-docs)
- [Swagger UI Config](https://searchapi.site/api-docs/swagger-ui-init.js)
- Create Search API key [here](https://searchapi.site/profile)
- [GitHub](https://github.com/mrgoonie/searchapi)

## Supported Transports

- [x] ["stdio"](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#stdio) transport - Default transport for CLI usage
- [x] ["Streamable HTTP"](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport - For web-based clients
  - [ ] Implement auth ("Authorization" headers with `Bearer <token>`)
- [x] ~~"sse" transport~~ **[(Deprecated)](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#backwards-compatibility)**
- [ ] Write tests

## How to use

### CLI

```bash
# Google search via CLI
npm run dev:cli -- search-google --query "your search query" --api-key "your-api-key"

# Google image search via CLI
npm run dev:cli -- search-google-images --query "your search query" --api-key "your-api-key"

# YouTube search via CLI
npm run dev:cli -- search-youtube --query "your search query" --api-key "your-api-key" --max-results 5
```

### MCP Setup

**For local configuration with stdio transport:**
```json
{
  "mcpServers": {
    "searchapi": {
      "command": "node",
      "args": ["/path/to/searchapi-mcp-server/dist/index.js"],
      "transportType": "stdio"
    }
  }
}
```

**For remote HTTP configuration:**
```json
{
  "mcpServers": {
    "searchapi": {
      "type": "http",
      "url": "http://mcp.searchapi.site/mcp"
    }
  }
}
```

**Environment Variables for HTTP Transport:**

You can configure the HTTP server using these environment variables:

- `MCP_HTTP_HOST`: The host to bind to (default: `127.0.0.1`)
- `MCP_HTTP_PORT`: The port to listen on (default: `8080`)
- `MCP_HTTP_PATH`: The endpoint path (default: `/mcp`)

---

# Source Code Overview

## What is MCP?

Model Context Protocol (MCP) is an open standard that allows AI systems to securely and contextually connect with external tools and data sources.

This boilerplate implements the MCP specification with a clean, layered architecture that can be extended to build custom MCP servers for any API or data source.

## Why Use This Boilerplate?

- **Production-Ready Architecture**: Follows the same pattern used in published MCP servers, with clear separation between CLI, tools, controllers, and services.

- **Type Safety**: Built with TypeScript for improved developer experience, code quality, and maintainability.

- **Working Example**: Includes a fully implemented IP lookup tool demonstrating the complete pattern from CLI to API integration.

- **Testing Framework**: Comes with testing infrastructure for both unit and CLI integration tests, including coverage reporting.

- **Development Tooling**: Includes ESLint, Prettier, TypeScript, and other quality tools preconfigured for MCP server development.

---

# Getting Started

## Prerequisites

- **Node.js** (>=18.x): [Download](https://nodejs.org/)
- **Git**: For version control

---

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/mrgoonie/searchapi-mcp-server.git
cd searchapi-mcp-server

# Install dependencies
npm install
```

---

## Step 2: Run Development Server

Start the server in development mode with stdio transport (default):

```bash
npm run dev:server
```

Or with the Streamable HTTP transport:

```bash
npm run dev:server:http
```

This starts the MCP server with hot-reloading and enables the MCP Inspector at http://localhost:5173.

⚙️ Proxy server listening on port 6277
🔍 MCP Inspector is up and running at http://127.0.0.1:6274

When using HTTP transport, the server will be available at http://127.0.0.1:8080/mcp by default.

---

## Step 3: Test the Example Tool

Run the example IP lookup tool from the CLI:

```bash
# Using CLI in development mode
npm run dev:cli -- search-google --query "your search query" --api-key "your-api-key"

# Or with a specific IP
npm run dev:cli -- search-google --query "your search query" --api-key "your-api-key" --limit 10 --offset 0 --sort "date:d" --from_date "2023-01-01" --to_date "2023-12-31"
```

---

# Architecture

This boilerplate follows a clean, layered architecture pattern that separates concerns and promotes maintainability.

## Project Structure

```
src/
├── cli/              # Command-line interfaces
├── controllers/      # Business logic
├── resources/        # MCP resources: expose data and content from your servers to LLMs
├── services/         # External API interactions
├── tools/            # MCP tool definitions
├── types/            # Type definitions
├── utils/            # Shared utilities
└── index.ts          # Entry point
```

## Layers and Responsibilities

### CLI Layer (`src/cli/*.cli.ts`)

- **Purpose**: Define command-line interfaces that parse arguments and call controllers
- **Naming**: Files should be named `<feature>.cli.ts`
- **Testing**: CLI integration tests in `<feature>.cli.test.ts`

### Tools Layer (`src/tools/*.tool.ts`)

- **Purpose**: Define MCP tools with schemas and descriptions for AI assistants
- **Naming**: Files should be named `<feature>.tool.ts` with types in `<feature>.types.ts`
- **Pattern**: Each tool should use zod for argument validation

### Controllers Layer (`src/controllers/*.controller.ts`)

- **Purpose**: Implement business logic, handle errors, and format responses
- **Naming**: Files should be named `<feature>.controller.ts`
- **Pattern**: Should return standardized `ControllerResponse` objects

### Services Layer (`src/services/*.service.ts`)

- **Purpose**: Interact with external APIs or data sources
- **Naming**: Files should be named `<feature>.service.ts`
- **Pattern**: Pure API interactions with minimal logic

### Utils Layer (`src/utils/*.util.ts`)

- **Purpose**: Provide shared functionality across the application
- **Key Utils**:
    - `logger.util.ts`: Structured logging
    - `error.util.ts`: Error handling and standardization
    - `formatter.util.ts`: Markdown formatting helpers

---

# Development Guide

## Development Scripts

```bash
# Start server in development mode (hot-reload & inspector)
npm run dev:server

# Run CLI in development mode
npm run dev:cli -- [command] [args]

# Build the project
npm run build

# Start server in production mode
npm run start:server

# Run CLI in production mode
npm run start:cli -- [command] [args]
```

## Testing

```bash
# Run all tests
npm test

# Run specific tests
npm test -- src/path/to/test.ts

# Generate test coverage report
npm run test:coverage
```

##  evals

The evals package loads an mcp client that then runs the index.ts file, so there is no need to rebuild between tests. You can load environment variables by prefixing the npx command. Full documentation can be found [here](https://www.mcpevals.io/docs).

```bash
OPENAI_API_KEY=your-key  npx mcp-eval src/evals/evals.ts src/tools/searchapi.tool.ts
```

## Code Quality

```bash
# Lint code
npm run lint

# Format code with Prettier
npm run format

# Check types
npm run typecheck
```

---

# Building Custom Tools

Follow these steps to add your own tools to the server:

## 1. Define Service Layer

Create a new service in `src/services/` to interact with your external API:

```typescript
// src/services/example.service.ts
import { Logger } from '../utils/logger.util.js';

const logger = Logger.forContext('services/example.service.ts');

export async function getData(param: string): Promise<any> {
	logger.debug('Getting data', { param });
	// API interaction code here
	return { result: 'example data' };
}
```

## 2. Create Controller

Add a controller in `src/controllers/` to handle business logic:

```typescript
// src/controllers/example.controller.ts
import { Logger } from '../utils/logger.util.js';
import * as exampleService from '../services/example.service.js';
import { formatMarkdown } from '../utils/formatter.util.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import { ControllerResponse } from '../types/common.types.js';

const logger = Logger.forContext('controllers/example.controller.ts');

export interface GetDataOptions {
	param?: string;
}

export async function getData(
	options: GetDataOptions = {},
): Promise<ControllerResponse> {
	try {
		logger.debug('Getting data with options', options);

		const data = await exampleService.getData(options.param || 'default');

		const content = formatMarkdown(data);

		return { content };
	} catch (error) {
		throw handleControllerError(error, {
			entityType: 'ExampleData',
			operation: 'getData',
			source: 'controllers/example.controller.ts',
		});
	}
}
```

## 3. Implement MCP Tool

Create a tool definition in `src/tools/`:

```typescript
// src/tools/example.tool.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Logger } from '../utils/logger.util.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import * as exampleController from '../controllers/example.controller.js';

const logger = Logger.forContext('tools/example.tool.ts');

const GetDataArgs = z.object({
	param: z.string().optional().describe('Optional parameter'),
});

type GetDataArgsType = z.infer<typeof GetDataArgs>;

async function handleGetData(args: GetDataArgsType) {
	try {
		logger.debug('Tool get_data called', args);

		const result = await exampleController.getData({
			param: args.param,
		});

		return {
			content: [{ type: 'text' as const, text: result.content }],
		};
	} catch (error) {
		logger.error('Tool get_data failed', error);
		return formatErrorForMcpTool(error);
	}
}

export function register(server: McpServer) {
	server.tool(
		'get_data',
		`Gets data from the example API, optionally using \`param\`.
Use this to fetch example data. Returns formatted data as Markdown.`,
		GetDataArgs.shape,
		handleGetData,
	);
}
```

## 4. Add CLI Support

Create a CLI command in `src/cli/`:

```typescript
// src/cli/example.cli.ts
import { program } from 'commander';
import { Logger } from '../utils/logger.util.js';
import * as exampleController from '../controllers/example.controller.js';
import { handleCliError } from '../utils/error-handler.util.js';

const logger = Logger.forContext('cli/example.cli.ts');

program
	.command('get-data')
	.description('Get example data')
	.option('--param <value>', 'Optional parameter')
	.action(async (options) => {
		try {
			logger.debug('CLI get-data called', options);

			const result = await exampleController.getData({
				param: options.param,
			});

			console.log(result.content);
		} catch (error) {
			handleCliError(error);
		}
	});
```

## 5. Register Components

Update the entry points to register your new components:

```typescript
// In src/cli/index.ts
import '../cli/example.cli.js';

// In src/index.ts (for the tool)
import exampleTool from './tools/example.tool.js';
// Then in registerTools function:
exampleTool.register(server);
```

---

# Debugging Tools

## MCP Inspector

Access the visual MCP Inspector to test your tools and view request/response details:

1. Run `npm run dev:server`
2. Open http://localhost:5173 in your browser
3. Test your tools and view logs directly in the UI

## Server Logs

Enable debug logs for development:

```bash
# Set environment variable
DEBUG=true npm run dev:server

# Or configure in ~/.mcp/configs.json
```

---

# Publishing Your MCP Server

When ready to publish your custom MCP server:

1. Update package.json with your details
2. Update README.md with your tool documentation
3. Build the project: `npm run build`
4. Test the production build: `npm run start:server`
5. Publish to npm: `npm publish`

---

# License

[ISC License](https://opensource.org/licenses/ISC)

```json
{
	"searchapi": {
		"environments": {
			"DEBUG": "true",
			"SEARCHAPI_API_KEY": "value"
		}
	}
}
```

**Note:** For backward compatibility, the server will also recognize configurations under the full package name (`searchapi-mcp-server`) or the unscoped package name (`searchapi-mcp-server`) if the `searchapi` key is not found. However, using the short `searchapi` key is recommended for new configurations.

## Co-Authors

- Claude Code (Claude AI Assistant)
- Goon