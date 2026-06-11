const Product = require("../models/Product");

const buildFilePath = (file) => (file ? `/uploads/${file.filename}` : undefined);

const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filters = { isAvailable: true };

    if (category && category !== "All") {
      filters.category = category;
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(filters)
      .populate("farmer", "name email phone address")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .populate("farmer", "name email phone address")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("farmer", "name email phone address");

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, category, description, price, quantity, unit, location } = req.body;

    const product = await Product.create({
      name,
      category,
      description,
      price,
      quantity,
      unit,
      location,
      image: buildFilePath(req.files && req.files.image && req.files.image[0]),
      selfie: buildFilePath(req.files && req.files.selfie && req.files.selfie[0]),
      farmer: req.user._id
    });
    // req.user._id comes from the verified cookie, so farmers cannot fake another owner.

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const isOwner = product.farmer.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Only the farmer owner or admin can update this product");
    }

    const allowedFields = ["name", "category", "description", "price", "quantity", "unit", "location", "isAvailable"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const image = buildFilePath(req.files && req.files.image && req.files.image[0]);
    const selfie = buildFilePath(req.files && req.files.selfie && req.files.selfie[0]);

    if (image) product.image = image;
    if (selfie) product.selfie = selfie;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const isOwner = product.farmer.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Only the farmer owner or admin can delete this product");
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
