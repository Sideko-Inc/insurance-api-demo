import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import { type Inspection } from "@/lib/schemas"
import type { NextRequest } from "next/server"
import { z } from "zod"

const CompleteInspectionSchema = z.object({
  findings: z.string(),
  approved: z.boolean(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { findings, approved } = CompleteInspectionSchema.parse(body)

    const inspections = await readJsonFile<Inspection>("inspections.json")
    const inspection = inspections.find((i) => i.id === id)

    if (!inspection) {
      return Response.json({ error: "Inspection not found" }, { status: 404 })
    }

    inspection.status = "completed"
    inspection.completedDate = getCurrentTimestamp()
    inspection.findings = findings
    inspection.approved = approved
    inspection.updatedAt = getCurrentTimestamp()

    const index = inspections.findIndex((i) => i.id === id)
    inspections[index] = inspection
    await writeJsonFile("inspections.json", inspections)

    return Response.json(inspection, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to complete inspection" }, { status: 500 })
  }
}
