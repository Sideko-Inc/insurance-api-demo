"""
Insurance API MCP Server
Automatically generated from OpenAPI specification
"""

import httpx
from pathlib import Path
from fastmcp import FastMCP


# Load the OpenAPI specification
def load_openapi_spec():
    """Load the OpenAPI spec from the api directory"""
    spec_path = Path(__file__).parent / "openapi.yaml"

    # Read YAML file and convert to JSON for FastMCP
    import yaml

    with open(spec_path, "r") as f:
        spec = yaml.safe_load(f)
    return spec


# API configuration for demo
API_BASE_URL = "https://insurance-api-demo.vercel.app"
API_KEY = "demo-key-12345"

# Create an HTTP client for the API
api_client = httpx.AsyncClient(
    base_url=API_BASE_URL,
    headers={"x-api-key": API_KEY, "Content-Type": "application/json"},
    timeout=30.0,
)

# Load OpenAPI spec
openapi_spec = load_openapi_spec()

# Create the MCP server from OpenAPI specification
mcp = FastMCP.from_openapi(
    openapi_spec=openapi_spec,
    client=api_client,
    name="Insurance Management API",
    tags={"insurance", "api", "management"},
)

# Export the app for Vercel with HTTP transport
# json_response=True makes GET return JSON capabilities instead of requiring SSE
# stateless_http=True allows stateless requests suitable for serverless
app = mcp.http_app(transport="http", json_response=True, stateless_http=True)

# Main entry point for local development
if __name__ == "__main__":
    # Run with HTTP transport for testing
    mcp.run(transport="http", host="0.0.0.0", port=8000)
