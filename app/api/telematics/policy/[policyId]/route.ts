import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile } from "@/lib/storage"
import { type TelematicsData } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { policyId } = await params

  try {
    const telematicsData = await readJsonFile<TelematicsData>("telematics.json")
    const policyData = telematicsData.filter((t) => t.policyId === policyId)

    return Response.json(policyData, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch telematics data" }, { status: 500 })
  }
}
