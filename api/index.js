// ===============================
//  Campus English Hub - Vercel Version (FINAL)
// ===============================

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

// Initialize app
const app = express();
dotenv.config();

// ===============================
//  Middleware setup
// ===============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Correct public directory path for Vercel
app.use(express.static(path.join(__dirname, "../public")));

// ✅ EJS setup - make sure the path points correctly for Vercel
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// ===============================
//  Database Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ===============================
//  Express Session
// ===============================
app.use(
  session({
    secret: "campusenglishsecret",
    resave: false,
    saveUninitialized: false,
  })
);

// ===============================
//  Pass current path to all EJS views
// ===============================
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// ===============================
//  Routes
// ===============================
const mainRoutes = require("../routes/mainRoutes");
const adminRoutes = require("../routes/adminRoutes");

app.use("/", mainRoutes);
app.use("/admin", adminRoutes);

// ===============================
//  404 Page - FIXED PATH
// ===============================
app.use((req, res) => {
  // ✅ Ensure this file exists: /views/pages/404.ejs
  res.status(404).render("pages/404", {
    message: "Page Not Found",
  });
});

// ===============================
//  ❌ DO NOT use app.listen() in Vercel
//  ✅ Export the app instead
// ===============================
module.exports = app;
