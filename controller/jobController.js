const Job = require("../models/jobModel");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;


exports.addJobPost = async (req, res) => {
  try {
    const {
      title,
      experience,
      type,
      salary,
      city,
      compensationType,
      country,
      workPeriod,
      noticePeriod,
      skills,
    } = req.body;

    const newJob = new Job({
      title,
      experience,
      type,
      salary,
      compensationType,
      city,
      country,
      workPeriod,
      noticePeriod,
      skills,
    });

    await newJob.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Job post added successfully",
        job: newJob,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add job post" });
  }
};

//get All Jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find(); 

        res.status(200).json({ success: true, message: 'Successfully retrieved all jobs', jobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to retrieve all jobs' });
    }
};


//get all the jobs by id 
exports.getJobById = async (req, res) => {
    try {
        const jobId = req.params.id; 
        
        const job = await Job.findById(jobId); 

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.status(200).json({ success: true, message: 'Successfully retrieved job', job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to retrieve job' });
    }
};


//editPost
exports.editJobPost = async (req, res) => {
    try {
        const jobId = req.params.id; 
        const { title, experience, type, salary, city, compensationType, country, workPeriod, noticePeriod, skills } = req.body;

        
        const updatedJob = await Job.findByIdAndUpdate(jobId, {
            title,
            experience,
            type,
            salary,
            city,
            compensationType,
            country,
            workPeriod,
            noticePeriod,
            skills
        }, { new: true }); // { new: true } ensures that the updated document is returned

        if (!updatedJob) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.status(200).json({ success: true, message: 'Job post updated successfully', job: updatedJob });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update job post' });
    }
};

//delete job
exports.deleteJobPost = async (req, res) => {
    try {
        const jobId = req.params.id; // Assuming the job ID is passed as a route parameter

        // Find the job by ID and delete it
        const deletedJob = await Job.findByIdAndDelete(jobId);

        if (!deletedJob) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.status(200).json({ success: true, message: 'Job post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete job post' });
    }
};


//job search
const dbName = 'vendor_portal_final';
exports.jobBasicKeywordSearch = async (req, res) => {
    try {
        let { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ error: 'Keyword is required' });
        }

        // If multiple keywords are provided separated by comma, split them
        const keywords = keyword.split(',');

        // Connect to MongoDB
        const client = new MongoClient(mongoURI);
        await client.connect();
        const db = client.db(dbName);

        // Query MongoDB for jobs
        const jobsCollection = db.collection('jobs');
        const matchedJobs = await jobsCollection.find({
            $or: [
                { title: { $regex: new RegExp(keyword, 'i') } },
                { city: { $regex: new RegExp(keyword, 'i') } },
                { country: { $regex: new RegExp(keyword, 'i') } },
                { experience: { $regex: new RegExp(keyword, 'i') } },
                { salary: { $regex: new RegExp(keyword, 'i') } },
                { type: { $regex: new RegExp(keyword, 'i') } },
                { compensationType: { $regex: new RegExp(keyword, 'i') } },
                { skills: { $in: keywords } } 
                // Search in the skills array
            ]
        }).toArray();

        // Close the MongoDB connection
        await client.close();

        res.json(matchedJobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


