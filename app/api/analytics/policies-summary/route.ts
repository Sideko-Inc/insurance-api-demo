import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile } from "@/lib/storage"
import { type Policy, type PoliciesSummary } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const policies = await readJsonFile<Policy>("policies.json")

    const summary: PoliciesSummary = {
      totalPolicies: policies.length,
      activePolicies: policies.filter((p) => p.status === "active").length,
      expiredPolicies: policies.filter((p) => p.status === "expired").length,
      cancelledPolicies: policies.filter((p) => p.status === "cancelled").length,
      totalPremiumRevenue: policies.reduce((sum, p) => sum + p.premium, 0),
      averagePremium: policies.length > 0 ? policies.reduce((sum, p) => sum + p.premium, 0) / policies.length : 0,
    }

    return Response.json(summary, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to generate policies summary" }, { status: 500 })
  }
}
