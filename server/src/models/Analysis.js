const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Kept false so we don't break the current guest flow.
  },
  jobDescription: {
    type: String,
    required: true,
  },
  matchPercentage: {
    type: Number,
    required: true,
  },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  recommendations: [{ type: String }],
  atsScore: { type: Number, default: 0 },
  resumeImprovements: [{ type: String }],
  roadmap: [
    {
      step: Number,
      task: String,
      duration: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);
