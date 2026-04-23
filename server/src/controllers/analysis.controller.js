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
  "atsScore": 62,
  "matchedSkills": ["JavaScript", "React"],
  "missingSkills": ["Node.js", "Docker"],
  "recommendations": ["Learn backend patterns", "Practice containerization"],
  "resumeImprovements": [
    "Use simple action words like 'Lead' or 'Created'",
    "Add numbers to show your results (e.g., 'Helped 10 customers')",
    "Keep your project descriptions short and clear"
  ],
  "roadmap": [
    { "step": 1, "task": "Learn Node.js Basics", "duration": "1 week" },
    { "step": 2, "task": "Build basic CRUD app", "duration": "2 weeks" }
  ],
  "learningResources": [
    { "title": "Node.js Tutorial for Beginners", "platform": "YouTube", "url": "https://youtube.com/results?search_query=node+js+tutorial" },
    { "title": "Data Structures & Algorithms", "platform": "GeeksforGeeks", "url": "https://www.geeksforgeeks.org/data-structures/" }
  ]
}

Note: Keep all feedback simple, direct, and easy for everyone to understand. Avoid heavy corporate jargon. Provide 2-3 specific learning resources based on the missing skills.

Candidate Resume TEXT:
"""
${resumeText}
"""

Job Description TEXT:
"""
${jobDescription}
"""
    `;

    // 4. Robust AI Analysis with 4-Tier Fallback Logic (1.5 Flash, 1.5 Pro, 2.0-Flash, 1.5-8B)
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-1.5-flash-8b'];
    let response = null;
    let fallbackUsed = false;

    for (const modelId of models) {
      try {
        console.log(`[AI] Attempting analysis with node: ${modelId}...`);
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${process.env.GEMINI_API_KEY}`;

        response = await axios.post(geminiUrl, {
          contents: [{
            parts: [{ text: prompt }]
          }]
        });

        if (response.data) {
          console.log(`[AI] Analysis successful via ${modelId}`);
          break; // Exit loop on success
        }
      } catch (err) {
        const status = err.response?.status;
        const errorMsg = err.response?.data?.error?.message || err.message;

        if (status === 503 || status === 429) {
          console.warn(`[AI] Model ${modelId} is throttled/busy. Error: ${errorMsg}`);
          console.warn(`[AI] Initializing fail-over to next node...`);
          fallbackUsed = true;
          continue; // Try next model in the list
        } else {
          // If it's a different error (e.g. 400 Bad Request), don't fallback
          throw err;
        }
      }
    }

    if (!response) {
      throw new Error('All AI nodes are currently at peak capacity. Please retry in 60 seconds.');
    }

    // 5. Parse the Response
    let aiResponseText = response.data.candidates[0].content.parts[0].text;

    // Robust JSON extraction
    const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI analysis produced invalid output structure.');
    }
    const analysisData = JSON.parse(jsonMatch[0]);

    // Save record to MongoDB Database
    let userIdObj = null;
    if (userId && userId !== 'undefined' && userId !== 'null') userIdObj = userId;

    const savedAnalysis = await Analysis.create({
      user: userIdObj, // Store user ID if provided by the frontend payload
      jobDescription: jobDescription,
      matchPercentage: analysisData.matchPercentage,
      atsScore: analysisData.atsScore || 0,
      matchedSkills: analysisData.matchedSkills,
      missingSkills: analysisData.missingSkills,
      recommendations: analysisData.recommendations,
      resumeImprovements: analysisData.resumeImprovements || [],
      roadmap: analysisData.roadmap,
      learningResources: analysisData.learningResources || [],
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
