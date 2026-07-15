const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const quoteController = require('../controllers/quoteController');
const quoteValidationMiddleware = require('../middlewares/quoteValidationMiddleware');

//* Public Access
router.post('/create', quoteValidationMiddleware.createQuoteValidator, quoteController.createQuote);

//* Users Access
router.get('/all', authMiddleware, quoteController.getAllQuotes);

//* Admin Access Only
router.post('/status/:id', authMiddleware, quoteController.updateQuoteStatus);
router.post('/delete/:id', authMiddleware, quoteController.deleteQuote);

module.exports = router;