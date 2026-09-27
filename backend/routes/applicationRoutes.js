const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/:jobId', protect, authorize('seeker'), upload.single('resume'), applyToJob);
router.get('/my', protect, authorize('seeker'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter'), getApplicantsForJob);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
