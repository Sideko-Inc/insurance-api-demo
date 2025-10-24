import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { FraudAnalysisRequestSchema, type FraudAnalysis, type Claim } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { claimId } = FraudAnalysisRequestSchema.parse(body)

    const claims = await readJsonFile<Claim>("claims.json")
    const claim = claims.find((c) => c.id === claimId)

    if (!claim) {
      return Response.json({ error: "Claim not found" }, { status: 404 })
    }

    const fraudIndicators = []
    let riskScore = 0

    if (claim.claimAmount > 10000) {
      fraudIndicators.push("High claim amount")
      riskScore += 30
    }

    if (claim.status === "pending" && !claim.notes) {
      fraudIndicators.push("Incomplete documentation")
      riskScore += 20
    }

    const filedDate = new Date(claim.filedDate)
    const daysSinceIncident = Math.floor((Date.now() - filedDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceIncident > 30) {
      fraudIndicators.push("Delayed reporting")
      riskScore += 25
    }

    let recommendation: "approve" | "review" | "reject"
    if (riskScore < 30) {
      recommendation = "approve"
    } else if (riskScore < 60) {
      recommendation = "review"
    } else {
      recommendation = "reject"
    }

    const analysis: FraudAnalysis = {
      id: generateId("FRD"),
      claimId,
      riskScore,
      fraudIndicators,
      recommendation,
      analyzedAt: getCurrentTimestamp(),
    }

    const analyses = await readJsonFile<FraudAnalysis>("fraud-analyses.json")
    analyses.push(analysis)
    await writeJsonFile("fraud-analyses.json", analyses)

    return Response.json(analysis, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to analyze claim" }, { status: 500 })
  }
}
