import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;
let isConnected = false;

export async function dbConnect(): Promise<void> {
  if (isConnected) return;
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { dbName: "testDb" });
    if (global._mongoose) {
      global._mongoose.conn = mongoose;
      global._mongoose.promise = Promise.resolve(mongoose);
    } else {
      global._mongoose = {
        conn: mongoose,
        promise: Promise.resolve(mongoose),
      };
    }
    isConnected = true;
  } catch (error) {
    console.error("Failed to connect to integration DB: ", error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) await mongoServer.stop();
    if (global._mongoose) {
      global._mongoose.conn = null;
      global._mongoose.promise = null;
    }
    isConnected = false;
  } catch (error) {
    console.error("Failed to disconnect integration DB: ", error);
    throw error;
  }
}

export async function clearDB(): Promise<void> {
  if (!isConnected) throw new Error("Database not connected");
  try {
    const collections = mongoose.connection.collections;
    await Promise.all(
      Object.values(collections).map((col) => col.deleteMany({})),
    );
  } catch (error) {
    console.error("Failed to clear integration DB: ", error);
    throw error;
  }
}

export function isDBConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
