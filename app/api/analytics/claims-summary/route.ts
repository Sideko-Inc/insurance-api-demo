import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile } from "@/lib/storage"
import { type Claim, type ClaimsSummary } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const claims = await readJsonFile<Claim>("claims.json")

    const summary: ClaimsSummary = {
      totalClaims: claims.length,
      approvedClaims: claims.filter((c) => c.status === "approved").length,
      rejectedClaims: claims.filter((c) => c.status === "rejected").length,
      pendingClaims: claims.filter((c) => c.status === "pending" || c.status === "processing").length,
      totalClaimAmount: claims.reduce((sum, c) => sum + c.claimAmount, 0),
      averageClaimAmount: claims.length > 0 ? claims.reduce((sum, c) => sum + c.claimAmount, 0) / claims.length : 0,
    }

    return Response.json(summary, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to generate claims summary" }, { status: 500 })
  }
}
