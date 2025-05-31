/**
 * Handles timer functionality for the Voice Q&A application
 */
const Timer = {
  /**
   * Initialize timer module
   */
  init() {
    this.sessionTimerEl = document.getElementById('session-timer');
    this.questionTimerEl = document.getElementById('question-timer');
    
    this.sessionTimeRemaining = CONFIG.timers.session;
    this.questionTimeRemaining = CONFIG.timers.question;
    
    this.sessionInterval = null;
    this.questionInterval = null;
  },
  
  /**
   * Start the session timer
   * @param {Function} onComplete - Callback function when timer completes
   */
  startSessionTimer(onComplete) {
    this.sessionTimeRemaining = CONFIG.timers.session;
    this.updateSessionTimerDisplay();
    
    this.sessionInterval = setInterval(() => {
      this.sessionTimeRemaining -= 1000;
      
      if (this.sessionTimeRemaining <= 0) {
        this.stopSessionTimer();
        if (onComplete) onComplete();
        return;
      }
      
      this.updateSessionTimerDisplay();
      this.updateSessionTimerStyle();
    }, 1000);
  },

  /**
   * Start the question timer
   * @param {Function} onComplete - Callback function when timer completes
   */
  startQuestionTimer(onComplete) {
    this.questionTimeRemaining = CONFIG.timers.question;
    this.updateQuestionTimerDisplay();
    
    this.questionInterval = setInterval(() => {
      this.questionTimeRemaining -= 1000;
      
      if (this.questionTimeRemaining <= 0) {
        this.stopQuestionTimer();
        console.log(this.questionTimeRemaining)
        if (onComplete) onComplete();
        return;
      }
      
      this.updateQuestionTimerDisplay();
      this.updateQuestionTimerStyle();
      
    }, 1000);
  },
  
  /**
   * Stop the session timer
   */
  stopSessionTimer() {
    if (this.sessionInterval) {
      clearInterval(this.sessionInterval);
      this.sessionInterval = null;
    }
  },
  
  /**
   * Stop the question timer
   */
  stopQuestionTimer() {
    if (this.questionInterval) {
      clearInterval(this.questionInterval);
      this.questionInterval = null;
    }
  },
  
  /**
   * Reset all timers
   */
  resetTimers() {
    this.stopSessionTimer();
    this.stopQuestionTimer();
    
    this.sessionTimeRemaining = CONFIG.timers.session;
    this.questionTimeRemaining = CONFIG.timers.question;
    
    this.updateSessionTimerDisplay();
    this.updateQuestionTimerDisplay();
    
    this.sessionTimerEl.classList.remove('warning', 'danger');
    this.questionTimerEl.classList.remove('warning', 'danger');
  },
  
  /**
   * Update the session timer display
   */
  updateSessionTimerDisplay() {
    this.sessionTimerEl.textContent = this.formatTime(this.sessionTimeRemaining);
  },
  
  /**
   * Update the question timer display
   */
  updateQuestionTimerDisplay() {
    this.questionTimerEl.textContent = this.formatTime(this.questionTimeRemaining);
  },
  
  /**
   * Update the session timer styling based on remaining time
   */
  updateSessionTimerStyle() {
    this.sessionTimerEl.classList.remove('warning', 'danger');
    
    if (this.sessionTimeRemaining <= CONFIG.timers.dangerThreshold) {
      this.sessionTimerEl.classList.add('danger');
    } else if (this.sessionTimeRemaining <= CONFIG.timers.warningThreshold) {
      this.sessionTimerEl.classList.add('warning');
    }
  },
  
  /**
   * Update the question timer styling based on remaining time
   */
  updateQuestionTimerStyle() {
    this.questionTimerEl.classList.remove('warning', 'danger');
    
    if (this.questionTimeRemaining <= CONFIG.timers.dangerThreshold) {
      this.questionTimerEl.classList.add('danger');
    } else if (this.questionTimeRemaining <= CONFIG.timers.warningThreshold) {
      this.questionTimerEl.classList.add('warning');
    }
  },
  
  /**
   * Format milliseconds to MM:SS
   * @param {number} milliseconds - Time in milliseconds
   * @returns {string} Formatted time string
   */
  formatTime(milliseconds) {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  },
  
  /**
   * Get the elapsed time from the session start
   * @param {number} startTime - Start time in milliseconds
   * @returns {string} Formatted elapsed time
   */
  getElapsedTime(startTime) {
    const elapsed = Date.now() - startTime;
    return this.formatTime(elapsed);
  }
};