#!/bin/bash

# Insurance API MCP Server Test Script
# Tests the MCP server endpoints to verify all tools are working

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
MCP_URL="${MCP_URL:-http://localhost:3000/mcp}"
VERBOSE="${VERBOSE:-false}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Insurance API MCP Server Test${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "MCP URL: ${MCP_URL}\n"

# Counter for tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local method="$2"
    local params="$3"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -e "${YELLOW}Testing:${NC} ${test_name}"

    local response=$(curl -s -X POST "${MCP_URL}" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json, text/event-stream" \
        -d "{
            \"jsonrpc\": \"2.0\",
            \"id\": ${TOTAL_TESTS},
            \"method\": \"${method}\",
            \"params\": ${params}
        }")

    if [ "$VERBOSE" = "true" ]; then
        echo "Response: ${response}" | jq '.' 2>/dev/null || echo "${response}"
    fi

    # Check if response contains error
    if echo "${response}" | grep -q '"error"'; then
        echo -e "${RED}✗ FAILED${NC} - ${test_name}"
        if [ "$VERBOSE" != "true" ]; then
            echo "Error: ${response}" | jq '.error' 2>/dev/null || echo "${response}"
        fi
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    else
        echo -e "${GREEN}✓ PASSED${NC} - ${test_name}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    fi
}

# Test 1: Health Check
echo -e "\n${BLUE}=== Health Check ===${NC}"
if curl -s "${MCP_URL}" > /dev/null; then
    echo -e "${GREEN}✓ PASSED${NC} - MCP server is reachable"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAILED${NC} - MCP server is not reachable"
    echo "Make sure the Next.js dev server is running: pnpm dev"
    exit 1
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 2: Initialize
echo -e "\n${BLUE}=== Protocol Tests ===${NC}"
run_test "Initialize MCP server" "initialize" '{
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {"name": "test-script", "version": "1.0"}
}'

# Test 3: List Tools
run_test "List all tools" "tools/list" '{}'

# Test 4: Core Operations - Policies
echo -e "\n${BLUE}=== Core Operations - Policies ===${NC}"
run_test "List policies" "tools/call" '{
    "name": "listPolicies",
    "arguments": {}
}'

# Test 5: Core Operations - Claims
echo -e "\n${BLUE}=== Core Operations - Claims ===${NC}"
run_test "List claims" "tools/call" '{
    "name": "listClaims",
    "arguments": {}
}'

# Test 6: Core Operations - Risk Assessment
echo -e "\n${BLUE}=== Core Operations - Risk Assessment ===${NC}"
run_test "Get risk assessment (expect 404)" "tools/call" '{
    "name": "getRiskAssessmentByPolicyId",
    "arguments": {"policyId": "TEST-POLICY-ID"}
}' || true

# Test 7: Customer Management - Customers
echo -e "\n${BLUE}=== Customer Management - Customers ===${NC}"
run_test "List customers" "tools/call" '{
    "name": "listCustomers",
    "arguments": {}
}'

# Test 8: Customer Management - Quotes
echo -e "\n${BLUE}=== Customer Management - Quotes ===${NC}"
run_test "List quotes" "tools/call" '{
    "name": "listQuotes",
    "arguments": {}
}'

# Test 9: Customer Management - Agents
echo -e "\n${BLUE}=== Customer Management - Agents ===${NC}"
run_test "List agents" "tools/call" '{
    "name": "listAgents",
    "arguments": {}
}'

# Test 10: Financial Operations - Payments
echo -e "\n${BLUE}=== Financial Operations - Payments ===${NC}"
run_test "List payments" "tools/call" '{
    "name": "listPayments",
    "arguments": {}
}'

# Test 11: Financial Operations - Beneficiaries
echo -e "\n${BLUE}=== Financial Operations - Beneficiaries ===${NC}"
run_test "List beneficiaries" "tools/call" '{
    "name": "listBeneficiaries",
    "arguments": {}
}'

# Test 12: Financial Operations - Reinsurance
echo -e "\n${BLUE}=== Financial Operations - Reinsurance ===${NC}"
run_test "List reinsurance" "tools/call" '{
    "name": "listReinsurance",
    "arguments": {}
}'

# Test 13: Policy Lifecycle - Renewals
echo -e "\n${BLUE}=== Policy Lifecycle - Renewals ===${NC}"
run_test "List renewals" "tools/call" '{
    "name": "listRenewals",
    "arguments": {}
}'

# Test 14: Policy Lifecycle - Endorsements
echo -e "\n${BLUE}=== Policy Lifecycle - Endorsements ===${NC}"
run_test "List endorsements" "tools/call" '{
    "name": "listEndorsements",
    "arguments": {}
}'

# Test 15: Policy Lifecycle - Documents
echo -e "\n${BLUE}=== Policy Lifecycle - Documents ===${NC}"
run_test "List documents" "tools/call" '{
    "name": "listDocuments",
    "arguments": {}
}'

# Test 16: Claims Processing - Fraud Detection
echo -e "\n${BLUE}=== Claims Processing - Fraud Detection ===${NC}"
run_test "Get fraud reports" "tools/call" '{
    "name": "getFraudReports",
    "arguments": {}
}'

# Test 17: Claims Processing - Inspections
echo -e "\n${BLUE}=== Claims Processing - Inspections ===${NC}"
run_test "List inspections" "tools/call" '{
    "name": "listInspections",
    "arguments": {}
}'

# Test 18: Claims Processing - Subrogation
echo -e "\n${BLUE}=== Claims Processing - Subrogation ===${NC}"
run_test "List subrogation" "tools/call" '{
    "name": "listSubrogation",
    "arguments": {}
}'

# Test 19: Analytics & Monitoring - Analytics
echo -e "\n${BLUE}=== Analytics & Monitoring - Analytics ===${NC}"
run_test "Get claims summary" "tools/call" '{
    "name": "getClaimsSummary",
    "arguments": {}
}'

run_test "Get policies summary" "tools/call" '{
    "name": "getPoliciesSummary",
    "arguments": {}
}'

run_test "Get loss ratio" "tools/call" '{
    "name": "getLossRatio",
    "arguments": {}
}'

# Test 20: Analytics & Monitoring - Audit Trail
echo -e "\n${BLUE}=== Analytics & Monitoring - Audit Trail ===${NC}"
run_test "Get audit logs" "tools/call" '{
    "name": "getAuditLogs",
    "arguments": {}
}'

# Test 21: Analytics & Monitoring - Telematics
echo -e "\n${BLUE}=== Analytics & Monitoring - Telematics ===${NC}"
run_test "List telematics data" "tools/call" '{
    "name": "listTelematicsData",
    "arguments": {}
}'

# Test 22: Analytics & Monitoring - Notifications
echo -e "\n${BLUE}=== Analytics & Monitoring - Notifications ===${NC}"
run_test "List notifications" "tools/call" '{
    "name": "listNotifications",
    "arguments": {}
}'

# Test 23: Create Operations Test (Customer)
echo -e "\n${BLUE}=== Create Operations Test ===${NC}"
run_test "Create customer" "tools/call" '{
    "name": "createCustomer",
    "arguments": {
        "firstName": "Test",
        "lastName": "User",
        "email": "test@example.com",
        "phone": "+1-555-0100",
        "address": {
            "street": "123 Test St",
            "city": "Test City",
            "state": "TS",
            "zipCode": "12345",
            "country": "USA"
        }
    }
}'

# Print Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Total Tests:  ${TOTAL_TESTS}"
echo -e "${GREEN}Passed:       ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed:       ${FAILED_TESTS}${NC}"

if [ ${FAILED_TESTS} -eq 0 ]; then
    SUCCESS_RATE=100
else
    SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
fi

echo -e "Success Rate: ${SUCCESS_RATE}%"
echo -e "${BLUE}========================================${NC}\n"

# Exit with appropriate code
if [ ${FAILED_TESTS} -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Check the output above.${NC}"
    exit 1
fi
