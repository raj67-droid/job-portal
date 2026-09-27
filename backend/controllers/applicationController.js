const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @route POST /api/applications/:jobId   (seeker only, multipart/form-data with 'resume' file)
const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      resumePath: `/uploads/resumes/${req.file.filename}`,
      resumeOriginalName: req.file.originalname,
      coverNote: req.body.coverNote,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/applications/my   (seeker's own applications)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({ path: 'job', select: 'title company location type' })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/applications/job/:jobId   (recruiter, must own the job)
const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applicants' });
    }

    const applications = await Application.find({ job: job._id })
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/applications/:id/status   (recruiter, owner of the related job)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Applied', 'Reviewed', 'Accepted', 'Rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };
