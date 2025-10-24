#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Helper to create directories
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Template generators
const routeTemplates = {
  // Basic CRUD list/create route
  listCreate: (resourceName, schema, filePrefix) => `import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from "@/lib/storage"
import { Create${schema}Schema, type ${schema} } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const ${resourceName.toUpperCase()}_FILE = "${filePrefix}.json"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const items = await readJsonFile<${schema}>(${resourceName.toUpperCase()}_FILE)
    return Response.json(items, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch ${resourceName}" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const validatedData = Create${schema}Schema.parse(body)

    const items = await readJsonFile<${schema}>(${resourceName.toUpperCase()}_FILE)

    const newItem: ${schema} = {
      ...validatedData,
      id: generateId("${filePrefix.substring(0, 3).toUpperCase()}"),
      createdAt: getCurrentTimestamp(),
      ${schema === 'Quote' ? 'validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),' : ''}
      ${schema === 'Quote' || schema === 'Payment' ? 'status: "pending" as const,' : ''}
      ${schema === 'Quote' ? 'premium: Math.random() * 1000 + 500,' : ''}
      ${schema === 'Agent' ? 'status: "active" as const,' : ''}
      ${schema === 'Renewal' ? 'status: "pending" as const,' : ''}
      ${schema === 'Notification' ? 'status: "pending" as const,' : ''}
      ${schema === 'Inspection' ? 'status: "scheduled" as const,' : ''}
      ${schema === 'Subrogation' ? 'status: "initiated" as const,' : ''}
      ${schema === 'Payment' ? 'paymentDate: getCurrentTimestamp(),' : ''}
      ${schema === 'Document' ? 'uploadedAt: getCurrentTimestamp(),' : ''}
    }

    items.push(newItem)
    await writeJsonFile(${resourceName.toUpperCase()}_FILE, items)

    return Response.json(newItem, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to create ${resourceName.slice(0, -1)}" }, { status: 500 })
  }
}
`,

  // Get/Update/Delete by ID route
  byId: (resourceName, schema, filePrefix) => `import { validateApiKey, createUnauthorizedResponse } from "@/lib/auth"
import { readJsonFile, writeJsonFile, getCurrentTimestamp } from "@/lib/storage"
import { Update${schema}Schema, type ${schema} } from "@/lib/schemas"
import type { NextRequest } from "next/server"

const ${resourceName.toUpperCase()}_FILE = "${filePrefix}.json"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const items = await readJsonFile<${schema}>(${resourceName.toUpperCase()}_FILE)
    const item = items.find((p) => p.id === id)

    if (!item) {
      return Response.json({ error: "${schema} not found" }, { status: 404 })
    }

    return Response.json(item, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch ${resourceName.slice(0, -1)}" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const body = await request.json()
    const validatedData = Update${schema}Schema.parse(body)

    const items = await readJsonFile<${schema}>(${resourceName.toUpperCase()}_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "${schema} not found" }, { status: 404 })
    }

    const updatedItem: ${schema} = {
      ...items[index],
      ...validatedData,
      updatedAt: getCurrentTimestamp(),
    }

    items[index] = updatedItem
    await writeJsonFile(${resourceName.toUpperCase()}_FILE, items)

    return Response.json(updatedItem, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: "Invalid input", message: error.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to update ${resourceName.slice(0, -1)}" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  const { id } = await params

  try {
    const items = await readJsonFile<${schema}>(${resourceName.toUpperCase()}_FILE)
    const index = items.findIndex((p) => p.id === id)

    if (index === -1) {
      return Response.json({ error: "${schema} not found" }, { status: 404 })
    }

    items.splice(index, 1)
    await writeJsonFile(${resourceName.toUpperCase()}_FILE, items)

    return Response.json({ message: "${schema} deleted successfully" }, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to delete ${resourceName.slice(0, -1)}" }, { status: 500 })
  }
}
`,
};

// Routes to generate
const routes = [
  { path: 'app/api/quotes/route.ts', template: 'listCreate', resourceName: 'quotes', schema: 'Quote', filePrefix: 'quotes' },
  { path: 'app/api/quotes/[id]/route.ts', template: 'byId', resourceName: 'quotes', schema: 'Quote', filePrefix: 'quotes' },
  { path: 'app/api/payments/route.ts', template: 'listCreate', resourceName: 'payments', schema: 'Payment', filePrefix: 'payments' },
  { path: 'app/api/payments/[id]/route.ts', template: 'byId', resourceName: 'payments', schema: 'Payment', filePrefix: 'payments' },
  { path: 'app/api/documents/route.ts', template: 'listCreate', resourceName: 'documents', schema: 'Document', filePrefix: 'documents' },
  { path: 'app/api/documents/[id]/route.ts', template: 'byId', resourceName: 'documents', schema: 'Document', filePrefix: 'documents' },
  { path: 'app/api/renewals/route.ts', template: 'listCreate', resourceName: 'renewals', schema: 'Renewal', filePrefix: 'renewals' },
  { path: 'app/api/renewals/[id]/route.ts', template: 'byId', resourceName: 'renewals', schema: 'Renewal', filePrefix: 'renewals' },
  { path: 'app/api/customers/route.ts', template: 'listCreate', resourceName: 'customers', schema: 'Customer', filePrefix: 'customers' },
  { path: 'app/api/customers/[id]/route.ts', template: 'byId', resourceName: 'customers', schema: 'Customer', filePrefix: 'customers' },
  { path: 'app/api/agents/route.ts', template: 'listCreate', resourceName: 'agents', schema: 'Agent', filePrefix: 'agents' },
  { path: 'app/api/agents/[id]/route.ts', template: 'byId', resourceName: 'agents', schema: 'Agent', filePrefix: 'agents' },
  { path: 'app/api/beneficiaries/route.ts', template: 'listCreate', resourceName: 'beneficiaries', schema: 'Beneficiary', filePrefix: 'beneficiaries' },
  { path: 'app/api/beneficiaries/[id]/route.ts', template: 'byId', resourceName: 'beneficiaries', schema: 'Beneficiary', filePrefix: 'beneficiaries' },
  { path: 'app/api/endorsements/route.ts', template: 'listCreate', resourceName: 'endorsements', schema: 'Endorsement', filePrefix: 'endorsements' },
  { path: 'app/api/endorsements/[id]/route.ts', template: 'byId', resourceName: 'endorsements', schema: 'Endorsement', filePrefix: 'endorsements' },
  { path: 'app/api/reinsurance/route.ts', template: 'listCreate', resourceName: 'reinsurance', schema: 'Reinsurance', filePrefix: 'reinsurance' },
  { path: 'app/api/reinsurance/[id]/route.ts', template: 'byId', resourceName: 'reinsurance', schema: 'Reinsurance', filePrefix: 'reinsurance' },
  { path: 'app/api/notifications/route.ts', template: 'listCreate', resourceName: 'notifications', schema: 'Notification', filePrefix: 'notifications' },
  { path: 'app/api/telematics/route.ts', template: 'listCreate', resourceName: 'telematics', schema: 'TelematicsData', filePrefix: 'telematics' },
  { path: 'app/api/inspections/route.ts', template: 'listCreate', resourceName: 'inspections', schema: 'Inspection', filePrefix: 'inspections' },
  { path: 'app/api/inspections/[id]/route.ts', template: 'byId', resourceName: 'inspections', schema: 'Inspection', filePrefix: 'inspections' },
  { path: 'app/api/subrogation/route.ts', template: 'listCreate', resourceName: 'subrogation', schema: 'Subrogation', filePrefix: 'subrogation' },
  { path: 'app/api/subrogation/[id]/route.ts', template: 'byId', resourceName: 'subrogation', schema: 'Subrogation', filePrefix: 'subrogation' },
];

// Generate all routes
routes.forEach(route => {
  const fullPath = path.join(__dirname, route.path);
  const dir = path.dirname(fullPath);

  ensureDir(dir);

  const content = routeTemplates[route.template](route.resourceName, route.schema, route.filePrefix);
  fs.writeFileSync(fullPath, content);

  console.log(`Created: ${route.path}`);
});

console.log('\nAll route files generated successfully!');
