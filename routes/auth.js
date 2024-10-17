const express = require('express');
const { register, login, logout, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/forgot-password', forgotPassword)

router.patch('/reset', resetPassword)

router.post('/logout', logout);

const authRoutes = router;
module.exports = authRoutes;