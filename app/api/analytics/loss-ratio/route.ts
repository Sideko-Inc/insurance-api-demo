import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile } from "@/lib/storage"
import { type Policy, type Claim, type LossRatio } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const policies = await readJsonFile<Policy>("policies.json")
    const claims = await readJsonFile<Claim>("claims.json")

    const totalPremiums = policies.reduce((sum, p) => sum + p.premium, 0)
    const totalClaims = claims.filter((c) => c.status === "approved").reduce((sum, c) => sum + c.claimAmount, 0)

    const lossRatio = totalPremiums > 0 ? (totalClaims / totalPremiums) * 100 : 0

    const now = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const result: LossRatio = {
      lossRatio,
      totalClaims,
      totalPremiums,
      periodStart: oneYearAgo.toISOString(),
      periodEnd: now.toISOString(),
    }

    return Response.json(result, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to calculate loss ratio" }, { status: 500 })
  }
}
