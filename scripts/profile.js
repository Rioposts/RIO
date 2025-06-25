// User profile data structure
let profileData = {
  username: '',
  fullName: 'Fawaz Ahmed',
  email: 'fawaz@example.com',
  birthday: '1995-05-15',
  joinDate: 'February 2025',
  stats: {
      streak: 0,
      tasksCompleted: 42,
      pointsEarned: 580
  },
  goals: [
      { id: 1, title: 'Meditate Daily', progress: 70 },
      { id: 2, title: 'Exercise 3x per week', progress: 50 },
      { id: 3, title: 'Read for 30 minutes daily', progress: 25 }
  ],
  preferences: {
      notifications: true,
      theme: 'light',
      reminderTime: '08:00'
  }
};

// Load profile data from localStorage
function loadProfileData() {
  const storedData = localStorage.getItem('rioProfileData');
  if (storedData) {
      profileData = JSON.parse(storedData);
  }
  
  // Get username from localStorage
  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
      profileData.username = storedUsername;
  }
  
  // Get streak from userData if available
  const userData = localStorage.getItem('rioUserData');
  if (userData) {
      const parsedUserData = JSON.parse(userData);
      profileData.stats.streak = parsedUserData.streak || profileData.stats.streak;
  }
  
  // Update UI with profile data
  updateProfileUI();
}

// Save profile data to localStorage
function saveProfileData() {
  localStorage.setItem('rioProfileData', JSON.stringify(profileData));
}

// Update UI with profile data
function updateProfileUI() {
  // Update username
  document.getElementById('profile-username').textContent = profileData.username || 'User';
  
  // Update join date
  document.getElementById('join-date').textContent = profileData.joinDate;
  
  // Update stats
  document.getElementById('streak-count').textContent = profileData.stats.streak;
  document.getElementById('tasks-completed').textContent = profileData.stats.tasksCompleted;
  document.getElementById('points-earned').textContent = profileData.stats.pointsEarned;
  
  // Update personal information form
  document.getElementById('full-name').value = profileData.fullName;
  document.getElementById('email').value = profileData.email;
  document.getElementById('birthday').value = profileData.birthday;
  
  // Update goals
  renderGoals();
  
  // Update preferences
  document.getElementById('notifications').checked = profileData.preferences.notifications;
  document.getElementById('theme').value = profileData.preferences.theme;
  document.getElementById('reminder-time').value = profileData.preferences.reminderTime;
}

// Render goals
function renderGoals() {
  const goalsContainer = document.getElementById('goals-container');
  goalsContainer.innerHTML = '';
  
  profileData.goals.forEach(goal => {
      const goalElement = document.createElement('div');
      goalElement.className = 'goal-item';
      goalElement.innerHTML = `
          <div class="goal-info">
              <div class="goal-title">${goal.title}</div>
              <div class="goal-progress">
                  <div class="goal-progress-bar">
                      <div class="goal-progress-fill" style="width: ${goal.progress}%;"></div>
                  </div>
                  <span>${goal.progress}%</span>
              </div>
          </div>
      `;
      
      goalsContainer.appendChild(goalElement);
  });
}

// Setup edit functionality for personal information
function setupPersonalInfoEdit() {
  const editButton = document.getElementById('edit-personal-info');
  const cancelButton = document.getElementById('cancel-personal-info');
  const saveButton = document.getElementById('save-personal-info');
  const formButtons = document.querySelector('#personal-info-form .form-buttons');
  const inputs = document.querySelectorAll('#personal-info-form input');
  
  editButton.addEventListener('click', () => {
      // Enable inputs
      inputs.forEach(input => {
          input.disabled = false;
      });
      
      // Show form buttons
      formButtons.classList.remove('hidden');
      
      // Hide edit button
      editButton.classList.add('hidden');
  });
  
  cancelButton.addEventListener('click', () => {
      // Disable inputs
      inputs.forEach(input => {
          input.disabled = true;
      });
      
      // Reset input values
      document.getElementById('full-name').value = profileData.fullName;
      document.getElementById('email').value = profileData.email;
      document.getElementById('birthday').value = profileData.birthday;
      
      // Hide form buttons
      formButtons.classList.add('hidden');
      
      // Show edit button
      editButton.classList.remove('hidden');
  });
  
  document.getElementById('personal-info-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Update profile data
      profileData.fullName = document.getElementById('full-name').value;
      profileData.email = document.getElementById('email').value;
      profileData.birthday = document.getElementById('birthday').value;
      
      // Save profile data
      saveProfileData();
      
      // Disable inputs
      inputs.forEach(input => {
          input.disabled = true;
      });
      
      // Hide form buttons
      formButtons.classList.add('hidden');
      
      // Show edit button
      editButton.classList.remove('hidden');
      
      // Show success message
      showSuccessMessage('Personal information updated successfully!');
  });
}

// Setup edit functionality for goals
function setupGoalsEdit() {
  const editButton = document.getElementById('edit-goals');
  const cancelButton = document.getElementById('cancel-goals');
  const saveButton = document.getElementById('save-goals');
  const goalsContainer = document.getElementById('goals-container');
  const goalsForm = document.getElementById('goals-form');
  
  editButton.addEventListener('click', () => {
      // Show goals form
      goalsForm.classList.remove('hidden');
      
      // Hide edit button
      editButton.classList.add('hidden');
  });
  
  cancelButton.addEventListener('click', () => {
      // Hide goals form
      goalsForm.classList.add('hidden');
      
      // Show edit button
      editButton.classList.remove('hidden');
  });
  
  document.getElementById('add-goal').addEventListener('click', () => {
      const newGoalInput = document.getElementById('new-goal');
      const goalTitle = newGoalInput.value.trim();
      
      if (goalTitle) {
          // Add new goal
          const newGoal = {
              id: profileData.goals.length + 1,
              title: goalTitle,
              progress: 0
          };
          
          profileData.goals.push(newGoal);
          
          // Clear input
          newGoalInput.value = '';
          
          // Re-render goals
          renderGoals();
      }
  });
  
  saveButton.addEventListener('click', () => {
      // Save profile data
      saveProfileData();
      
      // Hide goals form
      goalsForm.classList.add('hidden');
      
      // Show edit button
      editButton.classList.remove('hidden');
      
      // Show success message
      showSuccessMessage('Goals updated successfully!');
  });
}

// Setup edit functionality for preferences
function setupPreferencesEdit() {
  const editButton = document.getElementById('edit-preferences');
  const cancelButton = document.getElementById('cancel-preferences');
  const saveButton = document.getElementById('save-preferences');
  const formButtons = document.querySelector('#preferences-form .form-buttons');
  const inputs = document.querySelectorAll('#preferences-form input, #preferences-form select');
  
  editButton.addEventListener('click', () => {
      // Enable inputs
      inputs.forEach(input => {
          input.disabled = false;
      });
      
      // Show form buttons
      formButtons.classList.remove('hidden');
      
      // Hide edit button
      editButton.classList.add('hidden');
  });
  
  cancelButton.addEventListener('click', () => {
      // Disable inputs
      inputs.forEach(input => {
          input.disabled = true;
      });
      
      // Reset input values
      document.getElementById('notifications').checked = profileData.preferences.notifications;
      document.getElementById('theme').value = profileData.preferences.theme;
      document.getElementById('reminder-time').value = profileData.preferences.reminderTime;
      
      // Hide form buttons
      formButtons.classList.add('hidden');
      
      // Show edit button
      editButton.classList.remove('hidden');
  });
  
  document.getElementById('preferences-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Update profile data
      profileData.preferences.notifications = document.getElementById('notifications').checked;
      profileData.preferences.theme = document.getElementById('theme').value;
      profileData.preferences.reminderTime = document.getElementById('reminder-time').value;
      
      // Save profile data
      saveProfileData();
      
      // Apply theme if changed
      applyTheme(profileData.preferences.theme);
      
      // Disable inputs
      inputs.forEach(input => {
          input.disabled = true;
      });
      
      // Hide form buttons
      formButtons.classList.add('hidden');
      
      // Show edit button
      editButton.classList.remove('hidden');
      
      // Show success message
      showSuccessMessage('Preferences updated successfully!');
  });
}

// Function to apply theme
function applyTheme(theme) {
  // Implementation for theme change would go here
  console.log(`Theme changed to: ${theme}`);
}

// Show success message
function showSuccessMessage(message) {
  const motivationMessage = document.querySelector('.motivation-message');
  if (motivationMessage) {
      const originalMessage = motivationMessage.textContent;
      motivationMessage.textContent = message;
      
      // Reset to original message after 3 seconds
      setTimeout(() => {
          motivationMessage.textContent = originalMessage;
      }, 3000);
  }
}

// Function for logout
function logout() {
  localStorage.removeItem('token');
  alert('Logged out successfully!');
  window.location.href = 'login.html';
}

// Bottom navigation functionality
function setupNavigation() {
  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
          const navLabel = e.currentTarget.querySelector('.nav-label').textContent;
          
          switch (navLabel) {
              case 'Home':
                  window.location.href = 'dashboard.html';
                  break;
              case 'Profile':
                  // Already on profile page
                  break;
              default:
                  alert(`${navLabel} page will be implemented soon!`);
                  break;
          }
      });
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
  setupPersonalInfoEdit();
  setupGoalsEdit();
  setupPreferencesEdit();
  setupNavigation();
});