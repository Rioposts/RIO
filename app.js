function validateLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMessage = document.getElementById('error-message');

  // Reset the error message
  errorMessage.textContent = '';

  if (username === '' || password === '') {
    errorMessage.textContent = 'All fields are required!';
    return false; // Prevent form submission
  }

  if (username.length < 3 || username.length > 15) {
    errorMessage.textContent = 'Username must be between 3 and 15 characters.';
    return false;
  }

  if (password.length < 6) {
    errorMessage.textContent = 'Password must be at least 6 characters.';
    return false;
  }

  return true; // Proceed with form submission
}
function validateSignup() {
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const errorMessage = document.getElementById('signup-error-message');

  // Reset the error message
  errorMessage.textContent = '';

  if (username === '' || email === '' || password === '') {
    errorMessage.textContent = 'All fields are required!';
    return false; // Prevent form submission
  }

  if (!/^[a-zA-Z0-9]+$/i.test(username)) {
    errorMessage.textContent = 'Username can only contain letters and numbers.';
    return false;
  }

  if (username.length < 3 || username.length > 15) {
    errorMessage.textContent = 'Username must be between 3 and 15 characters.';
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage.textContent = 'Please enter a valid email address.';
    return false;
  }

  if (password.length < 6) {
    errorMessage.textContent = 'Password must be at least 6 characters.';
    return false;
  }

  return true; // Proceed with form submission
}
