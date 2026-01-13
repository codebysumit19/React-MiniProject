// Session duration: 1 hour
export const SESSION_DURATION = 5 * 60 * 1000; // 1 hour in milliseconds

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const loginTime = localStorage.getItem('loginTime');
  
  if (!token || !loginTime) {
    return false;
  }
  
  const currentTime = Date.now();
  const elapsed = currentTime - parseInt(loginTime);
  
  if (elapsed > SESSION_DURATION) {
    // Token expired, clear storage
    logout();
    return false;
  }
  
  return true;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('loginTime');
};

// Set auth token
export const setAuth = (token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('loginTime', Date.now().toString());
};

// Get remaining session time in minutes
export const getRemainingTime = () => {
  const loginTime = localStorage.getItem('loginTime');
  if (!loginTime) return 0;
  
  const elapsed = Date.now() - parseInt(loginTime);
  const remaining = SESSION_DURATION - elapsed;
  
  if (remaining <= 0) return 0;
  return Math.floor(remaining / 60000); // Convert to minutes
};

// Get token for API requests
export const getToken = () => {
  return localStorage.getItem('token');
};
