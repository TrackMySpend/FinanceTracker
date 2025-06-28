const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // For profile image uploads

const {
  registerUser,
  loginUser,
  getUserInfo,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

// Register route with optional profile image
router.post('/register', upload.single('profileImage'), registerUser);

// Login route
router.post('/login', loginUser);

// Get user info (JWT protected)
router.get('/getUser', protect, getUserInfo);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

// Upload profile image separately (optional use)
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
