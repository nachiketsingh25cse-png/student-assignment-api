import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';

// 1. Load environment variables from .env file
dotenv.config();

// 2. Connect to MongoDB database
connectDB();

// 3. Initialize Express application
const app = express();

// 4. Built-in middleware to parse incoming JSON payloads
app.use(express.json());

// 5. Welcome & Health Check Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Student Course & Assignment Management API',
    description: 'RESTful Backend API built with Node.js, Express, and MongoDB',
    status: 'Server is up and running!',
    timestamp: new Date().toISOString(),
    apiEndpoints: {
      auth: [
        { method: 'POST', path: '/api/users/register', desc: 'Register a new student/instructor' },
        { method: 'POST', path: '/api/users/login', desc: 'Login with credentials' },
        { method: 'POST', path: '/api/users/logout', desc: 'Logout current user' },
      ],
      assignments: [
        { method: 'GET', path: '/api/assignments', desc: 'Fetch all assignments (supports ?status=pending, ?subject=...)' },
        { method: 'POST', path: '/api/assignments', desc: 'Create a new course assignment' },
        { method: 'GET', path: '/api/assignments/:id', desc: 'Fetch a single assignment by ID' },
        { method: 'PUT', path: '/api/assignments/:id', desc: 'Update assignment details / status / priority' },
        { method: 'DELETE', path: '/api/assignments/:id', desc: 'Delete an assignment by ID' },
      ],
    },
  });
});

// 6. Mount API Route Modules
app.use('/api/users', userRoutes);
app.use('/api/assignments', assignmentRoutes);

// 7. 404 Catch-All Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// 8. Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 9. Start the HTTP Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Open http://localhost:${PORT} in your browser to view API documentation`);
});
