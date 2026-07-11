// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const pdfParse = require('pdf-parse');
// const mammoth = require('mammoth');
// const { protect, recruiterOnly } = require('../middleware/auth');

// // File upload config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = 'uploads/resumes';
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
//   }
// });
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const allowed = ['.pdf', '.docx', '.txt'];
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (allowed.includes(ext)) cb(null, true);
//     else cb(new Error('Only PDF, DOCX, TXT files allowed'));
//   }
// });

// // Extract text from uploaded file
// async function extractText(filePath, mimetype) {
//   const ext = path.extname(filePath).toLowerCase();
//   if (ext === '.pdf') {
//     const buffer = fs.readFileSync(filePath);
//     const data = await pdfParse(buffer);
//     return data.text;
//   } else if (ext === '.docx') {
//     const result = await mammoth.extractRawText({ path: filePath });
//     return result.value;
//   } else {
//     return fs.readFileSync(filePath, 'utf-8');
//   }
// }

// // Call Anthropic API
// // async function callAI(prompt) {
// //   const response = await fetch('https://api.anthropic.com/v1/messages', {
// //     method: 'POST',
// //     headers: {
// //       'x-api-key': process.env.ANTHROPIC_API_KEY,
// //       'anthropic-version': '2023-06-01',
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({
// //       model: 'claude-sonnet-4-20250514',
// //       max_tokens: 2000,
// //       messages: [{ role: 'user', content: prompt }]
// //     })
// //   });
// //   const data = await response.json();
// //   if (data.error) throw new Error(data.error.message);
// //   return data.content.map(c => c.text || '').join('');
// // }

// async function callAI(prompt) {
//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }]
//       })
//     }
//   );
//   const data = await response.json();
//   if (data.error) throw new Error(data.error.message);
//   return data.candidates[0].content.parts[0].text;
// }
// // POST /api/screen — screen multiple resumes against a JD
// router.post('/', protect, recruiterOnly, upload.array('resumes', 20), async (req, res) => {
//   try {
//     const { jobDescription, requiredSkills, pastedResumes } = req.body;
//     if (!jobDescription) return res.status(400).json({ message: 'Job description required' });

//     let resumeTexts = [];

//     // Extract text from uploaded files
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         try {
//           const text = await extractText(file.path, file.mimetype);
//           resumeTexts.push({ name: file.originalname, text, filePath: file.path });
//         } catch (e) {
//           resumeTexts.push({ name: file.originalname, text: `[Could not parse: ${file.originalname}]`, filePath: file.path });
//         }
//       }
//     }

//     // Add pasted resumes
//     if (pastedResumes) {
//       const parts = pastedResumes.split(/---\s*RESUME\s*---/i).map(r => r.trim()).filter(Boolean);
//       parts.forEach((text, i) => resumeTexts.push({ name: `Pasted Resume ${i + 1}`, text }));
//     }

//     if (resumeTexts.length === 0) return res.status(400).json({ message: 'No resumes provided' });

//     const skills = requiredSkills ? JSON.parse(requiredSkills).join(', ') : 'extract from JD';

//     const prompt = `You are an expert technical recruiter AI.

// Job Description:
// ${jobDescription}

// Required Skills: ${skills}

// Analyze the following ${resumeTexts.length} resume(s) and return a JSON array sorted by match score descending.

// For each resume return exactly this shape:
// {
//   "name": "candidate full name or filename if not found",
//   "title": "current/recent job title",
//   "experience": "X years",
//   "score": <integer 0-100>,
//   "skills": ["skill1", "skill2", ...],
//   "matchedSkills": ["skills matching the JD"],
//   "pros": "2-3 sentence strengths",
//   "cons": "1-2 sentence gaps",
//   "recommendation": "Strong Hire" | "Hire" | "Maybe" | "Pass"
// }

// Return ONLY a valid JSON array. No markdown. No explanation.

// Resumes:
// ${resumeTexts.map((r, i) => `\n=== RESUME ${i + 1} (${r.name}) ===\n${r.text.slice(0, 3000)}`).join('\n')}`;

//     const raw = await callAI(prompt);
//     const clean = raw.replace(/```json|```/g, '').trim();
//     const results = JSON.parse(clean);

//     res.json({ results, total: results.length });

//   } catch (err) {
//     console.error('Screening error:', err);
//     res.status(500).json({ message: 'Screening failed: ' + err.message });
//   }
// });

// // POST /api/screen/generate-jd — AI generate job description
// router.post('/generate-jd', protect, recruiterOnly, async (req, res) => {
//   try {
//     const { title, company, skills, context } = req.body;
//     const prompt = `Write a professional job description for:
// Title: ${title}
// Company: ${company}
// Skills: ${(skills || []).join(', ')}
// ${context ? 'Context: ' + context : ''}

// Include: role overview (2 sentences), responsibilities (4 bullet points starting with -), requirements (4 bullet points starting with -).
// Keep it under 250 words. Return plain text only, no markdown headers.`;

//     const text = await callAI(prompt);
//     res.json({ description: text });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { protect, recruiterOnly } = require('../middleware/auth');

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/resumes';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOCX, TXT files allowed'));
  }
});

// Extract text from file
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    return fs.readFileSync(filePath, 'utf-8');
  }
}

// Gemini AI call
async function callAI(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates[0].content.parts[0].text;
}

// POST /api/screen
router.post('/', protect, recruiterOnly, upload.array('resumes', 20), async (req, res) => {
  try {
    const { jobDescription, requiredSkills, pastedResumes } = req.body;
    if (!jobDescription) return res.status(400).json({ message: 'Job description required' });

    let resumeTexts = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const text = await extractText(file.path);
          resumeTexts.push({ name: file.originalname, text });
        } catch (e) {
          resumeTexts.push({ name: file.originalname, text: `[Could not parse: ${file.originalname}]` });
        }
      }
    }

    if (pastedResumes) {
      const parts = pastedResumes.split(/---\s*RESUME\s*---/i).map(r => r.trim()).filter(Boolean);
      parts.forEach((text, i) => resumeTexts.push({ name: `Pasted Resume ${i + 1}`, text }));
    }

    if (resumeTexts.length === 0) return res.status(400).json({ message: 'No resumes provided' });

    const skills = requiredSkills ? JSON.parse(requiredSkills).join(', ') : 'extract from JD';

    const prompt = `You are an expert technical recruiter AI.

Job Description:
${jobDescription}

Required Skills: ${skills}

Analyze the following ${resumeTexts.length} resume(s) and return a JSON array sorted by match score descending.

For each resume return exactly this shape:
{
  "name": "candidate full name or filename if not found",
  "title": "current/recent job title",
  "experience": "X years",
  "score": <integer 0-100>,
  "skills": ["skill1", "skill2"],
  "matchedSkills": ["skills matching the JD"],
  "pros": "2-3 sentence strengths",
  "cons": "1-2 sentence gaps",
  "recommendation": "Strong Hire or Hire or Maybe or Pass"
}

Return ONLY a valid JSON array. No markdown. No explanation.

Resumes:
${resumeTexts.map((r, i) => `\n=== RESUME ${i + 1} (${r.name}) ===\n${r.text.slice(0, 3000)}`).join('\n')}`;

    const raw = await callAI(prompt);
    const clean = raw.replace(/```json|```/g, '').trim();
    const results = JSON.parse(clean);

    res.json({ results, total: results.length });

  } catch (err) {
    console.error('Screening error:', err);
    res.status(500).json({ message: 'Screening failed: ' + err.message });
  }
});

// POST /api/screen/generate-jd
router.post('/generate-jd', protect, recruiterOnly, async (req, res) => {
  try {
    const { title, company, skills, context } = req.body;
    const prompt = `Write a professional job description for:
Title: ${title}
Company: ${company}
Skills: ${(skills || []).join(', ')}
${context ? 'Context: ' + context : ''}

Include: role overview (2 sentences), responsibilities (4 bullet points starting with -), requirements (4 bullet points starting with -).
Keep it under 250 words. Return plain text only.`;

    const text = await callAI(prompt);
    res.json({ description: text });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;