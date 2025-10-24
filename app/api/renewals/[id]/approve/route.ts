import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import { type Renewal } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const renewals = await readJsonFile<Renewal>("renewals.json")
    const renewal = renewals.find((r) => r.id === id)

    if (!renewal) {
      return Response.json({ error: "Renewal not found" }, { status: 404 })
    }

    renewal.status = "approved"
    renewal.updatedAt = getCurrentTimestamp()

    const index = renewals.findIndex((r) => r.id === id)
    renewals[index] = renewal
    await writeJsonFile("renewals.json", renewals)

    return Response.json(renewal, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to approve renewal" }, { status: 500 })
  }
}
