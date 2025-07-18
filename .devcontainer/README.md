# Development Container

This directory contains the devcontainer configuration for the Gaming Leaderboard project.

## What's Included

The devcontainer provides:

- **Node.js 18**: Required for the project (minimum Node.js 14.0.0 as specified in package.json)
- **Python 3.11**: Used for the development server (`python3 -m http.server 8000`)
- **VS Code Extensions**:
  - JavaScript language support
  - HTML and CSS support
  - Python support
  - Prettier code formatter
  - Live Server extension
  - Tailwind CSS IntelliSense

## Getting Started

1. Open the project in VS Code
2. When prompted, click "Reopen in Container" or use Command Palette: "Dev Containers: Reopen in Container"
3. The container will build and install dependencies automatically
4. Run the development server: `npm start` or `npm run dev`
5. The application will be available at `http://localhost:8000`

## Development Server

The project uses Python's built-in HTTP server for development:

```bash
npm start       # Starts python3 -m http.server 8000
npm run serve   # Alternative command
npm run dev     # Alternative command
```

## Port Forwarding

Port 8000 is automatically forwarded and labeled as "Development Server" in VS Code.

## Dependencies

Since this is a vanilla JavaScript project with no build process, the only dependencies are:
- Python 3 (for the HTTP server)
- Node.js (for package management, if needed in the future)

The `npm install` command runs automatically after container creation, though currently there are no dependencies to install.