import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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
} from "./schemas";

// Helper to make API requests to our own Next.js API
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

// Define all MCP tools mapped to API endpoints
const tools: Tool[] = [
  // Policy Tools
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

  // Claim Tools
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

  // Risk Assessment Tools
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

// Create and configure the MCP server
export function createMCPServer() {
  const server = new Server(
    {
      name: "insurance-api-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        // Policy operations
        case "listPolicies":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(await apiRequest("/api/policies"), null, 2),
              },
            ],
          };

        case "getPolicyById":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest(`/api/policies/${args.id}`),
                  null,
                  2
                ),
              },
            ],
          };

        case "createPolicy":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest("/api/policies", {
                    method: "POST",
                    body: JSON.stringify(args),
                  }),
                  null,
                  2
                ),
              },
            ],
          };

        case "updatePolicy":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest(`/api/policies/${args.id}`, {
                    method: "PUT",
                    body: JSON.stringify(args.updates),
                  }),
                  null,
                  2
                ),
              },
            ],
          };

        case "deletePolicy":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest(`/api/policies/${args.id}`, {
                    method: "DELETE",
                  }),
                  null,
                  2
                ),
              },
            ],
          };

        // Claim operations
        case "listClaims":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(await apiRequest("/api/claims"), null, 2),
              },
            ],
          };

        case "getClaimById":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest(`/api/claims/${args.id}`),
                  null,
                  2
                ),
              },
            ],
          };

        case "createClaim":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest("/api/claims", {
                    method: "POST",
                    body: JSON.stringify(args),
                  }),
                  null,
                  2
                ),
              },
            ],
          };

        case "updateClaim":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest(`/api/claims/${args.id}`, {
                    method: "PUT",
                    body: JSON.stringify(args.updates),
                  }),
                  null,
                  2
                ),
              },
            ],
          };

        case "deleteClaim":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest(`/api/claims/${args.id}`, {
                    method: "DELETE",
                  }),
                  null,
                  2
                ),
              },
            ],
          };

        case "approveClaim":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest(`/api/claims/${args.id}/approve`, {
                    method: "POST",
                  }),
                  null,
                  2
                ),
              },
            ],
          };

        case "rejectClaim":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest(`/api/claims/${args.id}/reject`, {
                    method: "POST",
                  }),
                  null,
                  2
                ),
              },
            ],
          };

        // Risk Assessment operations
        case "createRiskAssessment":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest("/api/risk-assessment", {
                    method: "POST",
                    body: JSON.stringify(args),
                  }),
                  null,
                  2
                ),
              },
            ],
          };

        case "getRiskAssessmentByPolicyId":
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  await apiRequest(`/api/risk-assessment/${args.policyId}`),
                  null,
                  2
                ),
              },
            ],
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

// For stdio transport (local development/testing)
export async function runStdioServer() {
  const server = createMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
