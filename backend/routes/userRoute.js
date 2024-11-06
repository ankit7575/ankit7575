const express = require("express");
const rateLimit = require("express-rate-limit");
const {
    registerUser,
    verifyOtpAndCompleteRegistration,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    updateUserPassword,
    updateUserProfile,
    getUserDetails,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser,
    updateUserStatus,
} = require("../controller/userController");

const { isAuthenticatedUser, authorizeRoles, protect } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts from this IP, please try again later.',
});

// User registration and login routes
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/verify-otp", verifyOtpAndCompleteRegistration);
router.get("/user/me", isAuthenticatedUser, getUserDetails);

// Password recovery routes
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// User profile update routes
router.put("/update-password", protect, updateUserPassword);
router.put("/update-profile", protect, updateUserProfile);

// Admin routes
router.get("/admin/users", isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.get("/users/:id", isAuthenticatedUser, authorizeRoles('admin'), getSingleUser);
router.put("/users/:id/role", isAuthenticatedUser, authorizeRoles('admin'), updateUserRole);
router.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

// Route to update user status (Admin only)
router.patch('/admin/users/:id/status', isAuthenticatedUser, authorizeRoles('admin'), updateUserStatus);

module.exports = router;
