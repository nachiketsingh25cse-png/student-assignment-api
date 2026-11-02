# Student Course & Assignment Management REST API

> A robust, production-ready RESTful backend built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, utilizing the **Model-Route-Controller (MRC)** pattern and secured with **Bcrypt** password hashing.

This project was developed for the **3rd Evaluation Assignment**, adapting core backend web development concepts to create a real-world **Student Course & Assignment Management System**.

---

## 📋 Table of Contents
1. [Project Overview & Features](#project-overview--features)
2. [Architecture (Model-Route-Controller)](#architecture-model-route-controller)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
   - [A. Installation](#a-installation)
   - [B. MongoDB Atlas Setup](#b-mongodb-atlas-setup)
   - [C. Environment Configuration](#c-environment-configuration)
   - [D. Run the Application](#d-run-the-application)
6. [Database Models](#database-models)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Testing with Postman Desktop App](#testing-with-postman-desktop-app)
9. [Git & GitHub Submission Guide](#git--github-submission-guide)
10. [Evaluation & Viva Preparation Notes](#evaluation--viva-preparation-notes)

---

## 🎯 Project Overview & Features

In academic environments, students and faculty need a reliable system to track course coursework, deadlines, submission status, and priority levels. This backend provides:

* **🔐 User Authentication**: Register students and instructors with encrypted passwords (`bcryptjs`), log in with credential validation, and manage user roles (`student`, `instructor`, `admin`).
* **📚 Full Assignment CRUD**:
  - **Create**: Add new assignments with subject, due date, priority, and description.
  - **Read**: Fetch all assignments, filter by status (`pending`, `in-progress`, `completed`), or get a specific assignment by its MongoDB ID.
  - **Update**: Edit assignment details, mark assignments as completed, or reschedule deadlines.
  - **Delete**: Remove assignments by ID.
* **🛡 Input Validation & Error Handling**: MongoDB schema validation, email regex validation, friendly 404 responses for invalid IDs, and central error handling.

---

## 🏗 Architecture (Model-Route-Controller)

```text
       HTTP Request (Postman / Web Client)
                        │
                        ▼
                ┌───────────────┐
                │   index.js    │ (Express server, JSON parser, middleware)
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │    Routes     │ (Maps URL paths e.g. /api/assignments to logic)
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │  Controllers  │ (Business logic, status codes, bcrypt hashing)
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │    Models     │ (Mongoose Schemas: User & Assignment)
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ MongoDB Atlas │ (Cloud NoSQL Database)
                └───────────────┘
```

---

## 📁 Folder Structure

```text
backend-tutorial-project/
├── config/
│   └── db.js                      # MongoDB connection using Mongoose
├── controllers/
│   ├── assignmentController.js    # Full CRUD controllers for assignments
│   └── userController.js          # Authentication controllers (Register/Login/Logout)
├── models/
│   ├── Assignment.js              # Assignment schema & validations
│   └── User.js                    # User schema with role & password encryption
├── routes/
│   ├── assignmentRoutes.js        # /api/assignments routing
│   └── userRoutes.js              # /api/users routing
├── .env                           # Local secret variables (git-ignored)
├── .env.example                   # Configuration template for GitHub
├── .gitignore                     # Excludes node_modules & .env
├── index.js                       # Main application entry point
├── package.json                   # Project metadata & dependencies
├── postman_collection.json        # Pre-configured Postman test collection
├── test-endpoints.js              # Local verification test script
└── README.md                      # Documentation & Evaluation guide
```

---

## ⚙️ Prerequisites

* **Node.js**: v18.x or higher (tested on Node v24)
* **npm**: v9.x or higher
* **Git**: Installed
* **Postman Desktop App**: For API testing
* **MongoDB Atlas Account**: Free cloud cluster

---

## 🚀 Step-by-Step Setup Guide

### A. Installation
```bash
# 1. Navigate to project folder
cd backend-tutorial-project

# 2. Install dependencies
npm install
```

### B. MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a free **M0 Cluster** (Shared tier).
3. Under **Security** > **Database Access**, create a user (e.g. `dbAdmin`) with a password.
4. Under **Security** > **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Under **Database** > **Connect**, choose **Drivers (Node.js)** and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

### C. Environment Configuration
Create a `.env` file in the root directory (or use `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/assignmentDB?retryWrites=true&w=majority
NODE_ENV=development
```
*(Replace `<username>` and `<password>` with your database user credentials)*.

### D. Run the Application
```bash
# Development mode with nodemon auto-restart:
npm run dev

# Production mode:
npm start
```
Terminal output:
```text
🚀 Server running on http://localhost:5000
📖 Open http://localhost:5000 in your browser to view API documentation
✅ MongoDB Connected successfully: cluster0...
```

Open `http://localhost:5000` in your browser to see the live API status!

---

## 🗄 Database Models

### 1. User Model (`models/User.js`)
| Field | Type | Required | Unique | Validation / Notes |
|---|---|---|---|---|
| `username` | String | Yes | No | Minimum 3 characters, trimmed |
| `email` | String | Yes | Yes | Validated with Email Regex, lowercase |
| `password` | String | Yes | No | Minimum 6 chars, stored as bcrypt hash |
| `role` | String | No | No | `student` (default), `instructor`, `admin` |
| `course` | String | No | No | e.g. `'Computer Science'` |
| `timestamps` | Date | Auto | No | `createdAt` and `updatedAt` |

### 2. Assignment Model (`models/Assignment.js`)
| Field | Type | Required | Values / Default | Notes |
|---|---|---|---|---|
| `title` | String | Yes | Min 3 characters | Assignment title |
| `subject` | String | Yes | - | Subject/course name |
| `description`| String | Yes | - | Detailed assignment tasks |
| `dueDate` | Date | Yes | - | Submission deadline |
| `status` | String | No | `'pending'` | `['pending', 'in-progress', 'completed']` |
| `priority` | String | No | `'medium'` | `['low', 'medium', 'high']` |
| `assignedTo` | String | No | `'Student'` | Student name or ID |
| `timestamps` | Date | Auto | - | `createdAt` and `updatedAt` |

---

## 📡 API Endpoints Reference

Base URL: `http://localhost:5000`

### 1. Root & Health Check
| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | API status and endpoint directory | `200 OK` |

### 2. User Authentication APIs (`/api/users`)
| Method | Endpoint | Request Body | Status Code | Description |
|---|---|---|---|---|
| `POST` | `/api/users/register` | `{"username", "email", "password", "role", "course"}` | `201 Created` | Hashes password & creates user |
| `POST` | `/api/users/login` | `{"email", "password"}` | `200 OK` | Validates credentials with bcrypt |
| `POST` | `/api/users/logout` | None | `200 OK` | Logs out the user session |

### 3. Assignment CRUD APIs (`/api/assignments`)
| Operation | Method | Endpoint | Request Body | Status Code |
|---|---|---|---|---|
| **CREATE** | `POST` | `/api/assignments` | `{"title", "subject", "description", "dueDate", "priority", "status", "assignedTo"}` | `201 Created` |
| **READ (All)** | `GET` | `/api/assignments` | None | `200 OK` |
| **READ (Filter)**| `GET` | `/api/assignments?status=pending` | None (Query parameter) | `200 OK` |
| **READ (Single)**| `GET` | `/api/assignments/:id` | None | `200 OK` / `404 Not Found` |
| **UPDATE** | `PUT` | `/api/assignments/:id` | Fields to update e.g. `{"status": "completed"}` | `200 OK` / `404 Not Found` |
| **DELETE** | `DELETE`| `/api/assignments/:id` | None | `200 OK` / `404 Not Found` |

---

## 🧪 Testing with Postman Desktop App

A pre-configured Postman Collection is included in the project: [`postman_collection.json`](postman_collection.json).

### 1-Click Import into Postman:
1. Open the **Postman Desktop App**.
2. Click **Import** (top left).
3. Select the file: `backend-tutorial-project/postman_collection.json`.
4. The collection named **"Student Course & Assignment Management API"** will appear in your sidebar.

### Recommended Testing Sequence:
1. **Health Check**: Run `GET http://localhost:5000/` -> returns `200 OK`.
2. **Register**: Send `POST /api/users/register` with student details -> returns `201 Created`.
3. **Login**: Send `POST /api/users/login` with email and password -> returns `200 OK`.
4. **Create Assignment**: Send `POST /api/assignments` with:
   ```json
   {
     "title": "Build REST API with Node & Express",
     "subject": "Web Technologies",
     "description": "Implement authentication and CRUD operations with MongoDB Atlas.",
     "dueDate": "2026-11-15T23:59:59.000Z",
     "priority": "high",
     "status": "pending",
     "assignedTo": "Nachiket Singh"
   }
   ```
   Copy the generated `_id` from the response (e.g. `672a81...`).
5. **Get All Assignments**: Send `GET /api/assignments` -> returns `200 OK` with list.
6. **Filter by Status**: Send `GET /api/assignments?status=pending` -> returns filtered list.
7. **Get Single Assignment**: Send `GET /api/assignments/<PASTE_ID_HERE>` -> returns `200 OK`.
8. **Update Assignment**: Send `PUT /api/assignments/<PASTE_ID_HERE>` with:
   ```json
   {
     "status": "completed",
     "priority": "medium"
   }
   ```
   -> returns `200 OK` with updated document.
9. **Delete Assignment**: Send `DELETE /api/assignments/<PASTE_ID_HERE>` -> returns `200 OK` ("Assignment deleted successfully").

---

## 🐙 Git & GitHub Submission Guide

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all files
git add .

# 3. Commit your changes
git commit -m "feat: complete student course and assignment management REST API"

# 4. Create a new public repository on GitHub (e.g. "student-assignment-api")

# 5. Link to your GitHub repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/student-assignment-api.git

# 6. Push to main
git branch -M main
git push -u origin main
```

Your public submission link:
`https://github.com/<YOUR_GITHUB_USERNAME>/student-assignment-api`

---

## 🎓 Evaluation & Viva Preparation Notes

Key answers for your 3rd Evaluation:

1. **Why Model-Route-Controller (MRC)?**
   - **Separation of Concerns**: Routes define endpoints, Controllers contain business logic, and Models manage the database schema. This structure ensures modularity, clean debugging, and code reusability.
2. **Why hash passwords with Bcrypt?**
   - Plain-text passwords are a major security vulnerability. `bcryptjs` uses cryptographic salting (random bits added to each password) and iterative hashing rounds to make brute-force and rainbow table attacks computationally infeasible.
3. **What is Express Middleware?**
   - Functions executed during the request-response lifecycle. For example, `express.json()` intercepts incoming request streams and parses JSON payloads into `req.body`.
4. **Explain HTTP Status Codes Used**:
   - `200 OK`: Request succeeded (GET, PUT, DELETE).
   - `201 Created`: New resource successfully created (POST).
   - `400 Bad Request`: Missing required fields or schema validation failure.
   - `401 Unauthorized`: Invalid login credentials.
   - `404 Not Found`: Resource ID or endpoint does not exist.
   - `500 Internal Server Error`: Unhandled server exception.
5. **How does MongoDB differ from SQL?**
   - MongoDB is a schema-flexible NoSQL document database storing data in JSON/BSON format. It scales horizontally and eliminates the need for complex multi-table joins for nested document structures.
