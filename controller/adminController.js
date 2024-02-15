const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModal");
const Developer = require("../models/developerModel")
const Jobs = require("../models/jobModel");
const Technology = require("../models/techModel");
//admin Login

exports.adminLogin = async (req, res) => {
  try {
    const staticAdminData = {
      email: "admin@g.com",
      password: "admin",
      role: "admin",
    };

    if (!req.body.password) {
      return res
        .status(401)
        .json({ success: false, message: "Password is required" });
    }

    // Find or create the admin user
    let adminUser = await Admin.findOne({ email: staticAdminData.email });

    if (!adminUser) {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(staticAdminData.password, 10);

      adminUser = new Admin({
        email: staticAdminData.email,
        password: hashedPassword,
        role: staticAdminData.role,
      });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      adminUser.password
    );

    if (req.body.email !== staticAdminData.email || !passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: adminUser._id, email: adminUser.email },
      process.env.JWT_SECRET || "admin-secret-key"
    );

    // Update the admin user with the new token
    adminUser.token = token;
    await adminUser.save();

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      role: adminUser.role,
      adminUser: adminUser,
    });

    console.log("adminUser", adminUser);
  } catch (error) {
    console.error("Error during admin login:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};




//count devloper
exports.countDeveloper = async (req, res) => {
  try {
    const count = await Developer.countDocuments();
    res.send(count.toString()); // Convert to string before sending in the response
  } catch (error) {
    console.error("Get Developer Count Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.countJobs = async (req, res) => {
  try {
    const count = await Jobs.countDocuments();
    res.send(count.toString()); // Convert to string before sending in the response
  } catch (error) {
    console.error("Get Job Count Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.countTech = async (req, res) => {

  try {
    // console.log("===Techhhhhhhhhhhhhh");
    const count = await Technology.countDocuments();
    res.send(count.toString());
  } catch (error) {
    console.error("Get Vendor Count Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
