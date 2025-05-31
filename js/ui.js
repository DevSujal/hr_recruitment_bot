/**
 * Handles UI updates and rendering for the Voice Q&A application
 */
const UI = {
  /**
   * Initialize UI module
   */
  init() {
    this.loginScreen = document.getElementById('login-screen');
    this.chatScreen = document.getElementById('chat-screen');
    this.completionScreen = document.getElementById('completion-screen');
    this.chatMessages = document.getElementById('chat-messages');
    this.userEmail = document.getElementById('user-email');
    this.recordingIndicator = document.getElementById('recording-indicator');
    this.errorContainer = document.getElementById('error-container');
    this.errorMessage = document.getElementById('error-message');
    this.questionsCount = document.getElementById('questions-count');
    this.sessionDuration = document.getElementById('session-duration');
    
    // Add event listener for new session button
    document.getElementById('new-session-button').addEventListener('click', () => {
      Storage.clearSession();
      this.showLoginScreen();
    });
  },
  
  /**
   * Show the login screen
   */
  showLoginScreen() {
    this.loginScreen.classList.add('active');
    this.chatScreen.classList.remove('active');
    this.completionScreen.classList.remove('active');
  },
  
  /**
   * Show the chat screen
   * @param {string} email - User's email address
   */
  showChatScreen(email) {
    this.loginScreen.classList.remove('active');
    this.chatScreen.classList.add('active');
    this.completionScreen.classList.remove('active');
    this.userEmail.textContent = email;
  },
  
  /**
   * Show the completion screen
   * @param {Object} sessionData - The session data
   */
  showCompletionScreen(sessionData) {
    this.loginScreen.classList.remove('active');
    this.chatScreen.classList.remove('active');
    this.completionScreen.classList.add('active');
    
    this.questionsCount.textContent = sessionData.qa.length;
    
    const duration = new Date(sessionData.endTime) - new Date(sessionData.startTime);
    this.sessionDuration.textContent = Timer.formatTime(duration);
  },
  
  /**
   * Add a system message to the chat
   * @param {string} text - The message text
   */
  addSystemMessage(text) {
    const message = this.createMessageElement('system', text);
    this.chatMessages.appendChild(message);
    this.scrollToBottom();
  },
  
  /**
   * Add a user message to the chat
   * @param {string} text - The message text
   */
  addUserMessage(text) {
    const message = this.createMessageElement('user', text);
    this.chatMessages.appendChild(message);
    this.scrollToBottom();
  },
  
  /**
   * Create a message element
   * @param {string} type - The message type ('system' or 'user')
   * @param {string} text - The message text
   * @returns {HTMLElement} The message element
   */
  createMessageElement(type, text) {
    const message = document.createElement('div');
    message.classList.add('message', type);
    
    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.textContent = text;
    
    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    message.appendChild(messageText);
    message.appendChild(timestamp);
    
    return message;
  },
  
  /**
   * Update the transcript in the user message
   * @param {string} transcript - The current transcript
   */
  updateTranscript(transcript) {
    // Find the last user message or create a new one if none exists
    let userMessage = this.chatMessages.querySelector('.message.user:last-child');
    
    if (!userMessage) {
      userMessage = this.createMessageElement('user', transcript);
      this.chatMessages.appendChild(userMessage);
    } else {
      userMessage.querySelector('.message-text').textContent = transcript;
    }
    
    this.scrollToBottom();
  },
  
  /**
   * Show the recording indicator
   */
  showRecordingIndicator() {
    this.recordingIndicator.style.display = 'flex';
  },
  
  /**
   * Hide the recording indicator
   */
  hideRecordingIndicator() {
    this.recordingIndicator.style.display = 'none';
  },
  
  /**
   * Show an error message
   * @param {string} message - The error message
   */
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorContainer.classList.add('visible');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideError();
    }, 5000);
  },
  
  /**
   * Hide the error message
   */
  hideError() {
    this.errorContainer.classList.remove('visible');
  },
  
  /**
   * Clear all messages from the chat
   */
  clearChat() {
    this.chatMessages.innerHTML = '';
  },
  
  /**
   * Scroll to the bottom of the chat
   */
  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
};