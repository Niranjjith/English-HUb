const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Lesson = require("./models/Lesson");
const Quiz = require("./models/Quiz");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB...");

    await Lesson.deleteMany();
    await Quiz.deleteMany();

    await Lesson.insertMany([
      { title: "Basics of English Grammar", content: "Learn about nouns, verbs, adjectives, and sentence structure." },
      { title: "Tenses Simplified", content: "Understanding past, present, and future tenses with examples." },
      { title: "Common Idioms", content: "Boost your vocabulary with everyday idiomatic expressions." }
    ]);

    await Quiz.insertMany([
      {
        question: "Choose the correct sentence.",
        options: ["He go to school.", "He goes to school.", "He going to school.", "He gone to school."],
        correctAnswer: "He goes to school."
      },
      {
        question: "What is the plural of 'child'?",
        options: ["childs", "childes", "children", "childrens"],
        correctAnswer: "children"
      },
      {
        question: "Which word is an adjective?",
        options: ["Quickly", "Quick", "Quicker", "Quicklyest"],
        correctAnswer: "Quick"
      }
    ]);

    console.log("✅ Sample data inserted!");
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
