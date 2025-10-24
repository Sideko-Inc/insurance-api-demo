import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import { UpdateSubrogationSchema, type Subrogation } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const SUBROGATION_FILE = "subrogation.json"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const items = await readJsonFile<Subrogation>(SUBROGATION_FILE)
    const item = items.find((p) => p.id === id)

    if (!item) {
      return Response.json({ error: "Subrogation not found" }, { status: 404 })
    }

    return Response.json(item, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch subrogatio" }, { status: 500 })
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
    const validatedData = UpdateSubrogationSchema.parse(body)

    const items = await readJsonFile<Subrogation>(SUBROGATION_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "Subrogation not found" }, { status: 404 })
    }

    const updatedItem: Subrogation = {
      ...items[index],
      ...validatedData,
      updatedAt: getCurrentTimestamp(),
    }

    items[index] = updatedItem
    await writeJsonFile(SUBROGATION_FILE, items)

    return Response.json(updatedItem, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to update subrogatio" }, { status: 500 })
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
    const items = await readJsonFile<Subrogation>(SUBROGATION_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "Subrogation not found" }, { status: 404 })
    }

    items.splice(index, 1)
    await writeJsonFile(SUBROGATION_FILE, items)

    return Response.json({ message: "Subrogation deleted successfully" }, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to delete subrogatio" }, { status: 500 })
  }
}
