//Validates form inputs (email, password, etc.)

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
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
  return '';
};

// // Phone validation
// export const validatePhone = (phone) => {
//   const phoneRegex = /^[0-9]{10}$/;
//   if (!phone) return 'Phone number is required';
//   if (!phoneRegex.test(phone)) return 'Phone must be 10 digits';
//   return '';
// };

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
