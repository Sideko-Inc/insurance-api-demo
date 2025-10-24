import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateQuoteSchema, type Quote } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const QUOTES_FILE = "quotes.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Quote>(QUOTES_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch quotes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateQuoteSchema.parse(body)

    const items = await readJsonFile<Quote>(QUOTES_FILE)

    const newItem: Quote = {
      ...validatedData,
      id: generateId("QUO"),
      createdAt: getCurrentTimestamp(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending" as const,
      premium: Math.random() * 1000 + 500,
      
      
      
      
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(QUOTES_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create quote" }, { status: 500 })
  }
}
