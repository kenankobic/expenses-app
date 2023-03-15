const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const expensesController = require("../controllers/expensesController");
const router = express.Router();

/**
 * Get page
 */
router.get("/", async (req, res) => {
  expensesController.getPage(req, res);
});

/**
 * Get list
 */
router.get("/list", async (req, res) => {
  expensesController.getList(req, res);
});

/**
 * Get by ID
 */
router.get("/:id", async (req, res) => {
  expensesController.getById(req, res);
});

/**
 * Protected routes
 */

/**
 * Create
 */
router.post("/", requireAuth, async (req, res) => {
  expensesController.create(req, res);
});

/**
 * Update
 */
router.put("/:id", requireAuth, async (req, res) => {
  expensesController.update(req, res);
});

/**
 * Delete
 */
router.delete("/:id", requireAuth, async (req, res) => {
  expensesController.remove(req, res);
});

module.exports = router;
