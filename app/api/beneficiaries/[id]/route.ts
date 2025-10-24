import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import { UpdateBeneficiarySchema, type Beneficiary } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const BENEFICIARIES_FILE = "beneficiaries.json"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const items = await readJsonFile<Beneficiary>(BENEFICIARIES_FILE)
    const item = items.find((p) => p.id === id)

    if (!item) {
      return Response.json({ error: "Beneficiary not found" }, { status: 404 })
    }

    return Response.json(item, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch beneficiarie" }, { status: 500 })
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
    const validatedData = UpdateBeneficiarySchema.parse(body)

    const items = await readJsonFile<Beneficiary>(BENEFICIARIES_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "Beneficiary not found" }, { status: 404 })
    }

    const updatedItem: Beneficiary = {
      ...items[index],
      ...validatedData,
      updatedAt: getCurrentTimestamp(),
    }

    items[index] = updatedItem
    await writeJsonFile(BENEFICIARIES_FILE, items)

    return Response.json(updatedItem, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to update beneficiarie" }, { status: 500 })
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
    const items = await readJsonFile<Beneficiary>(BENEFICIARIES_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "Beneficiary not found" }, { status: 404 })
    }

    items.splice(index, 1)
    await writeJsonFile(BENEFICIARIES_FILE, items)

    return Response.json({ message: "Beneficiary deleted successfully" }, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to delete beneficiarie" }, { status: 500 })
  }
}
