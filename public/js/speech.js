/**
 * Handles speech recognition for the Voice Q&A application
 */
const Speech = {
  /**
   * Initialize speech recognition module
   */
  init() {
    this.isRecording = false;
    this.currentTranscript = '';
    this.finalTranscript = '';
    
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      UI.showError('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure speech recognition
    this.recognition.lang = CONFIG.speech.language;
    this.recognition.continuous = CONFIG.speech.continuous;
    this.recognition.interimResults = CONFIG.speech.interimResults;
    
    this.setupEventListeners();
  },
  
  /**
   * Set up event listeners for speech recognition
   */
  setupEventListeners() {
    // Handle results
    this.recognition.onresult = (event) => {
      this.handleSpeechResult(event);
    };
    
    // Handle errors
    this.recognition.onerror = (event) => {
      this.handleSpeechError(event);
    };
    
    // Handle end of speech recognition
    this.recognition.onend = () => {
      if (this.isRecording) {
        // Auto-restart if recording is still active
        this.recognition.start();
      }
    };
    
    // Add event listener for stop recording button
    document.getElementById('stop-recording').addEventListener('click', () => {
      this.stopRecording();
      Session.handleQuestionComplete();
    });
  },
  
  /**
   * Handle speech recognition results
   * @param {SpeechRecognitionEvent} event - The speech recognition event
   */
  handleSpeechResult(event) {
    let interimTranscript = '';
    
    // Process the recognition results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        this.finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    
    // Update the current transcript
    this.currentTranscript = this.finalTranscript + interimTranscript;
    
    // Update the UI with the current transcript
    UI.updateTranscript(this.currentTranscript);
    
    // Check if we have a clear response (silence detection)
    if (this.finalTranscript.trim().length > 0 && interimTranscript === '') {
      this.silenceCounter = (this.silenceCounter || 0) + 1;
      
      // If we've had silence for a while after some speech, consider it complete
      if (this.silenceCounter > 5) {
        this.stopRecording();
        Session.handleQuestionComplete();
      }
    } else {
      this.silenceCounter = 0;
    }
  },
  
  /**
   * Handle speech recognition errors
   * @param {SpeechRecognitionEvent} event - The speech recognition error event
   */
  handleSpeechError(event) {
    switch (event.error) {
      case 'no-speech':
        console.log('No speech detected');
        break;
      case 'audio-capture':
        UI.showError('No microphone detected. Please ensure your microphone is connected and allowed.');
        this.stopRecording();
        break;
      case 'not-allowed':
        UI.showError('Microphone access denied. Please allow microphone access to use this application.');
        this.stopRecording();
        break;
      default:
        UI.showError(`Speech recognition error: ${event.error}`);
        this.stopRecording();
        break;
    }
  },
  
  /**
   * Start recording audio
   */
  startRecording() {
    try {
      this.isRecording = true;
      this.finalTranscript = '';
      this.currentTranscript = '';
      this.silenceCounter = 0;
      
      UI.showRecordingIndicator();
      this.recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      UI.showError('Failed to start speech recognition. Please reload the page.');
    }
  },
  
  /**
   * Stop recording audio
   */
  stopRecording() {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    UI.hideRecordingIndicator();
    
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  },
  
  /**
   * Get the final transcript
   * @returns {string} The final transcript
   */
  getFinalTranscript() {
    return this.currentTranscript.trim();
  },
  
  /**
   * Reset the speech recognition module
   */
  reset() {
    this.stopRecording();
    this.finalTranscript = '';
    this.currentTranscript = '';
  }
};