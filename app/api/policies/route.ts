import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { CreatePolicySchema, type Policy } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const POLICIES_FILE = "policies.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const policies = await readJsonFile<Policy>(POLICIES_FILE)
    return Response.json(policies, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch policies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = CreatePolicySchema.parse(body)

    const policies = await readJsonFile<Policy>(POLICIES_FILE)

    const newPolicy: Policy = {
      ...validatedData,
      id: generateId("POL"),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    policies.push(newPolicy)
    await writeJsonFile(POLICIES_FILE, policies)

    return Response.json(newPolicy, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create policy" }, { status: 500 })
  }
}
