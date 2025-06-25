document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup Successful! Redirecting...");

                // Store required info
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("username", data.username);

                // Redirect based on questionnaire status
                if (data.questionnaire_completed === 0 || data.questionnaire_completed === false) {
                    window.location.href = "habit-tracker.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
        }
    });
});
