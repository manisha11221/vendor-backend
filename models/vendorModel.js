const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  email_verification: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  },
  company_name: {
    type: String,
  },
  website_link: {
    type: String,
  },
  contact: {
    type: String,
  },
  gst_number: {
    type: String,
  },
  address: {
    type: String,
  },
  team_size: {
    type: Number, 
  },
  developers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer', 
  }],
  profileImage: {
    type: String,
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
