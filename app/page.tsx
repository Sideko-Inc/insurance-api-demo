"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, BrainCircuit, BarChart3, Users, MessageSquare, DollarSign, UserCheck, FileCheck, CalendarClock, AlertTriangle, TrendingUp, History, Bell, Car, ClipboardCheck, Scale, Building, Copy, Check } from "lucide-react"
import { useState } from "react"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-muted rounded transition-colors shrink-0"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

export default function HomePage() {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-balance">Mock Insurance API</h1>
          </div>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Live Insurance Management API
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="secondary">OpenAPI 3.1</Badge>
            <Badge variant="secondary">REST API</Badge>
          </div>
        </div>

        {/* API Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                OpenAPI Specification
              </CardTitle>
              <CardDescription>Access the complete API documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/openapi.yaml"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-muted p-3 rounded-md text-sm font-mono break-all hover:underline"
              >
                GET /openapi.yaml
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                MCP Server
              </CardTitle>
              <CardDescription>Model Context Protocol server with 106 tools</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-muted p-3 rounded-md text-sm font-mono break-all hover:underline"
              >
                GET /mcp
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Example Prompts */}
        <Card className="mb-12">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-4 w-4" />
              Example Prompts for LLMs
            </CardTitle>
            <CardDescription className="text-xs">
              Copy and paste these realistic insurance workflow prompts to test the MCP server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {/* New Business */}
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <Shield className="h-3 w-3 text-blue-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Onboard Sarah Johnson, 35, auto quote for 2022 Civic...</div>
                <CopyButton text="I need to onboard a new customer named Sarah Johnson, age 35, and create an auto insurance quote for her 2022 Honda Civic. Then assess the risk and convert it to a policy if the risk is acceptable." />
              </div>
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <Shield className="h-3 w-3 text-blue-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Life policy: 45yo male, $500K, spouse beneficiary...</div>
                <CopyButton text="Create a comprehensive life insurance policy for a 45-year-old male customer with $500,000 coverage, add his spouse as the primary beneficiary, and set up monthly premium payments." />
              </div>

              {/* Claims */}
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <FileText className="h-3 w-3 text-green-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Create CLM-2024-001234, fraud check, approve if safe...</div>
                <CopyButton text="A customer filed a claim for a car accident. Create claim CLM-2024-001234 for policy POL-12345, run fraud detection analysis on it, and approve it if the fraud score is low." />
              </div>
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <FileText className="h-3 w-3 text-green-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Water damage: create claim, schedule inspection...</div>
                <CopyButton text="Customer John Doe reported water damage to his home. Create the claim, schedule an inspection, upload the inspection photos as documents, and calculate the payout amount based on the policy coverage." />
              </div>

              {/* Policy Lifecycle */}
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <CalendarClock className="h-3 w-3 text-amber-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Policies expiring in 30 days, create renewals...</div>
                <CopyButton text="Show me all policies expiring in the next 30 days, create renewal quotes for each, and send notification emails to those customers." />
              </div>
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <CalendarClock className="h-3 w-3 text-amber-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Add collision to POL-45678, create endorsement...</div>
                <CopyButton text="A customer wants to add collision coverage to their existing auto policy POL-45678. Create an endorsement for the coverage change, recalculate the premium, and update the policy." />
              </div>

              {/* Analytics */}
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <TrendingUp className="h-3 w-3 text-emerald-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Business report: loss ratio, top 5 policy types...</div>
                <CopyButton text="Generate a comprehensive business report: show the loss ratio for this quarter, list the top 5 most profitable policy types, identify agents with the highest conversion rates, and flag any concerning fraud trends." />
              </div>
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <TrendingUp className="h-3 w-3 text-emerald-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Auto portfolio analysis: risk scores, telematics...</div>
                <CopyButton text="Analyze our auto insurance portfolio - show me the average risk score, claims frequency by vehicle type, and identify if we should adjust our underwriting criteria based on telematics data." />
              </div>

              {/* Complex Scenarios */}
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Hurricane in 33139: create claims, inspections...</div>
                <CopyButton text="Hurricane scenario: A major storm just hit - identify all homeowners policies in zip code 33139, create claims for customers who called in damage reports, prioritize inspections by claim amount, and prepare reinsurance reports for our catastrophe coverage." />
              </div>
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Investigate CLM-2024-005678: fraud, telematics...</div>
                <CopyButton text="Investigate claim CLM-2024-005678 - pull the claim details, check the customer's claim history, run fraud detection, review any related telematics data if it's an auto claim, and prepare a summary for the adjuster." />
              </div>

              {/* Financial */}
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <DollarSign className="h-3 w-3 text-green-600 shrink-0" />
                <div className="truncate flex-1 text-xs">Overdue payments report, send reminders...</div>
                <CopyButton text="Generate a report of all overdue payments for active policies, send reminder notifications to those customers, and flag policies that are 60+ days overdue for potential cancellation." />
              </div>
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <DollarSign className="h-3 w-3 text-green-600 shrink-0" />
                <div className="truncate flex-1 text-xs">Subrogation for CLM-2024-007890, recover costs...</div>
                <CopyButton text="A third-party is at fault for our customer's claim CLM-2024-007890. Approve the claim to pay our customer, then create a subrogation case to recover the costs from the at-fault party's insurer." />
              </div>

              {/* Compliance */}
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <History className="h-3 w-3 text-slate-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Audit claims over $50K, verify docs...</div>
                <CopyButton text="A regulator requested an audit of all claim approvals over $50,000 in the last 6 months. Pull the audit trail for those claims, verify each had proper documentation attached, and generate a compliance report." />
              </div>
              <div className="bg-muted/50 p-1.5 rounded flex items-center gap-1.5 group">
                <History className="h-3 w-3 text-slate-500 shrink-0" />
                <div className="truncate flex-1 text-xs">Annual review for CUST-67890, all policies...</div>
                <CopyButton text="Annual policy review workflow: For customer CUST-67890, pull all their active policies, review claim history, check current risk assessments, generate updated quotes with adjusted premiums, and prepare a comprehensive portfolio review document." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">API Endpoints</h2>

          {/* Core Endpoints */}
          <h3 className="text-xl font-semibold mb-4 text-muted-foreground">Core Operations</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Policies
                </CardTitle>
                <CardDescription>Manage insurance policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/policies</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/policies</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/policies/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">PUT</Badge>
                  <code className="text-xs">/api/policies/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">DELETE</Badge>
                  <code className="text-xs">/api/policies/:id</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Claims
                </CardTitle>
                <CardDescription>Process insurance claims</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/claims</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/claims</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/claims/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">PUT</Badge>
                  <code className="text-xs">/api/claims/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/claims/:id/approve</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/claims/:id/reject</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Evaluate policy risks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/risk-assessment</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/risk-assessment/:policyId</code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Management */}
          <h3 className="text-xl font-semibold mb-4 text-muted-foreground">Customer Management</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Customers
                </CardTitle>
                <CardDescription>Customer information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/customers</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/customers</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/customers/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">PUT</Badge>
                  <code className="text-xs">/api/customers/:id</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-cyan-500" />
                  Quotes
                </CardTitle>
                <CardDescription>Insurance quotes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/quotes</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/quotes</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/quotes/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">PUT</Badge>
                  <code className="text-xs">/api/quotes/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/quotes/:id/convert</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-indigo-500" />
                  Agents
                </CardTitle>
                <CardDescription>Insurance agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/agents</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/agents</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/agents/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">PUT</Badge>
                  <code className="text-xs">/api/agents/:id</code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Operations */}
          <h3 className="text-xl font-semibold mb-4 text-muted-foreground">Financial Operations</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Payments
                </CardTitle>
                <CardDescription>Payment processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/payments</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/payments</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/payments/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/payments/policy/:policyId</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-500" />
                  Beneficiaries
                </CardTitle>
                <CardDescription>Policy beneficiaries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/beneficiaries</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/beneficiaries</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/beneficiaries/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/beneficiaries/policy/:policyId</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-slate-600" />
                  Reinsurance
                </CardTitle>
                <CardDescription>Reinsurance contracts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/reinsurance</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/reinsurance</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/reinsurance/:id</code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Policy Lifecycle */}
          <h3 className="text-xl font-semibold mb-4 text-muted-foreground">Policy Lifecycle</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-amber-500" />
                  Renewals
                </CardTitle>
                <CardDescription>Policy renewals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/renewals</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/renewals</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/renewals/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/renewals/:id/approve</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                  Endorsements
                </CardTitle>
                <CardDescription>Policy modifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/endorsements</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/endorsements</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/endorsements/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/endorsements/:id/approve</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Documents
                </CardTitle>
                <CardDescription>Document management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/documents</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/documents</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/documents/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/documents/entity/:entityType/:entityId</code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Claims Processing */}
          <h3 className="text-xl font-semibold mb-4 text-muted-foreground">Claims Processing</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Fraud Detection
                </CardTitle>
                <CardDescription>Fraud analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/fraud-detection/analyze</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/fraud-detection/reports</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/fraud-detection/:id</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-teal-500" />
                  Inspections
                </CardTitle>
                <CardDescription>Property inspections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/inspections</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/inspections</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/inspections/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/inspections/:id/complete</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-violet-600" />
                  Subrogation
                </CardTitle>
                <CardDescription>Recovery claims</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/subrogation</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/subrogation</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/subrogation/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/subrogation/claim/:claimId</code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics & Monitoring */}
          <h3 className="text-xl font-semibold mb-4 text-muted-foreground">Analytics & Monitoring</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Analytics
                </CardTitle>
                <CardDescription>Business analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/analytics/claims-summary</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/analytics/policies-summary</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/analytics/loss-ratio</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-slate-500" />
                  Audit Trail
                </CardTitle>
                <CardDescription>Activity logs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/audit-trail</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/audit-trail/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/audit-trail/entity/:entityType/:entityId</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-700" />
                  Telematics
                </CardTitle>
                <CardDescription>Vehicle tracking data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/telematics</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/telematics</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/telematics/policy/:policyId</code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Communications */}
          <h3 className="text-xl font-semibold mb-4 text-muted-foreground">Communications</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-500" />
                  Notifications
                </CardTitle>
                <CardDescription>Send notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/notifications</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">POST</Badge>
                  <code className="text-xs">/api/notifications</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">GET</Badge>
                  <code className="text-xs">/api/notifications/:id</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Example Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Example Usage</CardTitle>
            <CardDescription>Try these curl commands to interact with the API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">List all policies:</p>
                <CopyButton text={`curl -X GET ${baseUrl}/api/policies \\
  -H "x-api-key: demo-key-12345"`} />
              </div>
              <code className="block bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">
                curl -X GET {baseUrl}/api/policies \{"\n"}
                {"  "}-H "x-api-key: demo-key-12345"
              </code>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Create a new claim:</p>
                <CopyButton text={`curl -X POST ${baseUrl}/api/claims \\
  -H "x-api-key: demo-key-12345" \\
  -H "Content-Type: application/json" \\
  -d '{
    "policyId": "POL-001",
    "claimNumber": "CLM-2024-999999",
    "claimType": "accident",
    "description": "Minor fender bender",
    "claimAmount": 2500,
    "status": "pending",
    "filedDate": "2024-10-22T10:00:00Z"
  }'`} />
              </div>
              <code className="block bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">
                curl -X POST {baseUrl}/api/claims \{"\n"}
                {"  "}-H "x-api-key: demo-key-12345" \{"\n"}
                {"  "}-H "Content-Type: application/json" \{"\n"}
                {"  "}-d '{`{`}
                {"\n"}
                {"    "}"policyId": "POL-001",{"\n"}
                {"    "}"claimNumber": "CLM-2024-999999",{"\n"}
                {"    "}"claimType": "accident",{"\n"}
                {"    "}"description": "Minor fender bender",{"\n"}
                {"    "}"claimAmount": 2500,{"\n"}
                {"    "}"status": "pending",{"\n"}
                {"    "}"filedDate": "2024-10-22T10:00:00Z"{"\n"}
                {"  "}
                {`}`}'
              </code>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Get risk assessment for a policy:</p>
                <CopyButton text={`curl -X GET ${baseUrl}/api/risk-assessment/POL-001 \\
  -H "x-api-key: demo-key-12345"`} />
              </div>
              <code className="block bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">
                curl -X GET {baseUrl}/api/risk-assessment/POL-001 \{"\n"}
                {"  "}-H "x-api-key: demo-key-12345"
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p className="mt-2">
            Demo API Keys: <code className="bg-muted px-2 py-1 rounded">demo-key-12345</code> or{" "}
            <code className="bg-muted px-2 py-1 rounded">test-key-67890</code>
          </p>
        </div>
      </div>
    </div>
  )
}
