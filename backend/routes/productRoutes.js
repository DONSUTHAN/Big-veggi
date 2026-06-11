const express = require("express");
const {
  getProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const productUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "selfie", maxCount: 1 }
]);

router.get("/", getProducts);
router.get("/mine", protect, authorizeRoles("farmer", "admin"), getMyProducts);
router.get("/:id", getProductById);
router.post("/", protect, authorizeRoles("farmer", "admin"), productUpload, createProduct);
router.put("/:id", protect, authorizeRoles("farmer", "admin"), productUpload, updateProduct);
router.delete("/:id", protect, authorizeRoles("farmer", "admin"), deleteProduct);

module.exports = router;
