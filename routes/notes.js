const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const notesController = require("../controllers/notesController");
const router = express.Router();

/**
 * Get page
 */
router.get("/", async (req, res) => {
  notesController.getPage(req, res);
});

/**
 * Get list
 */
router.get("/list", async (req, res) => {
  notesController.getList(req, res);
});

/**
 * Get by ID
 */
router.get("/:id", async (req, res) => {
  notesController.getById(req, res);
});

/**
 * Protected routes
 */

/**
 * Create
 */
router.post("/", requireAuth, async (req, res) => {
  notesController.create(req, res);
});

/**
 * Update
 */
router.put("/:id", requireAuth, async (req, res) => {
  notesController.update(req, res);
});

/**
 * Delete
 */
router.delete("/:id", requireAuth, async (req, res) => {
  notesController.remove(req, res);
});

module.exports = router;
