import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile } from "@/lib/storage"
import { type Payment } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { policyId } = await params

  try {
    const payments = await readJsonFile<Payment>("payments.json")
    const policyPayments = payments.filter((p) => p.policyId === policyId)

    return Response.json(policyPayments, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}
