const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    registerUser,
    loginUser,
    getUserInfo,
} = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware'); // Your multer config

// Register route with image upload support (if needed)
router.post('/register', upload.single('profileImage'), registerUser);

// Login route
router.post('/login', loginUser);

// Get user info (protected route)
router.get('/getUser', protect, getUserInfo);

// Upload image separately (optional use)
router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

module.exports = router;
