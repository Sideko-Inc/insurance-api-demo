import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import { UpdateClaimSchema, type Claim } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const CLAIMS_FILE = "claims.json"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const { id } = await params
    const claims = await readJsonFile<Claim>(CLAIMS_FILE)
    const claim = claims.find((c) => c.id === id)

    if (!claim) {
      return Response.json({ error: "Claim not found" }, { status: 404 })
    }

    return Response.json(claim, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch claim" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = UpdateClaimSchema.parse(body)

    const claims = await readJsonFile<Claim>(CLAIMS_FILE)
    const claimIndex = claims.findIndex((c) => c.id === id)

    if (claimIndex === -1) {
      return Response.json({ error: "Claim not found" }, { status: 404 })
    }

    const updatedClaim: Claim = {
      ...claims[claimIndex],
      ...validatedData,
      updatedAt: getCurrentTimestamp(),
    }

    claims[claimIndex] = updatedClaim
    await writeJsonFile(CLAIMS_FILE, claims)

    return Response.json(updatedClaim, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to update claim" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    claims.splice(claimIndex, 1)
    await writeJsonFile(CLAIMS_FILE, claims)

    return Response.json({ message: "Claim deleted successfully" }, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to delete claim" }, { status: 500 })
  }
}
