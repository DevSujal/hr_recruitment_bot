/**
 * Main entry point for the Voice Q&A application
 */
document.addEventListener("DOMContentLoaded", async () => {
  // Check browser support for required APIs
  checkBrowserSupport();

  // Initialize modules
  UI.init();
  Timer.init();
  Speech.init();
  Auth.init();
  Session.init();
});

/**
 * Check browser support for required APIs
 */
function checkBrowserSupport() {
  // Check for Web Speech API
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    alert(
      "Your browser does not support speech recognition. Please use Chrome, Edge, or Safari."
    );
  }

  // Check for localStorage
  if (!window.localStorage) {
    alert(
      "Your browser does not support local storage, which is required for this application."
    );
  }
}

/**
 * Handle errors
 * @param {Error} error - The error to handle
 */
window.onerror = function (message, source, lineno, colno, error) {
  console.error("Global error:", message, error);
  UI.showError(
    "An unexpected error occurred. Please refresh the page and try again."
  );
};
