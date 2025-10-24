import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateBeneficiarySchema, type Beneficiary } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const BENEFICIARIES_FILE = "beneficiaries.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Beneficiary>(BENEFICIARIES_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch beneficiaries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateBeneficiarySchema.parse(body)

    const items = await readJsonFile<Beneficiary>(BENEFICIARIES_FILE)

    const newItem: Beneficiary = {
      ...validatedData,
      id: generateId("BEN"),
      createdAt: getCurrentTimestamp(),
      
      
      
      
      
      
      
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(BENEFICIARIES_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create beneficiarie" }, { status: 500 })
  }
}
