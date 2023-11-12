const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

exports.login = (req, res, next) => {
  const { email, password } = req.body;


};

exports.signup = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;

  try {
    // Valider formulaire
  
    // Création user
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword
    });
  
    // Récupère token JWT
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      config.SECRET_JWT,
      { expiresIn: '24h' }
    );
  
    // Réponse
    res.status(201).json({
      message: "Utilisateur créer", 
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.error("Erreur lors de la création du compte", error)
    res.status(500).json({ message: "Erreur lors de la création du compte" })
  }

};

