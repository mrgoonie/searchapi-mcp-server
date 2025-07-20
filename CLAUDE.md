# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

[Brief description of what this project does and its main purpose]

## Development Commands

### Setup and Running
```bash
# Install dependencies
npm install

# Development with hot reload
npm run dev

# Build project
npm run build

# Run production server
npm start
```

### Code Quality
```bash
# Format code
npm run format

# Run linter
npm run lint

# Run tests
npm test
```

## Architecture Overview

### Tech Stack
- [List your main technologies, frameworks, and libraries]

### Key Directories
- `src/` - Main source code
- `tests/` - Test files
- `docs/` - Documentation

## Code Style Guidelines

### Formatting Rules
- Use consistent indentation (2 or 4 spaces)
- Follow language-specific conventions
- Keep line length reasonable

### Import Organization
- External packages first
- Internal modules second
- Relative imports last

## Key Patterns and Conventions

### Error Handling
- Use try-catch blocks for async operations
- Log errors with appropriate context
- Return user-friendly error messages

### Testing
- Write unit tests for core functionality
- Include integration tests for critical paths
- Mock external dependencies appropriately

## Environment Variables

Required environment variables:
- `NODE_ENV` - Environment (development/production)
- [Add other required environment variables]

## Common Development Tasks

### Adding a New Feature
1. Create feature branch from main
2. Implement feature with tests
3. Update documentation if needed
4. Create pull request

### Deployment
- [Describe deployment process]
- [Include any special considerations]

## Important Notes

- [Add any project-specific guidelines]
- [Include coding standards]
- [Mention any gotchas or common issues]
