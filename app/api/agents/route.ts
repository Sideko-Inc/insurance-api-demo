import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateAgentSchema, type Agent } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const AGENTS_FILE = "agents.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Agent>(AGENTS_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateAgentSchema.parse(body)

    const items = await readJsonFile<Agent>(AGENTS_FILE)

    const newItem: Agent = {
      ...validatedData,
      id: generateId("AGE"),
      createdAt: getCurrentTimestamp(),
      
      
      
      status: "active" as const,
      
      
      
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(AGENTS_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
