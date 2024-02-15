const express = require('express');
const router = express.Router();
const developerController = require('../controller/developerController');
const auth = require('../middlewares/vendorMiddleware')
const authentication = require('../middlewares/adminMiddleware')
const multerMiddleware = require("../middlewares/multerMiddleware")


router.post('/add-dev',auth,multerMiddleware.single('resume'),developerController.addDeveloper);
router.get('/get-dev/:id', developerController.getDeveloperById);
router.get('/get-devAll/', developerController.getDeveloperAll);
router.get('/get-by-vendor/:id',developerController.getByVendor);
router.put('/update-dev/:id',auth, multerMiddleware.single('resume'),developerController.updateDeveloper);
router.delete('/delete-dev/:id',auth, developerController.deleteDeveloper);
router.get("/getDeveloperall-with-vednor",developerController.getDeveloperAllWithVednor);

module.exports = router;
