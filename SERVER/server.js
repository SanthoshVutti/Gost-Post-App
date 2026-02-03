require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const secretRoutes = require("./routes/secretRoutes.js");

const app = express();


app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("❌ Database Connection Error:", err);
  });
app.use("/api/secrets", secretRoutes);

app.listen(process.env.PORT, () => {
  console.log("🚀 Server running on PORT", process.env.PORT);
});
