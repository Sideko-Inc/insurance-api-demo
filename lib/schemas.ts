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
  updatedAt: z.string().datetime().optional(),
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
  updatedAt: z.string().datetime().optional(),
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
  updatedAt: z.string().datetime().optional(),
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

// Quote Schema
export const QuoteSchema = z.object({
  id: z.string(),
  policyType: z.enum(["auto", "home", "life", "health"]),
  coverageAmount: z.number().positive(),
  premium: z.number().positive(),
  validUntil: z.string().datetime(),
  status: z.enum(["draft", "pending", "approved", "rejected", "converted"]),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateQuoteSchema = QuoteSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  premium: true,
  validUntil: true,
})

export const UpdateQuoteSchema = QuoteSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Payment Schema
export const PaymentSchema = z.object({
  id: z.string(),
  policyId: z.string(),
  amount: z.number().positive(),
  paymentDate: z.string().datetime(),
  paymentMethod: z.enum(["credit_card", "debit_card", "bank_transfer", "check", "cash"]),
  status: z.enum(["pending", "completed", "failed", "refunded"]),
  transactionId: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
})

export const CreatePaymentSchema = PaymentSchema.omit({
  id: true,
  createdAt: true,
  paymentDate: true,
  status: true,
  transactionId: true,
})

export const UpdatePaymentSchema = PaymentSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Document Schema
export const DocumentSchema = z.object({
  id: z.string(),
  entityType: z.enum(["policy", "claim", "customer"]),
  entityId: z.string(),
  documentType: z.enum(["policy_document", "claim_form", "certificate", "photo", "other"]),
  fileName: z.string(),
  fileUrl: z.string(),
  uploadedAt: z.string().datetime(),
  uploadedBy: z.string().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateDocumentSchema = DocumentSchema.omit({
  id: true,
  uploadedAt: true,
  uploadedBy: true,
})

export const UpdateDocumentSchema = DocumentSchema.partial().omit({
  id: true,
  uploadedAt: true,
})

// Renewal Schema
export const RenewalSchema = z.object({
  id: z.string(),
  policyId: z.string(),
  renewalDate: z.string().datetime(),
  newPremium: z.number().positive(),
  newCoverageAmount: z.number().positive().optional(),
  status: z.enum(["pending", "approved", "rejected", "completed"]),
  notificationSent: z.boolean().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateRenewalSchema = RenewalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  notificationSent: true,
})

export const UpdateRenewalSchema = RenewalSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Customer Schema
export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
})

export const CustomerSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  dateOfBirth: z.string().optional(),
  address: AddressSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateCustomerSchema = CustomerSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Agent Schema
export const AgentSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  licenseNumber: z.string(),
  status: z.enum(["active", "inactive", "suspended"]),
  commissionRate: z.number().min(0).max(100).optional(),
  territory: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateAgentSchema = AgentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
})

export const UpdateAgentSchema = AgentSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Beneficiary Schema
export const BeneficiarySchema = z.object({
  id: z.string(),
  policyId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.enum(["spouse", "child", "parent", "sibling", "other"]),
  percentage: z.number().min(0).max(100),
  dateOfBirth: z.string().optional(),
  contactInfo: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateBeneficiarySchema = BeneficiarySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateBeneficiarySchema = BeneficiarySchema.partial().omit({
  id: true,
  createdAt: true,
})

// Fraud Detection Schema
export const FraudAnalysisRequestSchema = z.object({
  claimId: z.string(),
})

export const FraudAnalysisSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  riskScore: z.number().min(0).max(100),
  fraudIndicators: z.array(z.string()),
  recommendation: z.enum(["approve", "review", "reject"]),
  notes: z.string().optional(),
  analyzedAt: z.string().datetime(),
})

// Endorsement Schema
export const EndorsementSchema = z.object({
  id: z.string(),
  policyId: z.string(),
  endorsementType: z.enum(["coverage_change", "rider_addition", "beneficiary_change", "other"]),
  description: z.string().optional(),
  effectiveDate: z.string().datetime(),
  premiumChange: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateEndorsementSchema = EndorsementSchema.omit({
  id: true,
  createdAt: true,
})

export const UpdateEndorsementSchema = EndorsementSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Reinsurance Schema
export const ReinsuranceSchema = z.object({
  id: z.string(),
  treatyName: z.string(),
  reinsurerName: z.string(),
  coverageAmount: z.number().positive(),
  premium: z.number().positive(),
  effectiveDate: z.string().datetime(),
  expiryDate: z.string().datetime(),
  status: z.enum(["active", "expired", "cancelled"]).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateReinsuranceSchema = ReinsuranceSchema.omit({
  id: true,
  createdAt: true,
  status: true,
})

export const UpdateReinsuranceSchema = ReinsuranceSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Audit Log Schema
export const AuditLogSchema = z.object({
  id: z.string(),
  entityType: z.enum(["policy", "claim", "payment", "customer", "agent"]),
  entityId: z.string(),
  action: z.enum(["create", "update", "delete", "approve", "reject"]),
  performedBy: z.string(),
  changes: z.any().optional(),
  timestamp: z.string().datetime(),
})

// Analytics Schemas
export const ClaimsSummarySchema = z.object({
  totalClaims: z.number().int(),
  approvedClaims: z.number().int(),
  rejectedClaims: z.number().int(),
  pendingClaims: z.number().int(),
  totalClaimAmount: z.number(),
  averageClaimAmount: z.number(),
})

export const PoliciesSummarySchema = z.object({
  totalPolicies: z.number().int(),
  activePolicies: z.number().int(),
  expiredPolicies: z.number().int(),
  cancelledPolicies: z.number().int(),
  totalPremiumRevenue: z.number(),
  averagePremium: z.number().optional(),
})

export const LossRatioSchema = z.object({
  lossRatio: z.number(),
  totalClaims: z.number(),
  totalPremiums: z.number(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
})

// Notification Schema
export const NotificationSchema = z.object({
  id: z.string(),
  recipientEmail: z.string().email(),
  recipientPhone: z.string().optional(),
  type: z.enum(["email", "sms", "both"]),
  subject: z.string(),
  message: z.string(),
  status: z.enum(["pending", "sent", "failed"]),
  sentAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateNotificationSchema = NotificationSchema.omit({
  id: true,
  createdAt: true,
  status: true,
  sentAt: true,
})

// Telematics Schema
export const TelematicsDataSchema = z.object({
  id: z.string(),
  policyId: z.string(),
  recordDate: z.string().datetime(),
  mileage: z.number().positive(),
  speed: z.number().optional(),
  hardBraking: z.number().int().optional(),
  hardAcceleration: z.number().int().optional(),
  nightDriving: z.number().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateTelematicsDataSchema = TelematicsDataSchema.omit({
  id: true,
  createdAt: true,
})

// Inspection Schema
export const InspectionSchema = z.object({
  id: z.string(),
  policyId: z.string(),
  inspectionType: z.enum(["property", "vehicle", "initial", "renewal"]),
  scheduledDate: z.string().datetime(),
  completedDate: z.string().datetime().optional(),
  inspector: z.string().optional(),
  findings: z.string().optional(),
  approved: z.boolean().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateInspectionSchema = InspectionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  completedDate: true,
  findings: true,
  approved: true,
})

export const UpdateInspectionSchema = InspectionSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Subrogation Schema
export const SubrogationSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  thirdParty: z.string(),
  amountSought: z.number().positive(),
  amountRecovered: z.number().optional(),
  status: z.enum(["initiated", "in_progress", "settled", "closed"]),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateSubrogationSchema = SubrogationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  amountRecovered: true,
})

export const UpdateSubrogationSchema = SubrogationSchema.partial().omit({
  id: true,
  createdAt: true,
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
export type Quote = z.infer<typeof QuoteSchema>
export type CreateQuote = z.infer<typeof CreateQuoteSchema>
export type UpdateQuote = z.infer<typeof UpdateQuoteSchema>
export type Payment = z.infer<typeof PaymentSchema>
export type CreatePayment = z.infer<typeof CreatePaymentSchema>
export type UpdatePayment = z.infer<typeof UpdatePaymentSchema>
export type Document = z.infer<typeof DocumentSchema>
export type CreateDocument = z.infer<typeof CreateDocumentSchema>
export type UpdateDocument = z.infer<typeof UpdateDocumentSchema>
export type Renewal = z.infer<typeof RenewalSchema>
export type CreateRenewal = z.infer<typeof CreateRenewalSchema>
export type UpdateRenewal = z.infer<typeof UpdateRenewalSchema>
export type Customer = z.infer<typeof CustomerSchema>
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>
export type Agent = z.infer<typeof AgentSchema>
export type CreateAgent = z.infer<typeof CreateAgentSchema>
export type UpdateAgent = z.infer<typeof UpdateAgentSchema>
export type Beneficiary = z.infer<typeof BeneficiarySchema>
export type CreateBeneficiary = z.infer<typeof CreateBeneficiarySchema>
export type UpdateBeneficiary = z.infer<typeof UpdateBeneficiarySchema>
export type FraudAnalysis = z.infer<typeof FraudAnalysisSchema>
export type FraudAnalysisRequest = z.infer<typeof FraudAnalysisRequestSchema>
export type Endorsement = z.infer<typeof EndorsementSchema>
export type CreateEndorsement = z.infer<typeof CreateEndorsementSchema>
export type UpdateEndorsement = z.infer<typeof UpdateEndorsementSchema>
export type Reinsurance = z.infer<typeof ReinsuranceSchema>
export type CreateReinsurance = z.infer<typeof CreateReinsuranceSchema>
export type UpdateReinsurance = z.infer<typeof UpdateReinsuranceSchema>
export type AuditLog = z.infer<typeof AuditLogSchema>
export type ClaimsSummary = z.infer<typeof ClaimsSummarySchema>
export type PoliciesSummary = z.infer<typeof PoliciesSummarySchema>
export type LossRatio = z.infer<typeof LossRatioSchema>
export type Notification = z.infer<typeof NotificationSchema>
export type CreateNotification = z.infer<typeof CreateNotificationSchema>
export type TelematicsData = z.infer<typeof TelematicsDataSchema>
export type CreateTelematicsData = z.infer<typeof CreateTelematicsDataSchema>
export type Inspection = z.infer<typeof InspectionSchema>
export type CreateInspection = z.infer<typeof CreateInspectionSchema>
export type UpdateInspection = z.infer<typeof UpdateInspectionSchema>
export type Subrogation = z.infer<typeof SubrogationSchema>
export type CreateSubrogation = z.infer<typeof CreateSubrogationSchema>
export type UpdateSubrogation = z.infer<typeof UpdateSubrogationSchema>
