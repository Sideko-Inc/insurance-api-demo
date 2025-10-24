import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateEndorsementSchema, type Endorsement } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const ENDORSEMENTS_FILE = "endorsements.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Endorsement>(ENDORSEMENTS_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch endorsements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateEndorsementSchema.parse(body)

    const items = await readJsonFile<Endorsement>(ENDORSEMENTS_FILE)

    const newItem: Endorsement = {
      ...validatedData,
      id: generateId("END"),
      createdAt: getCurrentTimestamp(),
      
      
      
      
      
      
      
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(ENDORSEMENTS_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create endorsement" }, { status: 500 })
  }
}
