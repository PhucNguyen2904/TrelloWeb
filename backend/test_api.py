#!/usr/bin/env python3
"""
🧪 Complete API Testing Script for FastAPI Trello Clone

Run this script to test all API endpoints:
  python test_api.py
"""

import requests
import json
from datetime import datetime

# Configuration
API_BASE = "http://localhost:8000"
TEST_EMAIL = f"test.user.{datetime.now().timestamp()}@example.com"
TEST_PASSWORD = "Test123456"

# Colors for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
BLUE = "\033[94m"
YELLOW = "\033[93m"
RESET = "\033[0m"

class TestRunner:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.board_id = None
        self.task_id = None
        self.passed = 0
        self.failed = 0

    def print_header(self, text):
        print(f"\n{BLUE}{'='*60}{RESET}")
        print(f"{BLUE}{text}{RESET}")
        print(f"{BLUE}{'='*60}{RESET}")

    def print_success(self, text):
        print(f"{GREEN}✓ {text}{RESET}")
        self.passed += 1

    def print_error(self, text):
        print(f"{RED}✗ {text}{RESET}")
        self.failed += 1

    def print_info(self, text):
        print(f"{YELLOW}ℹ {text}{RESET}")

    def test(self, method, endpoint, data=None, expected_status=None):
        """Test an API endpoint"""
        url = f"{API_BASE}{endpoint}"
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"

        try:
            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, json=data, headers=headers)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=headers)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers)
            
            if expected_status and response.status_code == expected_status:
                return response
            elif not expected_status:
                return response
            else:
                return None
        except Exception as e:
            self.print_error(f"Request failed: {e}")
            return None

    def run_tests(self):
        """Run all tests"""
        self.print_header("🧪 FASTAPI TRELLO CLONE - API TEST SUITE")

        # 1. Health Check
        self.print_header("1️⃣  Health Check")
        response = self.test("GET", "/health", expected_status=200)
        if response and response.status_code == 200:
            self.print_success(f"Health check passed: {response.json()}")
        else:
            self.print_error("Health check failed")
            return

        # 2. Root Endpoint
        self.print_header("2️⃣  Root Endpoint")
        response = self.test("GET", "/", expected_status=200)
        if response and response.status_code == 200:
            data = response.json()
            self.print_success(f"App: {data['name']} v{data['version']}")
            self.print_info(f"Docs available at: {data['docs']}")
        else:
            self.print_error("Root endpoint failed")

        # 3. Register New User
        self.print_header("3️⃣  User Registration")
        response = self.test(
            "POST",
            "/api/auth/register",
            data={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            expected_status=201
        )
        if response and response.status_code == 201:
            user = response.json()
            self.user_id = user["id"]
            self.print_success(f"User registered: {TEST_EMAIL}")
            self.print_info(f"User ID: {self.user_id}")
        else:
            self.print_error("User registration failed")
            return

        # 4. Try Register Duplicate Email
        self.print_header("4️⃣  Duplicate Email Check")
        response = self.test(
            "POST",
            "/api/auth/register",
            data={"email": TEST_EMAIL, "password": "AnotherPass123"}
        )
        if response and response.status_code == 400:
            self.print_success("Duplicate email correctly rejected")
        else:
            self.print_error("Duplicate email should be rejected")

        # 5. Login
        self.print_header("5️⃣  User Login")
        response = self.test(
            "POST",
            "/api/auth/login",
            data={"username": TEST_EMAIL, "password": TEST_PASSWORD},
            expected_status=200
        )
        if response and response.status_code == 200:
            token_data = response.json()
            self.token = token_data["access_token"]
            self.print_success("Login successful")
            self.print_info(f"Token: {self.token[:50]}...")
        else:
            self.print_error("Login failed")
            return

        # 6. Get Current User
        self.print_header("6️⃣  Get Current User")
        response = self.test("GET", "/api/auth/me", expected_status=200)
        if response and response.status_code == 200:
            user = response.json()
            self.print_success(f"Current user: {user['email']}")
            self.print_info(f"Created at: {user['created_at']}")
        else:
            self.print_error("Get current user failed")

        # 7. Wrong Password
        self.print_header("7️⃣  Wrong Password Check")
        response = self.test(
            "POST",
            "/api/auth/login",
            data={"username": TEST_EMAIL, "password": "WrongPassword"}
        )
        if response and response.status_code == 401:
            self.print_success("Wrong password correctly rejected")
        else:
            self.print_error("Wrong password should be rejected")

        # 8. Create Board
        self.print_header("8️⃣  Create Board")
        response = self.test(
            "POST",
            "/api/boards",
            data={"name": "Test Board - Alpha"},
            expected_status=201
        )
        if response and response.status_code == 201:
            board = response.json()
            self.board_id = board["id"]
            self.print_success(f"Board created: {board['name']}")
            self.print_info(f"Board ID: {self.board_id}")
        else:
            self.print_error("Board creation failed")
            return

        # 9. Get All Boards
        self.print_header("9️⃣  Get All Boards")
        response = self.test("GET", "/api/boards", expected_status=200)
        if response and response.status_code == 200:
            boards = response.json()
            self.print_success(f"Retrieved {len(boards)} board(s)")
            for board in boards:
                self.print_info(f"- {board['name']} (ID: {board['id']})")
        else:
            self.print_error("Get boards failed")

        # 10. Get Board Details
        self.print_header("🔟 Get Board Details")
        response = self.test(f"GET", f"/api/boards/{self.board_id}", expected_status=200)
        if response and response.status_code == 200:
            board = response.json()
            self.print_success(f"Board details retrieved: {board['name']}")
        else:
            self.print_error("Get board details failed")

        # 11. Update Board
        self.print_header("1️⃣1️⃣  Update Board")
        response = self.test(
            "PUT",
            f"/api/boards/{self.board_id}",
            data={"name": "Test Board - Alpha (Updated)"},
            expected_status=200
        )
        if response and response.status_code == 200:
            board = response.json()
            self.print_success(f"Board updated: {board['name']}")
        else:
            self.print_error("Board update failed")

        # 12. Create Task
        self.print_header("1️⃣2️⃣  Create Task")
        response = self.test(
            "POST",
            f"/api/boards/{self.board_id}/tasks",
            data={
                "title": "Design Homepage",
                "description": "Create mockups and wireframes",
                "status": "todo"
            },
            expected_status=201
        )
        if response and response.status_code == 201:
            task = response.json()
            self.task_id = task["id"]
            self.print_success(f"Task created: {task['title']}")
            self.print_info(f"Task ID: {self.task_id}, Status: {task['status']}")
        else:
            self.print_error("Task creation failed")
            return

        # 13. Get All Tasks
        self.print_header("1️⃣3️⃣  Get All Tasks in Board")
        response = self.test(f"GET", f"/api/boards/{self.board_id}/tasks", expected_status=200)
        if response and response.status_code == 200:
            tasks = response.json()
            self.print_success(f"Retrieved {len(tasks)} task(s)")
            for task in tasks:
                self.print_info(f"- {task['title']} ({task['status']})")
        else:
            self.print_error("Get tasks failed")

        # 14. Create Additional Tasks
        self.print_header("1️⃣4️⃣  Create More Tasks")
        for i, status in enumerate(["doing", "done"], 1):
            response = self.test(
                "POST",
                f"/api/boards/{self.board_id}/tasks",
                data={
                    "title": f"Task {i+1}",
                    "description": f"Description for task {i+1}",
                    "status": status
                },
                expected_status=201
            )
            if response and response.status_code == 201:
                task = response.json()
                self.print_success(f"Task created: {task['title']} ({task['status']})")
            else:
                self.print_error(f"Failed to create task {i+1}")

        # 15. Update Task
        self.print_header("1️⃣5️⃣  Update Task")
        response = self.test(
            "PUT",
            f"/api/boards/{self.board_id}/tasks/{self.task_id}",
            data={"status": "doing"},
            expected_status=200
        )
        if response and response.status_code == 200:
            task = response.json()
            self.print_success(f"Task updated: {task['title']} → {task['status']}")
        else:
            self.print_error("Task update failed")

        # 16. Get Task Details
        self.print_header("1️⃣6️⃣  Get Task Details")
        response = self.test(f"GET", f"/api/boards/{self.board_id}/tasks/{self.task_id}", expected_status=200)
        if response and response.status_code == 200:
            task = response.json()
            self.print_success(f"Task details: {task['title']}")
            self.print_info(f"Status: {task['status']}, Board ID: {task['board_id']}")
        else:
            self.print_error("Get task details failed")

        # 17. Permission Check - Create Board with Different User
        self.print_header("1️⃣7️⃣  Permission Check (Access Other User's Board)")
        # Would need to register another user for this test
        self.print_info("Skipped (requires second user)")

        # 18. Delete Task
        self.print_header("1️⃣8️⃣  Delete Task")
        # Create a task to delete
        response = self.test(
            "POST",
            f"/api/boards/{self.board_id}/tasks",
            data={"title": "Delete Me", "status": "todo"},
            expected_status=201
        )
        if response:
            temp_task_id = response.json()["id"]
            response = self.test(f"DELETE", f"/api/boards/{self.board_id}/tasks/{temp_task_id}", expected_status=204)
            if response and response.status_code == 204:
                self.print_success("Task deleted successfully")
            else:
                self.print_error("Task deletion failed")

        # 19. Delete Board
        self.print_header("1️⃣9️⃣  Delete Board")
        # Create a board to delete
        response = self.test(
            "POST",
            "/api/boards",
            data={"name": "Delete Me"},
            expected_status=201
        )
        if response:
            temp_board_id = response.json()["id"]
            response = self.test(f"DELETE", f"/api/boards/{temp_board_id}", expected_status=204)
            if response and response.status_code == 204:
                self.print_success("Board deleted successfully")
            else:
                self.print_error("Board deletion failed")

        # Summary
        self.print_header("📊 TEST SUMMARY")
        total = self.passed + self.failed
        percentage = (self.passed / total * 100) if total > 0 else 0
        print(f"{GREEN}✓ Passed: {self.passed}{RESET}")
        print(f"{RED}✗ Failed: {self.failed}{RESET}")
        print(f"{BLUE}Total: {total}{RESET}")
        print(f"{YELLOW}Success Rate: {percentage:.1f}%{RESET}\n")

if __name__ == "__main__":
    runner = TestRunner()
    runner.run_tests()
