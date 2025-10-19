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
app.use(express.static(path.join(__dirname, "../public"))); // ✅ Serve static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); // ✅ EJS templates path

// ===============================
//  Database Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // Wait up to 15 seconds before timeout
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

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
//  404 Page
// ===============================
app.use((req, res) => {
  res.status(404).render("pages/404", { message: "Page Not Found" });
});

// ===============================
//  ✅ Export app for Vercel (no app.listen())
// ===============================
module.exports = app;
