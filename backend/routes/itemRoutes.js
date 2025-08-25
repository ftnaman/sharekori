const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../database");
const { protect } = require("../middlewares/authMiddleware");
const fs = require("fs");

const router = express.Router();

// Multer Setup for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Add new item (protected route)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, item_description, rent_per_day, item_condition, category, location } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const owner_id = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO items 
        (title, item_description, rent_per_day, item_condition, category, location, image_url, owner_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, item_description, rent_per_day, item_condition || "Used", category, location, imageUrl, owner_id]
    );

    res.json({ message: "Item added successfully", itemId: result.insertId });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "Failed to add item", details: error.message });
  }
});

// Fetch items for logged-in user (protected route)
router.get("/user", protect, async (req, res) => {
  try {
    const owner_id = req.user.id;
    const [items] = await pool.query("SELECT * FROM items WHERE owner_id = ?", [owner_id]);
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});


// DELETE item by ID
router.delete('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;

    // Find the item first (to get its image path)
    const [rows] = await pool.query(
      "SELECT image_url FROM items WHERE id = ?",
      [itemId]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Item not found" });

    const imageUrl = rows[0].image_url;

    // Delete from DB
    const [result] = await pool.query("DELETE FROM items WHERE id = ?", [itemId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found or already deleted" });

    // Delete file from uploads folder
    if (imageUrl) {
      const filePath = path.join(__dirname, "..", imageUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error("⚠️ Failed to delete image file:", err.message);
      });
    }

    res.json({ message: "Item and image deleted successfully" });

  } catch (err) {
    console.error("Error deleting item:", err.sqlMessage || err.message);
    res.status(500).json({ error: "Server error while deleting item" });
  }
});


// GET featured items (random 18 items)
router.get("/featured", async (req, res) => {
  try {
    const [items] = await pool.query("SELECT * FROM items ORDER BY RAND() LIMIT 18");
    res.json(items);
  } catch (err) {
    console.error("Error fetching featured items:", err);
    res.status(500).json({ error: "Failed to fetch featured items" });
  }
});


// GET search items with filters
router.get("/search", async (req, res) => {
  try {
    const { keyword, category, condition } = req.query;

    let sql = "SELECT * FROM items WHERE 1=1";
    const params = [];

    if (keyword) {
      sql += " AND title LIKE ?";
      params.push(`%${keyword}%`);
    }
    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }
    if (condition) {
      sql += " AND item_condition = ?";
      params.push(condition);
    }

    const [items] = await pool.query(sql, params);
    res.json(items);
  } catch (err) {
    console.error("Error searching items:", err);
    res.status(500).json({ error: "Failed to search items" });
  }
});

// backend/routes/items.js
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT i.*, u.name as owner_name 
       FROM items i 
       JOIN users u ON i.owner_id = u.id 
       WHERE i.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Item not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;