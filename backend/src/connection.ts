import mongoose from "mongoose";
import { connect } from "mongoose";
import { Cart } from "./models/carts";
const dbUri = process.env.MONGO_URI || "";

const connection = connect(dbUri);

// Seed the database after connection is established
mongoose.connection.once("connected", async () => {
  console.log("Connected to mongo");
  try {
    // Check if the collection exists
    const exists = await Cart.countDocuments();
    if (exists === 0) {
      // Seed the collection with initial data
      await Cart.create({ userId: "seed-user", cartItems: [] });
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
  console.log("Seeding Complete");
});

export default connection;
