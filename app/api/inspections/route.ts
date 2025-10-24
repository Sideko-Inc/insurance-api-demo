import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateInspectionSchema, type Inspection } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const INSPECTIONS_FILE = "inspections.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Inspection>(INSPECTIONS_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch inspections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateInspectionSchema.parse(body)

    const items = await readJsonFile<Inspection>(INSPECTIONS_FILE)

    const newItem: Inspection = {
      ...validatedData,
      id: generateId("INS"),
      createdAt: getCurrentTimestamp(),
      
      
      
      
      
      
      status: "scheduled" as const,
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(INSPECTIONS_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create inspection" }, { status: 500 })
  }
}
