const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/userController');
const router = express.Router();

// Route for registering a new user
router.post('/register', registerUser);

// Route for logging in a user
router.post('/login', loginUser);

// Route for fetching all users (protected route example)
router.get('/users', getUsers);

module.exports = router;
