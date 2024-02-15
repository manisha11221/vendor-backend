const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const auth = require('../middlewares/adminMiddleware')

// Admin login route
router.post('/login', adminController.adminLogin);
// router.get('/search-data',auth,adminController.searchData);
router.get("/count-developer",adminController.countDeveloper);
router.get("/count-jobs",adminController.countJobs);
router.get("/count-tech",adminController.countTech);
module.exports = router;
