const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobController');


router.post('/add-jobs', jobController.addJobPost);
router.get('/get-jobs', jobController.getAllJobs);
router.get('/get-jobs-by-id/:id', jobController.getJobById);
router.put('/edit-jobs/:id', jobController.editJobPost);
router.delete('/delete-jobs/:id', jobController.deleteJobPost);
router.get('/job-basic-keyword-search',jobController.jobBasicKeywordSearch)

module.exports = router;


