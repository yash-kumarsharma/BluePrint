const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { 
  analyzeSkillGap, 
  getUserHistory, 
  getAnalysisById, 
  deleteAnalysis,
  scrapeJobDescription
} = require('../controllers/analysis.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route for analysis
router.post('/analyze-gap', upload.single('resume'), analyzeSkillGap);
router.post('/scrape-jd', scrapeJobDescription);

// Private routes
router.get('/history', protect, getUserHistory);
router.get('/:id', protect, getAnalysisById);
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;
