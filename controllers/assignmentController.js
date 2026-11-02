import Assignment from '../models/Assignment.js';

/**
 * @desc    Create a new course assignment (CREATE)
 * @route   POST /api/assignments
 * @access  Public
 */
export const createAssignment = async (req, res) => {
  try {
    const { title, subject, description, dueDate, status, priority, assignedTo } = req.body;

    // Validate required fields
    if (!title || !subject || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subject, description, and dueDate',
      });
    }

    // Create assignment in MongoDB
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
      message: 'Assignment created successfully',
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
 * @desc    Get all assignments with optional filtering (READ - List)
 * @route   GET /api/assignments
 * @access  Public
 */
export const getAllAssignments = async (req, res) => {
  try {
    const { status, subject, priority } = req.query;

    // Build filter object based on query parameters
    const filter = {};
    if (status) filter.status = status;
    if (subject) filter.subject = new RegExp(subject, 'i'); // case-insensitive match
    if (priority) filter.priority = priority;

    // Fetch assignments sorted by dueDate (earliest first)
    const assignments = await Assignment.find(filter).sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
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

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: `Assignment with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Error in getAssignmentById:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Assignment ID format',
      });
    }
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

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({
        success: false,
        message: `Assignment with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: updatedAssignment,
    });
  } catch (error) {
    console.error('Error in updateAssignment:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Assignment ID format',
      });
    }
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

    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({
        success: false,
        message: `Assignment with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
      data: deletedAssignment,
    });
  } catch (error) {
    console.error('Error in deleteAssignment:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Assignment ID format',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting assignment',
      error: error.message,
    });
  }
};
