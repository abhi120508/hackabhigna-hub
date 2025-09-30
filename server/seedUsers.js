const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ["admin", "judge", "volunteer"] },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

async function seedUsers() {
  try {
    const uri = process.env.ATLAS_URI;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Seed users with updated password "abhi0806"
    const users = [
      { role: "admin", password: "abhi0806" },
      { role: "judge", password: "abhi0806" },
      { role: "volunteer", password: "abhi0806" },
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        role: userData.role,
        password: hashedPassword,
      });
      await user.save();
      console.log(`Seeded user: ${userData.role}`);
    }

    console.log("All users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedUsers();
