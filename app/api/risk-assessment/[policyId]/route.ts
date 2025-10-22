import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile } from "@/lib/storage"
import type { RiskAssessment } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const RISK_ASSESSMENTS_FILE = "risk-assessments.json"

export async function GET(request: NextRequest, { params }: { params: Promise<{ policyId: string }> }) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const { policyId } = await params
    const assessments = await readJsonFile<RiskAssessment>(RISK_ASSESSMENTS_FILE)
    const assessment = assessments.find((a) => a.policyId === policyId)

    if (!assessment) {
      return Response.json({ error: "Risk assessment not found for this policy" }, { status: 404 })
    }

    return Response.json(assessment, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch risk assessment" }, { status: 500 })
  }
}
