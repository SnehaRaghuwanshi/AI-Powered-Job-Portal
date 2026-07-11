const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job:         { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       String,
  linkedin:    String,
  coverNote:   String,
  resumeText:  { type: String },           // extracted text from uploaded resume
  resumeFile:  { type: String },           // file path
  aiScore:     { type: Number, default: 0 },
  aiAnalysis: {
    matchedSkills: [String],
    pros:           String,
    cons:           String,
    recommendation: String,
  },
  status:      { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
