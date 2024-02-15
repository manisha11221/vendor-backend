const jwt = require("jsonwebtoken");
const authadminmodel = require("../models/adminModal");

const authSchema = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    // console.log("token", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - Token missing" });
    }

    const tokenWithoutPrefix = token.split(' ')[1];
    // console.log("token:--", tokenWithoutPrefix);

    try {
      const decodedadmin = jwt.verify(tokenWithoutPrefix, "admin-secret-key");
      console.log("decodedadmin", decodedadmin);

      const admin = await authadminmodel.findOne({ adminId: decodedadmin._Id });
      // console.log("admin_data_token", admin._id);

      if (!admin) {
        return res.status(404).json({
          message: "You are not authorized for this action",
          status: 409,
        });
      }

      req.token = tokenWithoutPrefix;
      req.admin = admin;
      next();
    } catch (error) {
      console.error("Token Verification Error:", error);
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  } catch (error) {
    console.error("Middleware Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authSchema;
