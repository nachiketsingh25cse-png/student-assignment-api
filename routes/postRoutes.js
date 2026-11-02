import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';

const router = express.Router();

/**
 * Route: /api/posts
 * GET: Retrieve all posts
 * POST: Create a new post
 */
router.route('/')
  .get(getAllPosts)
  .post(createPost);

/**
 * Route: /api/posts/:id
 * GET: Retrieve a single post by ID
 * PUT: Update a post by ID
 * DELETE: Delete a post by ID
 */
router.route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

export default router;
