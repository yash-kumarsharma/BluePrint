const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { analyzeSkillGap, getUserHistory } = require('../controllers/analysis.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route for analysis
// Job Description is expected in `req.body.jobDescription`.
router.post('/analyze-gap', upload.single('resume'), analyzeSkillGap);

// Private route for fetching history
router.get('/history', protect, getUserHistory);

module.exports = router;
