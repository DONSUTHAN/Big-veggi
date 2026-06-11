const express = require("express");
const { getDashboardStats, getUsers, updateUserRole, deleteUser } = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));
// Every admin route below this line requires a valid admin cookie.

router.get("/dashboard", getDashboardStats);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
