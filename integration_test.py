#!/usr/bin/env python3
"""
Comprehensive Integration test script for Insurance API Demo
Tests all API endpoints including core and extended features
"""

import os
import sys
import requests
from typing import Optional
from datetime import datetime, timedelta


class Colors:
    """ANSI color codes for terminal output"""

    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    RESET = "\033[0m"
    BOLD = "\033[1m"


class InsuranceAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "X-API-Key": "demo-key-12345",
            "Content-Type": "application/json",
        }
        self.test_results = {"passed": 0, "failed": 0, "total": 0}
        self.created_resources = {
            "policies": [],
            "claims": [],
            "risk_assessments": [],
            "customers": [],
            "quotes": [],
            "payments": [],
            "agents": [],
            "beneficiaries": [],
            "documents": [],
            "renewals": [],
            "inspections": [],
        }
        self.policy_id = None
        self.customer_id = None
        self.quote_id = None
        self.claim_id = None

    def log_test(self, test_name: str, passed: bool, message: str = ""):
        """Log test result with colored output"""
        self.test_results["total"] += 1
        if passed:
            self.test_results["passed"] += 1
            status = f"{Colors.GREEN}✓ PASS{Colors.RESET}"
        else:
            self.test_results["failed"] += 1
            status = f"{Colors.RED}✗ FAIL{Colors.RESET}"

        print(f"{status} - {test_name}")
        if message:
            print(f"      {message}")

    def test_auth_failure(self):
        """Test authentication failure with invalid API key"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Authentication{Colors.RESET}")

        response = requests.get(
            f"{self.base_url}/api/policies", headers={"X-API-Key": "invalid-key"}
        )

        self.log_test(
            "Auth failure with invalid API key",
            response.status_code == 401,
            f"Status: {response.status_code}",
        )

    def test_policies_crud(self) -> Optional[str]:
        """Test Policy CRUD operations"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Policies Endpoints{Colors.RESET}")

        # GET all policies (empty or existing)
        response = requests.get(f"{self.base_url}/api/policies", headers=self.headers)
        self.log_test(
            "GET /api/policies - List all policies",
            response.status_code == 200,
            f"Status: {response.status_code}, Count: {len(response.json())}",
        )

        # POST - Create new policy
        start_date = datetime.utcnow().isoformat() + "Z"
        end_date = (datetime.utcnow() + timedelta(days=365)).isoformat() + "Z"

        new_policy = {
            "policyNumber": "POL-TEST-001",
            "policyType": "auto",
            "holderName": "John Doe",
            "holderEmail": "john.doe@example.com",
            "premium": 1200.50,
            "coverageAmount": 50000.00,
            "startDate": start_date,
            "endDate": end_date,
            "status": "active",
        }

        response = requests.post(
            f"{self.base_url}/api/policies", headers=self.headers, json=new_policy
        )

        policy_id = None
        if response.status_code == 201:
            created_policy = response.json()
            policy_id = created_policy.get("id")
            self.created_resources["policies"].append(policy_id)
            self.policy_id = policy_id

        self.log_test(
            "POST /api/policies - Create new policy",
            response.status_code == 201 and policy_id is not None,
            f"Status: {response.status_code}, ID: {policy_id}",
        )

        if not policy_id:
            return None

        # GET single policy
        response = requests.get(
            f"{self.base_url}/api/policies/{policy_id}", headers=self.headers
        )
        self.log_test(
            f"GET /api/policies/{{id}} - Get policy by ID",
            response.status_code == 200 and response.json().get("id") == policy_id,
            f"Status: {response.status_code}",
        )

        # PUT - Update policy
        update_data = {"premium": 1300.75, "status": "active"}

        response = requests.put(
            f"{self.base_url}/api/policies/{policy_id}",
            headers=self.headers,
            json=update_data,
        )
        self.log_test(
            "PUT /api/policies/{{id}} - Update policy",
            response.status_code == 200 and response.json().get("premium") == 1300.75,
            f"Status: {response.status_code}",
        )

        # Test 404 for non-existent policy
        response = requests.get(
            f"{self.base_url}/api/policies/INVALID-ID", headers=self.headers
        )
        self.log_test(
            "GET /api/policies/{{id}} - 404 for non-existent policy",
            response.status_code == 404,
            f"Status: {response.status_code}",
        )

        return policy_id

    def test_claims_crud(self, policy_id: Optional[str]):
        """Test Claims CRUD operations"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Claims Endpoints{Colors.RESET}")

        if not policy_id:
            policy_id = "TEST-POLICY-ID"

        # GET all claims
        response = requests.get(f"{self.base_url}/api/claims", headers=self.headers)
        self.log_test(
            "GET /api/claims - List all claims",
            response.status_code == 200,
            f"Status: {response.status_code}, Count: {len(response.json())}",
        )

        # POST - Create new claim
        filed_date = datetime.utcnow().isoformat() + "Z"

        new_claim = {
            "claimNumber": "CLM-TEST-001",
            "policyId": policy_id,
            "claimType": "accident",
            "description": "Minor fender bender in parking lot",
            "claimAmount": 2500.00,
            "status": "pending",
            "filedDate": filed_date,
            "notes": "Driver side door dent",
        }

        response = requests.post(
            f"{self.base_url}/api/claims", headers=self.headers, json=new_claim
        )

        claim_id = None
        if response.status_code == 201:
            created_claim = response.json()
            claim_id = created_claim.get("id")
            self.created_resources["claims"].append(claim_id)
            self.claim_id = claim_id

        self.log_test(
            "POST /api/claims - Create new claim",
            response.status_code == 201 and claim_id is not None,
            f"Status: {response.status_code}, ID: {claim_id}",
        )

        if not claim_id:
            return

        # GET single claim
        response = requests.get(
            f"{self.base_url}/api/claims/{claim_id}", headers=self.headers
        )
        self.log_test(
            "GET /api/claims/{{id}} - Get claim by ID",
            response.status_code == 200 and response.json().get("id") == claim_id,
            f"Status: {response.status_code}",
        )

        # PUT - Update claim
        update_data = {"status": "processing", "notes": "Claim under review"}

        response = requests.put(
            f"{self.base_url}/api/claims/{claim_id}",
            headers=self.headers,
            json=update_data,
        )
        self.log_test(
            "PUT /api/claims/{{id}} - Update claim",
            response.status_code == 200,
            f"Status: {response.status_code}",
        )

        # POST - Approve claim
        response = requests.post(
            f"{self.base_url}/api/claims/{claim_id}/approve", headers=self.headers
        )
        self.log_test(
            "POST /api/claims/{{id}}/approve - Approve claim",
            response.status_code == 200 and response.json().get("status") == "approved",
            f"Status: {response.status_code}",
        )

        # Create another claim to test rejection
        new_claim["claimNumber"] = "CLM-TEST-002"
        response = requests.post(
            f"{self.base_url}/api/claims", headers=self.headers, json=new_claim
        )

        if response.status_code == 201:
            claim_id_2 = response.json().get("id")
            self.created_resources["claims"].append(claim_id_2)

            # POST - Reject claim
            response = requests.post(
                f"{self.base_url}/api/claims/{claim_id_2}/reject", headers=self.headers
            )
            self.log_test(
                "POST /api/claims/{{id}}/reject - Reject claim",
                response.status_code == 200
                and response.json().get("status") == "rejected",
                f"Status: {response.status_code}",
            )

    def test_risk_assessment(self, policy_id: Optional[str]):
        """Test Risk Assessment endpoints"""
        print(
            f"\n{Colors.BOLD}{Colors.BLUE}Testing Risk Assessment Endpoints{Colors.RESET}"
        )

        if not policy_id:
            policy_id = "TEST-POLICY-ID"

        # POST - Create risk assessment
        assessment_date = datetime.utcnow().isoformat() + "Z"

        new_assessment = {
            "policyId": policy_id,
            "riskScore": 65,
            "riskLevel": "medium",
            "factors": [
                "Age of driver: 25",
                "Clean driving record",
                "Urban area",
                "High coverage amount",
            ],
            "assessmentDate": assessment_date,
            "assessedBy": "AI Risk Engine v2.1",
            "notes": "Standard risk profile for urban driver",
        }

        response = requests.post(
            f"{self.base_url}/api/risk-assessment",
            headers=self.headers,
            json=new_assessment,
        )

        assessment_id = None
        if response.status_code == 201:
            created_assessment = response.json()
            assessment_id = created_assessment.get("id")
            self.created_resources["risk_assessments"].append(assessment_id)

        self.log_test(
            "POST /api/risk-assessment - Create risk assessment",
            response.status_code == 201 and assessment_id is not None,
            f"Status: {response.status_code}, ID: {assessment_id}",
        )

        # GET - Get risk assessment by policy ID
        response = requests.get(
            f"{self.base_url}/api/risk-assessment/{policy_id}", headers=self.headers
        )
        self.log_test(
            "GET /api/risk-assessment/{{policyId}} - Get risk assessment by policy",
            response.status_code == 200
            and response.json().get("policyId") == policy_id,
            f"Status: {response.status_code}",
        )

        # Test 404 for non-existent policy
        response = requests.get(
            f"{self.base_url}/api/risk-assessment/INVALID-POLICY-ID",
            headers=self.headers,
        )
        self.log_test(
            "GET /api/risk-assessment/{{policyId}} - 404 for non-existent policy",
            response.status_code == 404,
            f"Status: {response.status_code}",
        )

    def test_validation_errors(self):
        """Test validation error handling"""
        print(
            f"\n{Colors.BOLD}{Colors.BLUE}Testing Validation & Error Handling{Colors.RESET}"
        )

        # Invalid policy data (missing required fields)
        invalid_policy = {"policyNumber": "INVALID", "policyType": "invalid_type"}

        response = requests.post(
            f"{self.base_url}/api/policies", headers=self.headers, json=invalid_policy
        )
        self.log_test(
            "POST /api/policies - Validation error for invalid data",
            response.status_code == 400,
            f"Status: {response.status_code}",
        )

        # Invalid claim amount (negative)
        invalid_claim = {
            "claimNumber": "CLM-INVALID",
            "policyId": "TEST-ID",
            "claimType": "accident",
            "description": "Test",
            "claimAmount": -100,
            "status": "pending",
            "filedDate": datetime.utcnow().isoformat() + "Z",
        }

        response = requests.post(
            f"{self.base_url}/api/claims", headers=self.headers, json=invalid_claim
        )
        self.log_test(
            "POST /api/claims - Validation error for negative amount",
            response.status_code == 400,
            f"Status: {response.status_code}",
        )

    def test_customers(self):
        """Test Customer endpoints"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Customer Endpoints{Colors.RESET}")

        # Create customer
        customer_data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "phone": "+1-555-0100",
            "dateOfBirth": "1985-05-15",
            "address": {
                "street": "123 Main St",
                "city": "Springfield",
                "state": "IL",
                "zipCode": "62701",
                "country": "USA",
            },
        }

        response = requests.post(
            f"{self.base_url}/api/customers", headers=self.headers, json=customer_data
        )
        if response.status_code == 201:
            self.customer_id = response.json().get("id")

        self.log_test(
            "POST /api/customers - Create customer",
            response.status_code == 201,
            f"Status: {response.status_code}",
        )

        # Get all customers
        response = requests.get(f"{self.base_url}/api/customers", headers=self.headers)
        self.log_test(
            "GET /api/customers - List customers",
            response.status_code == 200,
            f"Count: {len(response.json())}",
        )

        # Get customer by ID
        if self.customer_id:
            response = requests.get(
                f"{self.base_url}/api/customers/{self.customer_id}",
                headers=self.headers,
            )
            self.log_test(
                "GET /api/customers/{{id}} - Get customer",
                response.status_code == 200,
            )

    def test_quotes(self):
        """Test Quote endpoints"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Quote Endpoints{Colors.RESET}")

        # Create quote
        quote_data = {
            "policyType": "auto",
            "coverageAmount": 50000,
            "customerEmail": "john.doe@example.com",
            "customerName": "John Doe",
        }

        response = requests.post(
            f"{self.base_url}/api/quotes", headers=self.headers, json=quote_data
        )
        if response.status_code == 201:
            self.quote_id = response.json().get("id")

        self.log_test(
            "POST /api/quotes - Create quote",
            response.status_code == 201,
        )

        # Get all quotes
        response = requests.get(f"{self.base_url}/api/quotes", headers=self.headers)
        self.log_test(
            "GET /api/quotes - List quotes",
            response.status_code == 200,
        )

        # Update quote to approved
        if self.quote_id:
            response = requests.put(
                f"{self.base_url}/api/quotes/{self.quote_id}",
                headers=self.headers,
                json={"status": "approved"},
            )
            self.log_test(
                "PUT /api/quotes/{{id}} - Update quote to approved",
                response.status_code == 200,
            )

            # Convert quote to policy
            response = requests.post(
                f"{self.base_url}/api/quotes/{self.quote_id}/convert",
                headers=self.headers,
            )
            if response.status_code == 200:
                self.policy_id = response.json().get("id")
            self.log_test(
                "POST /api/quotes/{{id}}/convert - Convert to policy",
                response.status_code == 200,
            )

    def test_payments(self):
        """Test Payment endpoints"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Payment Endpoints{Colors.RESET}")

        if not self.policy_id:
            print(f"{Colors.YELLOW}Skipping payments - no policy ID{Colors.RESET}")
            return

        # Create payment
        payment_data = {
            "policyId": self.policy_id,
            "amount": 1200.50,
            "paymentMethod": "credit_card",
        }

        response = requests.post(
            f"{self.base_url}/api/payments", headers=self.headers, json=payment_data
        )
        payment_id = None
        if response.status_code == 201:
            payment_id = response.json().get("id")

        self.log_test(
            "POST /api/payments - Create payment",
            response.status_code == 201,
        )

        # Get payments by policy
        response = requests.get(
            f"{self.base_url}/api/payments/policy/{self.policy_id}",
            headers=self.headers,
        )
        self.log_test(
            "GET /api/payments/policy/{{policyId}} - Get payments for policy",
            response.status_code == 200,
        )

    def test_agents(self):
        """Test Agent endpoints"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Agent Endpoints{Colors.RESET}")

        # Create agent
        agent_data = {
            "firstName": "Jane",
            "lastName": "Smith",
            "email": "jane.smith@insurance.com",
            "phone": "+1-555-0200",
            "licenseNumber": "AG-12345",
            "commissionRate": 5.5,
            "territory": "Northeast",
        }

        response = requests.post(
            f"{self.base_url}/api/agents", headers=self.headers, json=agent_data
        )
        self.log_test(
            "POST /api/agents - Create agent",
            response.status_code == 201,
        )

        # Get all agents
        response = requests.get(f"{self.base_url}/api/agents", headers=self.headers)
        self.log_test(
            "GET /api/agents - List agents",
            response.status_code == 200,
        )

    def test_beneficiaries(self):
        """Test Beneficiary endpoints"""
        print(
            f"\n{Colors.BOLD}{Colors.BLUE}Testing Beneficiary Endpoints{Colors.RESET}"
        )

        if not self.policy_id:
            print(
                f"{Colors.YELLOW}Skipping beneficiaries - no policy ID{Colors.RESET}"
            )
            return

        # Create beneficiary
        beneficiary_data = {
            "policyId": self.policy_id,
            "firstName": "Mary",
            "lastName": "Doe",
            "relationship": "spouse",
            "percentage": 100,
        }

        response = requests.post(
            f"{self.base_url}/api/beneficiaries",
            headers=self.headers,
            json=beneficiary_data,
        )
        self.log_test(
            "POST /api/beneficiaries - Create beneficiary",
            response.status_code == 201,
        )

        # Get all beneficiaries
        response = requests.get(
            f"{self.base_url}/api/beneficiaries", headers=self.headers
        )
        self.log_test(
            "GET /api/beneficiaries - List beneficiaries",
            response.status_code == 200,
        )

    def test_documents(self):
        """Test Document endpoints"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Document Endpoints{Colors.RESET}")

        if not self.policy_id:
            print(f"{Colors.YELLOW}Skipping documents - no policy ID{Colors.RESET}")
            return

        # Create document
        document_data = {
            "entityType": "policy",
            "entityId": self.policy_id,
            "documentType": "policy_document",
            "fileName": "policy_agreement.pdf",
            "fileUrl": "https://example.com/documents/policy_agreement.pdf",
        }

        response = requests.post(
            f"{self.base_url}/api/documents", headers=self.headers, json=document_data
        )
        self.log_test(
            "POST /api/documents - Upload document",
            response.status_code == 201,
        )

        # Get all documents
        response = requests.get(f"{self.base_url}/api/documents", headers=self.headers)
        self.log_test(
            "GET /api/documents - List documents",
            response.status_code == 200,
        )

    def test_renewals(self):
        """Test Renewal endpoints"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Renewal Endpoints{Colors.RESET}")

        if not self.policy_id:
            print(f"{Colors.YELLOW}Skipping renewals - no policy ID{Colors.RESET}")
            return

        # Create renewal
        renewal_data = {
            "policyId": self.policy_id,
            "renewalDate": (datetime.utcnow() + timedelta(days=365)).isoformat() + "Z",
            "newPremium": 1300.00,
            "newCoverageAmount": 55000,
        }

        response = requests.post(
            f"{self.base_url}/api/renewals", headers=self.headers, json=renewal_data
        )
        renewal_id = None
        if response.status_code == 201:
            renewal_id = response.json().get("id")

        self.log_test(
            "POST /api/renewals - Create renewal",
            response.status_code == 201,
        )

        # Approve renewal
        if renewal_id:
            response = requests.post(
                f"{self.base_url}/api/renewals/{renewal_id}/approve",
                headers=self.headers,
            )
            self.log_test(
                "POST /api/renewals/{{id}}/approve - Approve renewal",
                response.status_code == 200,
            )

    def test_fraud_detection(self):
        """Test Fraud Detection endpoints"""
        print(
            f"\n{Colors.BOLD}{Colors.BLUE}Testing Fraud Detection Endpoints{Colors.RESET}"
        )

        if not self.claim_id:
            # Create a test claim for fraud detection
            if self.policy_id:
                claim_data = {
                    "claimNumber": "CLM-FRAUD-TEST",
                    "policyId": self.policy_id,
                    "claimType": "theft",
                    "description": "Vehicle stolen from parking lot",
                    "claimAmount": 25000,
                    "status": "pending",
                    "filedDate": datetime.utcnow().isoformat() + "Z",
                }
                response = requests.post(
                    f"{self.base_url}/api/claims", headers=self.headers, json=claim_data
                )
                if response.status_code == 201:
                    self.claim_id = response.json().get("id")

        if not self.claim_id:
            print(f"{Colors.YELLOW}Skipping fraud detection - no claim ID{Colors.RESET}")
            return

        # Analyze claim for fraud
        response = requests.post(
            f"{self.base_url}/api/fraud-detection/analyze",
            headers=self.headers,
            json={"claimId": self.claim_id},
        )
        self.log_test(
            "POST /api/fraud-detection/analyze - Analyze claim",
            response.status_code == 200,
        )

        # Get fraud reports
        response = requests.get(
            f"{self.base_url}/api/fraud-detection/reports", headers=self.headers
        )
        self.log_test(
            "GET /api/fraud-detection/reports - List fraud reports",
            response.status_code == 200,
        )

    def test_analytics(self):
        """Test Analytics endpoints"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Testing Analytics Endpoints{Colors.RESET}")

        # Claims summary
        response = requests.get(
            f"{self.base_url}/api/analytics/claims-summary", headers=self.headers
        )
        self.log_test(
            "GET /api/analytics/claims-summary - Get claims summary",
            response.status_code == 200,
        )

        # Policies summary
        response = requests.get(
            f"{self.base_url}/api/analytics/policies-summary", headers=self.headers
        )
        self.log_test(
            "GET /api/analytics/policies-summary - Get policies summary",
            response.status_code == 200,
        )

        # Loss ratio
        response = requests.get(
            f"{self.base_url}/api/analytics/loss-ratio", headers=self.headers
        )
        self.log_test(
            "GET /api/analytics/loss-ratio - Get loss ratio",
            response.status_code == 200,
        )

    def test_audit_trail(self):
        """Test Audit Trail endpoints"""
        print(
            f"\n{Colors.BOLD}{Colors.BLUE}Testing Audit Trail Endpoints{Colors.RESET}"
        )

        response = requests.get(
            f"{self.base_url}/api/audit-trail", headers=self.headers
        )
        self.log_test(
            "GET /api/audit-trail - List audit logs",
            response.status_code == 200,
        )

    def test_notifications(self):
        """Test Notification endpoints"""
        print(
            f"\n{Colors.BOLD}{Colors.BLUE}Testing Notification Endpoints{Colors.RESET}"
        )

        notification_data = {
            "recipientEmail": "customer@example.com",
            "type": "email",
            "subject": "Policy Renewal Reminder",
            "message": "Your policy is up for renewal next month.",
        }

        response = requests.post(
            f"{self.base_url}/api/notifications",
            headers=self.headers,
            json=notification_data,
        )
        self.log_test(
            "POST /api/notifications - Send notification",
            response.status_code == 201,
        )

    def test_telematics(self):
        """Test Telematics endpoints"""
        print(
            f"\n{Colors.BOLD}{Colors.BLUE}Testing Telematics Endpoints{Colors.RESET}"
        )

        if not self.policy_id:
            print(f"{Colors.YELLOW}Skipping telematics - no policy ID{Colors.RESET}")
            return

        telematics_data = {
            "policyId": self.policy_id,
            "recordDate": datetime.utcnow().isoformat() + "Z",
            "mileage": 15230.5,
            "speed": 65.0,
            "hardBraking": 2,
            "hardAcceleration": 1,
            "nightDriving": 0.15,
        }

        response = requests.post(
            f"{self.base_url}/api/telematics",
            headers=self.headers,
            json=telematics_data,
        )
        self.log_test(
            "POST /api/telematics - Upload telematics data",
            response.status_code == 201,
        )

        # Get telematics by policy
        response = requests.get(
            f"{self.base_url}/api/telematics/policy/{self.policy_id}",
            headers=self.headers,
        )
        self.log_test(
            "GET /api/telematics/policy/{{policyId}} - Get telematics for policy",
            response.status_code == 200,
        )

    def test_inspections(self):
        """Test Inspection endpoints"""
        print(
            f"\n{Colors.BOLD}{Colors.BLUE}Testing Inspection Endpoints{Colors.RESET}"
        )

        if not self.policy_id:
            print(f"{Colors.YELLOW}Skipping inspections - no policy ID{Colors.RESET}")
            return

        inspection_data = {
            "policyId": self.policy_id,
            "inspectionType": "vehicle",
            "scheduledDate": (datetime.utcnow() + timedelta(days=7)).isoformat() + "Z",
            "inspector": "Inspector Smith",
        }

        response = requests.post(
            f"{self.base_url}/api/inspections",
            headers=self.headers,
            json=inspection_data,
        )
        inspection_id = None
        if response.status_code == 201:
            inspection_id = response.json().get("id")

        self.log_test(
            "POST /api/inspections - Schedule inspection",
            response.status_code == 201,
        )

        # Complete inspection
        if inspection_id:
            response = requests.post(
                f"{self.base_url}/api/inspections/{inspection_id}/complete",
                headers=self.headers,
                json={"findings": "Vehicle in good condition", "approved": True},
            )
            self.log_test(
                "POST /api/inspections/{{id}}/complete - Complete inspection",
                response.status_code == 200,
            )

    def test_subrogation(self):
        """Test Subrogation endpoints"""
        print(
            f"\n{Colors.BOLD}{Colors.BLUE}Testing Subrogation Endpoints{Colors.RESET}"
        )

        if not self.claim_id:
            print(f"{Colors.YELLOW}Skipping subrogation - no claim ID{Colors.RESET}")
            return

        subrogation_data = {
            "claimId": self.claim_id,
            "thirdParty": "Acme Insurance Co.",
            "amountSought": 15000,
            "notes": "Other driver at fault, seeking recovery",
        }

        response = requests.post(
            f"{self.base_url}/api/subrogation",
            headers=self.headers,
            json=subrogation_data,
        )
        self.log_test(
            "POST /api/subrogation - Create subrogation case",
            response.status_code == 201,
        )

    def cleanup(self):
        """Clean up created test resources"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}Cleaning Up Test Resources{Colors.RESET}")

        # Delete created policies
        for policy_id in self.created_resources["policies"]:
            try:
                response = requests.delete(
                    f"{self.base_url}/api/policies/{policy_id}", headers=self.headers
                )
                self.log_test(
                    f"DELETE /api/policies/{policy_id[:15]}... - Cleanup",
                    response.status_code == 200,
                    f"Status: {response.status_code}",
                )
            except Exception as e:
                print(f"{Colors.YELLOW}Cleanup warning: {str(e)}{Colors.RESET}")

        # Delete created claims
        for claim_id in self.created_resources["claims"]:
            try:
                response = requests.delete(
                    f"{self.base_url}/api/claims/{claim_id}", headers=self.headers
                )
                self.log_test(
                    f"DELETE /api/claims/{claim_id[:15]}... - Cleanup",
                    response.status_code == 200,
                    f"Status: {response.status_code}",
                )
            except Exception as e:
                print(f"{Colors.YELLOW}Cleanup warning: {str(e)}{Colors.RESET}")

    def print_summary(self):
        """Print test summary"""
        print(f"\n{Colors.BOLD}{'='*60}{Colors.RESET}")
        print(f"{Colors.BOLD}Test Summary{Colors.RESET}")
        print(f"{'='*60}")
        print(f"Total Tests: {self.test_results['total']}")
        print(f"{Colors.GREEN}Passed: {self.test_results['passed']}{Colors.RESET}")
        print(f"{Colors.RED}Failed: {self.test_results['failed']}{Colors.RESET}")

        success_rate = (
            (self.test_results["passed"] / self.test_results["total"] * 100)
            if self.test_results["total"] > 0
            else 0
        )
        print(f"Success Rate: {success_rate:.1f}%")
        print(f"{'='*60}\n")

        return self.test_results["failed"] == 0

    def run_all_tests(self):
        """Run all integration tests"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
        print(
            f"{Colors.BOLD}{Colors.BLUE}Insurance API Comprehensive Integration Tests{Colors.RESET}"
        )
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
        print(f"Base URL: {self.base_url}")

        try:
            # Test authentication
            self.test_auth_failure()

            # Test core endpoints
            policy_id = self.test_policies_crud()
            self.test_claims_crud(policy_id)
            self.test_risk_assessment(policy_id)

            # Test validation
            self.test_validation_errors()

            # Test customer management
            self.test_customers()

            # Test quotes (creates policy_id if needed)
            self.test_quotes()

            # Test payments
            self.test_payments()

            # Test agents
            self.test_agents()

            # Test beneficiaries
            self.test_beneficiaries()

            # Test documents
            self.test_documents()

            # Test renewals
            self.test_renewals()

            # Test fraud detection
            self.test_fraud_detection()

            # Test analytics
            self.test_analytics()

            # Test audit trail
            self.test_audit_trail()

            # Test notifications
            self.test_notifications()

            # Test telematics
            self.test_telematics()

            # Test inspections
            self.test_inspections()

            # Test subrogation
            self.test_subrogation()

            # Cleanup
            self.cleanup()

            # Print summary
            success = self.print_summary()

            return 0 if success else 1

        except requests.exceptions.ConnectionError:
            print(
                f"\n{Colors.RED}ERROR: Could not connect to {self.base_url}{Colors.RESET}"
            )
            print(f"{Colors.YELLOW}Make sure the API server is running{Colors.RESET}")
            return 1
        except Exception as e:
            print(f"\n{Colors.RED}ERROR: {str(e)}{Colors.RESET}")
            import traceback

            traceback.print_exc()
            return 1


def main():
    """Main entry point"""
    base_url = os.getenv("API_BASE_URL", "http://localhost:3000")
    tester = InsuranceAPITester(base_url)
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
