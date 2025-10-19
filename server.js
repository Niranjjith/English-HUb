// ===============================
//  Campus English Hub Server
// ===============================

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

// Initialize app
const app = express();
dotenv.config();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// ===============================
//  Database Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
  res.locals.currentPath = req.path; // Used to hide navbar on admin pages
  next();
});

// ===============================
//  Routes
// ===============================
const mainRoutes = require("./routes/mainRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/", mainRoutes);
app.use("/admin", adminRoutes);

// ===============================
//  Default Route
// ===============================
app.get("*", (req, res) => {
  res.status(404).render("pages/404", { message: "Page Not Found" });
});

// ===============================
//  Server Start
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
