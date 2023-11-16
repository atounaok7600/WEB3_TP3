const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const isAuth = require('../middleware/is-auth');

// /user/ => GET
router.get('/users/', usersController.getUsers);

// L'utilisateur actuellement connecté /user/ (profil utilisateur)
router.get('/user/', isAuth, usersController.getUser);

// un utilisateur avec son id /user/:id
router.get('/user/:id', usersController.getUserById);

// Mise à jour d'un utilisateur
router.put('/user/:userId', isAuth , usersController.updateUser);

// Suppression de l'utilisateur actuellement connecté
router.delete('/user/', isAuth, usersController.deleteUser);

// Mise à jour d'une voiture
router.put('/car/:userId', isAuth, usersController.updateCar);

module.exports = router;

