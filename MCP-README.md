# Insurance API MCP Server

This Next.js application now includes a Model Context Protocol (MCP) server that exposes all insurance API endpoints as MCP tools.

## What's Included

The MCP server provides 14 tools mapped directly to the API endpoints:

### Policy Tools
- `listPolicies` - List all insurance policies
- `getPolicyById` - Get a specific policy by ID
- `createPolicy` - Create a new insurance policy
- `updatePolicy` - Update an existing policy
- `deletePolicy` - Delete a policy

### Claim Tools
- `listClaims` - List all insurance claims
- `getClaimById` - Get a specific claim by ID
- `createClaim` - Create a new insurance claim
- `updateClaim` - Update an existing claim
- `deleteClaim` - Delete a claim
- `approveClaim` - Approve a pending claim
- `rejectClaim` - Reject a pending claim

### Risk Assessment Tools
- `createRiskAssessment` - Create a new risk assessment
- `getRiskAssessmentByPolicyId` - Get risk assessment for a policy

## Deployment

### Vercel (Production)

The MCP server is already configured for Vercel deployment using HTTP/JSON-RPC:

1. Deploy to Vercel as usual:
   ```bash
   vercel deploy
   ```

2. The MCP server will be available at:
   - MCP endpoint: `https://your-domain.vercel.app/mcp`

3. Configure your MCP client to use HTTP transport.

   **For Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):
   ```json
   {
     "mcpServers": {
       "insurance-api": {
         "url": "https://your-domain.vercel.app/mcp"
       }
     }
   }
   ```

   **For other MCP clients**, you may need to specify the transport explicitly:
   ```json
   {
     "mcpServers": {
       "insurance-api": {
         "url": "https://your-domain.vercel.app/mcp",
         "transport": "http"
       }
     }
   }
   ```

The server accepts JSON-RPC 2.0 requests via POST and responds with JSON-RPC 2.0 responses.

### Local Development (Stdio)

For local testing with stdio transport:

1. Start the Next.js dev server:
   ```bash
   pnpm dev
   ```

2. In a separate terminal, run the MCP server:
   ```bash
   pnpm run mcp
   ```

3. Configure your MCP client for stdio:
   ```json
   {
     "mcpServers": {
       "insurance-api": {
         "command": "pnpm",
         "args": ["run", "mcp"],
         "cwd": "/path/to/insurance-api-demo"
       }
     }
   }
   ```

## Environment Variables

Set these environment variables for the MCP server:

- `NEXT_PUBLIC_BASE_URL` - Base URL for API requests (default: http://localhost:3000)
- `API_KEY` - API key for authentication (default: demo-key-12345)

## Architecture

The implementation consists of:

1. **[app/mcp/route.ts](app/mcp/route.ts)** - Main MCP endpoint
   - Handles JSON-RPC 2.0 requests (POST)
   - Uses existing Zod schemas from `lib/schemas.ts`
   - Converts Zod schemas to JSON schemas for MCP tool definitions
   - Makes HTTP requests to the Next.js API routes
   - GET endpoint provides server info/health check

2. **[lib/mcp-server.ts](lib/mcp-server.ts)** - Stdio server (optional)
   - Alternative stdio transport for local development

3. **[mcp-server.ts](mcp-server.ts)** - Stdio entry point (optional)
   - Command-line interface for stdio transport

## Example Usage

### Via MCP Client

Once connected to an MCP client (like Claude Desktop), you can use commands like:

```
"List all active insurance policies"
"Create a new auto insurance policy for John Doe"
"Get the details of policy POL-001"
"Approve claim CLM-12345"
"Create a risk assessment for policy POL-001"
```

### Via Direct HTTP

You can also test the MCP server directly with curl:

```bash
# Quick test script
./test-mcp.sh

# Or manually:
# 1. Health check
curl http://localhost:3000/mcp

# 2. Initialize
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0"}}}'

# 3. List tools
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}'

# 4. Call a tool
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "listPolicies", "arguments": {}}}'
```

The MCP tools will handle the API calls and return formatted results.

## Troubleshooting

### Claude Desktop doesn't see tools

1. **Check the server is accessible**: Visit `https://your-domain.vercel.app/mcp` in a browser - you should see server info
2. **Verify the config file location**: On macOS it's `~/Library/Application Support/Claude/claude_desktop_config.json`
3. **Check the logs**: Look at Claude Desktop's logs for connection errors
4. **Test the protocol**: Run `./test-mcp.sh` while your server is running to verify all protocol methods work
5. **Restart Claude Desktop**: After changing the config file, restart the app completely

### Common issues

- **"No tools available"**: The server might not be returning tools in the expected format. Check that `tools/list` returns an array of tools with `name`, `description`, and `inputSchema` fields.
- **Connection errors**: Make sure your server URL is publicly accessible (for deployed version) or use `http://localhost:3000/mcp` for local testing
- **CORS issues**: The Next.js API route should handle CORS automatically, but if you get CORS errors, you may need to add CORS headers
