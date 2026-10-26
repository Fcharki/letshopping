import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  const uri = process.env.LOCAL_MONGODB_URL || process.env.CLOUD_MONGODB_URL;

  if (!uri) {
    throw new Error(
      "No MongoDB connection string found. Set LOCAL_MONGODB_URL or CLOUD_MONGODB_URL."
    );
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB Connected to : ${conn.connection.host}`.cyan.underline.bold);
  return conn;
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
