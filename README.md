# Backend Web Development Tutorial: Node.js, Express & MongoDB

> Implementation of the comprehensive beginner tutorial: **"Intro to Backend Web Development – Node.js, Express, MongoDB"** by Shivani (Hack Club / freeCodeCamp).

This project demonstrates a full-stack RESTful backend architecture built from scratch using **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, following the industry-standard **Model-Route-Controller (MRC)** design pattern. It includes user authentication with password hashing (`bcryptjs`) and full CRUD operations for posts, ready for Postman testing and assignment evaluation.

---

## 📋 Table of Contents
1. [Project Overview & Architecture](#project-overview--architecture)
2. [Folder Structure](#folder-structure)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
   - [A. Clone and Install Dependencies](#a-clone-and-install-dependencies)
   - [B. Setup Online MongoDB Atlas Cluster](#b-setup-online-mongodb-atlas-cluster)
   - [C. Configure Environment Variables](#c-configure-environment-variables)
   - [D. Run the Application](#d-run-the-application)
5. [Database Models](#database-models)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Testing with Postman Desktop App](#testing-with-postman-desktop-app)
8. [Git & GitHub Submission Guide](#git--github-submission-guide)
9. [Evaluation & Viva Preparation Notes](#evaluation--viva-preparation-notes)

---

## 🏗 Project Overview & Architecture

This application follows the **Model-Route-Controller (MRC)** pattern:

```text
       HTTP Request (e.g. from Postman or Browser)
                            │
                            ▼
                    ┌───────────────┐
                    │   index.js    │ (Express app, middleware, JSON parser)
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Routes     │ (Maps URL paths & HTTP verbs to controllers)
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Controllers  │ (Business logic, validation, hashing)
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Models     │ (Mongoose Schemas defining DB document structure)
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ MongoDB Atlas │ (Cloud NoSQL Database)
                    └───────────────┘
```

- **Routes (`/routes`)**: Inspect incoming HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) and URL paths, directing traffic to corresponding controller functions.
- **Controllers (`/controllers`)**: Contain the core business logic, handle request payloads (`req.body`, `req.params`), interact with Mongoose models, and return HTTP status codes with JSON responses.
- **Models (`/models`)**: Define the Mongoose schema (fields, data types, validations, timestamps) for MongoDB collections.

---

## 📁 Folder Structure

```text
backend-tutorial-project/
├── config/
│   └── db.js                 # MongoDB connection handler
├── controllers/
│   ├── postController.js     # CRUD operations logic (Create, Read, Update, Delete)
│   └── userController.js     # Auth logic (Register, Login, Logout)
├── models/
│   ├── Post.js               # Post schema definition
│   └── User.js               # User schema with validation
├── routes/
│   ├── postRoutes.js         # /api/posts endpoints
│   └── userRoutes.js         # /api/users endpoints
├── .env                      # Local secret variables (git-ignored)
├── .env.example              # Template for environment variables
├── .gitignore                # Files excluded from GitHub (node_modules, .env)
├── index.js                  # Main server entry point
├── package.json              # Project metadata & dependencies
├── postman_collection.json   # Ready-to-import Postman collection
└── README.md                 # Complete project documentation
```

---

## ⚙️ Prerequisites

- **Node.js**: v18 or higher (tested on Node v24)
- **npm**: v9 or higher
- **Git**: Installed and configured
- **Postman Desktop App**: For testing APIs
- **MongoDB Atlas Account**: Free cloud database

---

## 🚀 Step-by-Step Setup Guide

### A. Clone and Install Dependencies

```bash
# 1. Navigate to the project directory
cd backend-tutorial-project

# 2. Install dependencies
npm install
```

Key packages installed:
- `express`: Minimalist web framework for Node.js.
- `mongoose`: Elegant MongoDB object modeling for Node.js.
- `dotenv`: Loads environment variables from `.env` file into `process.env`.
- `bcryptjs`: Secure password hashing algorithm.
- `nodemon` (devDependencies): Auto-restarts server during code changes.

---

### B. Setup Online MongoDB Account and Cluster

Follow these steps to create your free MongoDB cloud database:

1. **Sign Up / Log In**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. **Create a Free Cluster**:
   - Choose the **M0 Free Tier** (Shared).
   - Select your preferred cloud provider (AWS, Google Cloud, or Azure) and nearest region.
   - Click **Create Deployment**.
3. **Set Up Database User Authentication**:
   - Under **Security** > **Database Access**, click **Add New Database User**.
   - Choose **Password** authentication.
   - Enter a **Username** (e.g. `dbAdmin`) and a strong **Password** (note this down!).
   - Set Built-in Role to **Read and write to any database**.
   - Click **Add User**.
4. **Set Up IP Access List (Network Access)**:
   - Under **Security** > **Network Access**, click **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) so you can connect from your laptop and testing environments.
   - Click **Confirm**.
5. **Get Connection String**:
   - Under **Deployment** > **Database**, click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string format:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```

---

### C. Configure Environment Variables

1. Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your connection string and desired port:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://dbAdmin:yourActualPassword@cluster0.abcde.mongodb.net/backendDB?retryWrites=true&w=majority
   NODE_ENV=development
   ```
   *(Replace `dbAdmin` and `yourActualPassword` with the database credentials created in Step B)*.

---

### D. Run the Application

```bash
# Production mode
npm start

# Development mode (auto-reload with nodemon)
npm run dev
```

When started, your terminal will display:
```text
✅ MongoDB Connected successfully: cluster0-shard-00-00.abcde.mongodb.net
🚀 Server running on http://localhost:5000
📖 Open http://localhost:5000 in your browser to view API documentation
```

Open `http://localhost:5000` in your browser to verify the server is live!

---

## 🗄 Database Models

### 1. User Model (`models/User.js`)
| Field | Type | Required | Unique | Description |
|---|---|---|---|---|
| `username` | String | Yes | No | Minimum 3 characters, trimmed |
| `email` | String | Yes | Yes | Validated with Regex pattern, lowercase |
| `password` | String | Yes | No | Minimum 6 characters (stored as bcrypt hash) |
| `createdAt` | Date | Auto | No | Managed via `{ timestamps: true }` |
| `updatedAt` | Date | Auto | No | Managed via `{ timestamps: true }` |

### 2. Post Model (`models/Post.js`)
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | String | Yes | - | Title of the post |
| `content` | String | Yes | - | Text content of the post |
| `author` | String | No | `'Anonymous'` | Name or username of creator |
| `createdAt` | Date | Auto | - | Timestamp when created |
| `updatedAt` | Date | Auto | - | Timestamp when updated |

---

## 📡 API Endpoints Reference

Base URL: `http://localhost:5000`

### 1. Root & Status
| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | API status and endpoint directory | `200 OK` |

### 2. Authentication APIs (`/api/users`)
| Method | Endpoint | Request Body | Status Code | Description |
|---|---|---|---|---|
| `POST` | `/api/users/register` | `{"username", "email", "password"}` | `201 Created` | Hashes password & creates user |
| `POST` | `/api/users/login` | `{"email", "password"}` | `200 OK` | Verifies credentials with bcrypt |
| `POST` | `/api/users/logout` | None | `200 OK` | Logs out the user |

### 3. Posts CRUD APIs (`/api/posts`)
| Operation | Method | Endpoint | Request Body | Status Code |
|---|---|---|---|---|
| **CREATE** | `POST` | `/api/posts` | `{"title", "content", "author"}` | `201 Created` |
| **READ (All)** | `GET` | `/api/posts` | None | `200 OK` |
| **READ (Single)**| `GET` | `/api/posts/:id` | None | `200 OK` / `404 Not Found` |
| **UPDATE** | `PUT` | `/api/posts/:id` | `{"title", "content", "author"}` | `200 OK` / `404 Not Found` |
| **DELETE** | `DELETE`| `/api/posts/:id` | None | `200 OK` / `404 Not Found` |

---

## 🧪 Testing with Postman Desktop App

A pre-configured Postman Collection is included in the project: `postman_collection.json`.

### How to Import & Use in Postman:
1. Open the **Postman Desktop App**.
2. Click **Import** (top left).
3. Drag and drop the `postman_collection.json` file from this project folder.
4. You will see a collection named **"Backend Tutorial - Express & MongoDB API"** with all requests pre-made.

### Sample Test Sequence:

#### 1. Register a User
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/users/register`
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:
  ```json
  {
    "username": "nachiket",
    "email": "nachiket@example.com",
    "password": "Password123"
  }
  ```
- **Response**: `201 Created` with user details (password is omitted for security).

#### 2. Login
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/users/login`
- **Body**:
  ```json
  {
    "email": "nachiket@example.com",
    "password": "Password123"
  }
  ```
- **Response**: `200 OK` with `"Login successful"`.

#### 3. Create a Post (CREATE)
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/posts`
- **Body**:
  ```json
  {
    "title": "Getting Started with Node & Express",
    "content": "This backend tutorial was implemented step-by-step with MongoDB Atlas.",
    "author": "nachiket"
  }
  ```
- **Response**: `201 Created`. Copy the `_id` field from the response (e.g. `672a8190c12...`).

#### 4. Read All Posts (READ)
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/posts`
- **Response**: `200 OK` with an array of all posts.

#### 5. Read Single Post (READ)
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/posts/<PASTE_POST_ID_HERE>`
- **Response**: `200 OK` with that specific post.

#### 6. Update Post (UPDATE)
- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/posts/<PASTE_POST_ID_HERE>`
- **Body**:
  ```json
  {
    "title": "Updated: Getting Started with Node & Express",
    "content": "This post content was successfully updated via PUT request."
  }
  ```
- **Response**: `200 OK` with the updated post document.

#### 7. Delete Post (DELETE)
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/posts/<PASTE_POST_ID_HERE>`
- **Response**: `200 OK` with `"Post deleted successfully"`.

---

## 🐙 Git & GitHub Submission Guide

Follow these commands to push this project to your GitHub account:

```bash
# 1. Initialize git repository (if not already done)
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: complete Node.js, Express & MongoDB backend tutorial"

# 4. Create a new public repository on GitHub (e.g., named "backend-api-tutorial")

# 5. Link local repository to your GitHub remote
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/backend-api-tutorial.git

# 6. Set main branch and push
git branch -M main
git push -u origin main
```

Your public repo URL for assignment submission will be:
`https://github.com/<YOUR_GITHUB_USERNAME>/backend-api-tutorial`

> **Note**: Your `.env` file is excluded in `.gitignore` so your personal database credentials will NEVER be pushed to GitHub. Evaluators will use `.env.example` as reference.

---

## 🎓 Evaluation & Viva Preparation Notes

Key concepts to explain during your 3rd Evaluation:

1. **What is the Model-Route-Controller (MRC) Pattern?**
   - **Separation of Concerns**: Routes define the URL endpoints, Controllers contain business logic, and Models represent database entities. This makes the code modular, maintainable, and testable.
2. **What is Express Middleware?**
   - A function that has access to the request object (`req`), response object (`res`), and the `next` middleware function in the application’s request-response cycle. For example, `express.json()` parses incoming JSON request bodies into `req.body`.
3. **Why do we hash passwords with bcrypt?**
   - Plain-text passwords must never be stored in a database. `bcryptjs` uses a cryptographic salt and slow hashing algorithm (adaptive work factor) to protect passwords against rainbow tables and brute-force attacks.
4. **What are the common HTTP status codes used?**
   - `200 OK`: Successful standard request.
   - `201 Created`: Resource successfully created (used in POST).
   - `400 Bad Request`: Client sent invalid or missing data.
   - `401 Unauthorized`: Invalid credentials.
   - `404 Not Found`: Resource or endpoint doesn't exist.
   - `500 Internal Server Error`: Unhandled server-side exception.
5. **How does MongoDB differ from SQL databases?**
   - MongoDB is a NoSQL document database storing data in flexible, JSON-like BSON documents. It does not require strict table joins or predefined column schemas like MySQL or PostgreSQL, making it ideal for rapid prototyping with JavaScript/JSON.
6. **What is Mongoose?**
   - An Object Data Modeling (ODM) library for MongoDB and Node.js that provides schema validation, type casting, middleware hooks, and business logic methods.
