const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { analyzeSkillGap } = require('../controllers/analysis.controller');

// We use the `upload.single('resume')` middleware which intercepts the form-data request,
// finds the file attached to the field name "resume", and places it in `req.file`.
// Job Description is expected in `req.body.jobDescription`.
router.post('/analyze-gap', upload.single('resume'), analyzeSkillGap);

module.exports = router;
