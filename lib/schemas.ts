import { z } from "zod"

// Policy Schema
export const PolicySchema = z.object({
  id: z.string(),
  policyNumber: z.string(),
  policyType: z.enum(["auto", "home", "life", "health"]),
  holderName: z.string(),
  holderEmail: z.string().email(),
  premium: z.number().positive(),
  coverageAmount: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(["active", "expired", "cancelled"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreatePolicySchema = PolicySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdatePolicySchema = PolicySchema.partial().omit({
  id: true,
  createdAt: true,
})

// Claim Schema
export const ClaimSchema = z.object({
  id: z.string(),
  claimNumber: z.string(),
  policyId: z.string(),
  claimType: z.enum(["accident", "theft", "damage", "medical", "other"]),
  description: z.string(),
  claimAmount: z.number().positive(),
  status: z.enum(["pending", "approved", "rejected", "processing"]),
  filedDate: z.string().datetime(),
  processedDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreateClaimSchema = ClaimSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  processedDate: true,
})

export const UpdateClaimSchema = ClaimSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Risk Assessment Schema
export const RiskAssessmentSchema = z.object({
  id: z.string(),
  policyId: z.string(),
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  factors: z.array(z.string()),
  assessmentDate: z.string().datetime(),
  assessedBy: z.string(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
})

export const CreateRiskAssessmentSchema = RiskAssessmentSchema.omit({
  id: true,
  createdAt: true,
})

// API Response Schemas
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
})

export const SuccessResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
})

// Types
export type Policy = z.infer<typeof PolicySchema>
export type CreatePolicy = z.infer<typeof CreatePolicySchema>
export type UpdatePolicy = z.infer<typeof UpdatePolicySchema>
export type Claim = z.infer<typeof ClaimSchema>
export type CreateClaim = z.infer<typeof CreateClaimSchema>
export type UpdateClaim = z.infer<typeof UpdateClaimSchema>
export type RiskAssessment = z.infer<typeof RiskAssessmentSchema>
export type CreateRiskAssessment = z.infer<typeof CreateRiskAssessmentSchema>
