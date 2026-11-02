import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database using Mongoose.
 * Reads the connection string from the MONGO_URI environment variable.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.includes('<password>') || mongoUri.includes('YOUR_PASSWORD')) {
      console.warn('\n⚠️  [MongoDB Warning]: MONGO_URI is not set or contains placeholder text in your .env file.');
      console.warn('👉 To connect to MongoDB Atlas:');
      console.warn('   1. Create your free cluster at https://cloud.mongodb.com');
      console.warn('   2. Copy the connection string into the .env file');
      console.warn('   3. Replace <password> with your actual database user password\n');
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

export default connectDB;
