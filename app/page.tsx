import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, BrainCircuit, BarChart3 } from "lucide-react"

export default function HomePage() {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-balance">Insurance API</h1>
          </div>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            A simple insurance management API for policy, claims, and risk assessment operations
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="secondary">OpenAPI 3.1</Badge>
            <Badge variant="secondary">REST API</Badge>
          </div>
        </div>

        {/* API Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                OpenAPI Specification
              </CardTitle>
              <CardDescription>Access the complete API documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/openapi.yaml"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-muted p-3 rounded-md text-sm font-mono break-all hover:underline"
              >
                GET /openapi.yaml
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                MCP
              </CardTitle>
              <CardDescription>MCP Server (1 tool per http operation)</CardDescription>
            </CardHeader>
            <CardContent>
              <code className="block bg-muted p-3 rounded-md text-sm font-mono break-all">
                {baseUrl}/api/policies
              </code>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">API Endpoints</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Policies
                </CardTitle>
                <CardDescription>Manage insurance policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">
                    GET
                  </Badge>
                  <code className="text-xs">/api/policies</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    POST
                  </Badge>
                  <code className="text-xs">/api/policies</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    GET
                  </Badge>
                  <code className="text-xs">/api/policies/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    PUT
                  </Badge>
                  <code className="text-xs">/api/policies/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    DELETE
                  </Badge>
                  <code className="text-xs">/api/policies/:id</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Claims
                </CardTitle>
                <CardDescription>Process insurance claims</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">
                    GET
                  </Badge>
                  <code className="text-xs">/api/claims</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    POST
                  </Badge>
                  <code className="text-xs">/api/claims</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    GET
                  </Badge>
                  <code className="text-xs">/api/claims/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    PUT
                  </Badge>
                  <code className="text-xs">/api/claims/:id</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    POST
                  </Badge>
                  <code className="text-xs">/api/claims/:id/approve</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    POST
                  </Badge>
                  <code className="text-xs">/api/claims/:id/reject</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Evaluate policy risks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">
                    POST
                  </Badge>
                  <code className="text-xs">/api/risk-assessment</code>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    GET
                  </Badge>
                  <code className="text-xs">/api/risk-assessment/:policyId</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Example Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Example Usage</CardTitle>
            <CardDescription>Try these curl commands to interact with the API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">List all policies:</p>
              <code className="block bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">
                curl -X GET {baseUrl}/api/policies \{"\n"}
                {"  "}-H "x-api-key: demo-key-12345"
              </code>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Create a new claim:</p>
              <code className="block bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">
                curl -X POST {baseUrl}/api/claims \{"\n"}
                {"  "}-H "x-api-key: demo-key-12345" \{"\n"}
                {"  "}-H "Content-Type: application/json" \{"\n"}
                {"  "}-d '{`{`}
                {"\n"}
                {"    "}"policyId": "POL-001",{"\n"}
                {"    "}"claimNumber": "CLM-2024-999999",{"\n"}
                {"    "}"claimType": "accident",{"\n"}
                {"    "}"description": "Minor fender bender",{"\n"}
                {"    "}"claimAmount": 2500,{"\n"}
                {"    "}"status": "pending",{"\n"}
                {"    "}"filedDate": "2024-10-22T10:00:00Z"{"\n"}
                {"  "}
                {`}`}'
              </code>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Get risk assessment for a policy:</p>
              <code className="block bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">
                curl -X GET {baseUrl}/api/risk-assessment/POL-001 \{"\n"}
                {"  "}-H "x-api-key: demo-key-12345"
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p className="mt-2">
            Demo API Keys: <code className="bg-muted px-2 py-1 rounded">demo-key-12345</code> or{" "}
            <code className="bg-muted px-2 py-1 rounded">test-key-67890</code>
          </p>
        </div>
      </div>
    </div>
  )
}
