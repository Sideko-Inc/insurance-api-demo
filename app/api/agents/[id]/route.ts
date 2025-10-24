import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import { UpdateAgentSchema, type Agent } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const AGENTS_FILE = "agents.json"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const items = await readJsonFile<Agent>(AGENTS_FILE)
    const item = items.find((p) => p.id === id)

    if (!item) {
      return Response.json({ error: "Agent not found" }, { status: 404 })
    }

    return Response.json(item, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch agent" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const body = await request.json()
    const validatedData = UpdateAgentSchema.parse(body)

    const items = await readJsonFile<Agent>(AGENTS_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "Agent not found" }, { status: 404 })
    }

    const updatedItem: Agent = {
      ...items[index],
      ...validatedData,
      updatedAt: getCurrentTimestamp(),
    }

    items[index] = updatedItem
    await writeJsonFile(AGENTS_FILE, items)

    return Response.json(updatedItem, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const items = await readJsonFile<Agent>(AGENTS_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "Agent not found" }, { status: 404 })
    }

    items.splice(index, 1)
    await writeJsonFile(AGENTS_FILE, items)

    return Response.json({ message: "Agent deleted successfully" }, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}
