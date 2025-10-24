import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateCustomerSchema, type Customer } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const CUSTOMERS_FILE = "customers.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Customer>(CUSTOMERS_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateCustomerSchema.parse(body)

    const items = await readJsonFile<Customer>(CUSTOMERS_FILE)

    const newItem: Customer = {
      ...validatedData,
      id: generateId("CUS"),
      createdAt: getCurrentTimestamp(),
      
      
      
      
      
      
      
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(CUSTOMERS_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
