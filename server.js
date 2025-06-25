const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON bodies

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "rio", // Replace with your actual database name
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
        return;
    }
    console.log("Connected to MySQL database.");
});

// ---------------------- User Authentication ----------------------
const updateStreak = (userId) => {
    const query = `SELECT last_active_date, streak_count FROM users WHERE id = ?`;

    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) return;

        const { last_active_date, streak_count } = results[0];
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        if (last_active_date === today) {
            return; // already updated today
        }

        let newStreak = 1;
        if (last_active_date === yesterday) {
            newStreak = streak_count + 1;
        }

        const updateQuery = `UPDATE users SET streak_count = ?, last_active_date = ? WHERE id = ?`;
        db.query(updateQuery, [newStreak, today, userId]);
    });
};

// Signup Route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, NOW())";

        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "User registration failed" });
            }

            const user_id = result.insertId;
            // Set questionnaire_completed = 0 after registration
            const setStatusQuery = "UPDATE users SET questionnaire_completed = 0 WHERE id = ?";
            db.query(setStatusQuery, [user_id], (err2) => {
                if (err2) {
                    console.error("Failed to set questionnaire status:", err2);
                    return res.status(500).json({ error: "Could not set questionnaire status" });
                }

                res.status(201).json({
                    message: "User registered successfully",
                    user_id: user_id,
                    username: username,
                    questionnaire_completed: 0
                });
            });
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT id, username, password_hash, questionnaire_completed FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error("Database query failed: ", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id }, "secretKey", { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            token,
            username: user.username,
            user_id: user.id,
            questionnaire_completed: user.questionnaire_completed // Important!
        });
    });
});


// ✅ API to mark questionnaire as completed
app.post("/questionnaire-complete", (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const query = "UPDATE users SET questionnaire_completed = 1 WHERE id = ?";
    db.query(query, [user_id], (err, result) => {
        if (err) {
            console.error("Error updating questionnaire status:", err);
            return res.status(500).json({ error: "Failed to update status" });
        }

        return res.status(200).json({ message: "Questionnaire status updated" });
    });
});



// Protected Profile Route
app.get("/profile", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Token is required" });

    try {
        const verified = jwt.verify(token, "secretKey");

        const query = "SELECT id, username, email, created_at FROM users WHERE id = ?";
        db.query(query, [verified.id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database query failed" });

            if (result.length === 0) return res.status(404).json({ error: "User not found" });

            return res.status(200).json({ user: result[0] });
        });
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
});

// ---------------------- Habit API Routes ----------------------

// Add a new habit
app.post("/habits", (req, res) => {
    const { user_id, name, category } = req.body;

    if (!user_id || !name || !category) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO habits (user_id, name, category, created_at) VALUES (?, ?, ?, NOW())";
    db.query(query, [user_id, name, category], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to add habit" });

        res.status(201).json({ message: "Habit added successfully", habit_id: result.insertId });
    });
});

// Get all habits for a specific user
app.get("/habits/:user_id", (req, res) => {
    const { user_id } = req.params;

    const query = "SELECT * FROM habits WHERE user_id = ?";
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch habits" });

        res.status(200).json({ habits: results });
    });
});

// Update a habit
app.put("/habits/:id", (req, res) => {
    const { id } = req.params;
    const { name, category, streak, completed_today } = req.body;

    const query = "UPDATE habits SET name = ?, category = ?, streak = ?, completed_today = ? WHERE id = ?";
    db.query(query, [name, category, streak, completed_today, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update habit" });

        res.status(200).json({ message: "Habit updated successfully" });
    });
});

// Delete a habit
app.delete("/habits/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM habits WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete habit" });

        res.status(200).json({ message: "Habit deleted successfully" });
    });
});
// ===================== HABITS API ===================== //

// Get all habits for a specific user
app.get("/habits/:userId", (req, res) => {
    const userId = req.params.userId;
    const query = "SELECT * FROM habits WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch habits" });
        res.status(200).json(results);
    });
});

// Add a new habit
app.post("/habits", (req, res) => {
    const { user_id, name, category } = req.body;

    if (!user_id || !name || !category) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO habits (user_id, name, category) VALUES (?, ?, ?)";
    db.query(query, [user_id, name, category], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to add habit" });
        res.status(201).json({ message: "Habit added successfully", habit_id: result.insertId });
    });
});

// Mark habit as completed & update streak
app.patch("/habits/:id/complete", (req, res) => {
    const habitId = req.params.id;

    const query = `
        UPDATE habits 
        SET completed_today = TRUE, 
            streak = streak + 1 
        WHERE id = ?
    `;
    db.query(query, [habitId], (err) => {
        if (err) return res.status(500).json({ error: "Failed to update habit" });
        res.status(200).json({ message: "Habit updated successfully" });
    });
});
// ✅ Fix: Get habits using query param instead of :user_id
app.get("/habits", (req, res) => {
    const user_id = req.query.user_id; // from ?user_id=

    const query = "SELECT * FROM habits WHERE user_id = ?";
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error("Error fetching habits:", err);
            return res.status(500).json({ error: "Failed to retrieve habits" });
        }
        res.status(200).json(results);
    });
});


// ---------------------- Start Server ----------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
