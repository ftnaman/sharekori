const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const pool = require('../database');

router.post('/', protect, async (req, res) => {
  const { item_id, start_date, end_date } = req.body;
  const renter_id = req.user.id;

  try {
    const [result] = await pool.query(
      `INSERT INTO rental_requests (item_id, renter_id, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [item_id, renter_id, start_date, end_date]
    );
    res.status(201).json({ message: 'Rental request created', rentalId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create rental' });
  }
});

module.exports = router;