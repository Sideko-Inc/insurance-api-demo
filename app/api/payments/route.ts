import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreatePaymentSchema, type Payment } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const PAYMENTS_FILE = "payments.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Payment>(PAYMENTS_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreatePaymentSchema.parse(body)

    const items = await readJsonFile<Payment>(PAYMENTS_FILE)

    const newItem: Payment = {
      ...validatedData,
      id: generateId("PAY"),
      createdAt: getCurrentTimestamp(),
      
      status: "pending" as const,
      
      
      
      
      
      
      paymentDate: getCurrentTimestamp(),
      
    }

    items.push(newItem)
    await writeJsonFile(PAYMENTS_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
