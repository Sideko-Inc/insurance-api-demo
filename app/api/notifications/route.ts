import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreateNotificationSchema, type Notification } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const NOTIFICATIONS_FILE = "notifications.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<Notification>(NOTIFICATIONS_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreateNotificationSchema.parse(body)

    const items = await readJsonFile<Notification>(NOTIFICATIONS_FILE)

    const newItem: Notification = {
      ...validatedData,
      id: generateId("NOT"),
      createdAt: getCurrentTimestamp(),
      
      
      
      
      
      status: "pending" as const,
      
      
      
      
    }

    items.push(newItem)
    await writeJsonFile(NOTIFICATIONS_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
