import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  CreatePolicySchema,
  UpdatePolicySchema,
  CreateClaimSchema,
  UpdateClaimSchema,
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

// Create the MCP handler
const handler = createMcpHandler(
  async (server) => {
    // Policy operations
    server.tool(
      "listPolicies",
      "List all insurance policies in the system",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/policies"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getPolicyById",
      "Get a specific insurance policy by ID",
      {
        id: z.string().describe("The policy ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/policies/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createPolicy",
      "Create a new insurance policy",
      CreatePolicySchema.shape,
      async (args) => ({
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
      })
    );

    server.tool(
      "updatePolicy",
      "Update an existing insurance policy",
      {
        id: z.string().describe("The policy ID"),
        ...UpdatePolicySchema.shape,
      },
      async ({ id, ...updates }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/policies/${id}`, {
                method: "PUT",
                body: JSON.stringify(updates),
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "deletePolicy",
      "Delete an insurance policy",
      {
        id: z.string().describe("The policy ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/policies/${id}`, {
                method: "DELETE",
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    // Claim operations
    server.tool(
      "listClaims",
      "List all insurance claims in the system",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/claims"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getClaimById",
      "Get a specific insurance claim by ID",
      {
        id: z.string().describe("The claim ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/claims/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createClaim",
      "Create a new insurance claim",
      CreateClaimSchema.shape,
      async (args) => ({
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
      })
    );

    server.tool(
      "updateClaim",
      "Update an existing insurance claim",
      {
        id: z.string().describe("The claim ID"),
        ...UpdateClaimSchema.shape,
      },
      async ({ id, ...updates }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/claims/${id}`, {
                method: "PUT",
                body: JSON.stringify(updates),
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "deleteClaim",
      "Delete an insurance claim",
      {
        id: z.string().describe("The claim ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/claims/${id}`, {
                method: "DELETE",
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "approveClaim",
      "Approve a pending insurance claim",
      {
        id: z.string().describe("The claim ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/claims/${id}/approve`, {
                method: "POST",
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "rejectClaim",
      "Reject a pending insurance claim",
      {
        id: z.string().describe("The claim ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/claims/${id}/reject`, {
                method: "POST",
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    // Risk assessment operations
    server.tool(
      "createRiskAssessment",
      "Create a new risk assessment for a policy",
      CreateRiskAssessmentSchema.shape,
      async (args) => ({
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
      })
    );

    server.tool(
      "getRiskAssessmentByPolicyId",
      "Get risk assessment for a specific policy",
      {
        policyId: z.string().describe("The policy ID"),
      },
      async ({ policyId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/risk-assessment/${policyId}`),
              null,
              2
            ),
          },
        ],
      })
    );
  },
  {
    capabilities: {
      tools: {},
    },
  },
  {
    basePath: "/mcp",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
