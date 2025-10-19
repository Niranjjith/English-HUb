const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");

// Homepage
router.get("/", async (req, res) => {
  const lessons = await Lesson.find().limit(3);
  res.render("pages/home", { lessons });
});

// Lessons page
router.get("/lessons", async (req, res) => {
  const lessons = await Lesson.find();
  res.render("pages/lessons", { lessons });
});

// Quiz page
router.get("/quiz", async (req, res) => {
  const quizzes = await Quiz.find();
  const answers = quizzes.map(q => q.correctAnswer);
  res.render("pages/quiz", { quizzes, answers });
});

// About page
router.get("/about", (req, res) => {
  res.render("pages/about");
});

module.exports = router;
