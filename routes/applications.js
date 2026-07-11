const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, recruiterOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/applications';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/apply — submit application with resume upload
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { jobId, name, email, phone, linkedin, coverNote } = req.body;
    if (!jobId || !name || !email) return res.status(400).json({ message: 'jobId, name, email required' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check duplicate
    const exists = await Application.findOne({ job: jobId, email });
    if (exists) return res.status(400).json({ message: 'You have already applied to this job' });

    let resumeText = '';
    let resumeFile = '';

    if (req.file) {
      resumeFile = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      try {
        if (ext === '.pdf') {
          const buf = fs.readFileSync(req.file.path);
          resumeText = (await pdfParse(buf)).text;
        } else if (ext === '.docx') {
          resumeText = (await mammoth.extractRawText({ path: req.file.path })).value;
        } else {
          resumeText = fs.readFileSync(req.file.path, 'utf-8');
        }
      } catch { resumeText = ''; }
    }

    const application = await Application.create({
      job: jobId, name, email, phone, linkedin, coverNote,
      resumeText, resumeFile,
      applicant: req.user?._id || null
    });

    // Increment applicant count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

    res.status(201).json({ message: 'Application submitted!', id: application._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/apply/job/:jobId — get all applications for a job (recruiter only)
router.get('/job/:jobId', protect, recruiterOnly, async (req, res) => {
  try {
    const apps = await Application.find({ job: req.params.jobId })
      .sort({ aiScore: -1, createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/apply/:id/status — update status (recruiter)
router.patch('/:id/status', protect, recruiterOnly, async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
