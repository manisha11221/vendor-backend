// routes/vendorRoutes.js

const express = require('express');
const router = express.Router();
const vendorController = require('../controller/vendorController');
const auth = require('../middlewares/vendorMiddleware');
const multerMiddleware = require("../middlewares/multerMiddleware")

  // Vendor request OTP route
router.post('/request-otp', vendorController.requestOTP);
router.post('/verify-otp', vendorController.verifyOTP);
router.post('/set-Password/:id', vendorController.setPassword);
router.post('/login', vendorController.loginVendor);
router.post('/edit-Profile',multerMiddleware.single('profileImage'), vendorController.editProfile);
router.get('/view-Profile/:id',multerMiddleware.single('profilePhoto '),vendorController.viewProfile)
router.post('/reset-password', vendorController.resetPassword);
router.post('/set-Password/:id', vendorController.setPassword);
router.get('/get-all-Vendors', vendorController.getAllVendors);
router.get('/get-Vendors-by-id/:id', vendorController.getvendorById);
router.post('/logout-vendor',auth,vendorController.logoutVendor);
router.get('/count-Tech',auth,vendorController.countTech);
router.post('/add-tech-by-vendor/:id',auth, vendorController.addTechByVendor);
router.get('/developer-count',auth,vendorController.developerCount);
module.exports = router;
