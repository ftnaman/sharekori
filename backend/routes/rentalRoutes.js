const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const pool = require('../database');

router.post('/', protect, async (req, res) => {
  const { item_id, start_date, end_date } = req.body;
  const renter_id = req.user.id;

  console.log('Creating rental request:', { item_id, renter_id, start_date, end_date });
  console.log('Date types:', { 
    start_date_type: typeof start_date, 
    end_date_type: typeof end_date,
    start_date_value: start_date,
    end_date_value: end_date
  });

  try {
    // First check if the item exists
    const [itemCheck] = await pool.query(
      `SELECT id, owner_id FROM items WHERE id = ?`,
      [item_id]
    );
    
    if (itemCheck.length === 0) {
      console.log('Item not found:', item_id);
      return res.status(404).json({ message: 'Item not found' });
    }

    // Prevent owner from renting their own item
    if (itemCheck[0].owner_id === renter_id) {
      console.log('Owner cannot rent their own item:', renter_id);
      return res.status(403).json({ message: 'You cannot rent your own item' });
    }
    
    console.log('Item found:', itemCheck[0]);
    
    const [result] = await pool.query(
      `INSERT INTO rental_requests (item_id, renter_id, start_date, end_date, delivered_status)
       VALUES (?, ?, ?, ?, 0)`,
      [item_id, renter_id, start_date, end_date]
    );
    console.log('Rental request created with ID:', result.insertId);
    res.status(201).json({ message: 'Rental request created', rentalId: result.insertId });
  } catch (err) {
    console.error('Error creating rental request:', err);
    console.error('Error details:', {
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState
    });
    res.status(500).json({ message: 'Failed to create rental', error: err.message });
  }
});

router.get("/my-rentals", protect, async (req, res) => {
  try {
    const renter_id = req.user.id;

    const [rows] = await pool.query(
      `SELECT 
        r.id AS rental_id,
        r.start_date,
        r.end_date,
        i.id AS item_id,
        i.title,
        i.item_description,
        i.rent_per_day,
        i.item_condition,
        i.category,
        i.location,
        i.image_url,
        u.id AS owner_id,
        u.name AS owner_name
      FROM rental_requests r
      JOIN items i ON r.item_id = i.id
      JOIN users u ON i.owner_id = u.id
      WHERE r.renter_id = ?`,
      [renter_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching rentals:", err);
    res.status(500).json({ error: "Failed to fetch rentals" });
  }
});

// Availability for an item (booked date ranges)
router.get('/availability/:itemId', async (req, res) => {
  const { itemId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT start_date, end_date
       FROM rental_requests
       WHERE item_id = ?
       ORDER BY start_date ASC`,
      [itemId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Check if user has completed rentals from a specific owner (for rating)
router.get('/user/completed', protect, async (req, res) => {
  const { owner_id } = req.query;
  const user_id = req.user.id;
  
  if (!owner_id) {
    return res.status(400).json({ error: 'Owner ID is required' });
  }
  
  try {
    // Check if user has completed rentals from this owner
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count
       FROM rental_requests r
       JOIN items i ON r.item_id = i.id
       WHERE r.renter_id = ? AND i.owner_id = ? AND r.end_date < NOW()`,
      [user_id, owner_id]
    );
    
    const canRate = rows[0].count > 0;
    res.json({ canRate });
  } catch (err) {
    console.error('Error checking completed rentals:', err);
    res.status(500).json({ error: 'Failed to check completed rentals' });
  }
});

// Get rental requests for a user (items they've requested to rent)
router.get('/my-requests', protect, async (req, res) => {
  try {
    const renter_id = req.user.id;
    console.log('Fetching rental requests for user:', renter_id);

    const [rows] = await pool.query(
      `SELECT 
        r.id AS request_id,
        r.start_date,
        r.end_date,
        COALESCE(r.delivered_status, 0) AS delivered_status,
        i.id AS item_id,
        i.title,
        i.item_description,
        i.rent_per_day,
        i.item_condition,
        i.category,
        i.location,
        i.image_url,
        u.id AS owner_id,
        u.name AS owner_name,
        renter.phone_number AS renter_phone
      FROM rental_requests r
      JOIN items i ON r.item_id = i.id
      JOIN users u ON i.owner_id = u.id
      JOIN users renter ON r.renter_id = renter.id
      WHERE r.renter_id = ?
      ORDER BY r.start_date DESC`,
      [renter_id]
    );

    console.log('Rental requests found:', rows.length);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching rental requests:", err);
    res.status(500).json({ error: "Failed to fetch rental requests" });
  }
});

// Mark rental request as delivered (for item owners)
router.put('/mark-delivered/:requestId', protect, async (req, res) => {
  try {
    const { requestId } = req.params;
    const owner_id = req.user.id;

    // Verify the user owns the item for this rental request
    const [checkResult] = await pool.query(
      `SELECT r.id FROM rental_requests r
       JOIN items i ON r.item_id = i.id
       WHERE r.id = ? AND i.owner_id = ?`,
      [requestId, owner_id]
    );

    if (checkResult.length === 0) {
      return res.status(404).json({ error: 'Rental request not found or unauthorized' });
    }

    // Update the delivered status
    await pool.query(
      `UPDATE rental_requests SET delivered_status = 1 WHERE id = ?`,
      [requestId]
    );

    res.json({ message: 'Rental request marked as delivered successfully' });
  } catch (err) {
    console.error("Error marking rental as delivered:", err);
    res.status(500).json({ error: "Failed to mark rental as delivered" });
  }
});

// Get rental requests for items owned by the user (for item owners)
router.get('/item-requests', protect, async (req, res) => {
  try {
    const owner_id = req.user.id;
    console.log('Fetching item rental requests for owner:', owner_id);

    const [rows] = await pool.query(
      `SELECT 
        r.id AS request_id,
        r.start_date,
        r.end_date,
        COALESCE(r.delivered_status, 0) AS delivered_status,
        i.id AS item_id,
        i.title,
        i.item_description,
        i.rent_per_day,
        i.item_condition,
        i.category,
        i.location,
        i.image_url,
        renter.id AS renter_id,
        renter.name AS renter_name,
        renter.phone_number AS renter_phone
      FROM rental_requests r
      JOIN items i ON r.item_id = i.id
      JOIN users renter ON r.renter_id = renter.id
      WHERE i.owner_id = ?
      ORDER BY r.start_date DESC`,
      [owner_id]
    );

    console.log('Item rental requests found:', rows.length);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching item rental requests:", err);
    res.status(500).json({ error: "Failed to fetch item rental requests" });
  }
});

module.exports = router;