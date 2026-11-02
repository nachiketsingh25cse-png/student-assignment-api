import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

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
    project: 'Intro to Backend Web Development',
    status: 'Server is up and running!',
    timestamp: new Date().toISOString(),
    apiEndpoints: {
      auth: [
        { method: 'POST', path: '/api/users/register', desc: 'Register a new user' },
        { method: 'POST', path: '/api/users/login', desc: 'Login existing user' },
        { method: 'POST', path: '/api/users/logout', desc: 'Logout current user' },
      ],
      posts: [
        { method: 'GET', path: '/api/posts', desc: 'Fetch all posts' },
        { method: 'POST', path: '/api/posts', desc: 'Create a new post' },
        { method: 'GET', path: '/api/posts/:id', desc: 'Fetch a single post by ID' },
        { method: 'PUT', path: '/api/posts/:id', desc: 'Update a post by ID' },
        { method: 'DELETE', path: '/api/posts/:id', desc: 'Delete a post by ID' },
      ],
    },
  });
});

// 6. Mount API Route Modules
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

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
