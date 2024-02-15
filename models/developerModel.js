const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  technology: [
    {
      type: String,
      required: true,
    },
  ],
  resume: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  gitHubUrl: {
    type: String,
  },
  linkedInLink: {
    type: String,
  },
  available: {
    type: String, // "part-time", "full-time", or any other values you want to support
    default: "full-time", 
  },

  rate: {
    type: Number,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const Developer = mongoose.model("Developer", developerSchema);

module.exports = Developer;
