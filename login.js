async function handleLogin(event) {
    event.preventDefault(); // Prevent form submission reload

    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login Successful!");
            console.log("Server response:", data);
            
            // Store token and user info
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("level", data.level || 1);
            localStorage.setItem("streak", data.streak || 1); // start at 1
            localStorage.setItem("lastLogin", new Date().toISOString().split("T")[0]); // store today's date

            
            //  fallback to 1 if level missing

            // Redirect based on questionnaire status
            const completed = data.user?.questionnaire_completed;
            if (completed === 0 || completed === false || completed === "0") {
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
}

// Attach function to the login button
document.getElementById("login-btn").addEventListener("click", handleLogin);
