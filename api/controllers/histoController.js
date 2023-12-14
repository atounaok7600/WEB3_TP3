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
 
}

exports.getFacture = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const allFactures = await Facture.find({ userId: userId }).lean();
    console.log(allFactures)

    res.status(200).json({
      factures: allFactures
    });
  } catch (error) {
    next(error)
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
