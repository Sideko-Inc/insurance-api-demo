import { validateApiKey } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return Response.json({ error: "Unauthorized", message: "Valid API key required" }, { status: 401 })
  }

  return Response.json(
    {
      message: "API key is valid",
      data: {
        authenticated: true,
      },
    },
    { status: 200 },
  )
}
