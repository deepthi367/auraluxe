const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auraluxe';

  try {
    // MongoDB Cloud Atlas try chestundhi (3 sec timeout)
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.log('Cloud Atlas connection failed. Switching to Local In-Memory Database...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('In-Memory MongoDB Connected Successfully!');
    } catch (fallbackErr) {
      console.error('Database Connection Error:', fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;