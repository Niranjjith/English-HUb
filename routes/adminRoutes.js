const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Admin = require("../models/Admin");

// Ensure default admin exists
(async () => {
  const existing = await Admin.findOne({ email: "admin@gmail.com" });
  if (!existing) {
    await Admin.create({ email: "admin@gmail.com", password: "123456" });
    console.log("✅ Default admin created: admin@gmail.com / 123456");
  }
})();

// Admin Login Page
router.get("/login", (req, res) => {
  res.render("pages/admin-login", { error: null });
});

// Login Logic
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email, password });
  if (!admin) {
    return res.render("pages/admin-login", { error: "Invalid credentials" });
  }
  req.session.admin = admin;
  res.redirect("/admin/dashboard");
});

// Dashboard
router.get("/dashboard", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  const lessons = await Lesson.find();
  const quizzes = await Quiz.find();
  res.render("pages/admin-dashboard", { admin: req.session.admin, lessons, quizzes });
});

// Add Lesson
router.post("/add-lesson", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  const { title, content } = req.body;
  await Lesson.create({ title, content });
  res.redirect("/admin/dashboard");
});

// Edit Lesson
router.post("/edit-lesson/:id", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  const { title, content } = req.body;
  await Lesson.findByIdAndUpdate(req.params.id, { title, content });
  res.redirect("/admin/dashboard");
});

// Delete Lesson
router.get("/delete-lesson/:id", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  await Lesson.findByIdAndDelete(req.params.id);
  res.redirect("/admin/dashboard");
});

// Add Quiz
router.post("/add-quiz", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  const { question, option1, option2, option3, option4, correctAnswer } = req.body;
  await Quiz.create({
    question,
    options: [option1, option2, option3, option4],
    correctAnswer,
  });
  res.redirect("/admin/dashboard");
});

// Edit Quiz
router.post("/edit-quiz/:id", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  const { question, option1, option2, option3, option4, correctAnswer } = req.body;
  await Quiz.findByIdAndUpdate(req.params.id, {
    question,
    options: [option1, option2, option3, option4],
    correctAnswer,
  });
  res.redirect("/admin/dashboard");
});

// Delete Quiz
router.get("/delete-quiz/:id", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin/login");
  await Quiz.findByIdAndDelete(req.params.id);
  res.redirect("/admin/dashboard");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

module.exports = router;
