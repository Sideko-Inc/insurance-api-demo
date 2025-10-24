import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  CreatePolicySchema,
  UpdatePolicySchema,
  CreateClaimSchema,
  UpdateClaimSchema,
  CreateRiskAssessmentSchema,
  CreateCustomerSchema,
  UpdateCustomerSchema,
  CreateQuoteSchema,
  UpdateQuoteSchema,
  CreatePaymentSchema,
  CreateAgentSchema,
  UpdateAgentSchema,
  CreateBeneficiarySchema,
  CreateDocumentSchema,
  CreateRenewalSchema,
  CreateEndorsementSchema,
  UpdateEndorsementSchema,
  CreateReinsuranceSchema,
  UpdateReinsuranceSchema,
  FraudAnalysisRequestSchema,
  CreateNotificationSchema,
  CreateTelematicsDataSchema,
  CreateInspectionSchema,
  CreateSubrogationSchema,
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
      "Accept": "application/json, text/event-stream",
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

    // Customer operations
    server.tool(
      "listCustomers",
      "List all customers in the system",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/customers"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getCustomerById",
      "Get a specific customer by ID",
      {
        id: z.string().describe("The customer ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/customers/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createCustomer",
      "Create a new customer",
      CreateCustomerSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/customers", {
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
      "updateCustomer",
      "Update an existing customer",
      {
        id: z.string().describe("The customer ID"),
        ...UpdateCustomerSchema.shape,
      },
      async ({ id, ...updates }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/customers/${id}`, {
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

    // Quote operations
    server.tool(
      "listQuotes",
      "List all insurance quotes",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/quotes"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getQuoteById",
      "Get a specific quote by ID",
      {
        id: z.string().describe("The quote ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/quotes/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createQuote",
      "Create a new insurance quote",
      CreateQuoteSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/quotes", {
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
      "updateQuote",
      "Update an existing quote",
      {
        id: z.string().describe("The quote ID"),
        ...UpdateQuoteSchema.shape,
      },
      async ({ id, ...updates }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/quotes/${id}`, {
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
      "convertQuoteToPolicy",
      "Convert an approved quote to a policy",
      {
        id: z.string().describe("The quote ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/quotes/${id}/convert`, {
                method: "POST",
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    // Payment operations
    server.tool(
      "listPayments",
      "List all payments",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/payments"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getPaymentById",
      "Get a specific payment by ID",
      {
        id: z.string().describe("The payment ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/payments/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createPayment",
      "Create a new payment",
      CreatePaymentSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/payments", {
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
      "getPaymentsByPolicy",
      "Get all payments for a specific policy",
      {
        policyId: z.string().describe("The policy ID"),
      },
      async ({ policyId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/payments/policy/${policyId}`),
              null,
              2
            ),
          },
        ],
      })
    );

    // Agent operations
    server.tool(
      "listAgents",
      "List all insurance agents",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/agents"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getAgentById",
      "Get a specific agent by ID",
      {
        id: z.string().describe("The agent ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/agents/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createAgent",
      "Create a new insurance agent",
      CreateAgentSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/agents", {
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
      "updateAgent",
      "Update an existing agent",
      {
        id: z.string().describe("The agent ID"),
        ...UpdateAgentSchema.shape,
      },
      async ({ id, ...updates }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/agents/${id}`, {
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

    // Beneficiary operations
    server.tool(
      "listBeneficiaries",
      "List all beneficiaries",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/beneficiaries"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getBeneficiaryById",
      "Get a specific beneficiary by ID",
      {
        id: z.string().describe("The beneficiary ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/beneficiaries/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createBeneficiary",
      "Create a new beneficiary for a policy",
      CreateBeneficiarySchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/beneficiaries", {
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
      "getBeneficiariesByPolicy",
      "Get all beneficiaries for a specific policy",
      {
        policyId: z.string().describe("The policy ID"),
      },
      async ({ policyId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/beneficiaries/policy/${policyId}`),
              null,
              2
            ),
          },
        ],
      })
    );

    // Document operations
    server.tool(
      "listDocuments",
      "List all documents",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/documents"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getDocumentById",
      "Get a specific document by ID",
      {
        id: z.string().describe("The document ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/documents/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createDocument",
      "Upload a new document",
      CreateDocumentSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/documents", {
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
      "getDocumentsByEntity",
      "Get all documents for a specific entity",
      {
        entityType: z.enum(["policy", "claim", "customer"]).describe("The entity type"),
        entityId: z.string().describe("The entity ID"),
      },
      async ({ entityType, entityId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/documents/entity/${entityType}/${entityId}`),
              null,
              2
            ),
          },
        ],
      })
    );

    // Renewal operations
    server.tool(
      "listRenewals",
      "List all policy renewals",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/renewals"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getRenewalById",
      "Get a specific renewal by ID",
      {
        id: z.string().describe("The renewal ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/renewals/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createRenewal",
      "Create a new policy renewal",
      CreateRenewalSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/renewals", {
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
      "approveRenewal",
      "Approve a policy renewal",
      {
        id: z.string().describe("The renewal ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/renewals/${id}/approve`, {
                method: "POST",
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    // Endorsement operations
    server.tool(
      "listEndorsements",
      "List all policy endorsements",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/endorsements"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getEndorsementById",
      "Get a specific endorsement by ID",
      {
        id: z.string().describe("The endorsement ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/endorsements/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createEndorsement",
      "Create a new policy endorsement",
      CreateEndorsementSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/endorsements", {
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
      "updateEndorsement",
      "Update an existing endorsement",
      {
        id: z.string().describe("The endorsement ID"),
        ...UpdateEndorsementSchema.shape,
      },
      async ({ id, ...updates }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/endorsements/${id}`, {
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
      "approveEndorsement",
      "Approve a policy endorsement",
      {
        id: z.string().describe("The endorsement ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/endorsements/${id}/approve`, {
                method: "POST",
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    // Reinsurance operations
    server.tool(
      "listReinsurance",
      "List all reinsurance contracts",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/reinsurance"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getReinsuranceById",
      "Get a specific reinsurance contract by ID",
      {
        id: z.string().describe("The reinsurance contract ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/reinsurance/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createReinsurance",
      "Create a new reinsurance contract",
      CreateReinsuranceSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/reinsurance", {
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
      "updateReinsurance",
      "Update an existing reinsurance contract",
      {
        id: z.string().describe("The reinsurance contract ID"),
        ...UpdateReinsuranceSchema.shape,
      },
      async ({ id, ...updates }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/reinsurance/${id}`, {
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

    // Fraud detection operations
    server.tool(
      "analyzeFraud",
      "Analyze a claim for potential fraud",
      FraudAnalysisRequestSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/fraud-detection/analyze", {
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
      "getFraudReports",
      "Get all fraud detection reports",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/fraud-detection/reports"),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "getFraudReportById",
      "Get a specific fraud report by ID",
      {
        id: z.string().describe("The fraud report ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/fraud-detection/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    // Analytics operations
    server.tool(
      "getClaimsSummary",
      "Get summary statistics for all claims",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/analytics/claims-summary"),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "getPoliciesSummary",
      "Get summary statistics for all policies",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/analytics/policies-summary"),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "getLossRatio",
      "Get loss ratio analytics",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/analytics/loss-ratio"),
              null,
              2
            ),
          },
        ],
      })
    );

    // Audit trail operations
    server.tool(
      "getAuditLogs",
      "Get all audit logs",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/audit-trail"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getAuditLogById",
      "Get a specific audit log by ID",
      {
        id: z.string().describe("The audit log ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/audit-trail/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "getAuditLogsByEntity",
      "Get audit logs for a specific entity",
      {
        entityType: z.enum(["policy", "claim", "payment", "customer", "agent"]).describe("The entity type"),
        entityId: z.string().describe("The entity ID"),
      },
      async ({ entityType, entityId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/audit-trail/entity/${entityType}/${entityId}`),
              null,
              2
            ),
          },
        ],
      })
    );

    // Notification operations
    server.tool(
      "listNotifications",
      "List all notifications",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/notifications"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getNotificationById",
      "Get a specific notification by ID",
      {
        id: z.string().describe("The notification ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/notifications/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "sendNotification",
      "Send a new notification",
      CreateNotificationSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/notifications", {
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

    // Telematics operations
    server.tool(
      "listTelematicsData",
      "List all telematics data",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/telematics"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "createTelematicsData",
      "Upload new telematics data",
      CreateTelematicsDataSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/telematics", {
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
      "getTelematicsByPolicy",
      "Get telematics data for a specific policy",
      {
        policyId: z.string().describe("The policy ID"),
      },
      async ({ policyId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/telematics/policy/${policyId}`),
              null,
              2
            ),
          },
        ],
      })
    );

    // Inspection operations
    server.tool(
      "listInspections",
      "List all inspections",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/inspections"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getInspectionById",
      "Get a specific inspection by ID",
      {
        id: z.string().describe("The inspection ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/inspections/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "scheduleInspection",
      "Schedule a new inspection",
      CreateInspectionSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/inspections", {
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
      "completeInspection",
      "Mark an inspection as completed",
      {
        id: z.string().describe("The inspection ID"),
        findings: z.string().describe("Inspection findings"),
        approved: z.boolean().describe("Whether the inspection was approved"),
      },
      async ({ id, findings, approved }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/inspections/${id}/complete`, {
                method: "POST",
                body: JSON.stringify({ findings, approved }),
              }),
              null,
              2
            ),
          },
        ],
      })
    );

    // Subrogation operations
    server.tool(
      "listSubrogation",
      "List all subrogation cases",
      {},
      async () => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(await apiRequest("/api/subrogation"), null, 2),
          },
        ],
      })
    );

    server.tool(
      "getSubrogationById",
      "Get a specific subrogation case by ID",
      {
        id: z.string().describe("The subrogation case ID"),
      },
      async ({ id }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/subrogation/${id}`),
              null,
              2
            ),
          },
        ],
      })
    );

    server.tool(
      "createSubrogation",
      "Create a new subrogation case",
      CreateSubrogationSchema.shape,
      async (args) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest("/api/subrogation", {
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
      "getSubrogationByClaim",
      "Get subrogation case for a specific claim",
      {
        claimId: z.string().describe("The claim ID"),
      },
      async ({ claimId }) => ({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              await apiRequest(`/api/subrogation/claim/${claimId}`),
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
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
