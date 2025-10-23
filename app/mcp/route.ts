import type { NextRequest } from "next/server";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  PolicySchema,
  CreatePolicySchema,
  UpdatePolicySchema,
  ClaimSchema,
  CreateClaimSchema,
  UpdateClaimSchema,
  RiskAssessmentSchema,
  CreateRiskAssessmentSchema,
} from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const apiKey = process.env.API_KEY || "demo-key-12345";

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || error.message || `API request failed: ${response.status}`);
  }

  return response.json();
}

// Define all MCP tools
const tools: Tool[] = [
  {
    name: "listPolicies",
    description: "List all insurance policies in the system",
    inputSchema: zodToJsonSchema(PolicySchema.pick({}), "ListPoliciesInput") as any,
  },
  {
    name: "getPolicyById",
    description: "Get a specific insurance policy by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The policy ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "createPolicy",
    description: "Create a new insurance policy",
    inputSchema: zodToJsonSchema(CreatePolicySchema, "CreatePolicyInput") as any,
  },
  {
    name: "updatePolicy",
    description: "Update an existing insurance policy",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The policy ID" },
        updates: zodToJsonSchema(UpdatePolicySchema, "UpdatePolicyData") as any,
      },
      required: ["id", "updates"],
    },
  },
  {
    name: "deletePolicy",
    description: "Delete an insurance policy",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The policy ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "listClaims",
    description: "List all insurance claims in the system",
    inputSchema: zodToJsonSchema(ClaimSchema.pick({}), "ListClaimsInput") as any,
  },
  {
    name: "getClaimById",
    description: "Get a specific insurance claim by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The claim ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "createClaim",
    description: "Create a new insurance claim",
    inputSchema: zodToJsonSchema(CreateClaimSchema, "CreateClaimInput") as any,
  },
  {
    name: "updateClaim",
    description: "Update an existing insurance claim",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The claim ID" },
        updates: zodToJsonSchema(UpdateClaimSchema, "UpdateClaimData") as any,
      },
      required: ["id", "updates"],
    },
  },
  {
    name: "deleteClaim",
    description: "Delete an insurance claim",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The claim ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "approveClaim",
    description: "Approve a pending insurance claim",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The claim ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "rejectClaim",
    description: "Reject a pending insurance claim",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The claim ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "createRiskAssessment",
    description: "Create a new risk assessment for a policy",
    inputSchema: zodToJsonSchema(CreateRiskAssessmentSchema, "CreateRiskAssessmentInput") as any,
  },
  {
    name: "getRiskAssessmentByPolicyId",
    description: "Get risk assessment for a specific policy",
    inputSchema: {
      type: "object",
      properties: {
        policyId: { type: "string", description: "The policy ID" },
      },
      required: ["policyId"],
    },
  },
];

// Handle tool execution
async function handleToolCall(name: string, args: any) {
  try {
    switch (name) {
      case "listPolicies":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest("/api/policies"), null, 2) }] };

      case "getPolicyById":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest(`/api/policies/${args.id}`), null, 2) }] };

      case "createPolicy":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest("/api/policies", { method: "POST", body: JSON.stringify(args) }), null, 2) }] };

      case "updatePolicy":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest(`/api/policies/${args.id}`, { method: "PUT", body: JSON.stringify(args.updates) }), null, 2) }] };

      case "deletePolicy":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest(`/api/policies/${args.id}`, { method: "DELETE" }), null, 2) }] };

      case "listClaims":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest("/api/claims"), null, 2) }] };

      case "getClaimById":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest(`/api/claims/${args.id}`), null, 2) }] };

      case "createClaim":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest("/api/claims", { method: "POST", body: JSON.stringify(args) }), null, 2) }] };

      case "updateClaim":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest(`/api/claims/${args.id}`, { method: "PUT", body: JSON.stringify(args.updates) }), null, 2) }] };

      case "deleteClaim":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest(`/api/claims/${args.id}`, { method: "DELETE" }), null, 2) }] };

      case "approveClaim":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest(`/api/claims/${args.id}/approve`, { method: "POST" }), null, 2) }] };

      case "rejectClaim":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest(`/api/claims/${args.id}/reject`, { method: "POST" }), null, 2) }] };

      case "createRiskAssessment":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest("/api/risk-assessment", { method: "POST", body: JSON.stringify(args) }), null, 2) }] };

      case "getRiskAssessmentByPolicyId":
        return { content: [{ type: "text", text: JSON.stringify(await apiRequest(`/api/risk-assessment/${args.policyId}`), null, 2) }] };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
}

// Handle JSON-RPC over HTTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle initialize
    if (body.method === "initialize") {
      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "insurance-api-server",
            version: "1.0.0",
          },
        },
      });
    }

    // Handle notifications/initialized (no response needed for notifications)
    if (body.method === "notifications/initialized") {
      return new Response(null, { status: 204 });
    }

    // Handle ping
    if (body.method === "ping") {
      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {},
      });
    }

    // Handle tools/list
    if (body.method === "tools/list") {
      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools },
      });
    }

    // Handle tools/call
    if (body.method === "tools/call") {
      const { name, arguments: args } = body.params;
      const result = await handleToolCall(name, args || {});

      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result,
      });
    }

    // Unknown method - check if it's a notification (no id)
    if (!body.id) {
      // Notifications don't get a response
      console.log("Received notification:", body.method);
      return new Response(null, { status: 204 });
    }

    // Unknown method with id - return error
    return Response.json({
      jsonrpc: "2.0",
      id: body.id,
      error: {
        code: -32601,
        message: `Method not found: ${body.method}`,
      },
    });
  } catch (error) {
    console.error("MCP Error:", error);
    return Response.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : "Internal error",
        },
      },
      { status: 500 }
    );
  }
}

// Simple GET endpoint for health check and tool discovery
export async function GET(request: NextRequest) {
  return Response.json({
    name: "insurance-api-mcp-server",
    version: "1.0.0",
    description: "Insurance Management API MCP Server",
    status: "ready",
    capabilities: {
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    },
  });
}
