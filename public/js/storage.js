/**
 * Handles local storage operations for the Voice Q&A application
 */
const Storage = {
  /**
   * Saves session data to local storage
   * @param {Object} sessionData - The session data to save
   */
  saveSession(sessionData) {
    try {
      localStorage.setItem('voiceQA_session', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error saving session data:', error);
      UI.showError('Failed to save session data. Local storage may be full or disabled.');
    }
  },
  
  /**
   * Retrieves session data from local storage
   * @returns {Object|null} The session data or null if not found
   */
  getSession() {
    try {
      const sessionData = localStorage.getItem('voiceQA_session');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error retrieving session data:', error);
      UI.showError('Failed to retrieve session data.');
      return null;
    }
  },
  
  /**
   * Clears session data from local storage
   */
  clearSession() {
    try {
      localStorage.removeItem('voiceQA_session');
    } catch (error) {
      console.error('Error clearing session data:', error);
    }
  },
  
  /**
   * Checks if a session exists in local storage
   * @returns {boolean} True if a session exists, false otherwise
   */
  hasActiveSession() {
    const session = this.getSession();
    return session !== null && session.endTime === null;
  }
};