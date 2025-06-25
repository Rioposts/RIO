document.addEventListener("DOMContentLoaded", async () => {
  const habitGrid = document.querySelector(".habit-grid");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const habitForm = document.getElementById("habitForm");
  const usernameDisplay = document.getElementById("username-display");

  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");

  if (!userId) {
    alert("No user ID found. Please log in again.");
    window.location.href = "login.html";
    return;
  }

  if (usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  let habits = [];
  let selectedCategory = "All";

  // Fetch habits from the backend for the specific user
  async function fetchHabits() {
    try {
      const response = await fetch(`http://localhost:3000/habits?user_id=${userId}`);
      const data = await response.json();
      habits = data;
      renderHabits();
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    }
  }

  // Render habits on the screen
  function renderHabits() {
    habitGrid.innerHTML = "";

    const filteredHabits =
      selectedCategory === "All"
        ? habits
        : habits.filter((habit) => habit.category === selectedCategory);

    if (filteredHabits.length === 0) {
      habitGrid.innerHTML = "<p>No habits found for this category.</p>";
      return;
    }

    filteredHabits.forEach((habit) => {
      const card = document.createElement("div");
      card.classList.add("habit-card");
      if (habit.completed_today) card.classList.add("completed");

      card.innerHTML = `
        <h3>${habit.name}</h3>
        <p>Category: ${habit.category}</p>
        <p>Streak: ${habit.streak} 🔥</p>
        <button class="complete-btn">${habit.completed_today ? "Completed" : "Mark as Done"}</button>
      `;

      // Mark habit as completed
      card.querySelector(".complete-btn").addEventListener("click", async () => {
        try {
          const res = await fetch(`http://localhost:3000/habits/${habit.id}/complete`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          });

          if (res.ok) {
            fetchHabits();
          }
        } catch (err) {
          console.error("Failed to update habit status:", err);
        }
      });

      habitGrid.appendChild(card);
    });
  }

  // Handle form submission to add a new habit
  habitForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("habitName").value.trim();
    const category = document.getElementById("habitCategory").value;

    if (!name || !category) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, name, category }),
      });

      if (response.ok) {
        document.getElementById("habitName").value = "";
        document.getElementById("habitCategory").value = "";
        fetchHabits();
      } else {
        console.error("Failed to add habit");
      }
    } catch (err) {
      console.error("Error adding habit:", err);
    }
  });

  // Handle category filter buttons
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCategory = btn.dataset.category;
      renderHabits();
    });
  });

  // Initial data fetch
  fetchHabits();
});
// Modal logic
const addHabitBtn = document.getElementById("addHabitBtn");
const habitModal = document.getElementById("add-habit-modal");
const closeModal = document.querySelector(".close-modal");
const cancelBtn = document.querySelector(".cancel-btn");

if (addHabitBtn && habitModal && closeModal && cancelBtn) {
  addHabitBtn.addEventListener("click", () => {
    habitModal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    habitModal.style.display = "none";
  });

  cancelBtn.addEventListener("click", () => {
    habitModal.style.display = "none";
  });

  // Optional: close when clicking outside the modal
  window.addEventListener("click", (event) => {
    if (event.target === habitModal) {
      habitModal.style.display = "none";
    }
  });
}
