const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
// This code sets up routes for user registration and login in a Node.js application using Express.js.