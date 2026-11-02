import express from 'express';
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignmentController.js';

const router = express.Router();

/**
 * Route: /api/assignments
 * GET: Retrieve all course assignments (supports ?status=pending or ?subject=...)
 * POST: Create a new assignment
 */
router.route('/')
  .get(getAllAssignments)
  .post(createAssignment);

/**
 * Route: /api/assignments/:id
 * GET: Retrieve a single assignment by ID
 * PUT: Update an assignment by ID (status, details, priority, due date)
 * DELETE: Delete an assignment by ID
 */
router.route('/:id')
  .get(getAssignmentById)
  .put(updateAssignment)
  .delete(deleteAssignment);

export default router;
