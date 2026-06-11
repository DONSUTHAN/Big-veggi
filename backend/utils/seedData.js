const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const admin = await User.create({
      name: "Big-veggi Admin",
      email: "admin@bigveggi.com",
      password: "Admin@123",
      role: "admin",
      phone: "9000000001",
      address: "Big-veggi office"
    });

    const farmer = await User.create({
      name: "Ravi Fresh Farm",
      email: "farmer@bigveggi.com",
      password: "Farmer@123",
      role: "farmer",
      phone: "9000000002",
      address: "Coimbatore, Tamil Nadu"
    });

    const secondFarmer = await User.create({
      name: "Anitha Organic Field",
      email: "anitha@bigveggi.com",
      password: "Farmer@123",
      role: "farmer",
      phone: "9000000003",
      address: "Mysuru, Karnataka"
    });

    const customer = await User.create({
      name: "Demo Customer",
      email: "customer@bigveggi.com",
      password: "Customer@123",
      role: "customer",
      phone: "9000000004",
      address: "Bengaluru, Karnataka"
    });

    await Product.insertMany([
      {
        name: "Fresh Apples",
        category: "Fruit",
        description: "Crisp farm apples picked this week.",
        price: 160,
        quantity: 80,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80",
        location: "Ooty, Tamil Nadu",
        farmer: farmer._id
      },
      {
        name: "Green Brinjal",
        category: "Vegetable",
        description: "Tender brinjal for curry and roasting.",
        price: 45,
        quantity: 120,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1615485925763-86786288908a?auto=format&fit=crop&w=900&q=80",
        location: "Coimbatore, Tamil Nadu",
        farmer: farmer._id
      },
      {
        name: "Organic Tomatoes",
        category: "Vegetable",
        description: "Juicy tomatoes grown without chemical spray.",
        price: 38,
        quantity: 150,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
        location: "Mysuru, Karnataka",
        farmer: secondFarmer._id
      },
      {
        name: "Banana Bunch",
        category: "Fruit",
        description: "Sweet bananas ready for direct delivery.",
        price: 55,
        quantity: 100,
        unit: "dozen",
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80",
        location: "Erode, Tamil Nadu",
        farmer: secondFarmer._id
      }
    ]);

    console.log("sample data loaded");
    console.log(`admin: ${admin.email} / Admin@123`);
    console.log(`farmer: ${farmer.email} / Farmer@123`);
    console.log(`customer: ${customer.email} / Customer@123`);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();
