const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/restrictTo');
const authController = require('../controllers/authController');
const authValidationMiddleware = require('../middlewares/authValidationMiddleware');

router.post('/register', authMiddleware, restrictTo('admin'), authValidationMiddleware.registerValidation, authController.userRegister);

router.post('/login', authValidationMiddleware.loginValidation, authController.userLogin);

router.post('/refresh-token', authController.refreshToken);

router.post('/logout', authController.logout);

router.post('/logout-all', authController.logoutAll);

router.post('/forgot-password', authValidationMiddleware.forgotPasswordValidation, authController.forgotPassword);

router.post('/reset-password/:token', authValidationMiddleware.resetPasswordValidation, authController.resetPassword);

// Confirmation Code ( Check if admin valid aur not )
router.post('/gate/verify', authValidationMiddleware.gateCodeValidation, authController.verifyGateCode);
router.get('/gate/status', authController.checkGateStatus);
router.post('/gate/forgot', authController.forgotGateCode);
router.post('/gate/reset/:token', authValidationMiddleware.resetGateCodeValidation, authController.resetGateCode);

module.exports = router;