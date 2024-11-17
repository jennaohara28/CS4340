(function (window) {
  window.__env = window.__env || {};

  // Public backend base URL for production
  // Still pointing to localhost since the backend is not public
  window.__env.apiBaseUrl = 'http://localhost:8080';
})(this);
