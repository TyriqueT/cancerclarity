
"use strict";

// CancerClarity: interactive learning features

document.addEventListener("DOMContentLoaded", () => {
  // Update the copyright year.
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // -----------------------------
  // 1. Expandable learning cards
  // -----------------------------
  const lessonButtons = document.querySelectorAll(".lesson-toggle");

  lessonButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lessonName = button.dataset.lesson;
      const lessonPanel = document.getElementById(`lesson-${lessonName}`);

      if (!lessonPanel) return;

      const isCurrentlyOpen = button.getAttribute("aria-expanded") === "true";
      const shouldOpen = !isCurrentlyOpen;

      lessonPanel.hidden = !shouldOpen;
      button.setAttribute("aria-expanded", String(shouldOpen));
      button.innerHTML = shouldOpen
        ? 'Close lesson <span aria-hidden="true">−</span>'
        : 'Read the lesson <span aria-hidden="true">＋</span>';
    });
  });

  // -----------------------------
  // 2. Myth-or-fact quiz
  // -----------------------------
  const questions = [
    {
      question: "Every cancer can be prevented if you make healthy choices.",
      answers: ["Myth", "Fact"],
      correctIndex: 0,
      explanation:
        "Correct — this is a myth. Some cancers may be prevented or their risk reduced, but no action can prevent every cancer. Risk can also be influenced by age, genetics, and other factors.",
      resource:
        "https://www.cancer.gov/about-cancer/causes-prevention",
      resourceLabel: "Learn about cancer causes and prevention"
    },
    {
      question: "UV radiation from tanning beds can increase skin cancer risk.",
      answers: ["Myth", "Fact"],
      correctIndex: 1,
      explanation:
        "Correct — this is a fact. UV radiation from tanning devices can damage skin and increase skin cancer risk. Avoiding indoor tanning helps reduce exposure.",
      resource:
        "https://www.cancer.gov/about-cancer/causes-prevention/risk/sunlight",
      resourceLabel: "Learn about sunlight and cancer risk"
    },
    {
      question: "HPV vaccination can help prevent certain cancers.",
      answers: ["Myth", "Fact"],
      correctIndex: 1,
      explanation:
        "Correct — this is a fact. HPV vaccination protects against HPV types that cause most HPV-related cancers. Recommendations depend on age and individual circumstances.",
      resource:
        "https://www.cdc.gov/vaccines/",
      resourceLabel: "Explore CDC vaccine information"
    },
    {
      question: "A screening test and a diagnostic test always mean the same thing.",
      answers: ["Myth", "Fact"],
      correctIndex: 0,
      explanation:
        "Correct — this is a myth. Screening looks for signs of a disease in people without symptoms. Diagnostic testing helps investigate a possible health problem, such as symptoms or an abnormal screening result.",
      resource:
        "https://www.cancer.gov/about-cancer/screening",
      resourceLabel: "Learn about cancer screening"
    },
    {
      question: "Avoiding tobacco can reduce the risk of several types of cancer.",
      answers: ["Myth", "Fact"],
      correctIndex: 1,
      explanation:
        "Correct — this is a fact. Tobacco use causes several types of cancer. Avoiding tobacco and seeking support to quit can help reduce risk.",
      resource:
        "https://www.cancer.gov/about-cancer/causes-prevention/risk/tobacco",
      resourceLabel: "Learn about tobacco and cancer"
    }
  ];

  const questionCounter = document.getElementById("question-counter");
  const scoreLabel = document.getElementById("score-label");
  const questionText = document.getElementById("question-text");
  const answerOptions = document.getElementById("answer-options");
  const answerFeedback = document.getElementById("answer-feedback");
  const nextButton = document.getElementById("next-question");
  const quizContent = document.getElementById("quiz-content");
  const quizResults = document.getElementById("quiz-results");
  const resultsTitle = document.getElementById("results-title");
  const resultsMessage = document.getElementById("results-message");
  const restartButton = document.getElementById("restart-quiz");
  const progressBar = document.getElementById("quiz-progress");
  const progressFill = document.getElementById("quiz-progress-fill");

  let currentQuestionIndex = 0;
  let score = 0;
  let questionAnswered = false;

  function renderQuestion() {
    const question = questions[currentQuestionIndex];
    questionAnswered = false;

    questionCounter.textContent =
      `QUESTION ${currentQuestionIndex + 1} OF ${questions.length}`;
    scoreLabel.textContent = `Score: ${score}`;
    questionText.textContent = question.question;

    progressBar.setAttribute("aria-valuenow", String(currentQuestionIndex));
    progressFill.style.width =
      `${(currentQuestionIndex / questions.length) * 100}%`;

    answerOptions.replaceChildren();

    question.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = answer;

      button.addEventListener("click", () => {
        chooseAnswer(index, button);
      });

      answerOptions.appendChild(button);
    });

    answerFeedback.hidden = true;
    answerFeedback.replaceChildren();
    nextButton.hidden = true;
    quizContent.hidden = false;
    quizResults.hidden = true;
  }

  function chooseAnswer(selectedIndex, selectedButton) {
    if (questionAnswered) return;

    questionAnswered = true;

    const question = questions[currentQuestionIndex];
    const answerButtons = answerOptions.querySelectorAll("button");
    const isCorrect = selectedIndex === question.correctIndex;

    if (isCorrect) {
      score += 1;
    }

    answerButtons.forEach((button, index) => {
      button.disabled = true;

      if (index === question.correctIndex) {
        button.classList.add("correct-answer");
      }
    });

    if (!isCorrect) {
      selectedButton.classList.add("wrong-answer");
    }

    scoreLabel.textContent = `Score: ${score}`;
    answerFeedback.hidden = false;

    const heading = document.createElement("strong");
    heading.textContent = isCorrect ? "✓ That's right!" : "Not quite — here's the fact.";
    answerFeedback.appendChild(heading);

    const explanation = document.createElement("p");
    explanation.textContent = question.explanation;
    answerFeedback.appendChild(explanation);

    const resourceLink = document.createElement("a");
    resourceLink.href = question.resource;
    resourceLink.target = "_blank";
    resourceLink.rel = "noopener noreferrer";
    resourceLink.textContent = `${question.resourceLabel} ↗`;
    answerFeedback.appendChild(resourceLink);

    nextButton.textContent =
      currentQuestionIndex === questions.length - 1
        ? "See my results →"
        : "Next question →";
    nextButton.hidden = false;
  }

  function showResults() {
    quizContent.hidden = true;
    quizResults.hidden = false;

    progressBar.setAttribute("aria-valuenow", String(questions.length));
    progressFill.style.width = "100%";
    questionCounter.textContent = "QUIZ COMPLETE";
    scoreLabel.textContent = `Score: ${score}/${questions.length}`;

    if (score === questions.length) {
      resultsTitle.textContent = "Excellent work!";
      resultsMessage.textContent =
        "You answered all five questions correctly. Keep exploring trusted sources and sharing what you learn.";
    } else if (score >= 3) {
      resultsTitle.textContent = "You're building knowledge!";
      resultsMessage.textContent =
        `You got ${score} out of ${questions.length}. Review any explanations that were new to you, then try again.`;
    } else {
      resultsTitle.textContent = "Every answer is a chance to learn.";
      resultsMessage.textContent =
        `You got ${score} out of ${questions.length}. Explore the learning cards and trusted resources, then give the quiz another try.`;
    }

    // Completing the quiz checks off the related learning task.
    const quizChecklistItem = document.querySelector('[data-check="quiz"]');
    if (quizChecklistItem) {
      quizChecklistItem.checked = true;
      saveChecklist();
      updateChecklistProgress();
    }
  }

  nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex += 1;
      renderQuestion();
    } else {
      showResults();
    }
  });

  restartButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    renderQuestion();
  });

  renderQuestion();

  // -----------------------------
  // 3. Learning checklist
  // -----------------------------
  const checklistItems = document.querySelectorAll("[data-check]");
  const checklistCount = document.getElementById("checklist-count");
  const checklistPercent = document.getElementById("checklist-percent");
  const checklistProgress = document.getElementById("checklist-progress");
  const checklistProgressFill = document.getElementById(
    "checklist-progress-fill"
  );
  const resetChecklistButton = document.getElementById("reset-checklist");

  const STORAGE_KEY = "cancerclarity-checklist-v1";

  function loadChecklist() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedItems = savedData ? JSON.parse(savedData) : {};

      checklistItems.forEach((item) => {
        item.checked = savedItems[item.dataset.check] === true;
      });
    } catch (error) {
      // The checklist still works for the current session if storage is unavailable.
      console.warn("Checklist progress could not be loaded.", error);
    }
  }

  function saveChecklist() {
    const checklistData = {};

    checklistItems.forEach((item) => {
      checklistData[item.dataset.check] = item.checked;
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistData));
    } catch (error) {
      console.warn("Checklist progress could not be saved.", error);
    }
  }

  function updateChecklistProgress() {
    const total = checklistItems.length;
    const completed = Array.from(checklistItems).filter(
      (item) => item.checked
    ).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    checklistCount.textContent = `${completed} of ${total} completed`;
    checklistPercent.textContent = `${percentage}%`;
    checklistProgress.setAttribute("aria-valuenow", String(completed));
    checklistProgressFill.style.width = `${percentage}%`;
  }

  checklistItems.forEach((item) => {
    item.addEventListener("change", () => {
      saveChecklist();
      updateChecklistProgress();
    });
  });

  resetChecklistButton.addEventListener("click", () => {
    const shouldReset = window.confirm(
      "Reset all checklist progress on this browser?"
    );

    if (!shouldReset) return;

    checklistItems.forEach((item) => {
      item.checked = false;
    });

    saveChecklist();
    updateChecklistProgress();
  });

  loadChecklist();
  updateChecklistProgress();

  // Completing any lesson marks "Explore a lesson" as done.
  lessonButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isOpening = button.getAttribute("aria-expanded") === "true";

      if (isOpening) {
        const lessonChecklistItem = document.querySelector(
          '[data-check="lesson"]'
        );

        if (lessonChecklistItem) {
          lessonChecklistItem.checked = true;
          saveChecklist();
          updateChecklistProgress();
        }
      }
    });
  });

  // Visiting a trusted resource marks the resource task as done.
  document.querySelectorAll("#resources a").forEach((link) => {
    link.addEventListener("click", () => {
      const resourceChecklistItem = document.querySelector(
        '[data-check="resource"]'
      );

      if (resourceChecklistItem) {
        resourceChecklistItem.checked = true;
        saveChecklist();
        updateChecklistProgress();
      }
    });
  });
});



  // -----------------------------
  // 4. Community conversation starter
  // -----------------------------
  const conversationChoice = document.getElementById("conversation-choice");
  const conversationPrompt = document.getElementById("conversation-prompt");
  const copyPromptButton = document.getElementById("copy-prompt");
  const copyStatus = document.getElementById("copy-status");

  const conversationPrompts = {
    learn:
      "I learned something new about cancer prevention today. Want to explore a trusted resource together?",
    family:
      "Have you ever talked with a healthcare professional about recommended cancer screenings or prevention? I found some information we could explore together.",
    reliable:
      "There is a lot of health information online. Want to compare what we've heard with information from trusted sources like the CDC or National Cancer Institute?"
  };

  if (conversationChoice && conversationPrompt && copyPromptButton && copyStatus) {
    conversationChoice.addEventListener("change", () => {
      conversationPrompt.textContent =
        conversationPrompts[conversationChoice.value] || conversationPrompts.learn;
      copyStatus.textContent = "";
    });

    copyPromptButton.addEventListener("click", async () => {
      const prompt = conversationPrompt.textContent.trim();

      try {
        await navigator.clipboard.writeText(prompt);
        copyStatus.textContent = "Copied! You can now paste it into a message.";
      } catch (error) {
        // Fallback for browsers that don't allow clipboard access.
        const temporaryText = document.createElement("textarea");
        temporaryText.value = prompt;
        temporaryText.setAttribute("readonly", "");
        temporaryText.style.position = "absolute";
        temporaryText.style.left = "-9999px";
        document.body.appendChild(temporaryText);
        temporaryText.select();

        const copied = document.execCommand("copy");
        temporaryText.remove();

        copyStatus.textContent = copied
          ? "Copied! You can now paste it into a message."
          : "Copy wasn't available. Select and copy the text above.";
      }
    });
  }
