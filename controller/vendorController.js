const  Vendor = require("../models/vendorModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path")
const Developer = require("../models/developerModel")
const Technology = require("../models/techModel");




//send Otp
const emailConfig = {
  service: "gmail",
  auth: {
    user: "itsr.manisha@gmail.com",
    pass: "rnmbuuyrmergcxcb",
  },
};
const transporter = nodemailer.createTransport(emailConfig);

exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    const currentDate = new Date();

    const expirationDate = new Date(currentDate);
    expirationDate.setDate(currentDate.getDate() + 1);

 
    const formattedExpirationDate = expirationDate.toISOString();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
      from: emailConfig.auth.user,
      to: email,
      subject: "Vendor Registration OTP",
      text: `Your OTP for vendor registration is: ${otp}`,
    };

    // If the email exists, update the OTP; otherwise, save a new entry
    if (existingVendor) {
      existingVendor.otp = otp;
      await existingVendor.save();
    } else {
      const vendor = new Vendor({
        email,
        otp,
        password: "your-default-password",
      });
      await vendor.save();
    }

    await transporter.sendMail(mailOptions);
    const redirectUrl = "https://takedevs.abhimilega.com/vendor-otpVerify";
    res.json({ message: "OTP sent successfully", redirectUrl });
    
  } catch (error) {
    console.error("Request OTP Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//varify with otp
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const vendor = await Vendor.findOne({ otp });

    if (vendor) {
      const vendorId = vendor._id;

      vendor.email_verification = true;
      await vendor.save();
      res.json({ message: "OTP verification successful", vendorId });
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//set-password
exports.setPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
   
    const hashedPassword = await bcrypt.hash(password, 10);
   
    const userId = req.params.id;

    const vendor = await Vendor.findById(userId);

    if (vendor) {
      // Update the user's password and mark as verified
      vendor.password = hashedPassword;
      vendor.email_verification = true;

      await vendor.save();

      res.json({ message: "Password set successfully after OTP verification" });
    } else {
      res.status(401).json({ message: "Invalid user ID" });
    }
  } catch (error) {
    console.error("Set Password After OTP Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//login
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });

    
    if (!vendor) {
      // console.log("after vendor......");
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);

    if (!isPasswordValid) {
      
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const generatedToken = jwt.sign(
      { email: vendor.email, _id: vendor._id, role: "vendor" }, 
      "vendor-secret-key",
    );

    // Save the token to the vendor document
    vendor.token = generatedToken;

    // Save the updated document
    await vendor.save();

    //Redirect to the vendor dashboard
    res.json({
      success: true,
      message: "Login successful",
      token: generatedToken,
      email:email,
      role: "vendor",
      redirectTo: "/vendor-dashboard",
      vendor: vendor, 
    });


    // res.render('vendor/editProfile.ejs', { vendor, redirectTo: "/vendor-dashboard" });

    // res.render('vendor/editProfile.ejs', { vendor });
    // console.log("-----------Vendorrr",vendor);

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//edit-profile
exports.editProfile = async (req, res) => {
  try {
    const { email, company_name, website_link, contact, gst_number, address ,team_size,profileImage} = req.body;
    const { authorization } = req.headers;
    
    // console.log("........",profileImage);
   
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Update only if the new value is provided, otherwise keep the existing value
    vendor.company_name = company_name || vendor.company_name;
    vendor.website_link = website_link || vendor.website_link;
    vendor.contact = contact || vendor.contact;
    vendor.gst_number = gst_number || vendor.gst_number;
    vendor.address = address || vendor.address;
    vendor.team_size = team_size || vendor.team_size;

    // console.log("req.file",req.file);
    if (req.file) {
      const filePath = path.join('public/uploads', req.file.filename);
      console.log("filePath" , req.file.filename);

        vendor.profileImage = `localhost:3000/uploads/${req.file.filename}`;
    }


    await vendor.save();

    res.json({ message: "Profile updated successfully", data: vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//view-profile
exports.viewProfile = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({ vendor });
  } catch (error) {
    console.error("Veiw Profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, old_psw, new_psw, confirm_psw } = req.body;

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    const isPasswordValid = await bcrypt.compare(old_psw, vendor.password);

    // console.log("data", isPasswordValid);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid old password" });
    }

    if (new_psw !== confirm_psw) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(new_psw, 10);
    vendor.password = hashedPassword;

    await vendor.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//set-password
exports.setPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
   
    const hashedPassword = await bcrypt.hash(password, 10);
   
    const userId = req.params.id;

    const vendor = await Vendor.findById(userId);

    if (vendor) {
      // Update the user's password and mark as verified
      vendor.password = hashedPassword;
      vendor.email_verification = true;

      await vendor.save();

      res.json({ message: "Password set successfully after OTP verification" });
    } else {
      res.status(401).json({ message: "Invalid user ID" });
    }
  } catch (error) {
    console.error("Set Password After OTP Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//get-all-vendor
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate({
      path: 'developers',
      select: 'name rate',
    });

    res.status(200).json({ success: true, vendors });
  } catch (error) {
    console.error("Get All Vendors Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//get-venodr-by-id
exports.getvendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // Fetch the vendor
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // const developer = await Developer.findOne({ vendorId: vendorId }); 

    // if (!developer) {
    //   return res.status(404).json({ message: "Developer not found" });
    // }

    // Combine vendor and developer details
    const vendorWithDeveloper = {
      _id: vendor._id,
      vendorEmail: vendor.email,
      Address: vendor.address,
      vendorEmail: vendor.email,
      companyname: vendor.company_name,
      gstnumber: vendor.gst_number,
      token: vendor.token,
      

      // developer: {
      //   _id: developer._id,
      //   developerName: developer.name,
      //   // Add other developer details as needed
      // },
    };

    res.status(200).json({ success: true, vendor: vendorWithDeveloper });

  } catch (error) {
    console.error("Get vendor by ID Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//vendor logout
exports.logoutVendor = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const tokenFromRequest = req.header("Authorization");

    if (!tokenFromRequest) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const token = tokenFromRequest.replace("Bearer ", "").trim();

    // Find the vendor with the provided token in the database
    const vendorUser = await Vendor.findOne({ token });

    // Handle invalid token
    if (!vendorUser) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Clear the token in the database
    vendorUser.token = null;
    await vendorUser.save();

    // Respond with a success message
    res.json({ success: true, message: "Vendor logout successful" });

  } catch (error) {
    // Handle errors during vendor logout
    console.error("Error during vendor logout:", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

//developer count and admi count api
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


//added vendor by 
exports.addTechByVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const { name } = req.body;

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    
    const newTechnology = new Technology({
      name: name,
      vendorId: vendor._id, 
      
    });

    await newTechnology.save();
    vendor.technologies = vendor.technologies || [];
    vendor.technologies.push(newTechnology._id);
    await vendor.save();
    res.status(201).json({
      success: true,
      message: 'Technology added successfully',
      technology: newTechnology,
      vendorId: vendor._id, 
    });
  } catch (error) {
    console.error('Add technology by vendor Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.developerCount = async (req, res) => {

  console.log("================apideveloper");
  try {
      const developer = await Developer.countDocuments();
      res.send(developer.toString());
  } catch (error) {
    console.error("Get Vendor developer Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


