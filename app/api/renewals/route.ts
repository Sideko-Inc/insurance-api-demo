import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateRenewalSchema, type Renewal } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const RENEWALS_FILE = "renewals.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Renewal>(RENEWALS_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch renewals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateRenewalSchema.parse(body)

    const items = await readJsonFile<Renewal>(RENEWALS_FILE)

    const newItem: Renewal = {
      ...validatedData,
      id: generateId("REN"),
      createdAt: getCurrentTimestamp(),
      
      
      
      
      status: "pending" as const,
      
      
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(RENEWALS_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create renewal" }, { status: 500 })
  }
}
