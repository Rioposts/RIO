const questions = [
  {
    question: "What's your primary goal for personal growth?",
    options: [
      "Improve Mental Health",
      "Boost Productivity",
      "Enhance Physical Fitness", 
      "Develop New Skills"
    ]
  },
  {
    question: "How do you typically handle stress?",
    options: [
      "Avoid it completely",
      "Use basic coping methods", 
      "Practice mindfulness",
      "Proactively manage stress"
    ]
  },
  {
    question: "How consistent are you with your daily routines?",
    options: [
      "Not consistent at all",
      "Somewhat inconsistent",
      "Mostly consistent",
      "Extremely disciplined"
    ]
  },
  {
    question: "How often do you learn something new?",
    options: [
      "Rarely",
      "Once in a while",
      "Monthly",
      "Weekly or more"
    ]
  },
  {
    question: "How do you approach personal challenges?",
    options: [
      "Give up quickly",
      "Struggle but persist",
      "Strategically plan",
      "Embrace and grow from challenges"
    ]
  },
  {
    question: "How do you prioritize self-care?",
    options: [
      "Almost never",
      "Occasionally",
      "Regularly",
      "It's a top priority"
    ]
  },
  {
    question: "What's your typical energy level during the day?",
    options: [
      "Constantly tired",
      "Occasional low energy",
      "Mostly energetic",
      "Consistently high energy"
    ]
  },
  {
    question: "How reflective are you about your personal growth?",
    options: [
      "Never reflect",
      "Rarely reflect",
      "Sometimes reflect",
      "Regularly assess and adjust"
    ]
  }
];

let currentQuestion = 0;
let selectedAnswers = [];

const container = document.querySelector(".quiz-container");
const questionElement = document.querySelector(".question");
const optionsContainer = document.querySelector(".options");
const progressBar = document.createElement("div");
progressBar.className = "progress-bar";
container.insertBefore(progressBar, container.firstChild);

// Add progress indicators
const progressIndicator = document.createElement("p");
progressIndicator.className = "progress-indicator";
container.insertBefore(progressIndicator, progressBar.nextSibling);

function renderQuestion() {
  // Update progress bar
  const progress = (currentQuestion / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressIndicator.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

  container.classList.remove('fade-out');
  container.classList.add('fade-in');
  questionElement.textContent = questions[currentQuestion].question;
  optionsContainer.innerHTML = "";
  
  questions[currentQuestion].options.forEach(option => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.onclick = handleAnswer;
    optionsContainer.appendChild(button);
  });
}

function handleAnswer(event) {
  selectedAnswers.push(event.target.textContent);
  
  container.classList.remove('fade-in');
  container.classList.add('fade-out');
  
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      renderQuestion();
    } else {
      updateQuestionnaireStatus();
    }
  }, 500);
}

function updateQuestionnaireStatus() {
  // Get the user ID from localStorage
  const userId = localStorage.getItem("user_id");
  
  if (!userId) {
    console.error("User ID not found");
    displayThankYou();
    return;
  }
  
  // Update questionnaire status in the database
  fetch("http://localhost:3000/questionnaire-complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Questionnaire status updated:", data);
    displayThankYou();
  })
  .catch(error => {
    console.error("Error updating questionnaire status:", error);
    displayThankYou();
  });
  
  // Also save user's answers if needed
  // This is optional but could be useful for personalization
  // You would need to add an API endpoint for this
  /*
  fetch("http://localhost:3000/save-answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      user_id: userId,
      answers: selectedAnswers 
    })
  });
  */
}

function displayThankYou() {
  container.innerHTML = `
    <div class="thank-you">
      <h1>Thank You!</h1>
      <h3>These answers will help us help you reach your goal faster!</h3>
      <p>Remember, this is just the beginning of your journey to personal growth.</p>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  container.classList.remove('fade-out');
  container.classList.add('fade-in');

  // Redirect to dashboard after 3 seconds
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 3000);
}

// Initialize the quiz when the page loads
renderQuestion();

// Add CSS for the new elements
document.head.insertAdjacentHTML('beforeend', `
<style>
  .progress-bar {
    width: 0%;
    height: 6px;
    background-color: #4CAF50;
    border-radius: 3px;
    margin-bottom: 10px;
    transition: width 0.5s ease;
  }
  
  .progress-indicator {
    text-align: center;
    font-size: 14px;
    color: white;
    margin-bottom: 15px;
  }
  
  .loading-dots {
    margin-top: 20px;
    text-align: center;
  }
  
  .loading-dots span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #4CAF50;
    border-radius: 50%;
    margin: 0 5px;
    animation: dots 1.5s infinite ease-in-out;
  }
  
  .loading-dots span:nth-child(2) {
    animation-delay: 0.5s;
  }
  
  .loading-dots span:nth-child(3) {
    animation-delay: 1s;
  }
  
  @keyframes dots {
    0%, 100% {
      transform: scale(0.75);
      opacity: 0.5;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .option {
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }
  
  .option:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .option:active {
    transform: translateY(0);
  }
</style>
`);