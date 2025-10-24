import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { type Quote, type Policy } from "@/lib/schemas"
import type { NextRequest } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const quotes = await readJsonFile<Quote>("quotes.json")
    const quote = quotes.find((q) => q.id === id)

    if (!quote) {
      return Response.json({ error: "Quote not found" }, { status: 404 })
    }

    if (quote.status !== "approved") {
      return Response.json({ error: "Only approved quotes can be converted" }, { status: 400 })
    }

    const policies = await readJsonFile<Policy>("policies.json")

    const newPolicy: Policy = {
      id: generateId("POL"),
      policyNumber: `INS-${new Date().getFullYear()}-${String(policies.length + 1).padStart(6, '0')}`,
      policyType: quote.policyType,
      holderName: quote.customerName || "",
      holderEmail: quote.customerEmail || "",
      premium: quote.premium,
      coverageAmount: quote.coverageAmount,
      startDate: getCurrentTimestamp(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    policies.push(newPolicy)
    await writeJsonFile("policies.json", policies)

    quote.status = "converted"
    const quoteIndex = quotes.findIndex((q) => q.id === id)
    quotes[quoteIndex] = quote
    await writeJsonFile("quotes.json", quotes)

    return Response.json(newPolicy, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to convert quote" }, { status: 500 })
  }
}
