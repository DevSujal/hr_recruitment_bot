/**
 * Manages the Q&A session for the Voice Q&A application
 */

const Session = {
  /**
   * Initialize the session module
   */
  init() {
    this.currentQuestionIndex = 0;
    this.sessionData = null;
  },

  /**
   * Initialize a new session
   * @param {string} email - User's email address
   */
  initialize(email) {
    // Create session data structure
    this.sessionData = {
      gmail: email,
      qa: [],
      startTime: new Date().toISOString(),
      endTime: null,
    };

    // Save initial session data
    Storage.saveSession(this.sessionData);

    // Show chat screen
    UI.showChatScreen(email);

    // Start session timer
    Timer.startSessionTimer(() => {
      this.completeSession();
    });

    // Start first question
    this.startNextQuestion();
  },

  /**
   * Restore an existing session
   * @param {Object} sessionData - The session data to restore
   */
  restore(sessionData) {
    this.sessionData = sessionData;

    // Update UI
    UI.showChatScreen(sessionData.gmail);

    // Calculate remaining session time
    const elapsedTime = Date.now() - new Date(sessionData.startTime).getTime();
    const remainingTime = Math.max(0, CONFIG.timers.session - elapsedTime);

    // If session has no time left, complete it
    if (remainingTime <= 0) {
      this.completeSession();
      return;
    }

    // Restore session timer
    Timer.sessionTimeRemaining = remainingTime;
    Timer.startSessionTimer(() => {
      this.completeSession();
    });

    // Restore chat messages
    UI.clearChat();
    sessionData.qa.forEach((item) => {
      UI.addSystemMessage(item.question);
      UI.addUserMessage(item.answer);
    });

    // Set current question index
    this.currentQuestionIndex = sessionData.qa.length;

    // Start next question if there are more
    if (this.currentQuestionIndex < CONFIG.questions.length) {
      this.startNextQuestion();
    } else {
      this.completeSession();
    }
  },

  /**
   * Start the next question
   */
  startNextQuestion() {
    // Check if we've reached the end of questions
    if (this.currentQuestionIndex >= CONFIG.questions.length) {
      this.completeSession();
      return;
    }

    // Get the current question
    const question = CONFIG.questions[this.currentQuestionIndex];

    // Display the question
    UI.addSystemMessage(question);

    // Start question timer
    Timer.startQuestionTimer(() => {
      this.handleQuestionComplete();
    });

    // Start recording
    Speech.startRecording();
  },

  /**
   * Handle completion of current question
   */
  handleQuestionComplete() {
    // Stop the question timer
    Timer.stopQuestionTimer();

    // Get the answer transcript
    const answer = Speech.getFinalTranscript();

    // Add the Q&A pair to session data
    console.log(this.sessionData);
    this.sessionData.qa.push({
      question: CONFIG.questions[this.currentQuestionIndex],
      answer: answer || "(No response)",
      timestamp: new Date().toISOString(),
    });

    // Save session data
    Storage.saveSession(this.sessionData);

    // Move to next question
    this.currentQuestionIndex++;

    // Reset speech recognition for next question
    Speech.reset();

    // Start next question after a short delay
    setTimeout(() => {
      this.startNextQuestion();
    }, 1000);
  },

  /**
   * Complete the session
   */
  async completeSession() {
    // Stop timers
    Timer.stopSessionTimer();
    Timer.stopQuestionTimer();

    // Stop recording
    Speech.stopRecording();

    // Update session end time
    this.sessionData.endTime = new Date().toISOString();

    // Save final session data
    Storage.saveSession(this.sessionData);

    // Show completion screen
    UI.showCompletionScreen(this.sessionData);

    const data = await JSON.parse(localStorage.getItem("voiceQA_session"));
    const { qa } = data;
    const response = await fetch("http://localhost:3000/get-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `Generate a brief summary and score for the interview based on the following question-answer pairs:\n\n${JSON.stringify(
          qa,
          null,
          2
        )}`,
      }),
    });
    const report = await response.json();
    const html = marked.parse(report.response);
    document.getElementById("summary-report").innerHTML = html;
  },
};
