import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateRiskAssessmentSchema, type RiskAssessment } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const RISK_ASSESSMENTS_FILE = "risk-assessments.json"

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateRiskAssessmentSchema.parse(body)

    const assessments = await readJsonFile<RiskAssessment>(RISK_ASSESSMENTS_FILE)

    const newAssessment: RiskAssessment = {
      ...validatedData,
      id: generateId("RISK"),
      createdAt: getCurrentTimestamp(),
    }

    assessments.push(newAssessment)
    await writeJsonFile(RISK_ASSESSMENTS_FILE, assessments)

    return Response.json(newAssessment, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create risk assessment" }, { status: 500 })
  }
}
