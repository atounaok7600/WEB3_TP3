const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Valider formulaire
    if(!email || !password ){
      console.log("Validation du formulaire échouée");
      return res.status(400).json({ message: "Tous les champs doivent être remplis." })
    }
    const user = await User.findOne({ email })

    if(!user){
      return res.status(401).json({ message: "Adresse email ou mot de passe incorrecte." })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return res.status(401).json({ message: "Adresse email ou mot de passe incorrecte." })
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.SECRET_JWT,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      message: "Connexion réussie",
      user: user.username,
      isValet: user.isValet,
      token,
    })
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }

};

exports.signup = async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body;

  try {
    // Valider formulaire
    if(!email || !username || !password || !confirmPassword){
      console.log("Validation du formulaire échouée");
      return res.status(400).json({ message: "Tous les champs doivent être remplis." })
    }

    // Hash le mdp
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "La confirmation du mot de passe ne correspond pas au mot de passe." })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    // Création user
    const user = new User({
      email,
      username,
      password: hashedPassword,
    });

    await user.save();
  
    // Réponse
    res.status(201).json({
      message: `Utilisateur créer ${username}`, 
      user: username,
    });
  } catch (error) {
    console.error("Erreur lors de la création du compte", error)
    res.status(500).json({ message: "Erreur lors de la création du compte" })
  }

};

