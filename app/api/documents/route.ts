import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateDocumentSchema, type Document } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const DOCUMENTS_FILE = "documents.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Document>(DOCUMENTS_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateDocumentSchema.parse(body)

    const items = await readJsonFile<Document>(DOCUMENTS_FILE)

    const newItem: Document = {
      ...validatedData,
      id: generateId("DOC"),
      uploadedAt: getCurrentTimestamp(),
    }

    items.push(newItem)
    await writeJsonFile(DOCUMENTS_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create document" }, { status: 500 })
  }
}
