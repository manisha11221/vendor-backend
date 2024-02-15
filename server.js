const express = require("express");
const bodyParser = require("body-parser");
const dbConn = require('./db/conn');



//all Routres
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const developerRoutes = require("./routes/developerRoutes")
const technologyRoutes = require("./routes/techRoutes")
const jobRoute = require("./routes/jobRoutes")
const cors = require("cors");

const app = express();

const PORT = 8000;

app.use(bodyParser.json());
// Use cors middleware
app.use(cors());
app.use(express.static('public'));

// Use admin routes
app.use("/admin", adminRoutes);

// Use vendor routes
app.use("/vendor", vendorRoutes);

//use developer routes
app.use("/developer",developerRoutes);

//use technology
app.use("/technology",technologyRoutes);

//use job
app.use("/job",jobRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
