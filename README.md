# Secure Node REST API with Identity
A secure, TypeScript-based Node.js API utilizing TypeORM and PostgreSQL, designed to manage Courses, Lessons, and Users. It features full CRUD operations and adds robust authentication and authorization via JSON Web Tokens (JWT).

## 🚀 Features
### Core Features (from base API)
- CRUD Operations: Supports GET, POST, PATCH, and DELETE endpoints for Courses and Lessons.
- Entity Relationships: Courses and Lessons are linked via a one-to-many relationship.
- Database Seeding and Cleanup: Seed and clear Course and Lesson data with simple scripts.
- Structured Routing: Modular route files for clarity and separation of concerns.
- Logging & Error Handling: Integrated with Winston for structured logs and error tracking.

### 🔐 Identity & Security Features (New)
- User Registration: Secure user creation with password hashing and salting (PBKDF2 with SHA-512).
- Login & Authentication: Generates signed JWTs after validating credentials.
- JWT Middleware: Verifies token presence and authenticity, attaching user data to requests.
- Authorization Middleware: Ensures that only admin users can perform privileged actions like creating new users.
- Environment-Based Secret Handling: Passwords and JWT secrets handled securely via .env.

### 📦 Technologies Used
- Node.js, TypeScript, Express
- PostgreSQL, TypeORM
- JWT (jsonwebtoken) for authentication
- Crypto for password hashing
- Winston for logging
- dotenv, cors, body-parser

### 📁 Project Structure Highlights
```graphql
├── src/
│   ├── models/               # Entity definitions (Course, Lesson, User)
│   ├── routes/               # Routes for CRUD and auth
│   ├── middlewares/          # JWT and Admin validation
│   ├── utils.ts              # Password hashing utility
│   ├── data-source.ts        # TypeORM data source config
│   └── server.ts             # Main entry point
```
### 🔑 Identity Endpoints
- POST /api/users
Create a new user. Requires admin privileges and authentication.
- POST /api/login
Login with credentials. Returns a JWT token.

### 🧪 Protected Course Endpoints
All course-related endpoints are now secured via JWT and require a valid login:
- GET /api/courses
- POST /api/courses
- PATCH /api/courses/:id
- DELETE /api/courses/:id
- Admin routes (like POST /api/users) require both authentication and admin privileges.

### 🛠️ Scripts
Defined in package.json:
- npm run populate-db: Populate database with sample data (Courses, Lessons, Users).
- npm run clear-db: Clear all data from the database.

### 🔧 Getting Started
1. Clone the repository
```bash
git clone https://github.com/tigerbluejay/Secure-Node-REST-API-with-Identity.git
cd Secure-Node-REST-API-with-Identity
```

2.  Install dependencies
```bash
npm install
```

3.  Set environment variables
```bash
cp .env.example .env
```

4.  Edit .env with your PostgreSQL credentials and JWT_SECRET

5.  Start the server
```bash
npm start
```

### 🌐 Environment Variables
```plaintext
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_secret_key
```

### 🔐 Authentication Example
Use this PowerShell snippet to test login:

```powershell
Invoke-WebRequest -Method POST http://localhost:9003/api/login -ContentType "application/json" `
-Body '{"email": "test@angular-university.io", "password":"test"}'
```
