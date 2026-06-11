const Order = require("../models/Order");
const Product = require("../models/Product");

const populateOrder = (query) =>
  query
    .populate("customer", "name email phone address")
    .populate("products.product", "name price unit image farmer");

const createOrder = async (req, res, next) => {
  try {
    const { products, paymentMethod, shippingAddress } = req.body;

    if (!products || products.length === 0) {
      res.status(400);
      throw new Error("Please add at least one product");
    }

    const productIds = products.map((item) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds }, isAvailable: true });

    const orderProducts = products.map((item) => {
      const dbProduct = dbProducts.find((product) => product._id.toString() === item.product);

      if (!dbProduct) {
        throw new Error("One product is no longer available");
      }

      const quantity = Number(item.quantity || 1);

      if (quantity > dbProduct.quantity) {
        throw new Error(`${dbProduct.name} has only ${dbProduct.quantity} ${dbProduct.unit} available`);
      }

      return {
        product: dbProduct._id,
        quantity,
        priceAtOrder: dbProduct.price
      };
    });

    const totalPrice = orderProducts.reduce((total, item) => total + item.quantity * item.priceAtOrder, 0);
    // The backend calculates totalPrice so customers cannot change it in the browser.

    const order = await Order.create({
      customer: req.user._id,
      products: orderProducts,
      totalPrice,
      paymentMethod,
      shippingAddress
    });

    await Promise.all(
      orderProducts.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity }
        })
      )
    );

    const createdOrder = await populateOrder(Order.findById(order._id));
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await populateOrder(Order.find({ customer: req.user._id }).sort({ createdAt: -1 }));
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getFarmerOrders = async (req, res, next) => {
  try {
    const farmerProducts = await Product.find({ farmer: req.user._id }).select("_id");
    const farmerProductIds = farmerProducts.map((product) => product._id);

    const orders = await populateOrder(
      Order.find({ "products.product": { $in: farmerProductIds } }).sort({ createdAt: -1 })
    );

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await populateOrder(Order.find({}).sort({ createdAt: -1 }));
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getAllOrders,
  updateOrderStatus
};
