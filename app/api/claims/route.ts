import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateClaimSchema, type Claim } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const CLAIMS_FILE = "claims.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const claims = await readJsonFile<Claim>(CLAIMS_FILE)
    return Response.json(claims, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch claims" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateClaimSchema.parse(body)

    const claims = await readJsonFile<Claim>(CLAIMS_FILE)

    const newClaim: Claim = {
      ...validatedData,
      id: generateId("CLM"),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    claims.push(newClaim)
    await writeJsonFile(CLAIMS_FILE, claims)

    return Response.json(newClaim, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create claim" }, { status: 500 })
  }
}
