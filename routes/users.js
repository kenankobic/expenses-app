const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const usersController = require("../controllers/usersController");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

/**
 * Get page
 */
router.get("/explore/users", async (req, res) => {
  usersController.exploreUsers(req, res);
});

/**
 * Get token
 */
router.post("/token", async (req, res) => {
  usersController.getToken(req, res);
});

/**
 * Register user
 */
router.post("/signup", async (req, res) => {
  usersController.signUp(req, res);
});

/**
 * Protected routes
 */

/**
 * Create User
 */
router.post("/users", requireAdmin, async (req, res) => {
  usersController.createUserAsAdmin(req, res);
});

/**
 * Get page
 */
router.get("/users", requireAuth, async (req, res) => {
  usersController.getUsersPage(req, res);
});

/**
 * Get user by id
 */
router.get("/users/:id", requireAuth, async (req, res) => {
  usersController.getUserById(req, res);
});

/**
 * Update profile
 */
router.put("/users", requireAuth, async (req, res) => {
  usersController.updateProfile(req, res);
});

/**
 * Upload profile image
 */
router.post("/profile/image", requireAuth, async (req, res) => {
  usersController.updateProfileImage(req, res);
});

/**
 * Delete profile image
 */
router.delete("/profile/image", requireAuth, async (req, res) => {
  usersController.deleteProfileImage(req, res);
});

module.exports = router;
