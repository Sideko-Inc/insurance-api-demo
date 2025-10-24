import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile } from "@/lib/storage"
import { type AuditLog } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { searchParams } = new URL(request.url)
  const entityType = searchParams.get("entityType")
  const entityId = searchParams.get("entityId")

  try {
    let logs = await readJsonFile<AuditLog>("audit-logs.json")

    if (entityType) {
      logs = logs.filter((log) => log.entityType === entityType)
    }

    if (entityId) {
      logs = logs.filter((log) => log.entityId === entityId)
    }

    return Response.json(logs, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
