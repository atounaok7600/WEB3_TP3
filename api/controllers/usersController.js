const User = require('../models/user');
const Voiture = require('../models/voiture');
const Histo = require('../models/historique');
const config = require('../config');
const url_base = config.URL + ":" + config.PORT;


exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isValet: false }).populate({
      path: 'voiture',
      match: { isParked: true }
    });

    const filteredUsers = users.filter(user => user.voiture != null);
    if (!filteredUsers.length) {
      const error = new Error('Aucun utilisateur trouvé.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      users: filteredUsers
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => { 
  try {
    const userId = req.user.userId;
    const user = await checkUserExists(userId);

    if(req.body.username){
      user.username = req.body.username;
    }

    if(req.body.email){
      user.email = req.body.email;
    }

    if(req.body.price){
      user.price = req.body.price;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      user: updatedUser,
      message: 'Profil mis à jour avec succès.'
    })
  } catch (error) {
    next(error)
  }
 }

exports.updateCar = async (req, res, next) => { 
  try {
    const userId = req.params.userId;
    const user = await checkUserExists(userId);
    let voiture;

    if(!user.voiture){
      voiture = await Voiture.create({});
      user.voiture = voiture._id;
      await user.save();
    }else{
      voiture = await Voiture.findById(user.voiture);
    }

    if (req.body.marque) voiture.marque = req.body.marque;
    if (req.body.modele) voiture.modele = req.body.modele;
    if (req.body.couleur) voiture.couleur = req.body.couleur;
    if (req.body.plaque) voiture.plaque = req.body.plaque;
    voiture.isMoving = req.body.isMoving;
    voiture.isParked = req.body.isParked;
    voiture.latitude = req.body.latitude;
    voiture.longitude = req.body.longitude;
    if (req.body.timeToLeave) voiture.timeToLeave = req.body.timeToLeave;
    if (req.body.valet) voiture.valet = req.body.valet;
    
    
    const updateVoiture = await voiture.save();

    if (user.voiture) {
      user.voiture = updateVoiture._id;
      await user.save();
    }

    res.status(200).json({
      voiture: updateVoiture,
      message: 'Voiture mise à jour avec succès.'
    })
  } catch (error) {
    next(error)
  }
 }

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await checkUserExists(userId);
    console.log(userId)
    //await user.remove();
    await User.deleteOne({ _id: userId })
    if (user.voiture) {
      console.log('Jai une voiture!')
      const voiture = await Voiture.findById(user.voiture);
      await voiture.remove();
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Fonction pour vérifier si un utilisateur existe
async function checkUserExists(userId) {
  const user = await User.findById(userId).populate('voiture');
  if (!user) {
    const error = new Error('L\'utilisateur n\'existe pas.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}