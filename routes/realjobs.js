const express = require('express');
const router = express.Router();

// GET /api/realjobs?query=react developer&location=india&page=1
router.get('/', async (req, res) => {
  const { query = 'software developer', location = 'india', page = 1 } = req.query;

  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + ' ' + location)}&page=${page}&num_pages=1&date_posted=all`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      }
    );

    const data = await response.json();

    if (!data.data) return res.json({ jobs: [], total: 0 });

    // Format jobs same as our schema
    const jobs = data.data.map(job => ({
      _id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country,
      salary: job.job_min_salary
        ? `$${job.job_min_salary}–$${job.job_max_salary}`
        : 'Not disclosed',
      type: job.job_is_remote ? 'Remote' : 'On-site',
      description: job.job_description?.slice(0, 500) + '...',
      skills: job.job_required_skills || [],
      applyLink: job.job_apply_link,
      logo: job.employer_logo,
      source: 'JSearch',
      createdAt: job.job_posted_at_datetime_utc
    }));

    res.json({ jobs, total: data.data.length });
  } catch (err) {
    res.status(500).json({ message: 'JSearch API error: ' + err.message });
  }
});

module.exports = router;