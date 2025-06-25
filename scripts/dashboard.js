// Use localStorage to persist data between refreshes
const STORAGE_KEYS = {
    GOALS: 'growWithRio_goals',
    USER: 'growWithRio_user',
    STREAK: 'growWithRio_streak'
};

// Initialize default user data if not present
function initializeDefaultUserData() {
    // Check if user data exists
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
        // Create default user
        const defaultUser = {
            id: "user_" + Date.now(),
            name: "Default User", // Default name that will be updated during login
            level: 1,
            points: 0,
            streak: 5, // Starting with 5-day streak as shown in UI
            completedGoals: 47, // As shown in UI
            avatar: "/api/placeholder/40/40",
            lastLogin: new Date().toISOString().split('T')[0]
        };
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
        
        // Also set username separately for easier access
        localStorage.setItem("username", defaultUser.name);
    }
}

// Initialize goals data if not present
function initializeGoalsData() {
    if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
        const initialGoals = [
            {
                id: 1,
                title: "Morning Exercise",
                description: "30 minutes of cardio",
                points: 30,
                isCompleted: true, // As shown in UI
                progress: 100,
                icon: "fa-running"
            },
            {
                id: 2,
                title: "Reading",
                description: "Read for 20 minutes",
                points: 40,
                isCompleted: false,
                progress: 50, // As shown in UI
                icon: "fa-book"
            },
            {
                id: 3,
                title: "Meditation",
                description: "10 minutes of mindfulness",
                points: 25,
                isCompleted: false,
                progress: 0,
                icon: "fa-meditation"
            },
            {
                id: 4,
                title: "Learning",
                description: "Complete 1 learning module",
                points: 25,
                isCompleted: false,
                progress: 0,
                icon: "fa-brain"
            }
        ];
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(initialGoals));
    }
}

// Initialize or load data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize default data if needed
    initializeDefaultUserData();
    initializeGoalsData();
    
    // Set up UI interaction handlers
    setupNavigationHandlers();
    setupGoalCardHandlers();
    setupRioPopupHandlers();
    
    // Show welcome popup after a delay
    setTimeout(() => {
        showRioPopup("Welcome back!", "Ready to continue your self-improvement journey?");
    }, 3000);

    // Apply current state to UI
    renderCurrentState();
});

// ----- Data Loading & Saving Functions -----
function loadUserData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
}

function saveUserData(data) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
    // Update username separately for easier access
    localStorage.setItem("username", data.name);
    localStorage.setItem("level", data.level);
    localStorage.setItem("streak", data.streak);
    checkForLevelUp();
}

function loadGoalsData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS));
}

function saveGoalsData(data) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data));
}

// Check if it's a new day and reset goals if needed
function checkDayChange() {
    const userData = loadUserData();
    const today = new Date().toISOString().split('T')[0];
    
    if (userData && userData.lastLogin !== today) {
        // It's a new day, reset goals
        const goals = loadGoalsData();
        goals.forEach(goal => {
            goal.isCompleted = false;
            goal.progress = 0;
        });
        saveGoalsData(goals);
    
        // Update last login
        userData.lastLogin = today;
        saveUserData(userData);
    
        console.log("New day detected, goals have been reset");
    }
}

// ----- Event Handlers Setup -----
function setupNavigationHandlers() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // In a full implementation, this would load different views
            console.log(`Navigated to: ${this.innerText.trim()}`);
        });
    });
}

function setupGoalCardHandlers() {
    const goalCards = document.querySelectorAll('.goal-card');
    
    goalCards.forEach(card => {
        // Store the original goal id as a data attribute for tracking
        const goalIndex = Array.from(goalCards).indexOf(card);
        card.setAttribute('data-goal-id', goalIndex + 1);
        
        card.addEventListener('click', function() {
            const goalId = parseInt(this.getAttribute('data-goal-id'));
            const goals = loadGoalsData();
            const goalData = goals.find(g => g.id === goalId);
            
            // Only allow interaction if goal is not already completed
            if (!goalData.isCompleted) {
                // If already in progress, complete it
                if (goalData.progress === 50) {
                    goalData.progress = 100;
                    goalData.isCompleted = true;
                    
                    // Update points only when completing a goal
                    const userData = loadUserData();
                    userData.points += goalData.points;
                    userData.completedGoals += 1;
                    saveUserData(userData);
                    
                    // Show Rio popup after completing a goal
                    showRioPopup("Great job!", "You've completed another goal today!");
                } 
                // If not started, mark as in progress
                else if (goalData.progress === 0) {
                    goalData.progress = 50;
                    
                    // Show Rio popup for encouragement
                    showRioPopup("You've started a new goal!", "Keep going, you're doing great!");
                }
                
                // Save updated goal data
                saveGoalsData(goals);
                
                // Update UI to reflect changes
                renderGoalCard(card, goalData);
                renderUserStats();
                checkDailyProgress();
            }
        });
    });
}

function setupRioPopupHandlers() {
    const rioPopup = document.getElementById('rioPopup');
    const rioPopupClose = document.querySelector('.rio-popup-close');
    
    rioPopupClose.addEventListener('click', function() {
        rioPopup.style.display = 'none';
    });
}

// ----- UI Rendering Functions -----
function renderCurrentState() {
    renderUserInfo();
    renderGoalCards();
    renderUserStats();
    checkDayChange();
}

function renderUserInfo() {
    const userData = loadUserData();
    
    if (userData) {
        // Welcome banner
        document.getElementById("user-name").textContent = userData.name;
        document.getElementById("user-level").textContent = userData.level;
        document.getElementById("user-streak").textContent = userData.streak;
        
        // Update streak fire icon count
        document.getElementById("streak-count").textContent = userData.streak;

        // Sidebar
        const sidebarUsername = document.getElementById("sidebar-username");
        if (sidebarUsername) sidebarUsername.textContent = userData.name;
        
        const sidebarLevel = document.getElementById("sidebar-level");
        if (sidebarLevel) sidebarLevel.textContent = `Level ${userData.level}`;
    }
}

function renderGoalCards() {
    const goalCards = document.querySelectorAll('.goal-card');
    const goals = loadGoalsData();
    
    goalCards.forEach((card, index) => {
        if (index < goals.length) {
            renderGoalCard(card, goals[index]);
        }
    });
}

function renderGoalCard(card, goalData) {
    // Update progress bar
    const progressBar = card.querySelector('.progress');
    progressBar.style.width = `${goalData.progress}%`;
    
    // Update classes based on progress
    card.classList.remove('completed', 'in-progress');
    if (goalData.isCompleted) {
        card.classList.add('completed');
    } else if (goalData.progress > 0) {
        card.classList.add('in-progress');
    }
}

function renderUserStats() {
    const userData = loadUserData();
    
    if (userData) {
        // Update stats display
        document.querySelector('.stat-item:nth-child(1) .stat-value').textContent = `${userData.streak} days`;
        document.querySelector('.stat-item:nth-child(2) .stat-value').textContent = userData.points.toLocaleString();
        document.querySelector('.stat-item:nth-child(3) .stat-value').textContent = userData.completedGoals.toString();
    }
}

// ----- Business Logic Functions -----
function checkDailyProgress() {
    const goals = loadGoalsData();
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.isCompleted).length;
    
    // Calculate progress percentage
    const progressPercentage = (completedGoals / totalGoals) * 100;
    
    // Update Rio's message based on progress
    if (progressPercentage === 100) {
        showRioPopup("All Done!", "You've completed all your goals for today. Fantastic work!");
    } else if (progressPercentage >= 75) {
        showRioPopup("Almost There!", "Just a few more goals to go. You can do it!");
    } else if (completedGoals > 0 && Math.random() > 0.5) {
        // Random encouragement with 50% chance when completing a goal
        const encouragements = [
            "You're making great progress!",
            "Keep up the good work!",
            "One step at a time, you're getting there!",
            "Your consistency is impressive!"
        ];
        
        const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)];
        showRioPopup("Keep Going!", randomMessage);
    }
}

function checkForLevelUp() {
    const userData = loadUserData();
    
    // Simple level calculation: each level requires 200 points
    const newLevel = Math.floor(userData.points / 200) + 1;
    
    if (newLevel > userData.level) {
        userData.level = newLevel;
        saveUserData(userData);
        
        // Update UI
        document.querySelector('.level-badge').textContent = `Level ${newLevel}`;
        showRioPopup("Level Up!", `Congratulations! You're now level ${newLevel}!`);
    }
}

// Rio popup messaging
function showRioPopup(title, message) {
    const rioPopup = document.getElementById('rioPopup');
    const rioTitle = rioPopup.querySelector('h3');
    const rioMessage = rioPopup.querySelector('p');
    
    rioTitle.textContent = title;
    rioMessage.textContent = message;
    
    rioPopup.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        rioPopup.style.display = 'none';
    }, 5000);
}

// Add some animations for better user experience
document.addEventListener('DOMContentLoaded', function() {
    // Add a CSS class for animations
    const style = document.createElement('style');
    style.innerHTML = `
        .points-updated {
            animation: pulse 1s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); color: var(--primary-color); }
            100% { transform: scale(1); }
        }
        
        .goal-card {
            cursor: pointer;
        }
        
        .goal-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }
        
        .streak-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: #ff5722;
        }
        
        .streak-icon i {
            margin-right: 8px;
        }
        
        .streak-icon span {
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});