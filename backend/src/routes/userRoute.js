const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const upload = require('../configs/multerConfig');

//* Public Access
router.get("/public", userController.getPublicProfile);

//* Users Access
router.get('/get-me', authMiddleware, userController.getMe);
router.post('/update-profile', authMiddleware, upload.single('userImage'), userController.updateProfile);
router.post('/delete-account', authMiddleware, userController.deleteAccount);

//* Admin Access Only
router.get('/members/all', authMiddleware, userController.getAllMembers)
router.post('/toggle-status', authMiddleware, userController.toggleStatus);
router.post('/delete-account/:id', authMiddleware, userController.deleteUserByAdmin);

module.exports = router;