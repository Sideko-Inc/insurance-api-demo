import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import { UpdatePolicySchema, type Policy } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const POLICIES_FILE = "policies.json"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const { id } = await params
    const policies = await readJsonFile<Policy>(POLICIES_FILE)
    const policy = policies.find((p) => p.id === id)

    if (!policy) {
      return Response.json({ error: "Policy not found" }, { status: 404 })
    }

    return Response.json(policy, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch policy" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = UpdatePolicySchema.parse(body)

    const policies = await readJsonFile<Policy>(POLICIES_FILE)
    const policyIndex = policies.findIndex((p) => p.id === id)

    if (policyIndex === -1) {
      return Response.json({ error: "Policy not found" }, { status: 404 })
    }

    const updatedPolicy: Policy = {
      ...policies[policyIndex],
      ...validatedData,
      updatedAt: getCurrentTimestamp(),
    }

    policies[policyIndex] = updatedPolicy
    await writeJsonFile(POLICIES_FILE, policies)

    return Response.json(updatedPolicy, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to update policy" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const { id } = await params
    const policies = await readJsonFile<Policy>(POLICIES_FILE)
    const policyIndex = policies.findIndex((p) => p.id === id)

    if (policyIndex === -1) {
      return Response.json({ error: "Policy not found" }, { status: 404 })
    }

    policies.splice(policyIndex, 1)
    await writeJsonFile(POLICIES_FILE, policies)

    return Response.json({ message: "Policy deleted successfully" }, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to delete policy" }, { status: 500 })
  }
}
