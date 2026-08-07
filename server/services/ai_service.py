import os
import json
from openai import OpenAI
from datetime import datetime
from fastapi import HTTPException

# Initialize OpenAI client with OpenRouter/Gemini support
API_KEY = os.getenv('OPENAI_API_KEY', 'your_openai_api_key_here')
IS_MOCK = API_KEY == 'your_openai_api_key_here' or not API_KEY

# Determine provider type
IS_OPENROUTER = API_KEY.startswith("sk-or-") if not IS_MOCK else False
IS_GEMINI = API_KEY.startswith("AIzaSy") if not IS_MOCK else False

if not IS_MOCK:
    if IS_OPENROUTER:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=API_KEY,
            default_headers={
                "HTTP-Referer": "http://localhost:3000", # Optional, for OpenRouter rankings
                "X-Title": "PrepSprint Career Planner", # Optional, for OpenRouter rankings
            }
        )
        DEFAULT_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash")
    elif IS_GEMINI:
        client = OpenAI(
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            api_key=API_KEY
        )
        DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
    else:
        client = OpenAI(api_key=API_KEY)
        DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
else:
    client = None
    DEFAULT_MODEL = "mock-mode"

def get_chat_completion(**kwargs):
    if client is None:
        return None
    if IS_GEMINI and "max_tokens" in kwargs:
        del kwargs["max_tokens"]
    return client.chat.completions.create(**kwargs)

class AIService:
    @staticmethod
    def _clean_json_response(text: str) -> str:
        """Removes markdown code block formatting if present."""
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    @staticmethod
    def _get_mock_response(method: str, **kwargs) -> dict:
        """Mock responses for development when API key is missing."""
        if method == "analyze_skill_gaps":
            target_role = kwargs.get("target_role", "Engineer")
            return {
                "status": "success",
                "analysis": json.dumps({
                    "gaps": [
                        {"name": "System Design", "importance": "High", "desc": f"Advanced architectural patterns for {target_role}."},
                        {"name": "Cloud Native Protocols", "importance": "Medium", "desc": "Kubernetes and distributed state management."},
                        {"name": "Security Architecture", "importance": "High", "desc": "Zero-trust networking and IAM policies."}
                    ],
                    "suggestions": [
                        {"name": "Deeper Microservices study", "type": "Architecture"},
                        {"name": "AWS/GCP Professional Certs", "type": "Cloud"}
                    ],
                    "direction": f"Focus on high-level orchestration and state consistency as you scale toward senior {target_role} performance."
                })
            }
        
        if method == "generate_roadmap":
            target_role = kwargs.get("target_role", "Engineer")
            duration = kwargs.get("duration_months", 6)
            phases = []
            for i in range(1, duration + 1):
                phases.append({
                    "name": f"Month {i}: Core Concepts of {target_role}",
                    "description": f"Master the fundamental skills and structures required to build standard programs as a {target_role}.",
                    "importance": f"Lays the crucial groundwork for all subsequent month workflows. Key for technical interviews in {target_role}.",
                    "duration_hours": "40 hours",
                    "difficulty": "Beginner" if i <= 2 else ("Intermediate" if i <= 4 else "Advanced"),
                    "prerequisites": "None" if i == 1 else f"Month {i-1} fundamentals",
                    "subtopics": [
                        "Variables and Variable Declarations (var, final, const)",
                        "Built-in Data Types (Numbers, Strings, Booleans)",
                        "List, Map, and Set Collections",
                        "Functions, Scope, and Parameter Types",
                        "Conditional Blocks and Control Flows",
                        "Loop Declarations (for, while, do-while)",
                        "Object-Oriented Programming (OOP) Essentials",
                        "Classes, Objects, and Constructors",
                        "Inheritance and Class Extensions",
                        "Interfaces and Abstract Primitives",
                        "Mixins and Generics",
                        "Asynchronous Execution Models (Future, Streams)",
                        "Exception Handling (try-catch, throw)"
                    ],
                    "learning_objectives": [
                        f"Write clean, syntactic structure code for {target_role}",
                        "Apply object-oriented and functional programming models",
                        "Manage simple data collections and asynchronous inputs"
                    ],
                    "best_practices": [
                        "Always document logic structures using clean code comments",
                        "Use descriptive camelCase or snake_case names according to style guides",
                        "Always initialize and handle exceptions for critical program steps"
                    ],
                    "common_mistakes": [
                        "Mixing variable scopes or forgetting final/const constraints",
                        "Improper asynchronous executions leading to blocked event threads",
                        "Failing to handle null pointer references or type castings"
                    ],
                    "practice_tasks": [
                        "Create a console calculator supporting optional settings parameters",
                        "Implement class structures modeling a client billing catalog",
                        "Write a mock fetch query parsing a string array using Futures"
                    ],
                    "real_world_use_case": f"Used as the foundational code system in production-grade {target_role} enterprise layouts to build reliable services.",
                    "project": {
                        "title": f"Month {i} Capstone: Build prototype {i}",
                        "description": f"Create a fully functional prototype applying all the technologies learned during Month {i}.",
                        "deliverables": [
                            "Implement secure user inputs and inputs validation",
                            "Integrate dynamic state and database connections",
                            "Configure simple error notifications and unit tests"
                        ]
                    },
                    "next_topic": f"Advanced architectural patterns and framework logic for Month {i+1}."
                })
            return {
                "status": "success",
                "roadmap": json.dumps({"phases": phases})
            }
            
        if method == "analyze_resume":
            return {
                "status": "success",
                "feedback": "This is a mock feedback. Your resume shows strong potential in structural logic but could benefit from more quantitative impact metrics in your experience section."
            }
            
        if method == "generate_interview_questions":
            return {
                "status": "success",
                "questions": json.dumps([
                    {"question": "How do you handle consistency in distributed systems?", "hint": "Think about CAP theorem."},
                    {"question": "Explain the difference between JWT and Session tokens.", "hint": "Stateful vs Stateless."}
                ])
            }
            
        if method == "ask_mentor":
            return {
                "status": "success",
                "answer": "This is a mock answer from your AI mentor. I can recommend you focus on backend scalability. \n- Focus on databases\n- Focus on caching\n- Focus on load balancing"
            }
            
        return {"status": "error", "error": "Mock mode: Unsupported AI method"}

    @staticmethod
    def _handle_credit_exception(e: Exception):
        err_str = str(e)
        if "402" in err_str or "credits" in err_str.lower() or "tokens" in err_str.lower() or "payment" in err_str.lower():
            raise HTTPException(
                status_code=402,
                detail="AI Provider Credits Exceeded: Your AI provider account has run out of tokens or credits. Please upgrade or try again later."
            )
        return {"error": err_str, "status": "error"}

    @staticmethod
    def analyze_resume(resume_text: str) -> dict:
        """Analyze resume using AI"""
        if IS_MOCK:
            return AIService._get_mock_response("analyze_resume")
        try:
            response = get_chat_completion(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a professional resume reviewer. Provide constructive feedback and suggestions for improvement."},
                    {"role": "user", "content": f"Please review this resume and provide suggestions for improvement:\n\n{resume_text}"}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return {"feedback": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return AIService._handle_credit_exception(e)

    @staticmethod
    def generate_interview_questions(difficulty: str = "medium", count: int = 3) -> list:
        """Generate interview questions using AI"""
        if IS_MOCK:
            return AIService._get_mock_response("generate_interview_questions")
        try:
            response = get_chat_completion(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert interview coach. Generate challenging but fair interview questions. Format result as JSON array of objects with 'question' and 'hint' fields."},
                    {"role": "user", "content": f"Generate {count} {difficulty} level technical interview questions for a Software Engineer role."}
                ],
                temperature=0.8,
                max_tokens=800
            )
            return {"questions": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return AIService._handle_credit_exception(e)

    @staticmethod
    def analyze_interview_answer(question: str, answer: str) -> dict:
        """Analyze interview answer and provide feedback"""
        if IS_MOCK:
            return {"feedback": "Mock feedback: Strong technical explanation, slightly improve clarity.", "status": "success"}
        try:
            response = get_chat_completion(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert interview coach providing constructive feedback on candidate answers."},
                    {"role": "user", "content": f"Question: {question}\n\nAnswer: {answer}\n\nProvide feedback on clarity, relevance, and technical accuracy."}
                ],
                temperature=0.7,
                max_tokens=400
            )
            return {"feedback": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return AIService._handle_credit_exception(e)

    @staticmethod
    def generate_career_suggestions(skills: list = None, experience: str = None) -> dict:
        """Generate career path suggestions based on skills and experience"""
        if skills is None:
            skills = []
        if experience is None:
            experience = ""
            
        if isinstance(skills, str):
            experience = f"{skills} {experience}".strip()
            skills = []
            
        if IS_MOCK:
            return {"suggestions": "Mock: Staff Engineer, Solutions Architect.", "status": "success"}
        try:
            skills_str = ', '.join(skills) if skills else "None specified"
            response = get_chat_completion(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a career counselor specializing in tech careers."},
                    {"role": "user", "content": f"Based on these skills: {skills_str} and experience: {experience}, what are the best career paths and next steps?"}
                ],
                temperature=0.8,
                max_tokens=600
            )
            return {"suggestions": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return AIService._handle_credit_exception(e)

    @staticmethod
    def _generate_dynamic_local_roadmap(target_role: str, interests: str, target_level: str) -> str:
        """Create a role-centric dynamic 5-phase roadmap offline.

        Priority: 1) Target Job Role  2) Experience Level  3) User techs (only if relevant).
        Irrelevant user technologies are silently ignored and replaced with
        technologies actually required for the selected job role.
        """

        # ── compact phase builder ────────────────────────────────────
        def _p(name, desc, imp, hrs, subs, obj, bp, cm, task, pt, pd, pdl, nt):
            return {
                "name": name, "description": desc, "importance": imp,
                "duration_hours": hrs, "subtopics": subs,
                "learning_objectives": [obj], "best_practices": [bp],
                "common_mistakes": [cm], "practice_tasks": [task],
                "project": {"title": pt, "description": pd, "deliverables": [pdl]},
                "next_topic": nt
            }

        # ── role registry ────────────────────────────────────────────
        _ROLES = {
            "qa": {
                "kw": ["qa", "quality", "test", "sdet", "tester"],
                "rel": {"html","css","javascript","js","python","java","c#","sql","selenium","cypress","playwright","postman","jmeter","appium","git","jenkins","docker","api","rest","testng","junit","pytest","cucumber","katalon"},
                "sub": ("Selenium", {"cypress": "Cypress", "playwright": "Playwright", "appium": "Appium"}),
            },
            "frontend": {
                "kw": ["frontend","front-end","front end","ui developer","ui engineer","web developer"],
                "rel": {"html","css","javascript","js","typescript","ts","react","vue","angular","svelte","next","nextjs","nuxt","tailwind","sass","scss","webpack","vite","git","figma","node","graphql","redux","jest","cypress","storybook"},
                "sub": ("React", {"vue": "Vue", "angular": "Angular", "svelte": "Svelte"}),
            },
            "backend": {
                "kw": ["backend","back-end","back end","server-side","api developer"],
                "rel": {"python","java","node","nodejs","go","golang","rust","c#","php","ruby","sql","postgresql","mysql","mongodb","redis","docker","kubernetes","git","rest","graphql","grpc","kafka","rabbitmq","django","flask","fastapi","spring","express","nestjs"},
                "sub": ("Python", {"java": "Java", "node": "Node.js", "nodejs": "Node.js", "go": "Go", "golang": "Go", "c#": "C#", "php": "PHP", "ruby": "Ruby", "rust": "Rust"}),
            },
            "fullstack": {
                "kw": ["full stack","fullstack","full-stack","mern","mean"],
                "rel": {"html","css","javascript","js","typescript","react","vue","angular","node","nodejs","python","java","sql","mongodb","postgresql","docker","git","rest","graphql","redis","next","express"},
                "sub": ("React", {"vue": "Vue", "angular": "Angular", "svelte": "Svelte"}),
            },
            "devops": {
                "kw": ["devops","dev ops","sre","site reliability","platform engineer","infrastructure","cloud engineer","cloud architect"],
                "rel": {"linux","bash","shell","python","docker","kubernetes","terraform","ansible","jenkins","git","aws","gcp","azure","prometheus","grafana","nginx","helm","argocd"},
                "sub": ("AWS", {"gcp": "GCP", "azure": "Azure"}),
            },
            "data_science": {
                "kw": ["data scientist","data science","ml engineer","machine learning","ai engineer","artificial intelligence","deep learning"],
                "rel": {"python","r","sql","tensorflow","pytorch","keras","scikit-learn","pandas","numpy","matplotlib","jupyter","spark","hadoop","docker","git","mlflow","airflow","tableau","power bi"},
                "sub": ("TensorFlow", {"pytorch": "PyTorch"}),
            },
            "mobile": {
                "kw": ["mobile","android","ios","flutter","react native","app developer"],
                "rel": {"java","kotlin","swift","dart","flutter","react native","javascript","typescript","firebase","sqlite","git","xcode","android studio","swiftui","jetpack compose"},
                "sub": ("Flutter", {"react native": "React Native", "kotlin": "Kotlin", "swift": "Swift"}),
            },
            "data_engineer": {
                "kw": ["data engineer","data engineering","etl","data pipeline"],
                "rel": {"python","sql","spark","airflow","kafka","hadoop","aws","gcp","azure","docker","git","postgresql","mongodb","snowflake","dbt","terraform","scala","java"},
                "sub": ("Spark", {"kafka": "Kafka", "airflow": "Airflow"}),
            },
            "cybersecurity": {
                "kw": ["cybersecurity","security analyst","pentester","penetration","infosec","soc analyst"],
                "rel": {"linux","python","bash","networking","wireshark","nmap","burp suite","metasploit","sql","git","docker","aws","splunk","kali"},
                "sub": ("Kali Linux", {"splunk": "Splunk"}),
            },
            "sde": {
                "kw": ["sde","software engineer","software developer","programmer","engineer","developer"],
                "rel": {"python","java","javascript","js","typescript","c++","c#","go","rust","sql","git","docker","linux","react","node","spring","django","flask","html","css","mongodb","postgresql","redis","kubernetes","aws","gcp"},
                "sub": ("Python", {"java": "Java", "javascript": "JavaScript", "c++": "C++", "c#": "C#", "go": "Go", "rust": "Rust"}),
            },
        }

        # ── match role ───────────────────────────────────────────────
        role_lower = target_role.lower().strip()
        matched = "sde"
        best_len = 0
        for key, cfg in _ROLES.items():
            for kw in cfg["kw"]:
                if kw in role_lower and len(kw) > best_len:
                    matched = key
                    best_len = len(kw)
        role_cfg = _ROLES[matched]

        # ── filter user techs to relevant ones only ──────────────────
        user_techs = [t.strip().lower() for t in (interests or "").replace(",", " ").split() if t.strip()]
        relevant = [t for t in user_techs if t in role_cfg["rel"]]

        # ── resolve substitutable tool name ──────────────────────────
        default_tool, subs = role_cfg["sub"]
        tool = default_tool
        for ut in relevant:
            if ut in subs:
                tool = subs[ut]
                break

        level = target_level if target_level in ("Beginner", "Intermediate", "Advanced") else "Beginner"
        role_title = target_role.strip() or matched.replace("_", " ").title()

        # =================================================================
        #  P H A S E   D E F I N I T I O N S   (role × level)
        # =================================================================

        # ── QA ENGINEER ──────────────────────────────────────────────
        if matched == "qa":
            if level == "Beginner":
                phases = [
                    _p("Phase 1: Software Testing Fundamentals",
                       "Learn testing types, SDLC, STLC, test case design, and QA methodologies.",
                       "Foundation: Understanding what testing means is required before learning any tool.",
                       "30 hours",
                       ["Testing types: Unit, Integration, System, UAT", "SDLC and STLC lifecycle models", "Writing effective test cases and test plans", "Bug reporting and defect lifecycle management"],
                       "Write well-structured test cases covering positive and negative scenarios.",
                       "Traceability: Link every test case to a requirement for full coverage.",
                       "No Plan: Writing tests without a test plan leads to critical coverage gaps.",
                       "Write 20 test cases for a mock e-commerce checkout flow.",
                       "Test Case Portfolio", "Create a structured test suite for a web application.",
                       "Document test cases with expected results and traceability matrix.",
                       "Manual Testing & Bug Reporting"),
                    _p("Phase 2: Manual Testing & Bug Reporting",
                       "Master test execution, defect logging, regression testing, and exploratory testing.",
                       "Execution: Manual testing skills remain essential even with automation.",
                       "30 hours",
                       ["Test execution and result documentation", "Bug reporting with severity and priority", "Regression and smoke testing strategies", "Exploratory and ad-hoc testing techniques"],
                       "Execute test cycles and report defects with clear reproduction steps.",
                       "Reproducible Steps: Always include exact steps, expected vs actual results in bug reports.",
                       "Vague Bugs: Filing bugs without clear steps makes them impossible to fix.",
                       "Execute a full test cycle on a sample web application and log 10 defects.",
                       "Bug Report Collection", "Create detailed bug reports for a real application.",
                       "File 10 well-structured bug reports with screenshots and severity ratings.",
                       "SQL for Database Testing"),
                    _p("Phase 3: SQL for Database Testing",
                       "Master SQL queries to validate data integrity, backend correctness, and data flows.",
                       "Data Layer: Most applications store data in databases — QA must verify data accuracy.",
                       "35 hours",
                       ["SELECT, INSERT, UPDATE, DELETE operations", "JOINs, subqueries, and aggregate functions", "Data validation and constraint verification", "Database testing strategies and data migration checks"],
                       "Write SQL queries to verify data integrity across multiple tables.",
                       "Targeted Queries: Write precise WHERE clauses to verify specific data conditions.",
                       "SELECT *: Running unfiltered queries on production-sized tables crashes sessions.",
                       "Write 15 SQL validation queries for a mock user-orders database.",
                       "Database Validation Suite", "Build SQL queries to verify data integrity.",
                       "Create a query library validating referential integrity across 5 related tables.",
                       "API Testing with Postman"),
                    _p("Phase 4: API Testing with Postman",
                       "Learn REST API testing, request construction, response validation, and authentication.",
                       "API Layer: Modern applications are API-driven — testing APIs catches backend bugs early.",
                       "35 hours",
                       ["HTTP methods: GET, POST, PUT, DELETE", "Request headers, body, and query parameters", "Response status codes and JSON validation", "Authentication testing: API keys, Bearer tokens"],
                       "Test REST APIs end-to-end using Postman collections and assertions.",
                       "Environment Variables: Use Postman environments to avoid hardcoded URLs and tokens.",
                       "No Assertions: Sending requests without validating responses misses backend errors.",
                       "Build a Postman collection testing 10 endpoints of a sample REST API.",
                       "API Test Collection", "Create a Postman test suite with environment variables.",
                       "Automated Postman collection with pre-request scripts and test assertions.",
                       f"Introduction to {tool} Automation"),
                    _p(f"Phase 5: Introduction to {tool} Automation",
                       f"Learn {tool} basics, element locators (CSS/XPath), and writing your first automated tests.",
                       f"Automation: {tool} is the industry standard for web UI test automation.",
                       "40 hours",
                       [f"{tool} setup and browser driver configuration", "Element locators: ID, CSS selectors, XPath", "Basic actions: click, type, navigate, wait", "Writing and running your first automated test scripts"],
                       f"Write basic {tool} scripts that automate login and form submission flows.",
                       f"Explicit Waits: Use explicit waits in {tool} instead of Thread.sleep for stability.",
                       "Fragile Locators: Using absolute XPaths that break on every minor UI change.",
                       f"Automate a login flow and form submission using {tool}.",
                       "First Automation Suite", f"Build a {tool}-based automated test for a login page.",
                       f"Working {tool} test scripts for login, form fill, and navigation.",
                       "Advanced Test Automation & Frameworks"),
                ]
            elif level == "Intermediate":
                phases = [
                    _p(f"Phase 1: Advanced {tool} Automation",
                       f"Master Page Object Model, data-driven testing, waits, and cross-browser execution in {tool}.",
                       f"Scalability: POM and data-driven patterns make {tool} suites maintainable at scale.",
                       "40 hours",
                       ["Page Object Model (POM) architecture", "Data-driven testing with external data sources", "Explicit and fluent wait strategies", "Cross-browser and headless execution"],
                       f"Build a POM-based {tool} framework with data-driven test cases.",
                       f"Decouple Locators: Keep locators in Page classes, separate from test logic.",
                       "God Objects: Putting all locators and actions in a single file becomes unmaintainable.",
                       f"Refactor 10 test scripts into a clean POM structure with data providers.",
                       f"POM Framework", f"Build a reusable {tool} framework with Page Object Model.",
                       f"Complete POM framework with base page, page objects, and data-driven tests.",
                       "API Automation & CI Integration"),
                    _p("Phase 2: API Automation & CI Integration",
                       "Automate API testing with REST Assured or Newman and integrate tests into CI pipelines.",
                       "Automation: Manual API testing doesn't scale — automated API suites catch regressions fast.",
                       "40 hours",
                       ["REST Assured / Postman Newman for API automation", "Request chaining and dynamic data extraction", "Contract testing and schema validation", "Integrating API tests into Jenkins/GitHub Actions"],
                       "Build automated API test suites that run in CI on every code push.",
                       "Schema Validation: Validate response JSON schemas, not just status codes.",
                       "Hardcoded Data: Using hardcoded test data that breaks when environments change.",
                       "Automate 15 API test cases and configure them in a CI pipeline.",
                       "CI API Test Suite", "Automated API tests running in a CI/CD pipeline.",
                       "API automation suite with CI integration and HTML test reports.",
                       "Performance Testing"),
                    _p("Phase 3: Performance Testing with JMeter",
                       "Learn load testing, stress testing, and performance bottleneck identification using JMeter.",
                       "Performance: Applications that pass functional tests can still fail under real user load.",
                       "40 hours",
                       ["JMeter test plan creation and thread groups", "Load testing, stress testing, and soak testing", "Response time analysis and throughput metrics", "Identifying bottlenecks from performance reports"],
                       "Design and execute load tests that identify performance bottlenecks.",
                       "Realistic Scenarios: Model test loads based on actual production traffic patterns.",
                       "Unrealistic Load: Testing with 10,000 concurrent users when actual peak is 200.",
                       "Create a JMeter test plan simulating 100 concurrent users on a REST API.",
                       "Performance Test Report", "Execute load tests and document bottleneck findings.",
                       "JMeter test plan with HTML report identifying top 3 performance bottlenecks.",
                       "Test Frameworks & BDD"),
                    _p("Phase 4: Test Frameworks & BDD",
                       "Master TestNG/JUnit test frameworks, Cucumber BDD with Gherkin, and advanced reporting.",
                       "Structure: Frameworks provide organization, parallel execution, and clear test reporting.",
                       "40 hours",
                       ["TestNG/JUnit annotations and test configuration", "Cucumber BDD with Gherkin feature files", "Test listeners, retries, and parallel execution", "Allure and Extent reporting integration"],
                       "Write BDD feature files with step definitions and generate visual test reports.",
                       "Readable Gherkin: Write feature files that non-technical stakeholders can understand.",
                       "Implementation in Gherkin: Writing code-level details in feature files instead of behavior.",
                       "Convert 10 test cases into Cucumber BDD scenarios with step definitions.",
                       "BDD Test Suite", "Cucumber BDD framework with reporting integration.",
                       "BDD feature files with step definitions and Allure/Extent HTML reports.",
                       "Docker & Test Environment Management"),
                    _p("Phase 5: Docker & Test Environment Management",
                       "Learn Docker-based test environments, Selenium Grid, and parallel test execution.",
                       "Environments: Consistent test environments eliminate 'works on my machine' failures.",
                       "35 hours",
                       ["Docker basics for QA: images, containers, compose", "Selenium Grid setup for parallel execution", "Test environment provisioning and teardown", "Managing test data and database seeding"],
                       "Set up a Dockerized Selenium Grid running tests in parallel across browsers.",
                       "Isolation: Each test run should start with a clean, known state.",
                       "Shared State: Tests that depend on each other's data create flaky failures.",
                       "Set up a Docker Compose Selenium Grid and run tests across 3 browsers.",
                       "Dockerized Test Grid", "Parallel test execution across browsers using Docker.",
                       "Docker Compose setup with Selenium Grid running cross-browser tests.",
                       "Test Architecture & Security Testing"),
                ]
            else:  # Advanced
                phases = [
                    _p("Phase 1: Test Architecture & Strategy",
                       "Design test pyramids, risk-based strategies, and coverage frameworks for large-scale systems.",
                       "Strategy: Senior QA engineers design testing strategies, not just write test scripts.",
                       "45 hours",
                       ["Test pyramid: unit, integration, E2E proportions", "Risk-based testing and priority matrices", "Coverage analysis and gap identification", "Test strategy documentation for enterprise systems"],
                       "Design a complete test strategy document for a multi-service application.",
                       "Risk Prioritization: Allocate most testing effort to highest-risk, highest-impact areas.",
                       "Inverted Pyramid: Having more E2E tests than unit tests creates slow, brittle suites.",
                       "Create a test strategy for a microservices application with coverage analysis.",
                       "Enterprise Test Strategy", "Complete test architecture for a distributed system.",
                       "Test strategy document with pyramid ratios, risk matrix, and coverage targets.",
                       "Security Testing"),
                    _p("Phase 2: Security Testing & OWASP",
                       "Learn OWASP Top 10, vulnerability scanning, SAST/DAST tools, and security test design.",
                       "Security: A single vulnerability can expose user data — QA must verify security controls.",
                       "40 hours",
                       ["OWASP Top 10 vulnerabilities and mitigations", "SAST and DAST scanning tools (ZAP, SonarQube)", "SQL injection, XSS, and CSRF testing techniques", "Security test case design and compliance checks"],
                       "Identify and report OWASP Top 10 vulnerabilities in a test application.",
                       "Defense in Depth: Test security at every layer — UI, API, database, infrastructure.",
                       "Surface Only: Testing only login security while ignoring API and data-layer vulnerabilities.",
                       "Run OWASP ZAP scan on a test application and document all findings.",
                       "Security Audit Report", "Comprehensive security test report with remediation.",
                       "Security findings report with severity ratings and remediation recommendations.",
                       "Performance Engineering"),
                    _p("Phase 3: Performance Engineering at Scale",
                       "Master APM tools, capacity planning, SLA monitoring, and production performance analysis.",
                       "Scale: Performance issues that appear only under production load require engineering-level analysis.",
                       "45 hours",
                       ["APM tools: New Relic, Datadog, Grafana integration", "Capacity planning and scalability testing", "SLA/SLO monitoring and alerting", "Production performance debugging and profiling"],
                       "Set up performance monitoring and create capacity plans for production systems.",
                       "Baselines: Establish performance baselines before making optimization changes.",
                       "Lab-Only Testing: Performance results in isolated labs often differ from production behavior.",
                       "Set up APM monitoring for a test application and create a capacity plan.",
                       "Performance Engineering Plan", "Production performance monitoring and capacity analysis.",
                       "APM dashboard setup with baseline metrics and capacity planning document.",
                       "Test Infrastructure at Scale"),
                    _p("Phase 4: Test Infrastructure at Scale",
                       "Build scalable test infrastructure with cloud grids, infrastructure as code, and test orchestration.",
                       "Infrastructure: Large organizations need automated, self-service test environments.",
                       "45 hours",
                       ["Cloud test grids: BrowserStack, Sauce Labs, AWS Device Farm", "Infrastructure as Code for test environments", "Test orchestration and pipeline optimization", "Flaky test detection and quarantine strategies"],
                       "Design and build a cloud-based test infrastructure supporting 50+ parallel tests.",
                       "Flaky Detection: Automatically quarantine flaky tests to maintain suite reliability.",
                       "Manual Environments: Manually provisioning test environments creates bottlenecks.",
                       "Build a cloud-based test grid with IaC and flaky test quarantine logic.",
                       "Scalable Test Platform", "Cloud-native test infrastructure with orchestration.",
                       "Cloud test grid setup with IaC, parallel execution, and flaky test management.",
                       "QA Leadership & Process"),
                    _p("Phase 5: QA Leadership & Process Improvement",
                       "Lead QA strategy, mentor teams, establish quality metrics, and drive shift-left testing culture.",
                       "Leadership: Senior QA leaders define quality culture and process across organizations.",
                       "40 hours",
                       ["Quality metrics: defect density, escape rate, coverage %", "Shift-left testing and developer collaboration", "QA team mentoring and knowledge sharing", "Process improvement and test maturity models"],
                       "Define quality metrics and implement a shift-left testing initiative.",
                       "Metrics that Matter: Track metrics that drive decisions, not vanity numbers.",
                       "Gate Mentality: Using QA as a gate instead of embedding quality throughout SDLC.",
                       "Implement a shift-left initiative with measurable quality metrics for a team.",
                       "QA Transformation Plan", "Quality improvement initiative with metrics and mentoring.",
                       "Shift-left implementation plan with KPIs, mentoring schedule, and maturity assessment.",
                       "Continuous Quality Engineering"),
                ]

        # ── FRONTEND DEVELOPER ───────────────────────────────────────
        elif matched == "frontend":
            if level == "Beginner":
                phases = [
                    _p("Phase 1: HTML & Semantic Web Structure",
                       "Learn HTML5 elements, semantic tags, forms, accessibility attributes, and document structure.",
                       "Structure: HTML is the skeleton of every web page — semantic HTML improves SEO and accessibility.",
                       "30 hours",
                       ["HTML5 semantic elements: header, nav, main, section, article", "Forms, inputs, validation attributes", "Accessibility: ARIA roles and alt attributes", "Document structure and meta tags"],
                       "Build accessible, semantic HTML pages that pass W3C validation.",
                       "Semantic First: Use semantic elements (nav, article, aside) instead of generic divs.",
                       "Div Soup: Building entire pages with only div elements hurts accessibility and SEO.",
                       "Build a multi-page HTML website with forms and proper semantic structure.",
                       "Semantic Website", "Create a 3-page website using only semantic HTML5.",
                       "Accessible HTML pages passing W3C validation with proper heading hierarchy.",
                       "CSS Layouts & Responsive Design"),
                    _p("Phase 2: CSS Layouts & Responsive Design",
                       "Master Flexbox, CSS Grid, responsive layouts, media queries, and mobile-first design.",
                       "Layout: CSS layout skills are required for every frontend position and project.",
                       "35 hours",
                       ["Flexbox layout patterns and alignment", "CSS Grid for two-dimensional layouts", "Media queries and responsive breakpoints", "Mobile-first design methodology"],
                       "Build fully responsive layouts that work across mobile, tablet, and desktop.",
                       "Mobile-First: Start with mobile layout and enhance upward for larger screens.",
                       "Fixed Pixels: Using fixed pixel widths instead of relative units breaks responsiveness.",
                       "Recreate a popular website's layout using only Flexbox and Grid.",
                       "Responsive Portfolio", "Build a responsive portfolio page with CSS Grid and Flexbox.",
                       "Pixel-perfect responsive layout matching a design reference across 3 breakpoints.",
                       "JavaScript Fundamentals"),
                    _p("Phase 3: JavaScript Fundamentals",
                       "Master variables, functions, DOM manipulation, events, and asynchronous JavaScript.",
                       "Interactivity: JavaScript makes web pages interactive — it is the language of the browser.",
                       "40 hours",
                       ["Variables, data types, operators, and scope", "Functions, closures, and arrow functions", "DOM selection, manipulation, and traversal", "Event handling and event delegation patterns"],
                       "Write JavaScript that manipulates the DOM and responds to user interactions.",
                       "Event Delegation: Attach events to parent elements instead of individual children.",
                       "Global Variables: Polluting the global scope causes naming conflicts and bugs.",
                       "Build an interactive to-do list with add, delete, filter, and local storage.",
                       "Interactive To-Do App", "Dynamic to-do application with vanilla JavaScript.",
                       "Working to-do app with CRUD operations, filtering, and localStorage persistence.",
                       f"{tool} Fundamentals"),
                    _p(f"Phase 4: {tool} Fundamentals",
                       f"Learn {tool} components, props, state, hooks, JSX syntax, and component lifecycle.",
                       f"Framework: {tool} is the most in-demand frontend framework in the job market.",
                       "45 hours",
                       [f"{tool} project setup and file structure", f"Components, JSX, and props in {tool}", f"State management with useState and useEffect", "Conditional rendering and list iteration"],
                       f"Build multi-component {tool} applications with state and props.",
                       f"Small Components: Keep {tool} components focused on a single responsibility.",
                       f"Prop Drilling: Passing props through many layers instead of using context or state management.",
                       f"Build a weather app using {tool} that fetches data from a public API.",
                       f"{tool} Weather App", f"Dynamic weather application built with {tool}.",
                       f"Working {tool} app with API integration, loading states, and error handling.",
                       "Version Control & Developer Tools"),
                    _p("Phase 5: Version Control & Developer Tools",
                       "Master Git workflows, Chrome DevTools, npm, and deploying your first application.",
                       "Tooling: Professional frontend developers must use Git, npm, and debugging tools daily.",
                       "30 hours",
                       ["Git: init, commit, branch, merge, pull requests", "Chrome DevTools: inspect, console, network, performance", "npm: packages, scripts, dependency management", "Deployment: Netlify, Vercel, or GitHub Pages"],
                       "Use Git for version control and deploy a frontend project to a live URL.",
                       "Small Commits: Make small, focused commits with descriptive messages.",
                       "One Big Commit: Committing all changes at once makes debugging and review impossible.",
                       "Deploy your portfolio project to Vercel and set up a Git branching workflow.",
                       "Live Deployment", "Deploy a frontend project with proper Git workflow.",
                       "Live deployed site with Git history showing feature branches and pull requests.",
                       "Advanced Frontend Patterns"),
                ]
            elif level == "Intermediate":
                phases = [
                    _p(f"Phase 1: Advanced {tool} Patterns",
                       f"Master context API, custom hooks, performance optimization, and advanced component patterns in {tool}.",
                       f"Depth: Real-world {tool} projects require patterns beyond basic state and props.",
                       "40 hours",
                       [f"Context API and global state in {tool}", "Custom hooks for reusable logic", "React.memo, useMemo, useCallback optimization", "Compound components and render props patterns"],
                       f"Build reusable custom hooks and optimize {tool} component rendering.",
                       "Custom Hooks: Extract shared logic into custom hooks for reusability.",
                       f"Premature Optimization: Wrapping everything in memo without measuring actual bottlenecks.",
                       f"Build a dashboard with 5 custom hooks and measurable performance optimizations.",
                       f"Optimized Dashboard", f"Performance-optimized {tool} dashboard with custom hooks.",
                       f"Dashboard with custom hooks, memoization, and React Profiler analysis.",
                       "State Management & Routing"),
                    _p("Phase 2: State Management & Routing",
                       "Learn Redux/Zustand for global state, React Router for navigation, and code splitting.",
                       "Scale: Complex applications need structured state management and client-side routing.",
                       "40 hours",
                       ["Redux Toolkit or Zustand for global state", "React Router: routes, params, nested layouts", "Code splitting and lazy loading with Suspense", "URL-based state and query parameters"],
                       "Build a multi-page app with global state management and protected routes.",
                       "Minimal Global State: Keep state as local as possible; globalize only what's shared.",
                       "Everything Global: Putting all state in Redux/Zustand when local state would suffice.",
                       "Build a multi-page e-commerce app with cart state, routing, and auth guards.",
                       "E-Commerce SPA", "Multi-page e-commerce app with state management and routing.",
                       "SPA with product listing, cart, checkout, auth guards, and persistent state.",
                       "TypeScript for Frontend"),
                    _p("Phase 3: TypeScript for Frontend",
                       "Learn TypeScript types, interfaces, generics, and type-safe component development.",
                       "Type Safety: TypeScript catches bugs at compile time and is required by most employers.",
                       "35 hours",
                       ["TypeScript basics: types, interfaces, enums", "Generics and utility types", f"Typing {tool} components, props, and hooks", "Type-safe API responses and form handling"],
                       f"Convert a JavaScript {tool} project to fully typed TypeScript.",
                       "Strict Mode: Enable strict TypeScript to catch the most errors at compile time.",
                       "Type Any: Using 'any' everywhere defeats the purpose of TypeScript.",
                       f"Convert an existing {tool} project to TypeScript with zero type errors.",
                       "TypeScript Migration", f"Fully typed {tool} application with strict TypeScript.",
                       f"Type-safe {tool} app with typed API layer, components, and custom hooks.",
                       "Testing & Build Tools"),
                    _p("Phase 4: API Integration & Async Patterns",
                       "Master fetch/axios, SWR/React Query, error boundaries, and loading state patterns.",
                       "Data Fetching: Every frontend app needs to fetch, cache, and display server data reliably.",
                       "40 hours",
                       ["Fetch API and Axios for HTTP requests", "React Query/SWR for caching and revalidation", "Error boundaries and fallback UI patterns", "Optimistic updates and pagination"],
                       "Build data-fetching layers with caching, error handling, and loading states.",
                       "Cache First: Use React Query/SWR for automatic caching and background refetching.",
                       "Manual Caching: Implementing custom caching logic when libraries handle it better.",
                       "Build a data dashboard with React Query, infinite scroll, and error boundaries.",
                       "Data Dashboard", "API-driven dashboard with caching and error handling.",
                       "Dashboard with React Query integration, optimistic updates, and error boundaries.",
                       "Testing & Build Configuration"),
                    _p("Phase 5: Testing & Build Tools",
                       "Learn Jest, React Testing Library, Webpack/Vite configuration, and linting setup.",
                       "Quality: Testing and proper build configuration are expected in professional frontend teams.",
                       "40 hours",
                       ["Jest unit testing fundamentals", "React Testing Library for component tests", "Webpack or Vite build configuration", "ESLint, Prettier, and Husky pre-commit hooks"],
                       "Write component tests with React Testing Library and configure build pipelines.",
                       "Test Behavior: Test what users see and do, not implementation details.",
                       "Snapshot Overuse: Relying on snapshot tests instead of meaningful behavioral assertions.",
                       "Write tests for 10 components and set up linting with pre-commit hooks.",
                       "Test Suite Setup", "Component test suite with build and lint configuration.",
                       "Test coverage for key components with ESLint, Prettier, and CI integration.",
                       "Advanced Frontend Architecture"),
                ]
            else:  # Advanced
                phases = [
                    _p("Phase 1: Performance Optimization",
                       "Master Core Web Vitals, bundle analysis, lazy loading, and rendering performance.",
                       "Speed: Google ranks pages by Core Web Vitals — slow sites lose users and SEO rankings.",
                       "45 hours",
                       ["Core Web Vitals: LCP, FID, CLS measurement", "Bundle analysis and tree-shaking", "Image optimization and lazy loading", "Virtual lists and rendering optimization"],
                       "Achieve Lighthouse scores above 90 on a real-world production application.",
                       "Measure First: Use Lighthouse and WebPageTest before guessing what to optimize.",
                       "Blind Optimization: Optimizing code without profiling often misses the real bottleneck.",
                       "Audit a production app, identify top 3 bottlenecks, and improve Lighthouse by 20+ points.",
                       "Performance Audit", "Production performance optimization with measurable results.",
                       "Before/after Lighthouse reports with documented optimization decisions.",
                       "Accessibility & Web Standards"),
                    _p("Phase 2: Accessibility & Web Standards",
                       "Implement WCAG 2.1 compliance, screen reader support, keyboard navigation, and inclusive design.",
                       "Inclusion: Inaccessible websites exclude users and violate legal requirements in many regions.",
                       "35 hours",
                       ["WCAG 2.1 guidelines and compliance levels", "Screen reader testing (NVDA, VoiceOver)", "Keyboard navigation and focus management", "Color contrast, ARIA patterns, and semantic HTML"],
                       "Make a web application fully WCAG 2.1 AA compliant with screen reader support.",
                       "Semantic First: Use native HTML elements before reaching for ARIA attributes.",
                       "ARIA Overuse: Adding ARIA roles to elements that already have native semantics.",
                       "Audit a web app with axe DevTools and fix all accessibility violations.",
                       "Accessibility Remediation", "Full WCAG 2.1 AA compliance for a web application.",
                       "Accessibility audit report with all violations fixed and screen reader verification.",
                       "Advanced Architecture"),
                    _p("Phase 3: Advanced Architecture & SSR",
                       "Design micro-frontends, implement SSR/SSG with Next.js, and build design systems.",
                       "Architecture: Large-scale frontend applications require architectural patterns for maintainability.",
                       "45 hours",
                       ["Micro-frontend architecture patterns", "SSR and SSG with Next.js", "Design system creation and component libraries", "Monorepo management with Nx or Turborepo"],
                       "Architect a micro-frontend system or design system for a large-scale application.",
                       "Module Federation: Use Webpack Module Federation for runtime micro-frontend composition.",
                       "Over-Splitting: Creating micro-frontends for every small feature adds unnecessary complexity.",
                       "Build a design system with 15+ components published as an npm package.",
                       "Design System", "Reusable component library published as a package.",
                       "Storybook-documented design system with tokens, components, and usage guidelines.",
                       "CI/CD & DevOps for Frontend"),
                    _p("Phase 4: CI/CD & DevOps for Frontend",
                       "Build automated testing pipelines, preview deployments, and monitoring for frontend applications.",
                       "Automation: Professional frontend teams require CI/CD, monitoring, and automated quality gates.",
                       "40 hours",
                       ["CI/CD pipelines with GitHub Actions or GitLab CI", "Preview deployments for pull requests", "Error monitoring with Sentry or LogRocket", "Feature flags and A/B testing infrastructure"],
                       "Set up a complete CI/CD pipeline with preview deploys and error monitoring.",
                       "Preview Deploys: Every PR should get an auto-deployed preview URL for review.",
                       "Manual Deploys: Deploying frontend manually creates inconsistency and human error.",
                       "Configure CI/CD with preview deploys, Sentry monitoring, and feature flags.",
                       "Frontend DevOps", "Complete CI/CD and monitoring for a frontend application.",
                       "Automated pipeline with test gates, preview deploys, and production monitoring.",
                       "Technical Leadership"),
                    _p("Phase 5: Technical Leadership & Standards",
                       "Lead frontend architecture decisions, mentor developers, and drive engineering standards.",
                       "Leadership: Senior frontend roles require influencing teams and driving technical direction.",
                       "35 hours",
                       ["Architecture Decision Records (ADRs)", "Code review best practices and style guides", "Mentoring strategies and technical talks", "Technology evaluation and migration planning"],
                       "Lead a frontend technical initiative with documented architecture decisions.",
                       "Write ADRs: Document every major technical decision with context and alternatives.",
                       "Hero Development: Taking all complex work yourself instead of growing the team.",
                       "Write 3 ADRs and mentor a junior developer on a real feature implementation.",
                       "Leadership Initiative", "Lead a cross-team frontend improvement project.",
                       "ADR documents, style guide updates, and mentoring session documentation.",
                       "Continuous Frontend Innovation"),
                ]

        # ── BACKEND DEVELOPER ────────────────────────────────────────
        elif matched == "backend":
            if level == "Beginner":
                phases = [
                    _p(f"Phase 1: {tool} Programming Fundamentals",
                       f"Master variables, functions, OOP, error handling, and core syntax in {tool}.",
                       f"Foundation: {tool} is the primary language — solid fundamentals are non-negotiable.",
                       "35 hours",
                       [f"{tool} variables, data types, and operators", "Functions, scope, closures, and modules", "Object-oriented programming: classes and inheritance", "Error handling with try-catch and exceptions"],
                       f"Write clean, well-structured {tool} programs solving real-world problems.",
                       f"Type Hints: Use type annotations in {tool} for clarity and IDE support.",
                       "No Error Handling: Ignoring exceptions causes silent failures in production.",
                       f"Build a CLI task manager with file I/O and error handling in {tool}.",
                       "CLI Task Manager", f"Terminal-based task manager built with {tool}.",
                       f"Working CLI app with CRUD operations, file persistence, and input validation.",
                       "SQL & Database Basics"),
                    _p("Phase 2: SQL & Database Fundamentals",
                       "Learn relational databases, SQL queries, table design, normalization, and CRUD operations.",
                       "Data: Almost every backend application reads from and writes to a database.",
                       "35 hours",
                       ["Tables, columns, primary and foreign keys", "SELECT, INSERT, UPDATE, DELETE with WHERE clauses", "JOINs: INNER, LEFT, RIGHT, and aggregations", "Database normalization and schema design"],
                       "Design a normalized database schema and write complex queries with JOINs.",
                       "Indexing: Add indexes on frequently queried columns to improve performance.",
                       "No Normalization: Storing redundant data leads to inconsistencies and update anomalies.",
                       "Design a 5-table schema for a blog platform and write 15 complex queries.",
                       "Blog Database", "Normalized database schema with comprehensive SQL queries.",
                       "ER diagram, CREATE TABLE scripts, and 15 queries including JOINs and aggregations.",
                       "REST API Development"),
                    _p("Phase 3: REST API Development",
                       "Build RESTful APIs with routing, middleware, request validation, and JSON responses.",
                       "APIs: Backend developers build APIs that frontend applications and mobile apps consume.",
                       "40 hours",
                       ["REST principles and HTTP methods", "Routing, controllers, and middleware", "Request validation and error responses", "JSON serialization and response formatting"],
                       "Build a complete CRUD REST API with proper error handling and validation.",
                       "Status Codes: Return appropriate HTTP status codes (201, 400, 404, 500) for each scenario.",
                       "200 Everything: Returning 200 OK for errors makes client-side error handling impossible.",
                       "Build a REST API for a bookstore with CRUD endpoints and validation.",
                       "Bookstore API", "RESTful CRUD API with validation and proper HTTP status codes.",
                       "Working REST API with 10+ endpoints, request validation, and error handling.",
                       "Authentication & Security Basics"),
                    _p("Phase 4: Authentication & Security Basics",
                       "Implement password hashing, JWT authentication, input validation, and CORS configuration.",
                       "Security: Unsecured APIs expose user data — authentication is a baseline requirement.",
                       "35 hours",
                       ["Password hashing with bcrypt", "JWT token creation and verification", "Input sanitization and SQL injection prevention", "CORS configuration and rate limiting"],
                       "Implement secure JWT authentication with password hashing and input validation.",
                       "Never Store Plaintext: Always hash passwords with bcrypt — never store them as plain text.",
                       "Rolling Your Own Crypto: Implementing custom authentication instead of using proven libraries.",
                       "Add JWT authentication to the bookstore API with role-based access.",
                       "Secure API", "JWT-authenticated API with password hashing and input validation.",
                       "Authentication middleware with protected routes, role checks, and password hashing.",
                       "Version Control & Deployment"),
                    _p("Phase 5: Git & Basic Deployment",
                       "Master Git workflows, environment variables, and deploying your API to a server.",
                       "Deployment: An API that only runs locally has no value — deployment is essential.",
                       "30 hours",
                       ["Git: branching, merging, pull requests", "Environment variables and .env configuration", "Deployment to Heroku, Railway, or Render", "Basic logging and server monitoring"],
                       "Deploy a backend API to a cloud platform with environment variable management.",
                       "Environment Variables: Never commit secrets — use .env files and server configs.",
                       "Committed Secrets: Pushing API keys or database passwords to Git repositories.",
                       "Deploy the bookstore API to a cloud platform with proper environment config.",
                       "Live API Deployment", "Deploy a backend API to production.",
                       "Live deployed API with environment management and basic health monitoring.",
                       "Advanced Backend Architecture"),
                ]
            elif level == "Intermediate":
                phases = [
                    _p("Phase 1: Advanced Database Design",
                       "Master indexing, transactions, database migrations, and NoSQL with MongoDB.",
                       "Data Scale: Production databases need optimization, migrations, and sometimes NoSQL solutions.",
                       "40 hours",
                       ["Index design and query plan analysis", "Transactions, ACID properties, and locking", "Database migrations and version control", "MongoDB: documents, collections, aggregation pipeline"],
                       "Optimize database queries with indexing and implement transactional operations.",
                       "Migration Scripts: Version-control all schema changes with migration scripts.",
                       "Manual Schema Changes: Altering production tables without migration scripts causes disasters.",
                       "Optimize 10 slow queries with indexes and implement a migration workflow.",
                       "Optimized Data Layer", "Database optimization with migrations and NoSQL integration.",
                       "Query optimization report, migration scripts, and MongoDB aggregation pipelines.",
                       "API Architecture & Documentation"),
                    _p("Phase 2: API Architecture & Documentation",
                       "Design scalable API patterns with versioning, pagination, filtering, and OpenAPI documentation.",
                       "Design: Well-designed APIs are self-documenting, consistent, and easy for clients to consume.",
                       "35 hours",
                       ["RESTful design patterns and resource naming", "Pagination, filtering, and sorting strategies", "API versioning strategies (URL, header, query)", "OpenAPI/Swagger documentation generation"],
                       "Design a production-quality API with documentation, versioning, and pagination.",
                       "Consistent Naming: Use plural nouns for resources (/users, /orders) and HTTP verbs for actions.",
                       "Inconsistent APIs: Mixing naming conventions and response formats confuses API consumers.",
                       "Redesign an API with versioning, pagination, and auto-generated Swagger docs.",
                       "Documented API", "Production-quality API with OpenAPI documentation.",
                       "Versioned API with pagination, filtering, and interactive Swagger documentation.",
                       "Caching & Performance"),
                    _p("Phase 3: Caching & Performance Optimization",
                       "Implement Redis caching, query optimization, connection pooling, and response compression.",
                       "Speed: Slow APIs lose users — caching and optimization are expected skills for mid-level developers.",
                       "40 hours",
                       ["Redis: caching strategies, TTL, invalidation", "Query optimization and N+1 problem solutions", "Connection pooling and resource management", "Response compression and payload optimization"],
                       "Reduce API response times by 50% using caching and query optimization.",
                       "Cache Invalidation: Define clear invalidation strategies before implementing caching.",
                       "Stale Cache: Serving stale data because cache invalidation was not properly designed.",
                       "Add Redis caching to 5 endpoints and optimize database queries with EXPLAIN.",
                       "Performance Optimization", "API performance improvement with caching and profiling.",
                       "Before/after benchmarks showing response time improvements with Redis integration.",
                       "Docker & Containerization"),
                    _p("Phase 4: Docker & Containerization",
                       "Master Dockerfiles, docker-compose, multi-stage builds, and containerized development.",
                       "Containers: Docker eliminates environment inconsistencies and is standard in production.",
                       "35 hours",
                       ["Dockerfiles: layers, caching, multi-stage builds", "Docker Compose for multi-service setups", "Volume management and container networking", "Container security and image optimization"],
                       "Containerize a multi-service application with Docker Compose.",
                       "Multi-Stage Builds: Use multi-stage builds to keep production images small and secure.",
                       "Fat Images: Including development tools and dependencies in production images.",
                       "Containerize the API with a database and Redis using Docker Compose.",
                       "Containerized Stack", "Full application stack running in Docker containers.",
                       "Docker Compose setup with API, database, Redis, and optimized production images.",
                       "Testing & CI/CD"),
                    _p("Phase 5: Testing & CI/CD Pipelines",
                       "Write unit and integration tests, set up test fixtures, and configure automated CI/CD pipelines.",
                       "Quality: Automated tests and CI/CD prevent regressions and enable confident deployments.",
                       "40 hours",
                       ["Unit tests with mocking and dependency injection", "Integration tests with test databases", "Test fixtures, factories, and data seeding", "CI/CD pipelines: GitHub Actions, automated deployments"],
                       "Achieve 80%+ test coverage and set up CI/CD with automated deployments.",
                       "Test Isolation: Each test should run independently with its own data and state.",
                       "Shared Test State: Tests that depend on execution order create intermittent failures.",
                       "Write 30 tests (unit + integration) and configure CI/CD with auto-deploy.",
                       "Tested Pipeline", "Complete test suite with automated CI/CD deployment.",
                       "Test suite with 80%+ coverage and GitHub Actions pipeline with auto-deploy.",
                       "System Design & Scalability"),
                ]
            else:  # Advanced
                phases = [
                    _p("Phase 1: System Design & Scalability",
                       "Design distributed systems with horizontal scaling, load balancing, CDN, and microservices.",
                       "Architecture: Senior backend roles require designing systems that handle millions of users.",
                       "50 hours",
                       ["Horizontal vs vertical scaling strategies", "Load balancers, reverse proxies, and CDN layers", "Microservices vs monolith trade-off analysis", "CAP theorem and distributed consistency models"],
                       "Design a scalable system architecture for a high-traffic application.",
                       "Design for Failure: Assume every component can fail and build resilience in.",
                       "Premature Microservices: Splitting into microservices before understanding domain boundaries.",
                       "Design a system architecture for a million-user chat application.",
                       "System Design Document", "Complete architecture for a high-traffic distributed system.",
                       "Architecture diagram with capacity estimates, failure modes, and scaling strategy.",
                       "Message Queues & Event-Driven"),
                    _p("Phase 2: Message Queues & Event-Driven Architecture",
                       "Implement Kafka/RabbitMQ, event sourcing, CQRS, and asynchronous processing pipelines.",
                       "Decoupling: Event-driven patterns are essential for scalable, resilient microservices.",
                       "45 hours",
                       ["Kafka: topics, partitions, consumer groups", "RabbitMQ: exchanges, queues, routing", "Event sourcing and CQRS patterns", "Dead letter queues and retry strategies"],
                       "Implement an event-driven pipeline with Kafka handling 10K+ messages per second.",
                       "Idempotent Consumers: Design consumers that can safely process the same message twice.",
                       "No Dead Letters: Failing to handle message processing failures loses data silently.",
                       "Build an event-driven order processing system with Kafka and dead letter handling.",
                       "Event Pipeline", "Event-driven microservice communication with Kafka.",
                       "Kafka-based event pipeline with producers, consumers, DLQ, and monitoring.",
                       "Security & Compliance"),
                    _p("Phase 3: Security & Compliance Engineering",
                       "Implement OWASP mitigations, encryption at rest and in transit, secrets management, and audit logs.",
                       "Trust: A single security breach destroys user trust and can incur legal penalties.",
                       "40 hours",
                       ["OWASP Top 10 backend mitigations", "Encryption: TLS, AES, key rotation", "Secrets management: Vault, AWS Secrets Manager", "Audit logging and compliance reporting"],
                       "Conduct a security audit and implement comprehensive protections.",
                       "Least Privilege: Grant minimum permissions required for each service and user.",
                       "Hardcoded Secrets: Storing credentials in code or config files instead of secret managers.",
                       "Implement secrets management and conduct a security audit on an existing API.",
                       "Security Hardening", "Production security improvements with audit logging.",
                       "Security audit report with vault integration, encrypted storage, and audit trails.",
                       "Observability & SRE"),
                    _p("Phase 4: Observability & Site Reliability",
                       "Set up logging, metrics, tracing, alerting, and incident response for production systems.",
                       "Visibility: You cannot fix problems you cannot see — observability is critical for production.",
                       "45 hours",
                       ["Structured logging with correlation IDs", "Metrics: Prometheus, Grafana dashboards", "Distributed tracing with Jaeger or Zipkin", "Alerting, on-call procedures, and incident response"],
                       "Set up full observability for a production service with actionable alerting.",
                       "Correlation IDs: Include trace IDs in every log entry for cross-service debugging.",
                       "Alert Fatigue: Too many non-actionable alerts cause teams to ignore real incidents.",
                       "Set up Prometheus, Grafana, and Jaeger for a microservice application.",
                       "Observability Stack", "Complete monitoring and alerting for production services.",
                       "Grafana dashboards, alert rules, and distributed tracing across services.",
                       "Technical Leadership"),
                    _p("Phase 5: Technical Leadership & Architecture",
                       "Lead architecture decisions, mentor engineers, manage technical debt, and drive standards.",
                       "Impact: Senior engineers influence teams through decisions, not just individual code output.",
                       "35 hours",
                       ["Architecture Decision Records (ADRs)", "Technical debt identification and prioritization", "Code review leadership and engineering standards", "Mentoring and knowledge-sharing programs"],
                       "Lead a technical initiative with documented decisions and measurable team impact.",
                       "Write ADRs: Document decisions with context, alternatives considered, and rationale.",
                       "Undocumented Decisions: Making major technical choices without recorded reasoning.",
                       "Write 3 ADRs, lead a tech debt reduction initiative, and mentor a junior engineer.",
                       "Engineering Leadership", "Technical leadership initiative with mentoring.",
                       "ADR documents, tech debt roadmap, and mentoring outcomes documentation.",
                       "Staff Engineering & Beyond"),
                ]

        # ── DEVOPS / CLOUD ENGINEER ──────────────────────────────────
        elif matched == "devops":
            if level == "Beginner":
                phases = [
                    _p("Phase 1: Linux & Shell Scripting",
                       "Master Linux commands, file system navigation, permissions, and bash scripting.",
                       "Foundation: Linux is the OS of servers — every DevOps task starts with the terminal.",
                       "35 hours",
                       ["Linux file system, navigation, and permissions", "Essential commands: grep, awk, sed, find", "Bash scripting: variables, loops, conditionals", "Process management and system monitoring"],
                       "Write bash scripts to automate common system administration tasks.",
                       "Shellcheck: Always validate scripts with shellcheck to catch common errors.",
                       "Hardcoded Paths: Writing scripts with hardcoded absolute paths that break on other systems.",
                       "Write 5 bash scripts automating log rotation, backup, and monitoring tasks.",
                       "Automation Scripts", "Bash scripts for common sysadmin automation tasks.",
                       "5 documented bash scripts with error handling and logging.",
                       "Networking & Protocols"),
                    _p("Phase 2: Networking & Protocol Fundamentals",
                       "Learn TCP/IP, DNS, HTTP/HTTPS, firewalls, load balancers, and network troubleshooting.",
                       "Networking: DevOps engineers debug network issues daily — protocol knowledge is essential.",
                       "30 hours",
                       ["TCP/IP stack and OSI model layers", "DNS resolution and record types", "HTTP/HTTPS, SSL/TLS certificates", "Firewalls, ports, and basic network security"],
                       "Troubleshoot network connectivity issues using standard diagnostic tools.",
                       "Know Your Ports: Memorize common ports (22, 80, 443, 3306, 5432, 6379) for fast debugging.",
                       "Open Ports: Leaving unnecessary ports exposed to the internet is a security risk.",
                       "Set up a firewall, configure DNS records, and troubleshoot connectivity issues.",
                       "Network Lab", "Hands-on networking setup with DNS and firewall configuration.",
                       "Firewall rules, DNS record configuration, and network troubleshooting documentation.",
                       "Git & Collaboration"),
                    _p("Phase 3: Git & Version Control Workflows",
                       "Master Git branching strategies, pull requests, merge conflicts, and team collaboration.",
                       "Collaboration: Every DevOps pipeline starts with version control — Git mastery is required.",
                       "25 hours",
                       ["Git branching: GitFlow and trunk-based development", "Pull requests, code review, and merge strategies", "Resolving merge conflicts and rebasing", "Git hooks and repository management"],
                       "Manage a Git repository with branching strategy and pull request workflow.",
                       "Branch Protection: Require PR reviews and passing CI before merging to main.",
                       "Direct Push to Main: Pushing directly to the main branch bypasses review and CI checks.",
                       "Set up a Git repository with branch protection, PR templates, and CI triggers.",
                       "Git Workflow Setup", "Professional Git workflow with branch protection.",
                       "Repository with branching strategy, PR templates, and merge policies.",
                       "Docker & Containerization"),
                    _p("Phase 4: Docker & Containerization",
                       "Learn Docker images, containers, Dockerfiles, docker-compose, and container networking.",
                       "Containers: Docker is the foundation of modern deployment — every DevOps role requires it.",
                       "40 hours",
                       ["Docker images, containers, and registries", "Dockerfiles: layers, caching, multi-stage builds", "Docker Compose for multi-container applications", "Container networking and volume management"],
                       "Containerize a multi-service application with Docker Compose.",
                       "Minimal Base Images: Use alpine or distroless images to reduce attack surface.",
                       "Root Containers: Running containers as root increases security vulnerability exposure.",
                       "Containerize a 3-tier application (frontend, API, database) with Docker Compose.",
                       "Containerized App", "Multi-service application running in Docker containers.",
                       "Docker Compose stack with networking, volumes, and health checks.",
                       f"Cloud Fundamentals ({tool})"),
                    _p(f"Phase 5: Cloud Fundamentals — {tool}",
                       f"Learn {tool} core services: compute, storage, networking, IAM, and basic deployment.",
                       f"Cloud: Most production workloads run on {tool} — cloud skills are essential for DevOps.",
                       "40 hours",
                       [f"{tool} account setup, IAM, and security groups", "Compute: EC2/VMs, auto-scaling basics", "Storage: S3/Cloud Storage, databases as a service", "Networking: VPC, subnets, and load balancers"],
                       f"Deploy an application to {tool} with proper IAM, networking, and storage.",
                       "Least Privilege IAM: Grant only the minimum permissions each service needs.",
                       f"Admin Access Everywhere: Using root/{tool} admin credentials for application services.",
                       f"Deploy a containerized application to {tool} with IAM roles and VPC.",
                       f"{tool} Deployment", f"Application deployment on {tool} with security best practices.",
                       f"Deployed app on {tool} with IAM roles, security groups, and basic monitoring.",
                       "Kubernetes & Orchestration"),
                ]
            elif level == "Intermediate":
                phases = [
                    _p("Phase 1: Kubernetes & Container Orchestration",
                       "Master pods, services, deployments, ConfigMaps, secrets, and Helm charts.",
                       "Orchestration: Kubernetes is the industry standard for running containers at scale.",
                       "45 hours",
                       ["Pods, ReplicaSets, and Deployments", "Services, Ingress, and networking", "ConfigMaps, Secrets, and environment management", "Helm charts for templated deployments"],
                       "Deploy a multi-service application to Kubernetes with Helm charts.",
                       "Resource Limits: Always set CPU and memory limits to prevent runaway containers.",
                       "No Limits: Running pods without resource limits can starve the entire cluster.",
                       "Deploy a 3-service app to Kubernetes with Helm, ingress, and health checks.",
                       "K8s Deployment", "Production Kubernetes deployment with Helm charts.",
                       "Helm-managed K8s deployment with services, ingress, and rolling updates.",
                       "CI/CD Pipeline Design"),
                    _p("Phase 2: CI/CD Pipeline Design",
                       "Build multi-stage CI/CD pipelines with Jenkins or GitHub Actions, quality gates, and artifacts.",
                       "Automation: CI/CD pipelines automate testing and deployment — manual deploys are unacceptable.",
                       "40 hours",
                       ["GitHub Actions or Jenkins pipeline design", "Multi-stage pipelines: build, test, deploy", "Quality gates: lint, test, security scan", "Artifact management and release strategies"],
                       "Build a CI/CD pipeline that automatically tests, builds, and deploys on merge.",
                       "Fast Feedback: Keep CI pipeline under 10 minutes for fast developer feedback.",
                       "Slow Pipelines: 30+ minute pipelines that developers ignore or bypass.",
                       "Build a multi-stage GitHub Actions pipeline with test, build, and deploy stages.",
                       "CI/CD Pipeline", "Automated pipeline with quality gates and deployment.",
                       "Working CI/CD pipeline with lint, test, build, and auto-deploy stages.",
                       "Infrastructure as Code"),
                    _p("Phase 3: Infrastructure as Code — Terraform",
                       "Provision cloud infrastructure with Terraform: modules, state management, and workspaces.",
                       "Repeatability: Manual infrastructure setup is error-prone — IaC makes it reproducible and auditable.",
                       "45 hours",
                       ["Terraform basics: providers, resources, variables", "Modules for reusable infrastructure components", "State management: remote backends, locking", "Workspaces for multi-environment management"],
                       "Provision a complete cloud environment using Terraform modules.",
                       "Remote State: Always store Terraform state in a remote backend with locking.",
                       "Local State: Using local Terraform state in a team causes conflicts and state corruption.",
                       "Build Terraform modules for VPC, compute, and database with remote state.",
                       "IaC Foundation", "Terraform-managed cloud infrastructure with modules.",
                       "Terraform modules with remote state, variables, and multi-environment workspaces.",
                       "Monitoring & Observability"),
                    _p("Phase 4: Monitoring & Observability",
                       "Set up Prometheus, Grafana, ELK stack, alerting, and dashboard-driven operations.",
                       "Visibility: Without monitoring, you learn about outages from users instead of dashboards.",
                       "40 hours",
                       ["Prometheus metrics collection and PromQL", "Grafana dashboard design and best practices", "Log aggregation with ELK or Loki", "Alerting rules and incident notification"],
                       "Build a monitoring stack with dashboards and actionable alerting.",
                       "Actionable Alerts: Every alert should have a clear runbook describing what to do.",
                       "Alert Fatigue: Too many alerts that no one acts on — real incidents get ignored.",
                       "Set up Prometheus + Grafana with 5 dashboards and alerting for a K8s cluster.",
                       "Monitoring Stack", "Observability stack with dashboards and alerting.",
                       "Prometheus + Grafana setup with custom dashboards and actionable alert rules.",
                       "Security & Compliance"),
                    _p("Phase 5: DevOps Security & Compliance",
                       "Implement secrets management, container scanning, network policies, and compliance automation.",
                       "Security: DevOps engineers are responsible for securing infrastructure and supply chains.",
                       "35 hours",
                       ["Secrets management with Vault or cloud KMS", "Container image scanning with Trivy/Snyk", "Network policies and zero-trust principles", "Compliance as Code and audit automation"],
                       "Implement secrets management and automated security scanning in CI/CD.",
                       "Shift Left Security: Integrate security scanning into CI/CD, not just production audits.",
                       "Post-Deploy Scanning: Only scanning after deployment means vulnerabilities reach production.",
                       "Add container scanning, secrets management, and network policies to a K8s deployment.",
                       "Secure Infrastructure", "Security-hardened infrastructure with automated scanning.",
                       "Vault integration, Trivy scanning in CI, and K8s network policies.",
                       "Advanced Platform Engineering"),
                ]
            else:  # Advanced
                phases = [
                    _p("Phase 1: Advanced Kubernetes & Service Mesh",
                       "Master operators, auto-scaling, service mesh (Istio), multi-cluster, and GitOps with ArgoCD.",
                       "Scale: Large-scale Kubernetes requires advanced patterns for reliability and observability.",
                       "50 hours",
                       ["Custom operators and CRDs", "HPA, VPA, and cluster auto-scaling", "Istio service mesh: traffic management, mTLS", "GitOps with ArgoCD for declarative deployments"],
                       "Implement GitOps-based deployments with auto-scaling and service mesh.",
                       "GitOps: Use ArgoCD for declarative, auditable, and rollback-friendly deployments.",
                       "Imperative Kubectl: Using kubectl apply manually in production instead of GitOps.",
                       "Set up ArgoCD with Istio service mesh and auto-scaling policies.",
                       "GitOps Platform", "Production GitOps deployment with service mesh.",
                       "ArgoCD-managed deployments with Istio, canary releases, and auto-scaling.",
                       "Platform Engineering"),
                    _p("Phase 2: Platform Engineering & Developer Experience",
                       "Build internal developer platforms, golden paths, self-service infrastructure, and developer portals.",
                       "Productivity: Platform engineering multiplies developer velocity across the organization.",
                       "45 hours",
                       ["Internal developer platforms (IDPs)", "Golden paths and scaffolding templates", "Self-service infrastructure provisioning", "Developer portals with Backstage"],
                       "Build a self-service developer platform reducing onboarding time by 50%.",
                       "Paved Roads: Provide golden paths that make the right thing the easy thing.",
                       "Mandated Tools: Forcing tools without explaining value creates developer resistance.",
                       "Build a Backstage-based developer portal with service templates.",
                       "Developer Platform", "Internal developer platform with self-service capabilities.",
                       "Backstage portal with service catalog, templates, and documentation.",
                       "Reliability Engineering"),
                    _p("Phase 3: Reliability Engineering & Chaos",
                       "Implement SLOs/SLIs, error budgets, chaos engineering, and production resilience testing.",
                       "Resilience: Systems must be tested for failure before failure finds them in production.",
                       "45 hours",
                       ["SLOs, SLIs, and error budget policies", "Chaos engineering with Litmus or Chaos Monkey", "Game days and disaster recovery drills", "Incident management and blameless postmortems"],
                       "Define SLOs and conduct chaos engineering experiments on production-like systems.",
                       "Error Budgets: Use error budgets to balance reliability investment vs feature velocity.",
                       "Blame Culture: Blaming individuals in postmortems prevents honest root cause analysis.",
                       "Define SLOs for 3 services and run chaos experiments testing failure modes.",
                       "Resilience Framework", "SLO-driven reliability with chaos engineering.",
                       "SLO definitions, chaos experiment results, and postmortem templates.",
                       "FinOps & Cost Optimization"),
                    _p("Phase 4: FinOps & Cloud Cost Optimization",
                       "Optimize cloud spending with right-sizing, spot instances, reserved capacity, and cost allocation.",
                       "Cost: Cloud bills grow fast — FinOps skills save organizations millions annually.",
                       "35 hours",
                       ["Resource right-sizing and utilization analysis", "Spot/preemptible instances and savings plans", "Cost allocation tags and chargeback models", "Budget alerts and automated cost controls"],
                       "Reduce cloud spending by 30% through right-sizing and purchase optimization.",
                       "Tag Everything: Enforce cost allocation tags on all resources for visibility.",
                       "Untagged Resources: Resources without cost tags make spending attribution impossible.",
                       "Audit cloud spending, implement right-sizing, and set up budget alerts.",
                       "Cost Optimization", "Cloud cost reduction with automated controls.",
                       "Cost audit report with savings recommendations and automated budget alerts.",
                       "DevOps Leadership"),
                    _p("Phase 5: DevOps Leadership & Strategy",
                       "Lead infrastructure strategy, evaluate vendors, build teams, and drive organizational transformation.",
                       "Influence: Senior DevOps leaders shape technology strategy across the organization.",
                       "35 hours",
                       ["Technology evaluation and vendor selection", "Team building and hiring for DevOps roles", "DevOps maturity models and transformation", "Executive communication and ROI presentation"],
                       "Lead a DevOps transformation initiative with measurable organizational impact.",
                       "Measure Impact: Track DORA metrics (lead time, deploy frequency, MTTR, change failure rate).",
                       "Tools-Only Thinking: Focusing only on tools while ignoring culture and process.",
                       "Implement DORA metrics tracking and present a DevOps maturity assessment.",
                       "DevOps Transformation", "Organization-wide DevOps improvement initiative.",
                       "DORA metrics dashboard, maturity assessment, and improvement roadmap.",
                       "Continuous Platform Innovation"),
                ]

        # ── DATA SCIENTIST / ML ENGINEER ─────────────────────────────
        elif matched == "data_science":
            if level == "Beginner":
                phases = [
                    _p("Phase 1: Python for Data Science",
                       "Master Python fundamentals, Jupyter notebooks, and essential data science libraries.",
                       "Language: Python is the dominant language for data science and machine learning.",
                       "35 hours",
                       ["Python basics: variables, functions, loops, OOP", "Jupyter notebooks and interactive development", "NumPy for numerical computing", "Pandas for data manipulation and analysis"],
                       "Write Python scripts for data loading, cleaning, and basic analysis.",
                       "Vectorize: Use NumPy/Pandas vectorized operations instead of Python loops for speed.",
                       "Loop Everything: Using for-loops on DataFrames instead of vectorized Pandas operations.",
                       "Load, clean, and analyze a real-world dataset using Pandas in Jupyter.",
                       "Data Analysis Notebook", "Exploratory data analysis in Jupyter notebooks.",
                       "Jupyter notebook with data loading, cleaning, transformation, and summary statistics.",
                       "Statistics & Mathematics"),
                    _p("Phase 2: Statistics & Mathematics Foundations",
                       "Learn descriptive statistics, probability, distributions, and hypothesis testing.",
                       "Math: Machine learning IS applied statistics — skipping math leads to misused algorithms.",
                       "35 hours",
                       ["Descriptive statistics: mean, median, variance, std dev", "Probability theory and Bayes' theorem", "Common distributions: normal, binomial, Poisson", "Hypothesis testing and p-values"],
                       "Apply statistical methods to draw valid conclusions from real datasets.",
                       "Check Assumptions: Verify statistical assumptions before applying any test.",
                       "P-Value Hacking: Running many tests until finding a significant result by chance.",
                       "Perform hypothesis tests and distribution analysis on a real-world dataset.",
                       "Statistical Analysis", "Statistical analysis with hypothesis testing.",
                       "Statistical analysis report with visualizations and hypothesis test results.",
                       "SQL & Data Wrangling"),
                    _p("Phase 3: SQL & Data Wrangling",
                       "Master SQL queries for data extraction and Pandas for advanced data transformations.",
                       "Data Prep: Data scientists spend 60-80% of their time cleaning and preparing data.",
                       "35 hours",
                       ["SQL: JOINs, subqueries, window functions", "Data cleaning: missing values, outliers, duplicates", "Feature encoding: one-hot, label, ordinal", "Data merging, reshaping, and aggregation"],
                       "Extract data with SQL and prepare clean, analysis-ready datasets with Pandas.",
                       "Reproducible Pipelines: Script all data cleaning steps for reproducibility.",
                       "Manual Cleaning: Cleaning data manually in Excel instead of scripting it.",
                       "Build a data pipeline that extracts SQL data and prepares it for modeling.",
                       "Data Pipeline", "SQL extraction and Pandas cleaning pipeline.",
                       "Reproducible data cleaning pipeline from SQL source to analysis-ready DataFrame.",
                       "Data Visualization"),
                    _p("Phase 4: Data Visualization & Storytelling",
                       "Create effective visualizations with Matplotlib, Seaborn, and learn data storytelling.",
                       "Communication: Insights that can't be communicated effectively have no business impact.",
                       "30 hours",
                       ["Matplotlib: line, bar, scatter, histogram charts", "Seaborn: statistical visualizations and heatmaps", "Dashboard creation with Plotly or Streamlit", "Data storytelling and presentation techniques"],
                       "Create clear, insight-driven visualizations that communicate findings effectively.",
                       "Label Everything: Always include titles, axis labels, and legends on every chart.",
                       "Chart Junk: Adding unnecessary decorations that obscure the actual data insights.",
                       "Create a visual analysis report with 10 charts telling a data story.",
                       "Visual Report", "Data storytelling with Matplotlib and Seaborn visualizations.",
                       "Visual analysis report with annotated charts and written narrative.",
                       "Introduction to Machine Learning"),
                    _p("Phase 5: Introduction to Machine Learning",
                       "Learn supervised learning fundamentals with scikit-learn: regression, classification, evaluation.",
                       "ML Basics: Understanding core algorithms is prerequisite to all advanced ML work.",
                       "40 hours",
                       ["Linear and logistic regression", "Decision trees and random forests", "Model evaluation: accuracy, precision, recall, F1", "Train/test split and cross-validation"],
                       "Train, evaluate, and compare ML models on a real dataset using scikit-learn.",
                       "Cross-Validate: Always use cross-validation instead of a single train/test split.",
                       "Data Leakage: Accidentally including test data information in training causes inflated metrics.",
                       "Build and compare 3 ML models on a classification dataset with cross-validation.",
                       "ML Model Comparison", "Supervised learning model comparison with scikit-learn.",
                       "Model comparison report with metrics, confusion matrices, and feature importance.",
                       "Advanced Machine Learning"),
                ]
            elif level == "Intermediate":
                phases = [
                    _p("Phase 1: Advanced Machine Learning",
                       "Master ensemble methods, clustering, dimensionality reduction, and hyperparameter tuning.",
                       "Depth: Real-world ML problems require techniques beyond basic classification and regression.",
                       "45 hours",
                       ["Ensemble methods: boosting (XGBoost, LightGBM), bagging", "Clustering: K-Means, DBSCAN, hierarchical", "Dimensionality reduction: PCA, t-SNE, UMAP", "Hyperparameter tuning: Grid, Random, Bayesian search"],
                       "Apply advanced ML algorithms and optimize models with hyperparameter tuning.",
                       "Validation Strategy: Choose validation strategy (k-fold, stratified, time-series) based on data.",
                       "Overfitting: Creating complex models that memorize training data but fail on new data.",
                       "Win a Kaggle competition using ensemble methods and hyperparameter optimization.",
                       "Kaggle Competition", "Advanced ML model with ensemble and optimization.",
                       "Kaggle submission with feature engineering, ensemble model, and optimization log.",
                       "Feature Engineering & Pipelines"),
                    _p("Phase 2: Feature Engineering & ML Pipelines",
                       "Build automated feature engineering, scikit-learn pipelines, and reproducible ML workflows.",
                       "Production: Ad-hoc notebooks don't scale — pipelines make ML reproducible and deployable.",
                       "40 hours",
                       ["Feature engineering: interactions, transformations, binning", "Scikit-learn pipelines and column transformers", "Feature selection and importance analysis", "MLflow for experiment tracking and versioning"],
                       "Build end-to-end ML pipelines with automated feature engineering and tracking.",
                       "Pipeline Everything: Put all preprocessing into scikit-learn Pipelines to prevent data leakage.",
                       "Notebook-Only: Keeping ML code only in notebooks makes it impossible to deploy or reproduce.",
                       "Build a scikit-learn pipeline with MLflow tracking for a real-world dataset.",
                       "ML Pipeline", "Reproducible ML pipeline with experiment tracking.",
                       "Scikit-learn pipeline with MLflow experiments, metrics, and model versioning.",
                       "Deep Learning Fundamentals"),
                    _p(f"Phase 3: Deep Learning with {tool}",
                       f"Learn neural networks, CNNs, training loops, and transfer learning using {tool}.",
                       "Deep Learning: Many modern AI applications (vision, NLP, speech) require deep learning.",
                       "45 hours",
                       ["Neural network architecture: layers, activations, loss functions", f"{tool} basics: tensors, models, training loops", "CNNs for image classification and object detection", "Transfer learning with pre-trained models"],
                       f"Train deep learning models using {tool} achieving state-of-the-art accuracy.",
                       "Start Pre-trained: Use transfer learning from pre-trained models instead of training from scratch.",
                       "Training from Scratch: Training large models from scratch without sufficient data or compute.",
                       f"Fine-tune a pre-trained CNN on a custom image classification dataset using {tool}.",
                       f"Deep Learning Project", f"Image classification model with {tool} and transfer learning.",
                       f"Fine-tuned CNN model with training curves, evaluation metrics, and inference demo.",
                       "NLP & Text Processing"),
                    _p("Phase 4: NLP & Natural Language Processing",
                       "Learn text processing, word embeddings, transformers, and modern NLP with Hugging Face.",
                       "NLP: Text data is everywhere — NLP skills unlock applications in search, chatbots, and analysis.",
                       "45 hours",
                       ["Text preprocessing: tokenization, stemming, TF-IDF", "Word embeddings: Word2Vec, GloVe", "Transformers and attention mechanism concepts", "Hugging Face: pre-trained models for NLP tasks"],
                       "Build NLP applications using transformer models from Hugging Face.",
                       "Pre-trained First: Use Hugging Face pre-trained models before building custom ones.",
                       "Custom Tokenizers: Building custom tokenization when established tools handle it better.",
                       "Build a sentiment analysis system using a fine-tuned Hugging Face model.",
                       "NLP Application", "Sentiment analysis with Hugging Face transformers.",
                       "Fine-tuned transformer model for sentiment analysis with evaluation and API demo.",
                       "ML Deployment & MLOps"),
                    _p("Phase 5: ML Deployment & MLOps",
                       "Deploy models as APIs, build prediction services, and set up model monitoring.",
                       "Production: Models that only run in notebooks deliver zero business value.",
                       "40 hours",
                       ["Model serialization: pickle, ONNX, TorchScript", "FastAPI or Flask for model serving", "Docker containerization for ML services", "Model monitoring: drift detection, performance tracking"],
                       "Deploy an ML model as a production API with monitoring and versioning.",
                       "Monitor Drift: Track data and model drift in production to detect degradation early.",
                       "Fire and Forget: Deploying a model without monitoring causes silent accuracy degradation.",
                       "Deploy an ML model as a FastAPI service with Docker and drift monitoring.",
                       "ML API Service", "Production ML model deployment with monitoring.",
                       "Dockerized ML API with health checks, versioning, and drift detection.",
                       "Advanced MLOps & AI Engineering"),
                ]
            else:  # Advanced
                phases = [
                    _p("Phase 1: Advanced Deep Learning & Research",
                       "Master transformers architecture, GANs, reinforcement learning, and research paper implementation.",
                       "Cutting Edge: Advanced roles require understanding and implementing latest research.",
                       "50 hours",
                       ["Transformer architecture deep dive and custom implementations", "GANs: generator, discriminator, training dynamics", "Reinforcement learning: Q-learning, policy gradient", "Implementing research papers from scratch"],
                       "Implement a research paper and train a custom architecture from scratch.",
                       "Ablation Studies: Systematically vary components to understand their contribution.",
                       "Black Box Models: Using complex architectures without understanding why they work.",
                       "Implement a recent transformer variant paper with ablation experiments.",
                       "Research Implementation", "Custom model implementation from a research paper.",
                       "Paper implementation with ablation study, training logs, and comparison to baseline.",
                       "MLOps Infrastructure"),
                    _p("Phase 2: MLOps Infrastructure at Scale",
                       "Build ML pipeline orchestration, model registries, A/B testing, and automated retraining.",
                       "Scale: Enterprise ML requires infrastructure for training, deploying, and monitoring hundreds of models.",
                       "45 hours",
                       ["Pipeline orchestration: Airflow, Kubeflow, Vertex AI", "Model registries and versioning strategies", "A/B testing and shadow deployment patterns", "Automated retraining triggers and CI/CD for ML"],
                       "Build an end-to-end MLOps platform with automated retraining and A/B testing.",
                       "Automate Retraining: Set up triggers to retrain models when drift is detected.",
                       "Manual Retraining: Manually retraining models on an ad-hoc schedule leads to stale predictions.",
                       "Build an MLOps pipeline with Kubeflow, model registry, and A/B deployment.",
                       "MLOps Platform", "Enterprise MLOps infrastructure with automated pipelines.",
                       "Kubeflow pipeline with model registry, A/B testing, and automated retraining.",
                       "Big Data & Distributed Computing"),
                    _p("Phase 3: Big Data & Distributed ML",
                       "Process large-scale data with Spark, distributed training, and streaming data pipelines.",
                       "Scale: Real-world datasets often exceed single-machine capacity — distributed computing is required.",
                       "45 hours",
                       ["Apache Spark for large-scale data processing", "Distributed training: data parallel, model parallel", "Streaming ML with Kafka and Spark Streaming", "Data lake architecture and partitioning strategies"],
                       "Process TB-scale datasets and train models using distributed computing.",
                       "Partition Wisely: Choose partition keys based on query patterns, not arbitrary columns.",
                       "Collect All: Calling collect() on large Spark DataFrames crashes the driver.",
                       "Build a Spark pipeline processing a large dataset and training a distributed model.",
                       "Distributed ML Pipeline", "Large-scale data processing with distributed training.",
                       "Spark pipeline processing 100GB+ dataset with distributed model training.",
                       "AI Ethics & Responsible AI"),
                    _p("Phase 4: AI Ethics & Responsible AI",
                       "Implement fairness metrics, bias detection, model explainability, and responsible AI practices.",
                       "Trust: Biased AI systems cause real harm — responsible AI is an ethical and legal requirement.",
                       "35 hours",
                       ["Fairness metrics: demographic parity, equalized odds", "Bias detection and mitigation techniques", "Model explainability: SHAP, LIME, attention maps", "AI governance and documentation (Model Cards)"],
                       "Audit an ML model for bias and implement fairness interventions.",
                       "Model Cards: Document model performance across demographic groups for transparency.",
                       "Ignoring Bias: Deploying models without fairness audits harms underrepresented groups.",
                       "Audit a model for demographic bias and implement mitigation strategies.",
                       "Responsible AI Audit", "Model fairness audit with bias mitigation.",
                       "Fairness audit report with bias metrics, mitigation results, and Model Card.",
                       "AI Leadership & Strategy"),
                    _p("Phase 5: AI Strategy & Technical Leadership",
                       "Lead AI initiatives, evaluate build-vs-buy decisions, and align AI with business objectives.",
                       "Impact: Senior AI leaders translate business problems into AI solutions and drive adoption.",
                       "35 hours",
                       ["AI strategy and use case prioritization", "Build vs buy vs fine-tune decision frameworks", "AI team building and talent development", "Stakeholder communication and ROI demonstration"],
                       "Define an AI strategy with prioritized use cases and measurable business impact.",
                       "Start Simple: Begin with high-impact, low-complexity use cases to build trust.",
                       "AI Hammer: Applying AI to every problem when simpler solutions would be more effective.",
                       "Create an AI strategy document with 5 prioritized use cases and ROI estimates.",
                       "AI Strategy", "Enterprise AI strategy with use case prioritization.",
                       "AI strategy document with use case matrix, ROI projections, and implementation roadmap.",
                       "Continuous AI Innovation"),
                ]

        # ── SDE / SOFTWARE ENGINEER (also default fallback) ──────────
        else:
            if level == "Beginner":
                phases = [
                    _p(f"Phase 1: {tool} Programming Fundamentals",
                       f"Master variables, data types, functions, control flow, and error handling in {tool}.",
                       f"Foundation: Strong {tool} fundamentals are the prerequisite for every software engineering role.",
                       "35 hours",
                       [f"{tool} variables, data types, and operators", "Conditionals, loops, and control flow", "Functions, scope, and parameter patterns", "Error handling and exception management"],
                       f"Write clean, well-structured {tool} programs solving real-world problems.",
                       f"Readable Code: Use descriptive variable and function names in {tool} for maintainability.",
                       "No Error Handling: Ignoring exceptions causes silent failures and difficult debugging.",
                       f"Build a CLI task manager with CRUD operations and file persistence in {tool}.",
                       "CLI Application", f"Command-line task manager built with {tool}.",
                       f"Working CLI app with input validation, file I/O, and error handling in {tool}.",
                       "Data Structures & Algorithms"),
                    _p("Phase 2: Data Structures & Algorithms",
                       "Learn arrays, linked lists, trees, hash maps, sorting, searching, and time complexity.",
                       "Problem Solving: DSA is tested in every technical interview and builds algorithmic thinking.",
                       "40 hours",
                       ["Arrays, strings, and hash maps", "Linked lists, stacks, and queues", "Trees, binary search trees, and graphs", "Sorting algorithms and Big-O time complexity"],
                       "Solve algorithmic problems efficiently with optimal time and space complexity.",
                       "Understand Complexity: Always analyze time and space complexity before coding a solution.",
                       "Brute Force Only: Not considering efficient solutions leads to timeout on large inputs.",
                       "Solve 50 problems on LeetCode/HackerRank across easy and medium difficulty.",
                       "DSA Problem Set", "Algorithmic problem solving practice.",
                       "50 solved problems with explanations of approach and complexity analysis.",
                       "SQL & Database Basics"),
                    _p("Phase 3: SQL & Database Fundamentals",
                       "Learn relational databases, SQL queries, table design, JOINs, and normalization.",
                       "Data: Almost every application stores data — SQL skills are essential for all SDE roles.",
                       "30 hours",
                       ["Tables, primary keys, and foreign keys", "SELECT, INSERT, UPDATE, DELETE queries", "JOINs: INNER, LEFT, RIGHT, FULL", "Normalization and basic schema design"],
                       "Design a normalized database schema and write complex multi-table queries.",
                       "Normalization: Design tables to avoid data duplication and update anomalies.",
                       "Denormalized Everything: Storing redundant data leads to inconsistencies.",
                       "Design a 4-table schema for a library system and write 10 complex queries.",
                       "Database Design", "Normalized database with comprehensive SQL queries.",
                       "ER diagram, CREATE TABLE scripts, and SQL queries with JOINs and aggregations.",
                       "Version Control with Git"),
                    _p("Phase 4: Git & Version Control",
                       "Master Git commands, branching, merging, pull requests, and collaborative workflows.",
                       "Collaboration: Git is used in every professional software team — mastery is non-negotiable.",
                       "25 hours",
                       ["Git: init, add, commit, status, log", "Branching, merging, and conflict resolution", "Pull requests and code review basics", "Gitignore, stashing, and repository management"],
                       "Use Git confidently for branching, merging, and collaborative development.",
                       "Small Commits: Make small, atomic commits with descriptive messages for easy review.",
                       "Commit Everything: Committing generated files, dependencies, or secrets to the repository.",
                       "Set up a Git repository with branching strategy and practice merge conflict resolution.",
                       "Git Workflow", "Professional Git workflow with branching and PRs.",
                       "Repository with feature branches, resolved conflicts, and pull request history.",
                       "First Software Project"),
                    _p("Phase 5: First Complete Software Project",
                       "Build a complete project applying all fundamentals: coding, database, testing, and Git.",
                       "Application: Building a real project cements knowledge better than any tutorial or course.",
                       "40 hours",
                       ["Project planning and requirement breakdown", "Clean code principles and documentation", "Basic testing: unit tests and manual testing", "Deployment and presentation of the project"],
                       "Deliver a complete, documented, and tested software project independently.",
                       "Test First: Write tests alongside code — don't leave testing as an afterthought.",
                       "Tutorial Hell: Endlessly watching tutorials without building anything original.",
                       "Build and deploy a complete project with documentation, tests, and Git workflow.",
                       "Portfolio Project", "Complete software project with documentation and testing.",
                       "Deployed project with README, test suite, clean Git history, and documentation.",
                       "Intermediate Software Engineering"),
                ]
            elif level == "Intermediate":
                phases = [
                    _p("Phase 1: Design Patterns & Clean Architecture",
                       "Learn SOLID principles, common design patterns, and clean architecture for maintainable code.",
                       "Craftsmanship: Design patterns and clean code separate professional engineers from beginners.",
                       "40 hours",
                       ["SOLID principles and clean code practices", "Creational patterns: Factory, Builder, Singleton", "Behavioral patterns: Observer, Strategy, Command", "Layered architecture and dependency injection"],
                       "Apply SOLID principles and design patterns to improve code maintainability.",
                       "Composition Over Inheritance: Prefer composition to avoid deep inheritance hierarchies.",
                       "Over-Engineering: Applying patterns everywhere when simple code would suffice.",
                       "Refactor an existing project applying SOLID and at least 3 design patterns.",
                       "Architecture Refactor", "Codebase improvement with design patterns.",
                       "Refactored codebase with pattern documentation and before/after comparison.",
                       "Databases & Data Modeling"),
                    _p("Phase 2: Advanced Databases & Data Modeling",
                       "Master indexing, transactions, ORMs, NoSQL databases, and data migration strategies.",
                       "Data Layer: Mid-level engineers must optimize data access and design schemas for scale.",
                       "40 hours",
                       ["Indexing strategies and query optimization", "Transactions, ACID, and isolation levels", "ORM patterns and migration workflows", "NoSQL: MongoDB document modeling, Redis caching"],
                       "Design optimized database schemas and implement efficient data access layers.",
                       "Migration Scripts: Version-control all schema changes with reversible migrations.",
                       "N+1 Queries: Fetching related data in loops instead of using JOINs or eager loading.",
                       "Optimize slow queries with indexes and implement a MongoDB integration.",
                       "Data Layer", "Optimized database with migrations and NoSQL integration.",
                       "Query optimization report, migration scripts, and NoSQL implementation.",
                       "API Design & Integration"),
                    _p("Phase 3: API Design & Integration",
                       "Build production-quality REST APIs with authentication, documentation, and error handling.",
                       "Integration: APIs are how modern software components communicate — design skills are essential.",
                       "40 hours",
                       ["RESTful API design principles and conventions", "JWT authentication and role-based access control", "OpenAPI/Swagger documentation generation", "Error handling, validation, and rate limiting"],
                       "Design and build a documented, authenticated REST API from scratch.",
                       "API Versioning: Version your APIs from day one to prevent breaking client applications.",
                       "No Documentation: Undocumented APIs are unusable and create constant support burden.",
                       "Build a full REST API with auth, docs, pagination, and rate limiting.",
                       "Production API", "Full-featured REST API with documentation.",
                       "Authenticated API with Swagger docs, pagination, validation, and rate limiting.",
                       "Docker & CI/CD"),
                    _p("Phase 4: Docker & CI/CD Pipelines",
                       "Containerize applications with Docker and build automated CI/CD deployment pipelines.",
                       "Automation: Docker and CI/CD are standard in every professional engineering team.",
                       "40 hours",
                       ["Docker: images, containers, Compose, multi-stage builds", "CI/CD with GitHub Actions or Jenkins", "Automated testing in CI pipelines", "Deployment strategies: blue-green, rolling, canary"],
                       "Containerize an application and deploy it through an automated CI/CD pipeline.",
                       "Multi-Stage Builds: Use multi-stage Docker builds to keep production images small.",
                       "Manual Deploys: Deploying code manually introduces human error and inconsistency.",
                       "Containerize an app with Docker and set up CI/CD with auto-deploy on merge.",
                       "CI/CD Pipeline", "Automated deployment pipeline with Docker.",
                       "Docker Compose setup with CI/CD pipeline running tests and auto-deploying.",
                       "Collaborative Development"),
                    _p("Phase 5: Collaborative Development & Agile",
                       "Practice Git workflows, code reviews, Agile/Scrum, and technical documentation.",
                       "Teamwork: Professional software engineering is a team sport — solo skills alone are insufficient.",
                       "35 hours",
                       ["Git branching strategies: GitFlow, trunk-based", "Code review best practices and feedback", "Agile/Scrum: sprints, standups, retrospectives", "Technical documentation: ADRs and design docs"],
                       "Contribute to a team project with PRs, code reviews, and sprint workflows.",
                       "Small PRs: Keep pull requests small and focused for fast, effective review.",
                       "Giant Merges: Accumulating weeks of work into a single massive merge request.",
                       "Open 3 PRs, review 3 others, and document a technical decision as an ADR.",
                       "Team Project", "Collaborative development with Git workflow and code reviews.",
                       "Merged PRs, code review comments, and architectural documentation.",
                       "Advanced Software Architecture"),
                ]
            else:  # Advanced
                phases = [
                    _p("Phase 1: System Design & Distributed Systems",
                       "Design scalable distributed systems: sharding, replication, consensus, and microservices.",
                       "Architecture: Senior SDE roles require designing systems handling millions of users.",
                       "50 hours",
                       ["Horizontal scaling, sharding, and replication", "Load balancers, CDN, and caching layers", "Microservices: decomposition, communication, data ownership", "CAP theorem, eventual consistency, and distributed transactions"],
                       "Design a scalable system architecture passing a system design interview.",
                       "Trade-Off Awareness: Every design decision is a trade-off — articulate both sides.",
                       "Premature Microservices: Splitting into microservices without clear domain boundaries.",
                       "Design system architectures for 3 different high-scale applications.",
                       "System Design Portfolio", "System design documents for high-scale applications.",
                       "3 system design documents with diagrams, capacity estimates, and trade-off analysis.",
                       "Performance & Optimization"),
                    _p("Phase 2: Performance & Optimization Engineering",
                       "Profile, benchmark, and optimize application performance across the full stack.",
                       "Efficiency: At scale, small inefficiencies compound into major cost and reliability issues.",
                       "45 hours",
                       ["Profiling tools and bottleneck identification", "Database query optimization and indexing strategy", "Memory management and garbage collection tuning", "Caching strategies and cache invalidation patterns"],
                       "Identify and fix the top performance bottlenecks in a production application.",
                       "Measure First: Always profile before optimizing — intuition is frequently wrong.",
                       "Premature Optimization: Optimizing code that isn't the actual bottleneck wastes effort.",
                       "Profile an application, identify top 3 bottlenecks, and optimize them with benchmarks.",
                       "Performance Audit", "Full-stack performance analysis and optimization.",
                       "Before/after benchmarks with documented optimization decisions and measurements.",
                       "Security Engineering"),
                    _p("Phase 3: Security Engineering & Best Practices",
                       "Implement OWASP mitigations, encryption, secrets management, and security auditing.",
                       "Trust: Security vulnerabilities destroy user trust and incur legal and financial penalties.",
                       "40 hours",
                       ["OWASP Top 10 mitigations for backend and frontend", "Encryption at rest, in transit, and key management", "Secrets management with Vault or cloud KMS", "Security auditing, logging, and compliance"],
                       "Conduct a security audit and implement comprehensive security protections.",
                       "Least Privilege: Every service and user should have minimum required permissions.",
                       "Hardcoded Secrets: Storing credentials in code instead of using secret managers.",
                       "Audit an application for OWASP vulnerabilities and implement remediations.",
                       "Security Hardening", "Application security audit and remediation.",
                       "Security audit report with vulnerability fixes and secrets management integration.",
                       "Technical Leadership"),
                    _p("Phase 4: Technical Leadership & Mentoring",
                       "Lead technical decisions, mentor engineers, manage tech debt, and influence team direction.",
                       "Influence: Senior engineers multiply team output through leadership, not just individual code.",
                       "35 hours",
                       ["Architecture Decision Records (ADRs)", "Technical debt management and prioritization", "Code review leadership and quality standards", "Mentoring strategies and knowledge sharing"],
                       "Lead a technical initiative with documented decisions and measurable team impact.",
                       "Write ADRs: Document every major decision with context, alternatives, and rationale.",
                       "Hero Culture: Solving all hard problems yourself instead of growing the team.",
                       "Write 3 ADRs, run a tech debt reduction sprint, and mentor a junior engineer.",
                       "Leadership Initiative", "Technical leadership with mentoring and ADRs.",
                       "ADR documents, tech debt prioritization, and mentoring outcomes.",
                       "Production Operations & SRE"),
                    _p("Phase 5: Production Operations & SRE",
                       "Implement monitoring, alerting, incident response, SLOs, and infrastructure as code.",
                       "Reliability: Code in production needs observability, alerting, and rapid incident response.",
                       "45 hours",
                       ["Observability: logging, metrics, distributed tracing", "SLOs, SLIs, and error budget policies", "Incident response and blameless postmortems", "Infrastructure as Code with Terraform or Pulumi"],
                       "Set up production observability with SLOs and an incident response process.",
                       "Blameless Postmortems: Focus on systems and processes, never on blaming individuals.",
                       "Alert Fatigue: Setting too many alerts that get ignored when real incidents occur.",
                       "Set up monitoring, define SLOs, and write an incident response runbook.",
                       "Production Readiness", "Full production readiness assessment.",
                       "Monitoring setup, SLO definitions, and incident response playbook.",
                       "Staff Engineering & Continuous Growth"),
                ]

        return json.dumps({"phases": phases})

    @staticmethod
    def _get_available_tokens() -> int:
        """Pre-check available OpenRouter credits and convert to output tokens"""
        if IS_MOCK or not IS_OPENROUTER:
            return 5000
        try:
            import urllib.request
            req = urllib.request.Request(
                "https://openrouter.ai/api/v1/auth/key",
                headers={"Authorization": f"Bearer {API_KEY}"}
            )
            with urllib.request.urlopen(req, timeout=3) as res:
                data = json.loads(res.read().decode('utf-8'))
                key_data = data.get("data", {})
                
                # Check is_free_tier flag
                is_free_tier = key_data.get("is_free_tier", False)
                if is_free_tier:
                    return 1000

                limit_remaining = key_data.get("limit_remaining")
                if limit_remaining is None:
                    req_cred = urllib.request.Request(
                        "https://openrouter.ai/api/v1/credits",
                        headers={"Authorization": f"Bearer {API_KEY}"}
                    )
                    with urllib.request.urlopen(req_cred, timeout=3) as res_cred:
                        cred_data = json.loads(res_cred.read().decode('utf-8')).get("data", {})
                        total_credits = cred_data.get("total_credits", 0)
                        total_usage = cred_data.get("total_usage", 0)
                        limit_remaining = max(0.0, total_credits - total_usage)
                
                token_rate = 0.0000003
                margin = 0.00005
                available_usd = max(0.0, limit_remaining - margin)
                return int(available_usd / token_rate)
        except Exception as e:
            print("Failed to fetch credits pre-check:", str(e))
            return 1000

    @staticmethod
    def generate_roadmap(target_role: str, interests: str, target_level: str = "Beginner") -> dict:
        """Generate a structured career roadmap using AI.
        
        Priority order:
          1. Target Job Role (highest)
          2. Experience Level (Beginner / Intermediate / Advanced)
          3. User technologies (only if relevant to the role)
        
        Hard token cap: 100 tokens per request.
        """
        if IS_MOCK:
            return AIService._get_mock_response("generate_roadmap", target_role=target_role, duration_months=5)
            
        # ── Pre-flight credit check ──────────────────────────────────
        available_tokens = AIService._get_available_tokens()
        if available_tokens < 100:
            raise HTTPException(
                status_code=402, 
                detail="Insufficient credits: You need at least 100 tokens to generate a roadmap. Please recharge your OpenRouter account."
            )
        
        # Hard cap: allow sufficient output tokens for complete JSON structure
        MAX_TOKENS = 1500
        
        # ── Level-specific prompt instructions ───────────────────────
        level_instructions = {
            "Beginner": (
                "LEVEL=BEGINNER: The user is a complete beginner. "
                "Focus exclusively on fundamentals, prerequisites, and basic concepts. "
                "Cover: core theory, foundational tools, simple hands-on exercises, and basic terminology. "
                "Do NOT include advanced topics, architecture patterns, or optimization strategies."
            ),
            "Intermediate": (
                "LEVEL=INTERMEDIATE: The user already knows the basics. "
                "Skip all beginner/foundational content. "
                "Focus on practical industry skills, real-world projects, professional tools, CI/CD pipelines, "
                "design patterns, and collaboration workflows. "
                "Do NOT include beginner introductions or advanced expert-level topics."
            ),
            "Advanced": (
                "LEVEL=ADVANCED: The user is experienced. "
                "Skip ALL beginner and intermediate content. "
                "Focus on expert-level topics: system architecture, performance optimization, scalability, "
                "security best practices, team leadership, code review strategies, and real-world production scenarios. "
                "Assume deep existing knowledge."
            ),
        }
        level_prompt = level_instructions.get(target_level, level_instructions["Beginner"])
        
        system_prompt = (
            "You are an elite career counselor. Generate a career roadmap as a JSON object.\n\n"
            "RULES:\n"
            f"1. ROLE-FIRST: The roadmap is for the role '{target_role}'. Determine what skills THIS ROLE actually requires.\n"
            f"2. {level_prompt}\n"
            f"3. SECONDARY INPUT: The user suggested these technologies: '{interests}'. "
            "Use them ONLY if they are genuinely relevant to the target role. "
            "If a technology is irrelevant, IGNORE it and use the correct one for the role instead.\n"
            "4. TOKEN BUDGET: You have ONLY 100 tokens. Be extremely terse.\n\n"
            "Return JSON: {\"phases\":[...]} with exactly 5 objects. "
            "Each object: name, description(5 words max), importance(5 words max), duration_hours, "
            "subtopics(array of 3 strings, 4 words each), "
            "learning_objectives(array of 1 string), best_practices(array of 1 string), "
            "common_mistakes(array of 1 string), practice_tasks(array of 1 string), "
            "project({title,description,deliverables:[1 string]}), next_topic(5 words max)."
        )
        
        user_prompt = (
            f"Role: {target_role}. Level: {target_level}. Suggestions: {interests}."
        )
        
        try:
            response_format = { "type": "json_object" } if not IS_OPENROUTER else None
            response = get_chat_completion(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=MAX_TOKENS,
                response_format=response_format
            )
            return {"roadmap": AIService._clean_json_response(response.choices[0].message.content), "status": "success"}
        except Exception as e:
            err_str = str(e)
            
            # If OpenRouter tells us how many tokens it can afford
            import re
            match = re.search(r"only afford (\d+)", err_str)
            if match:
                affordable = int(match.group(1))
                if affordable < 100:
                    raise HTTPException(
                        status_code=402, 
                        detail=f"Insufficient credits: Only {affordable} tokens remaining. You need at least 100. Please recharge your OpenRouter account."
                    )

            # Fall back to dynamic local roadmap generation
            print("API call failed, generating fallback:", err_str)
            fallback_roadmap = AIService._generate_dynamic_local_roadmap(target_role, interests, target_level)
            return {
                "roadmap": fallback_roadmap, 
                "status": "success",
                "warning": "AI Provider Credits Exceeded: Using offline dynamic blueprint fallback."
            }

    @staticmethod
    def analyze_skill_gaps(
        current_skills: list,
        target_role: str,
        resume_text: str = "",
        job_description: str = "",
        experience_years: str = "0-1"
    ) -> dict:
        """Analyze technical gaps between current skills/resume and target role/job description using AI"""
        if IS_MOCK:
            return AIService._get_mock_response("analyze_skill_gaps", target_role=target_role)
        try:
            response_format = { "type": "json_object" } if not IS_OPENROUTER else None
            
            system_prompt = (
                "You are an expert technical talent architect and senior engineering recruiter. "
                "Analyze the candidate's technical profile (current skills and resume) against the target job role, "
                "experience level, and job description. Evaluate their readiness, identify matching skills, and "
                "uncover critical gaps they must address to get hired. "
                "Your analysis MUST be formatted in structured JSON using the following schema:\n"
                "{\n"
                "  \"readiness_score\": 75, // An integer between 0 and 100 representing their readiness percentage\n"
                "  \"overall_assessment\": \"A detailed 2-3 sentence paragraph assessing their fit, core strengths, and major growth areas.\",\n"
                "  \"matched_skills\": [\"React\", \"Python\"], // List of matching skills found in their resume that align with requirements\n"
                "  \"gaps\": [\n"
                "    {\n"
                "      \"name\": \"System Architecture\", // Name of the gap / missing skill\n"
                "      \"importance\": \"High\", // Importance level: 'Critical', 'High', 'Medium', or 'Low'\n"
                "      \"desc\": \"Brief description of why this gap is critical for the target role.\",\n"
                "      \"how_to_learn\": \"Actionable learning resource, tutorial recommendation, or practice strategy to close this gap.\"\n"
                "    }\n"
                "  ],\n"
                "  \"suggestions\": [\n"
                "    {\n"
                "      \"name\": \"Build a REST API in Spring Boot and deploy it to AWS\", // Actionable next step\n"
                "      \"type\": \"Project\" // Category: 'Learning', 'Project', 'Certification', or 'Resume'\n"
                "    }\n"
                "  ],\n"
                "  \"direction\": \"A high-level summary paragraph providing strategic advice to guide their learning journey toward this role.\",\n"
                "  \"target_role\": \"Software Engineer\" // Confirm target role title\n"
                "}"
            )
            
            user_content = (
                f"Target Role: {target_role}\n"
                f"Experience Level: {experience_years} years\n"
                f"Current Skills: {', '.join(current_skills) if current_skills else 'Not specified'}\n"
            )
            if resume_text:
                user_content += f"\nCandidate Resume Details:\n{resume_text}\n"
            if job_description:
                user_content += f"\nTarget Job Description:\n{job_description}\n"
                
            user_content += "\nIdentify readiness score, matching skills, gaps, suggestions, and provide strategic direction in the exact JSON format specified."

            response = get_chat_completion(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.7,
                max_tokens=1500,
                response_format=response_format
            )
            return {"analysis": AIService._clean_json_response(response.choices[0].message.content), "status": "success"}
        except Exception as e:
            return AIService._handle_credit_exception(e)

    @staticmethod
    def ask_mentor(question: str) -> dict:
        """Answer general career/tech questions as an AI Mentor"""
        if IS_MOCK:
            return AIService._get_mock_response("ask_mentor")
        try:
            system_prompt = (
                "You are a dedicated AI Career Mentor and senior technical lead. Your role is strictly to act as "
                "an experienced software engineer mentoring a learner on technology learning and career growth.\n\n"
                "You must ONLY focus on topics related to technology learning and career growth, such as:\n"
                "- Skill roadmaps\n"
                "- Programming concepts\n"
                "- Technology stacks\n"
                "- Project guidance\n"
                "- Interview preparation\n"
                "- Resume and portfolio advice\n"
                "- Career paths\n"
                "- Learning plans\n"
                "- Best practices\n"
                "- Industry expectations\n"
                "- Debugging approaches\n"
                "- Code explanations\n"
                "- Learning resources\n\n"
                "When answering, guide the user by explaining what to learn, why it matters, how to practice it, "
                "common mistakes to avoid, and what to learn next. Provide step-by-step guidance, practical examples, "
                "project suggestions, and industry-relevant advice wherever appropriate.\n"
                "Maintain a friendly, professional, encouraging, and practical tone. Use clean formatting, spacing, "
                "and markdown headings/bullet lists to structure your response.\n\n"
                "CRITICAL RULE: You are NOT a general-purpose chatbot. If the user asks unrelated questions "
                "(such as entertainment, politics, sports, jokes, recipes, general chitchat, or other non-technical/non-career topics), "
                "you must politely decline to answer, explaining that you are designed specifically for technology "
                "learning and career guidance, and invite them to ask a relevant career or technology question instead.\n\n"
                "At the very end of your response, output a separator '===Suggestions===' on a single line, "
                "followed by exactly 3 follow-up suggestions for the user, one per line (do not prefix them with numbers or symbols, "
                "e.g. 'Explain OOP' or 'Recommend Java roadmap')."
            )
            response = get_chat_completion(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                temperature=0.8,
                max_tokens=2000
            )
            return {"answer": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return AIService._handle_credit_exception(e)

    @staticmethod
    def ask_mentor_with_history(history: list, question: str) -> dict:
        """Answer general career/tech questions as an AI Mentor, incorporating conversation history"""
        if IS_MOCK:
            return AIService._get_mock_response("ask_mentor")
        try:
            system_prompt = (
                "You are a dedicated AI Career Mentor and senior technical lead. Your role is strictly to act as "
                "an experienced software engineer mentoring a learner on technology learning and career growth.\n\n"
                "You must ONLY focus on topics related to technology learning and career growth, such as:\n"
                "- Skill roadmaps\n"
                "- Programming concepts\n"
                "- Technology stacks\n"
                "- Project guidance\n"
                "- Interview preparation\n"
                "- Resume and portfolio advice\n"
                "- Career paths\n"
                "- Learning plans\n"
                "- Best practices\n"
                "- Industry expectations\n"
                "- Debugging approaches\n"
                "- Code explanations\n"
                "- Learning resources\n\n"
                "When answering, guide the user by explaining what to learn, why it matters, how to practice it, "
                "common mistakes to avoid, and what to learn next. Provide step-by-step guidance, practical examples, "
                "project suggestions, and industry-relevant advice wherever appropriate.\n"
                "Maintain a friendly, professional, encouraging, and practical tone. Use clean formatting, spacing, "
                "and markdown headings/bullet lists to structure your response.\n\n"
                "CRITICAL RULE: You are NOT a general-purpose chatbot. If the user asks unrelated questions "
                "(such as entertainment, politics, sports, jokes, recipes, general chitchat, or other non-technical/non-career topics), "
                "you must politely decline to answer, explaining that you are designed specifically for technology "
                "learning and career guidance, and invite them to ask a relevant career or technology question instead.\n\n"
                "At the very end of your response, output a separator '===Suggestions===' on a single line, "
                "followed by exactly 3 follow-up suggestions for the user, one per line (do not prefix them with numbers or symbols, "
                "e.g. 'Explain OOP' or 'Recommend Java roadmap')."
            )
            messages = [
                {"role": "system", "content": system_prompt}
            ]
            for msg in history:
                role = "assistant" if msg.get("sender") == "bot" else "user"
                messages.append({"role": role, "content": msg.get("text", "")})
            
            messages.append({"role": "user", "content": question})
            
            response = get_chat_completion(
                model=DEFAULT_MODEL,
                messages=messages,
                temperature=0.8,
                max_tokens=2000
            )
            return {"answer": response.choices[0].message.content, "status": "success"}
        except Exception as e:
            return AIService._handle_credit_exception(e)

