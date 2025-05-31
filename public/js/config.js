/**
 * Configuration settings for the Voice Q&A application
 */
const CONFIG = {
  // Timer durations in milliseconds
  timers: {
    session: 3600000, // 1 hour
    question: 120000,  // 2 minutes
    warningThreshold: 30000, // Show warning when 30 seconds left
    dangerThreshold: 10000  // Show danger styling when 10 seconds left
  },
  
  // Questions for the Q&A session
  questions: [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and how have they helped you succeed?",
    "Describe a challenging situation you faced and how you overcame it.",
    "What are your short-term and long-term career goals?",
    "Why are you interested in this position?",
    "How do you handle stress and pressure?",
    "Describe your ideal work environment.",
    "What motivates you in your professional life?"
  ],
  
  // Speech recognition configuration
  speech: {
    language: 'en-US',
    continuous: true,
    interimResults: true
  }
};