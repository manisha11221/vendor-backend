const Technology = require("../models/techModel");
const mongoose = require("mongoose");

exports.addTechnology = async (req, res) => {
  try {
    const { name, status } = req.body;
  
    const technology = new Technology({ name, status });
    await technology.save();
    res.json({
      message: "Technology Added succesfully",
      technology,
    });
  } catch (error) {
    console.error("Add Technology Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get all technology
exports.getTechnology = async (req, res) => {
  // console.log("TechIn co0nroller.......");
  try {
    const technology = await Technology.find();
    
    res.status(200).json({
      success: true,
      technology,
    });
  } catch (error) {
    console.error("get All technology:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//get by id
exports.getTechnologyById = async (req, res) => {
    try {
      const technologyId = req.params.id;
      const technology = await Technology.findById(technologyId);
  
      if (!technology) {
        return res.status(404).json({ message: "Technology not found" });
      }
  
      res.json({ technology });
    } catch (error) {
      console.error('Get Technology by ID Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  
//edit technology by id
exports.editTechnology = async (req, res) => {
  try {
    const { name, status } = req.body;
    const technologyId = req.params.id;

    console.log("TECXHiD",req.body , req.para);
    
    // Convert technologyId to ObjectId format
    if (!mongoose.Types.ObjectId.isValid(technologyId)) {
      return res.status(400).json({ message: "Invalid technologyId" });
    }
    const validTechnologyId = new mongoose.Types.ObjectId(technologyId);
    console.log("TECXHiD",technologyId);

    console.log("afterInObject.......",validTechnologyId);

    const technology = await Technology.findByIdAndUpdate(
      {_id:validTechnologyId},
      { $set : {name, status} },
      { new: true }
    );

    if (!technology) {
      return res.status(404).json({ message: "Technology not found" });
    }

    res.json({ message: "Technology updated successfully", technology });
  } catch (error) {
    console.error("Update Technology Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete technology  by id
exports.deleteTechnology = async (req, res) => {
  try {
    // const deletedTechnology = await Technology.findByIdAndDelete(req.params.id);

    const technologyId = req.params.id;
    console.log(technologyId);
    const deletedTechnology = await Technology.findByIdAndDelete(technologyId);

    if (!deletedTechnology) {
      return res.status(404).json({ message: "Technology not found" });
    }
    res.json({ message: 'Technology deleted successfully', deletedTechnology });
  } catch (error) {
    console.error('Delete Technology Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

