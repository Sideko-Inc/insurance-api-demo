import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateTelematicsDataSchema, type TelematicsData } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const TELEMATICS_FILE = "telematics.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<TelematicsData>(TELEMATICS_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch telematics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateTelematicsDataSchema.parse(body)

    const items = await readJsonFile<TelematicsData>(TELEMATICS_FILE)

    const newItem: TelematicsData = {
      ...validatedData,
      id: generateId("TEL"),
      createdAt: getCurrentTimestamp(),
      
      
      
      
      
      
      
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(TELEMATICS_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create telematic" }, { status: 500 })
  }
}
