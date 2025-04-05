// auth.js - Handles user registration, login, and logout using localStorage

// Retrieve users from localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Register a new user; returns true if successful, false if username already exists
function registerUser(username, password) {
  var users = getUsers();
  if (users[username]) {
    return false; // Username already exists
  }
  // For demonstration, the password is stored in plain text (this is not recommended for production)
  users[username] = { password: password };
  saveUsers(users);
  return true;
}

// Log in a user; returns true if credentials are correct, false otherwise
function loginUser(username, password) {
  var users = getUsers();
  if (users[username] && users[username].password === password) {
    localStorage.setItem("loggedInUser", username);
    return true;
  }
  return false;
}

// Get the currently logged in user
function getLoggedInUser() {
  return localStorage.getItem("loggedInUser");
}

// Log out the current user
function logoutUser() {
  localStorage.removeItem("loggedInUser");
}
