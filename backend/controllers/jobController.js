const Job = require('../models/Job');
const Application = require('../models/Application');

// @route GET /api/jobs   (public, supports ?search=&location=&type=)
const getJobs = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;

    const jobs = await Job.find(query)
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/jobs/my/posted   (recruiter's own jobs)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/jobs   (recruiter only)
const createJob = async (req, res) => {
  try {
    const { title, description, company, location, type, salary, skills } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      type,
      salary,
      skills: Array.isArray(skills) ? skills : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/jobs/:id   (recruiter, owner only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }

    const fields = ['title', 'description', 'company', 'location', 'type', 'salary', 'skills', 'isActive'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) job[f] = req.body[f];
    });

    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/jobs/:id   (recruiter, owner only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getJobs, getJobById, getMyJobs, createJob, updateJob, deleteJob };
