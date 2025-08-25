const jwt = require('jsonwebtoken');
const db = require('../database');

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [decoded.userId]);
      if (rows.length === 0) return res.status(401).send('User not found');

      req.user = rows[0];
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send('Not authorized');
    }
  } else {
    return res.status(401).send('Not authorized, no token');
  }
};

module.exports = { protect };