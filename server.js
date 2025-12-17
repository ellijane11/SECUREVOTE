const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_AADHAR = '111122223333';
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
let voters = new Set(); // Simulates voter list (use blockchain in production)

app.post('/signup', async (req, res) => {
  const { aadhar, age } = req.body;
  if (!aadhar || aadhar.length !== 12 || age < 18) {
    return res.status(400).json({ error: 'Invalid Aadhar or age < 18' });
  }
  if (voters.has(aadhar)) {
    return res.status(400).json({ error: 'Aadhar already registered' });
  }
  voters.add(aadhar);
  const token = jwt.sign({ aadhar, isAdmin: aadhar === ADMIN_AADHAR }, JWT_SECRET);
  res.json({ token, isAdmin: aadhar === ADMIN_AADHAR });
});

app.post('/login', (req, res) => {
  const { aadhar } = req.body;
  if (!voters.has(aadhar)) {
    return res.status(400).json({ error: 'Not in voter list. Signup first.' });
  }
  const token = jwt.sign({ aadhar, isAdmin: aadhar === ADMIN_AADHAR }, JWT_SECRET);
  res.json({ token, isAdmin: aadhar === ADMIN_AADHAR });
});

app.get('/voters', authenticateToken, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
  res.json(Array.from(voters));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.listen(3001, () => console.log('Server running on port 3001'));
