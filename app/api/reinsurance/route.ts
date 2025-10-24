import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateReinsuranceSchema, type Reinsurance } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const REINSURANCE_FILE = "reinsurance.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Reinsurance>(REINSURANCE_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch reinsurance" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateReinsuranceSchema.parse(body)

    const items = await readJsonFile<Reinsurance>(REINSURANCE_FILE)

    const newItem: Reinsurance = {
      ...validatedData,
      id: generateId("REI"),
      createdAt: getCurrentTimestamp(),
      
      
      
      
      
      
      
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(REINSURANCE_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create reinsuranc" }, { status: 500 })
  }
}
