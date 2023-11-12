const express = require('express');
const authController = require('../controllers/authController');
const isAuth = require('../middleware/is-auth')
const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/is-auth', isAuth);


module.exports = router;
