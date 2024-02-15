
const express = require('express');
const router = express.Router();
const techController = require('../controller/techController');

//add technology 
router.post('/add-technology', techController.addTechnology);
router.get('/get-technology', techController.getTechnology);
router.get('/get-TechnologyById/:id', techController.getTechnologyById);
router.put('/edit-technology/:id', techController.editTechnology);
router.delete('/delete-technology/:id', techController.deleteTechnology);

module.exports = router;