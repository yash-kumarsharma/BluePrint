const pdfParse = require('pdf-parse');
const axios = require('axios');
const Analysis = require('../models/Analysis');

// @desc    Upload Resume PDF + JD, then Analyze Skill Gap using Gemini API
// @route   POST /api/analysis/analyze-gap
// @access  Public
exports.analyzeSkillGap = async (req, res) => {
  try {
    const { jobDescription, userId } = req.body;

    // 1. Validate Input
    if (!req.file || !jobDescription) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both a resume (PDF file) and a jobDescription (text).' 
      });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(500).json({
        success: false,
        message: 'Gemini API Key is missing. Please add it to your .env file.'
      });
    }

    // 2. Parse the PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    // 3. Construct the Prompt for the LLM
    const prompt = `
You are an expert Career Coach and Technical Recruiter.
I will provide you with a candidate's resume text and a job description.
Analyze them and return a strict JSON object with this exact structure (do not include markdown formatting like \`\`\`json, just return the raw JSON object):

{
  "matchPercentage": 75,
  "matchedSkills": ["JavaScript", "React"],
  "missingSkills": ["Node.js", "Docker"],
  "recommendations": ["Learn backend patterns", "Practice containerization"],
  "roadmap": [
    { "step": 1, "task": "Learn Node.js Basics", "duration": "1 week" },
    { "step": 2, "task": "Build basic CRUD app", "duration": "2 weeks" }
  ]
}

Candidate Resume TEXT:
"""
${resumeText}
"""

Job Description TEXT:
"""
${jobDescription}
"""
    `;

    // 4. Call Google Gemini API (Using Axios for stability)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await axios.post(geminiUrl, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    // 5. Parse the Response
    let aiResponseText = response.data.candidates[0].content.parts[0].text;
    
    // Sometimes Gemini still adds markdown even when told not to, so we clean it.
    if (aiResponseText.startsWith('```json')) {
      aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (aiResponseText.startsWith('```')) {
      aiResponseText = aiResponseText.replace(/```/g, '').trim();
    }

    const analysisData = JSON.parse(aiResponseText);

    // Save record to MongoDB Database
    let userIdObj = null;
    if (userId && userId !== 'undefined' && userId !== 'null') userIdObj = userId;

    const savedAnalysis = await Analysis.create({
      user: userIdObj, // Store user ID if provided by the frontend payload
      jobDescription: jobDescription,
      matchPercentage: analysisData.matchPercentage,
      matchedSkills: analysisData.matchedSkills,
      missingSkills: analysisData.missingSkills,
      recommendations: analysisData.recommendations,
      roadmap: analysisData.roadmap,
    });

    // Return the finalized data
    return res.status(200).json({
      success: true,
      data: analysisData,
      analysisId: savedAnalysis._id
    });

  } catch (error) {
    console.error('AI Analysis Error:', error?.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze the resume and JD.'
    });
  }
};

// @desc    Get logged in user's analysis history
// @route   GET /api/analysis/history
// @access  Private
exports.getUserHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};
