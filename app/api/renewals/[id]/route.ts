import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import { UpdateRenewalSchema, type Renewal } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const RENEWALS_FILE = "renewals.json"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const items = await readJsonFile<Renewal>(RENEWALS_FILE)
    const item = items.find((p) => p.id === id)

    if (!item) {
      return Response.json({ error: "Renewal not found" }, { status: 404 })
    }

    return Response.json(item, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch renewal" }, { status: 500 })
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
    const validatedData = UpdateRenewalSchema.parse(body)

    const items = await readJsonFile<Renewal>(RENEWALS_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "Renewal not found" }, { status: 404 })
    }

    const updatedItem: Renewal = {
      ...items[index],
      ...validatedData,
      updatedAt: getCurrentTimestamp(),
    }

    items[index] = updatedItem
    await writeJsonFile(RENEWALS_FILE, items)

    return Response.json(updatedItem, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to update renewal" }, { status: 500 })
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
    const items = await readJsonFile<Renewal>(RENEWALS_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "Renewal not found" }, { status: 404 })
    }

    items.splice(index, 1)
    await writeJsonFile(RENEWALS_FILE, items)

    return Response.json({ message: "Renewal deleted successfully" }, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to delete renewal" }, { status: 500 })
  }
}
