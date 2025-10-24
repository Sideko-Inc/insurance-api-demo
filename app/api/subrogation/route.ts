import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateSubrogationSchema, type Subrogation } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const SUBROGATION_FILE = "subrogation.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Subrogation>(SUBROGATION_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch subrogation" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateSubrogationSchema.parse(body)

    const items = await readJsonFile<Subrogation>(SUBROGATION_FILE)

    const newItem: Subrogation = {
      ...validatedData,
      id: generateId("SUB"),
      createdAt: getCurrentTimestamp(),
      
      
      
      
      
      
      
      status: "initiated" as const,
      
      
    }

    items.push(newItem)
    await writeJsonFile(SUBROGATION_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create subrogatio" }, { status: 500 })
  }
}
