# 🌱 RIO: Your Personal Self-Growth Buddy

RIO is a self-improvement and habit-tracking web app designed to help users achieve their personal growth goals through task management, daily streaks, and motivational feedback. Built with 💻 HTML, CSS, JavaScript, Node.js, Express.js, and MySQL, this project is part of my full-stack learning journey.

---

## 🚀 Features

- ✅ User authentication (Sign Up / Login)
- 📋 Add and track personal habits
- 📈 Progress visualization & streak tracking
- 🎯 Motivational feedback system with Rio, your personal buddy
- ⚙️ Admin dashboard for managing user data (optional)
- 🧠 Fun UI inspired by Fabulous & Duolingo

---

## 🛠️ Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL
- Deployment: Localhost (for now)

---

## 🧪 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rioposts/RIO.git
   cd RIO

2. Install Dependencies:
    npm install

3. Configure the Database:
  Make sure MySQL is installed and running.

  Create a database (e.g. rio_db) and import the SQL file if provided.

  Update your db.js or .env file with your credentials:

// Example
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'rio_db'
});

  
4. Run the App:
   node index.js

5. Open your browser: 
  Visit: http://localhost:3000

📦 Folder Structure
bash
Copy
Edit
RIO/
├── public/          # Static files (CSS, JS, images)
├── views/           # EJS templates or frontend HTML
├── routes/          # Express routes
├── db/              # MySQL setup/config
├── index.js         # Main server file
├── package.json     
└── README.md   

🙌 Credits
Made with 💙 by Fawaz Mulla (@Rioposts)
Rio is here to help you grow 🌱 every day.

---

📌 Note
This is a WIP (Work in Progress) — More features like reminders, email notifications, and MongoDB support may be added in future updates.



