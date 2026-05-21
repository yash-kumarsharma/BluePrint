const pdfParse = require('pdf-parse');
const cheerio = require('cheerio');
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

    // 4. Robust AI Analysis with Fallback Logic
    const models = ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-2.5-flash-lite'];
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

// @desc    Get single analysis by ID
// @route   GET /api/analysis/:id
// @access  Private
exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Check ownership if user is logged in
    if (analysis.user && analysis.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this analysis' });
    }

    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analysis details' });
  }
};

// @desc    Delete analysis
// @route   DELETE /api/analysis/:id
// @access  Private
exports.deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Check ownership
    if (analysis.user && analysis.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this analysis' });
    }

    await analysis.deleteOne();
    res.status(200).json({ success: true, message: 'Analysis removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete analysis' });
  }
};

// @desc    Scrape Job Description from URL and Clean using Gemini API
// @route   POST /api/analysis/scrape-jd
// @access  Public
exports.scrapeJobDescription = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Please provide a URL.' });
    }

    let textContent = '';
    let methodUsed = '';

    // 1. Try Jina Reader first (handles JS-rendering and Cloudflare bypass)
    try {
      console.log(`[Scraper] Attempting to fetch content via Jina Reader for: ${url}`);
      const jinaResponse = await axios.get(`https://r.jina.ai/${url}`, {
        timeout: 10000,
        headers: {
          'Accept': 'text/plain'
        }
      });
      if (jinaResponse.data && typeof jinaResponse.data === 'string' && jinaResponse.data.length > 100) {
        textContent = jinaResponse.data;
        methodUsed = 'Jina Reader';
        console.log(`[Scraper] Successfully fetched content via Jina Reader.`);
      }
    } catch (jinaError) {
      console.warn(`[Scraper] Jina Reader failed: ${jinaError.message}. Trying direct axios fallback...`);
    }

    // 2. Fallback to direct Axios + Cheerio parse
    if (!textContent) {
      try {
        console.log(`[Scraper] Attempting direct fetch for: ${url}`);
        const directResponse = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
          }
        });

        if (directResponse.data) {
          const $ = cheerio.load(directResponse.data);
          
          // Remove scripts, styles, navs, footers, headers to keep body text clean
          $('script, style, nav, footer, header, iframe, noscript').remove();
          
          // Get clean body text
          textContent = $('body').text().replace(/\s+/g, ' ').trim();
          methodUsed = 'Direct Axios + Cheerio';
          console.log(`[Scraper] Successfully fetched content directly.`);
        }
      } catch (directError) {
        console.error(`[Scraper] Direct fetch failed: ${directError.message}`);
        throw new Error('Failed to retrieve the job page content. Both scraping routes were blocked or timed out.');
      }
    }

    if (!textContent || textContent.length < 100) {
      throw new Error('Extracted text content from the URL is empty or too short.');
    }

    // 3. Gemini cleaning pass to isolate Job Title, Company, and Job Description/Requirements
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      // If no key is set, just return a truncated portion of the raw text as fallback
      return res.status(200).json({
        success: true,
        method: methodUsed,
        text: textContent.slice(0, 1000)
      });
    }

    console.log(`[Scraper] Cleaning up content with Gemini API...`);
    const cleanPrompt = `
You are a technical recruiter assistant.
I will give you raw page text scraped from a job board or career page.
Extract the relevant job description information and format it into a clean, readable text description.
It must contain:
1. Job Title
2. Company Name
3. Role Overview / About the Role
4. Key Responsibilities
5. Core Requirements / Qualifications

Filter out all navigational items, website policies, headers/footers, login prompts, unrelated ads, or other links. Keep only the job posting details.

Raw Scraped Text:
"""
${textContent.slice(0, 8000)}
"""
    `;

    // Try our fallback list of models
    const models = ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-2.5-flash-lite'];
    let geminiResponse = null;

    for (const modelId of models) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${process.env.GEMINI_API_KEY}`;
        geminiResponse = await axios.post(geminiUrl, {
          contents: [{
            parts: [{ text: cleanPrompt }]
          }]
        }, { timeout: 15000 });

        if (geminiResponse.data) {
          break;
        }
      } catch (err) {
        console.warn(`[Scraper] Gemini cleanup failed on ${modelId}: ${err.message}. Trying next model...`);
      }
    }

    if (!geminiResponse) {
      // If Gemini cleaning fails, fall back to returning a cleaned snippet of the parsed text
      return res.status(200).json({
        success: true,
        method: methodUsed,
        text: textContent.slice(0, 1500)
      });
    }

    const cleanedText = geminiResponse.data.candidates[0].content.parts[0].text.trim();

    return res.status(200).json({
      success: true,
      method: methodUsed,
      text: cleanedText
    });

  } catch (error) {
    console.error('[Scraper Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while scraping the job description URL.'
    });
  }
};
