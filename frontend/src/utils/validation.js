// Validates form inputs (email, password, etc.)

// Email validation - UPDATED to accept both email and username
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Check if empty
  if (!email) return 'Email or username is required';
  
  // If it contains @, validate as email
  if (email.includes('@') && !emailRegex.test(email)) {
    return 'Invalid email format';
  }
  
  // If no @, treat as username (min 3 chars)
  if (!email.includes('@') && email.length < 3) {
    return 'Username must be at least 3 characters';
  }
  
  return '';
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 3) return 'Password must be at least 3 characters';
  return '';
};

// Name validation
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  return '';
};

// Username validation
export const validateUsername = (username) => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  // Check for special characters (username should be alphanumeric)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return '';
};

// Role validation
export const validateRole = (role) => {
  if (!role) return 'Please select a role';
  return '';
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};
