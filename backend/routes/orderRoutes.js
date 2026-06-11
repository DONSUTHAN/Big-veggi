const express = require("express");
const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("customer", "admin"), createOrder);
router.get("/my", protect, authorizeRoles("customer", "admin"), getMyOrders);
router.get("/farmer", protect, authorizeRoles("farmer", "admin"), getFarmerOrders);
router.get("/", protect, authorizeRoles("admin"), getAllOrders);
router.put("/:id/status", protect, authorizeRoles("admin"), updateOrderStatus);

module.exports = router;
