#!/usr/bin/env node
import { runStdioServer } from "./lib/mcp-server";

runStdioServer().catch((error) => {
  console.error("Fatal error in MCP server:", error);
  process.exit(1);
});
