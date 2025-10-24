import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile } from "@/lib/storage"
import { type FraudAnalysis } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const analyses = await readJsonFile<FraudAnalysis>("fraud-analyses.json")
    return Response.json(analyses, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch fraud reports" }, { status: 500 })
  }
}
