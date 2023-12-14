const Histo = require('../models/historique');
const Facture = require('../models/facture');
const User = require('../models/user');

exports.getHistorique = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const histo = await Histo
    .find({ userId: userId })
    .sort({ createdAt: -1 });
    if (!histo) {
      const error = new Error('Aucun historique trouvé.');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      histo: histo
    });
  } catch (err) {
    next(err);
  }
}

exports.effectuerPaiement = async (req, res, next) => {
  const userId = req.user.userId;
 
  try {
    const histoPrix = await Histo.find(
      { userId: userId, isPaid: false },
      { price: 1, _id: 0 }
    )

    let total = 0;
    histoPrix.forEach(item => {
      total += item.price
    });
    
    if(total > 0){
      const histo = await Histo
      .updateMany(
        { userId: userId, isPaid: false },
        { $set: { isPaid: true } },
        { new: true });

        
      await Facture.create({
        userId: userId,
        price: total
      })
    }
    
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
}

exports.getFacture = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const factures = await Facture
    .find({ userId: userId })
    .sort({ createdAt: -1 });
    
    res.status(200).json({
      factures: factures
    });
  } catch (err) {
    next(err);
  }
}

exports.ajoutHistorique = async (req, res, next) => {
  const valetId = req.user.userId;
  const { carUserId, valetPrice } = req.body;

  try {
    // Ajout du déplacement dans l'historique
    const ajout = new Histo({
      price: valetPrice,
      isPaid: false,
      userId: carUserId,
      valetId: valetId,
    });

    await ajout.save();

    res.status(200).json({});

  } catch (error) {
    next(error);
  }
}
