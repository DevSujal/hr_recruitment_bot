/**
 * Handles authentication for the Voice Q&A application
 */
const Auth = {
  /**
   * Initialize authentication module
   */
  init() {
    this.loginForm = document.getElementById("login-form");
    this.emailInput = document.getElementById("email-input");
    this.emailError = document.getElementById("email-error");

    this.addEventListeners();
    this.checkExistingSession();
  },

  /**
   * Add event listeners for auth-related elements
   */
  addEventListeners() {
    this.loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validateAndLogin();
    });

    this.emailInput.addEventListener("input", () => {
      this.emailInput.classList.remove("error");
      this.emailError.textContent = "";
    });
  },

  /**
   * Validate email and initialize session if valid
   */
  async validateAndLogin() {
    const email = this.emailInput.value.trim();

    if (!this.isValidGmail(email)) {
      this.emailInput.classList.add("error");
      this.emailError.textContent =
        "Please enter a valid Gmail address (@gmail.com)";
      return;
    }
    const btn = document.getElementById("login-button");
    btn.innerHTML = "please wait generating questions";
    btn.disabled = true;
    const response = await fetch("http://localhost:3000/get-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `generate 10 unique HR recruitment questions. these should be an strictly array of questions questions : [question1, question2 etc]`,
      }),
    });
    const questions = await response.json();
    CONFIG.questions = JSON.parse(questions.response);

    // Initialize session with the validated email
    Session.initialize(email);
  },

  /**
   * Check if email is a valid Gmail address
   * @param {string} email - The email to validate
   * @returns {boolean} True if valid Gmail, false otherwise
   */
  isValidGmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  },

  /**
   * Check for existing session and restore if found
   */
  checkExistingSession() {
    if (Storage.hasActiveSession()) {
      const sessionData = Storage.getSession();
      Session.restore(sessionData);
    }
  },
};
