import mongoose from 'mongoose';
import Assignment from '../models/Assignment.js';

// Pre-seeded in-memory store for instant testing
const inMemoryAssignments = [
  {
    _id: '6726210f9a1b4c3d8e5f0001',
    title: 'Web Tech Backend API',
    subject: 'Web Technologies',
    description: 'Implement REST API with Node, Express & MongoDB',
    dueDate: '2026-11-20T23:59:59.000Z',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Nachiket Singh',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6726210f9a1b4c3d8e5f0002',
    title: 'Database Schema Design',
    subject: 'Database Systems',
    description: 'Normalize relations to 3NF and build ER diagram',
    dueDate: '2026-11-25T23:59:59.000Z',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Nachiket Singh',
    createdAt: new Date().toISOString(),
  },
];

/**
 * @desc    Create a new course assignment (CREATE)
 * @route   POST /api/assignments
 * @access  Public
 */
export const createAssignment = async (req, res) => {
  try {
    const { title, subject, description, dueDate, status, priority, assignedTo } = req.body;

    if (!title || !subject || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subject, description, and dueDate',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const newAssignment = await Assignment.create({
        title,
        subject,
        description,
        dueDate,
        status: status || 'pending',
        priority: priority || 'medium',
        assignedTo: assignedTo || 'Student',
      });

      return res.status(201).json({
        success: true,
        message: 'Assignment created successfully in MongoDB Atlas',
        data: newAssignment,
      });
    }

    // In-memory fallback
    const newAssignment = {
      _id: new mongoose.Types.ObjectId().toString(),
      title,
      subject,
      description,
      dueDate,
      status: status || 'pending',
      priority: priority || 'medium',
      assignedTo: assignedTo || 'Student',
      createdAt: new Date().toISOString(),
    };

    inMemoryAssignments.unshift(newAssignment);

    return res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      storage: 'Active Local Server',
      data: newAssignment,
    });
  } catch (error) {
    console.error('Error in createAssignment:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating assignment',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all assignments with optional query filter (READ - List)
 * @route   GET /api/assignments
 * @access  Public
 */
export const getAllAssignments = async (req, res) => {
  try {
    const { status, subject, priority } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status) filter.status = status;
      if (subject) filter.subject = new RegExp(subject, 'i');
      if (priority) filter.priority = priority;

      const assignments = await Assignment.find(filter).sort({ dueDate: 1 });
      return res.status(200).json({
        success: true,
        count: assignments.length,
        data: assignments,
      });
    }

    // In-memory fallback
    let list = [...inMemoryAssignments];
    if (status) list = list.filter((a) => a.status === status);
    if (subject) list = list.filter((a) => a.subject.toLowerCase().includes(subject.toLowerCase()));
    if (priority) list = list.filter((a) => a.priority === priority);

    return res.status(200).json({
      success: true,
      count: list.length,
      storage: 'Active Local Server',
      data: list,
    });
  } catch (error) {
    console.error('Error in getAllAssignments:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching assignments',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single assignment by ID (READ - Single)
 * @route   GET /api/assignments/:id
 * @access  Public
 */
export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: `Assignment with ID ${id} not found`,
        });
      }
      return res.status(200).json({ success: true, data: assignment });
    }

    const assignment = inMemoryAssignments.find((a) => a._id === id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: `Assignment with ID ${id} not found`,
      });
    }

    return res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error in getAssignmentById:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching assignment',
      error: error.message,
    });
  }
};

/**
 * @desc    Update assignment details / status (UPDATE)
 * @route   PUT /api/assignments/:id
 * @access  Public
 */
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const updated = await Assignment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res.status(404).json({ success: false, message: `Assignment with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, message: 'Assignment updated successfully', data: updated });
    }

    const index = inMemoryAssignments.findIndex((a) => a._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Assignment with ID ${id} not found` });
    }

    inMemoryAssignments[index] = { ...inMemoryAssignments[index], ...req.body, updatedAt: new Date().toISOString() };

    return res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: inMemoryAssignments[index],
    });
  } catch (error) {
    console.error('Error in updateAssignment:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating assignment',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete assignment by ID (DELETE)
 * @route   DELETE /api/assignments/:id
 * @access  Public
 */
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const deleted = await Assignment.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: `Assignment with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, message: 'Assignment deleted successfully', data: deleted });
    }

    const index = inMemoryAssignments.findIndex((a) => a._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Assignment with ID ${id} not found` });
    }

    const removed = inMemoryAssignments.splice(index, 1)[0];

    return res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
      data: removed,
    });
  } catch (error) {
    console.error('Error in deleteAssignment:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting assignment',
      error: error.message,
    });
  }
};
