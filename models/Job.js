const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  salary:      { type: String },
  type:        { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  description: { type: String, required: true },
  skills:      [String],
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive:    { type: Boolean, default: true },
  applicants:  { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

// Text search index
JobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', JobSchema);
