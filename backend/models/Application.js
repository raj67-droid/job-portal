const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumePath: { type: String, required: true },
    resumeOriginalName: { type: String },
    coverNote: { type: String },
    status: {
      type: String,
      enum: ['Applied', 'Reviewed', 'Accepted', 'Rejected'],
      default: 'Applied',
    },
  },
  { timestamps: true }
);

// Prevent the same user from applying to the same job twice
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
