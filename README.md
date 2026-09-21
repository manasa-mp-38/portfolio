# 🚀 3D Developer Portfolio — MANASA M P

A complete, production-ready, full-stack 3D developer portfolio website built for **MANASA M P** featuring an interactive **Three.js** frontend with dark glassmorphism aesthetics and a robust **Java 17+ Spring Boot** REST API backend with **Spring Data JPA**, **Spring Security**, and **MySQL** database persistence.

---

## 📌 Project Overview

- **Owner:** MANASA M P
- **Professional Headline:** BCA Student | Python Full Stack Developer | AI & Data Science Enthusiast
- **Contact Email:** [manasamp60@gmail.com](mailto:manasamp60@gmail.com)
- **Phone:** +91 8147191049
- **Location:** Budigere Cross, Bangalore, Karnataka
- **LinkedIn:** [https://www.linkedin.com/in/manasa-m-p-manasa-7a9645370](https://www.linkedin.com/in/manasa-m-p-manasa-7a9645370)

---

## 🛠️ Technology Stack

### Frontend
- **HTML5 & Modern CSS3:** Semantic markup, CSS Custom Properties, and responsive flexbox/grid layout.
- **Bootstrap 5 & Bootstrap Icons:** Mobile-first layout system, accessible UI elements, and icon set.
- **Three.js (r128):**
  - Interactive **3D Laptop / Futuristic Workspace** with animated glowing code texture, floating syntax elements, particle constellation, and cursor parallax tracking.
  - Interactive **3D Skills Sphere** mathematically distributed via the Fibonacci sphere algorithm with mouse drag rotation, orbital nodes, and raycasting click inspectors.
- **GSAP (GreenSock Animation Platform):** Smooth section reveals, staggered entrance transitions, and card interactions.
- **Vanilla JavaScript (ES6+):** REST API client (`fetch`), dynamic validation, modal controllers, and accessibility toggles. *(No heavy frameworks: React, Angular, or Vue were avoided as requested).*

### Backend
- **Java 17+**
- **Spring Boot 3.x:** Microservices-ready layered REST architecture.
- **Spring Web:** RESTful API endpoints and CORS configuration.
- **Spring Data JPA & Hibernate:** Object-Relational Mapping (ORM) with schema auto-generation.
- **Spring Security:** Role-based HTTP Basic and session authentication protecting administrative contact management endpoints.
- **Spring Validation:** Jakarta Bean Validation (`@NotBlank`, `@Email`, `@Size`) with custom error response mappings.
- **MySQL Connector/J:** Native high-performance relational database connectivity.
- **Maven:** Dependency management and build lifecycle automation.

---

## 📂 Project Architecture

```
3D-Portfolio/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/manasa/portfolio/
│   │   ├── PortfolioApplication.java          # Spring Boot Main Entry Point
│   │   ├── config/
│   │   │   ├── CorsConfig.java                # Global Cross-Origin Configuration
│   │   │   └── SecurityConfig.java            # Spring Security 6 & Role Auth
│   │   ├── controller/
│   │   │   ├── ContactMessageController.java  # REST Controller (/api/contact)
│   │   │   └── AdminController.java           # Admin Auth Controller (/api/admin)
│   │   ├── dto/
│   │   │   ├── ApiResponse.java               # Standardized JSON Response Wrapper
│   │   │   ├── ContactMessageDTO.java         # Validated Request Payload
│   │   │   ├── LoginRequest.java              # Admin Auth Credentials
│   │   │   └── LoginResponse.java             # Admin Token Response
│   │   ├── entity/
│   │   │   └── ContactMessage.java            # JPA Database Entity
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java    # Centralized REST Exception Advice
│   │   │   └── ResourceNotFoundException.java # Custom 404 Exception
│   │   ├── repository/
│   │   │   └── ContactMessageRepository.java  # Spring Data JPA Repository
│   │   └── service/
│   │       └── ContactMessageService.java     # Business Logic & CRUD Operations
│   └── src/main/resources/
│       ├── application.properties             # DB connection, port & security configs
│       └── static/                            # Bundled production frontend
│           ├── index.html
│           ├── admin.html
│           ├── css/
│           ├── js/
│           └── assets/
│
├── frontend/                                  # Standalone Frontend Source
│   ├── index.html                             # Main 3D Portfolio Landing Page
│   ├── admin.html                             # Protected Admin Portal Interface
│   ├── css/
│   │   ├── style.css                          # Dark glassmorphism & 3D styling
│   │   └── admin.css                          # Admin dashboard styles
│   ├── js/
│   │   ├── three-scene.js                     # 3D Laptop & Skills Sphere Engine
│   │   ├── main.js                            # UI interactions, GSAP & 3D tilt
│   │   ├── contact.js                         # Real REST API submission controller
│   │   └── admin.js                           # Admin auth, table rendering & search
│   └── assets/                                # Vector illustrations & graphics
│
└── README.md                                  # Complete Technical Guide
```

---

## 🗄️ Database Setup (MySQL)

1. Open **MySQL Workbench** or your MySQL command-line client:
   ```bash
   mysql -u root -p
   ```
2. Create the portfolio database:
   ```sql
   CREATE DATABASE IF NOT EXISTS manasa_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE manasa_portfolio;
   ```
3. Hibernate will automatically create the `contact_messages` table on first run:
   ```sql
   DESCRIBE contact_messages;
   ```
   *Table Schema Reference:*
   | Field | Type | Attributes |
   |---|---|---|
   | `id` | `BIGINT` | PRIMARY KEY, AUTO_INCREMENT |
   | `name` | `VARCHAR(100)` | NOT NULL |
   | `email` | `VARCHAR(150)` | NOT NULL |
   | `subject` | `VARCHAR(200)` | NOT NULL |
   | `message` | `TEXT` | NOT NULL |
   | `created_at` | `DATETIME(6)` | NOT NULL |

---

## ⚙️ Backend Setup & Configuration

### 1. Configure Database Credentials
Edit `backend/src/main/resources/application.properties` or set environment variables:
```properties
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:manasa_portfolio}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:YourPasswordHere}

# Admin Credentials (Configurable via Environment Variables)
portfolio.admin.username=${ADMIN_USERNAME:admin}
portfolio.admin.password=${ADMIN_PASSWORD:Admin@Manasa2025}
```

### 2. Build & Run with Maven
Navigate to the `backend` folder:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend will initialize on `http://localhost:8080`.

---

## 🌐 Frontend Setup

You can run the frontend in **two ways**:

### Option A: Integrated Mode (Recommended)
Since the frontend is bundled in `backend/src/main/resources/static/`, running Spring Boot automatically serves both the frontend and REST APIs from a single server:
- Portfolio: `http://localhost:8080/index.html` (or `http://localhost:8080/`)
- Admin Portal: `http://localhost:8080/admin.html`

### Option B: Standalone Mode (Live Server / VS Code)
1. Open the `frontend` folder in **VS Code** or **IntelliJ IDEA**.
2. Start **Live Server** (or run `npx serve frontend` or Python's `python -m http.server 5500`).
3. Open `http://127.0.0.1:5500/index.html`.
4. The JavaScript REST client automatically connects to the backend at `http://localhost:8080/api/contact`.

---

## 📡 REST API Documentation

### Public Endpoints
#### Submit Contact Message
- **URL:** `POST /api/contact`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Alex Smith",
    "email": "alex@example.com",
    "subject": "Full Stack Opportunity",
    "message": "Hello Manasa, I reviewed your 3D portfolio and would love to discuss a project."
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Message sent successfully! Thank you for reaching out.",
    "data": {
      "id": 1,
      "name": "Alex Smith",
      "email": "alex@example.com",
      "subject": "Full Stack Opportunity",
      "message": "Hello Manasa, I reviewed your 3D portfolio and would love to discuss a project.",
      "createdAt": "2026-09-21T22:00:00"
    },
    "timestamp": "2026-09-21T22:00:00.123"
  }
  ```

---

### Protected Administrative Endpoints *(Requires HTTP Basic Auth)*

Default credentials:
- **Username:** `admin`
- **Password:** `Admin@Manasa2025`

#### 1. Admin Login Verification
- **URL:** `POST /api/admin/login`
- **Body:** `{"username": "admin", "password": "Admin@Manasa2025"}`
- **Response:** `200 OK` with base64 Basic Auth token.

#### 2. Get All Messages
- **URL:** `GET /api/contact`
- **Response:** List of all persisted messages sorted chronologically descending.

#### 3. Search Messages
- **URL:** `GET /api/contact/search?q=query`
- **Response:** Filtered list of messages matching sender name, email, or keywords.

#### 4. Delete Message
- **URL:** `DELETE /api/contact/{id}`
- **Response:** `200 OK` confirming deletion.

#### 5. Get Metrics
- **URL:** `GET /api/contact/stats`
- **Response:** Total received message counter.

---

## 🔒 Security Architecture

1. **No Credentials in Frontend JavaScript:** Admin username and password are validated server-side.
2. **Spring Security 6:** CSRF disabled for stateless REST endpoints, BCrypt password hashing for in-memory credentials, and role-based route protection (`hasRole('ADMIN')`).
3. **Global CORS Filter:** Configured with specific methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`) to facilitate secure cross-origin requests.
4. **Bean Validation:** Rejects blank submissions or invalid emails at the controller layer before database interaction.

---

## 🎨 3D & Accessibility Features

1. **Interactive 3D Laptop Workspace:** Procedural 3D model with keyboard deck, glowing screen displaying real code, floating syntax tokens, and mouse-reactive parallax tilt.
2. **3D Interactive Skills Sphere:** Rotatable particle cloud mapping all 19 verified skills from Manasa's resume.
3. **Accessibility (Reduce Motion):** Clicking the "Reduce Motion" button in the navigation bar halts 3D rotations and complex animations for users sensitive to motion.
4. **Automatic WebGL Fallback:** Gracefully degrades to a clean CSS card layout if WebGL is unsupported.

---

## 🚀 GitHub Setup & Version Control

To push this project to GitHub:

```bash
cd 3D-Portfolio
git init
git add .
git commit -m "Initial commit: Complete 3D Full-Stack Portfolio for Manasa M P"
git branch -M main
git remote add origin https://github.com/<your-username>/3d-portfolio.git
git push -u origin main
```

---

## 🌐 Production Deployment Architecture

```
                 [ Client Browser ]
                         │
                         ▼
             [ Cloudflare / CDN / DNS ]
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
  [ Static Frontend ]          [ Spring Boot REST API ]
  (Netlify / Vercel / Nginx)   (AWS EC2 / Render / Docker)
          │                             │
          │ (POST /api/contact)         ▼
          └─────────────────────► [ MySQL 8.x Database ]
                                  (AWS RDS / Railway / Aiven)
```

1. **Frontend Hosting:** Can be served via Spring Boot or deployed independently to Netlify, Vercel, or AWS S3.
2. **Backend Hosting:** Package the application as a standalone executable JAR (`java -jar portfolio-1.0.0.jar`) and run inside a Docker container on AWS EC2, DigitalOcean, or Render.
3. **Database:** Hosted on AWS RDS MySQL or any managed MySQL provider, configured via the `DB_HOST`, `DB_USER`, and `DB_PASSWORD` environment variables.

---

## 📜 Resume Source of Truth

All information contained in this portfolio (Education, Projects, Internship, Certifications, and Skills) reflects the verified credentials of **MANASA M P**:
- **Education:** BCA from Sree Venkateshwara College (8.47 CGPA); SSLC from Sree Vidya Niketan School (60%).
- **Project:** Amusement Park Management System (Ticketing, Ride Management, Visitor Tracking, Staff Scheduling).
- **Internship:** 28-day Python Full Stack Internship at HOPE Foundation.
- **Certification:** Python Full Stack from HOPE Foundation.
- **Skills:** Python, C, R, SQL, JavaScript, HTML, CSS, Bootstrap, Pandas, NumPy, Seaborn, Matplotlib, VS Code, Turbo C, Google Colab, Jupyter Notebook, Online Learning, Leadership, Communication.
