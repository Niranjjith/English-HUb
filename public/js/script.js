document.addEventListener("DOMContentLoaded", () => {
  console.log("🎓 Campus English Hub Loaded");

  const submitBtn = document.getElementById("submitQuiz");
  const retryBtn = document.getElementById("retryQuiz");
  const successMsg = document.getElementById("successMessage");
  const resultBox = document.getElementById("resultContainer");
  const scoreText = document.getElementById("score");

  if (!submitBtn) return;

  submitBtn.addEventListener("click", () => {
    const quizCards = document.querySelectorAll(".quiz-card");
    let score = 0;

    quizCards.forEach((card) => {
      const questionIndex = parseInt(card.getAttribute("data-question-index"));
      const correctAnswer = window.quizAnswers[questionIndex];
      const radios = card.querySelectorAll("input[type='radio']");
      let selected = null;

      radios.forEach((r) => {
        if (r.checked) selected = r.value.trim();
      });

      // Reset highlight
      card.classList.remove("border-success", "border-danger");

      if (selected === correctAnswer) {
        score++;
        card.classList.add("border", "border-success");
      } else {
        card.classList.add("border", "border-danger");
      }
    });

    // Show result
    scoreText.textContent = score;
    resultBox.classList.remove("d-none");
    successMsg.style.display = "block";
    successMsg.style.opacity = 0;
    successMsg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, fill: "forwards" });

    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  });

  // Retry Quiz
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      const quizCards = document.querySelectorAll(".quiz-card");
      quizCards.forEach((card) => {
        card.classList.remove("border-success", "border-danger");
        const radios = card.querySelectorAll("input[type='radio']");
        radios.forEach((r) => (r.checked = false));
      });
      resultBox.classList.add("d-none");
      successMsg.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
