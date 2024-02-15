const { default: mongoose } = require("mongoose");
const Developer = require("../models/developerModel");
const vendor = require("../models/vendorModel");
const upload = require('../middlewares/multerMiddleware');

exports.addDeveloper = async (req, res) => {
  // console.log("req",req);
  try {
    const {
      name,
      experience,
      technology,
      resume,
      available,
      rate,
      portfolio,
      gitHubUrl,
      linkedInLink,
    } = req.body;

    // console.log("reqqqqq", req.body);

    if (!name || !experience || !rate) {
      return res
        .status(400)
        .json({ message: "Name, experience, and rate are required fields." });
    }

    const developer = new Developer({
      name,
      experience,
      technology,
      available,
      rate,
      portfolio,
      gitHubUrl,
      linkedInLink,
      vendorId: req.user.id,
    });

      if (req.file) {
        developer.resume = `http://localhost:3000/uploads/${req.file.filename}`;
      }
      // console.log("req.file.path:", req.file);


      await developer.save();

      const updatedVendor = await vendor.findByIdAndUpdate(
        req.user.id,
        { $push: { developers: developer._id } },
        { new: true }
      );

      // console.log("Developer id in vendor table:", developer._id);

      res.json({
        message: "Developer created successfully",
        developer,
        updatedVendor,
      });
   
  } catch (error) {
    console.error("Create Developer Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get by id
exports.getDeveloperById = async (req, res) => {
  try {
    const developerId = new mongoose.Types.ObjectId(req.params.id);

    const developer = await Developer.findById(developerId);
    
    if (!developer) {
      return res.status(404).json({ message: "Developer not found" });
    }
    // console.log("devvvvId",developerId);

    res.json({ developer });
  } catch (error) {
    console.error("Get Developer by ID Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get all dev In vendor pannel
exports.getDeveloperAllWithVednor = async (req, res) => {
  try {
    // console.log("calling from js");
    const developers = await Developer.find();
    let dataArr = [];

    for (const findDeveloper of developers) {
      let findVendorData = await vendor.findOne({
        _id: findDeveloper.vendorId,
      });
      
      // Check if vendor data is found
      if (findVendorData) {
        // Combine developer and vendor details
        let combinedData = {
          developer: findDeveloper.toObject(),
          vendor: findVendorData.toObject(),
        };
        
        // console.log("findVendorDataByTheFrontENd", findVendorData);
        dataArr.push(combinedData);
      } else {
        // If no vendor data is found, include only developer details
        dataArr.push({ developer: findDeveloper.toObject(), vendor: null });
      }
    }

    res.json({ dataArr });
  } catch (error) {
    console.error("Get All Developers Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get ALl 
exports.getDeveloperAll = async (req, res) => {
  try {
    const developers = await Developer.find();

    // console.log("mmmm", developers);
    res.json({ success: true, developers });
  } catch (error) {
    console.error("Get All Developers Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


exports.getByVendor = async (req, res) => {
  try {
    // console.log("hsssssssssssss");
    
    // Extract vendorId from the URL parameter
    const vendorId = req.params.id;
    // console.log('Vendor ID:', vendorId);

    // Use async/await with try-catch for better error handling
    const developers = await Developer.find({ vendorId });

    // console.log('Developer data:', developers);
    res.json({ developers });
  } catch (error) {
    console.error('Get Developers by Vendor Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//update developer
exports.updateDeveloper = async (req, res) => {
  
  try {
    const developerId = req.params.id;
    const { name, experience, technology, available, rate ,portfolio,gitHubUrl,linkedInLink } = req.body;
    const resume = req.file ? req.file.path : req.body.resume;
    
    console.log("reqqqqqqqqqqq",req.body);

    // Convert technologyId to ObjectId format
    if (!mongoose.Types.ObjectId.isValid(developerId)) {
      return res.status(400).json({ message: "Invalid developerId" });
    }
    const validDeveloperId = new mongoose.Types.ObjectId(developerId);
    // console.log("dddddddddddddddd",developerId);

    const updatedDeveloper = await Developer.findByIdAndUpdate(
      developerId,
      { name, experience, technology, resume, available, rate ,portfolio,gitHubUrl,linkedInLink},
      { new: true }
    );


    if (!updatedDeveloper) {
      return res.status(404).json({ message: "Developer not found" });
    }

    res.json({ message: "Developer updated successfully", updatedDeveloper });
  } catch (error) {
    console.error("Update Developer Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete dev
exports.deleteDeveloper = async (req, res) => {
  try {
    const developerId = req.params.id;
    const deletedDeveloper = await Developer.findByIdAndDelete(developerId);

    if (!deletedDeveloper) {
      return res.status(404).json({ message: "Developer not found" });
    }

    res.json({ message: "Developer deleted successfully", deletedDeveloper });
  } catch (error) {
    console.error("Delete Developer Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

