import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import type { Claim } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const CLAIMS_FILE = "claims.json"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const { id } = await params
    const claims = await readJsonFile<Claim>(CLAIMS_FILE)
    const claimIndex = claims.findIndex((c) => c.id === id)

    if (claimIndex === -1) {
      return Response.json({ error: "Claim not found" }, { status: 404 })
    }

    const updatedClaim: Claim = {
      ...claims[claimIndex],
      status: "rejected",
      processedDate: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    claims[claimIndex] = updatedClaim
    await writeJsonFile(CLAIMS_FILE, claims)

    return Response.json(updatedClaim, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to reject claim" }, { status: 500 })
  }
}
