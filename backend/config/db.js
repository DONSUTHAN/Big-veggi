const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    // MONGO_URL comes from .env so the database address is not hard-coded.
    console.log("mongo connected");
  } catch (error) {
    console.log("mongo connection failed");
    console.log(error.message);
  }
};

module.exports = connectDB;
