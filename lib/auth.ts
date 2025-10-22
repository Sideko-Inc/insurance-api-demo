import type { NextRequest } from "next/server"

const VALID_API_KEYS = new Set(["demo-key-12345", "test-key-67890"])

export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    console.log("[v0] No API key provided")
    return false
  }

  const isValid = VALID_API_KEYS.has(apiKey)

  return isValid
}

export function createUnauthorizedResponse() {
  return Response.json({ error: "Unauthorized", message: "Valid API key required" }, { status: 401 })
}
