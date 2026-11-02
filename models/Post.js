import mongoose from 'mongoose';

/**
 * Post Schema
 * Defines the structure of a Post document in MongoDB for CRUD operations.
 */
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    author: {
      type: String,
      default: 'Anonymous',
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
