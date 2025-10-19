const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error", err));

// Sessions (not persistent, but works fine for demo)
app.use(
  session({
    secret: "campusenglishhubsecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Pass path to all views
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Routes
app.use("/", require("../routes/mainRoutes"));
app.use("/admin", require("../routes/adminRoutes"));

// 404 page
app.get("*", (req, res) => {
  res.status(404).render("pages/404", { message: "Page not found" });
});

// Export for Vercel
module.exports = app;
