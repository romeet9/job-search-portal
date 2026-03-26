const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = 'jsearch.p.rapidapi.com';

if (!RAPID_API_KEY) {
  console.warn('WARNING: RAPID_API_KEY is not defined in .env file.');
}

const CITY_COORDS = {
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  mumbai:    { lat: 19.0760, lng: 72.8777 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  delhi:     { lat: 28.6139, lng: 77.2090 },
  pune:      { lat: 18.5204, lng: 73.8567 },
  chennai:   { lat: 13.0827, lng: 80.2707 },
  all:       { lat: 20.5937, lng: 78.9629 }
};

const CACHE_FILE = path.join(__dirname, 'jobs_cache.json');
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

function getCache() {
  if (!fs.existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function setCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

app.get('/api/jobs', async (req, res) => {
  const { city = 'all', role = 'Product Designer' } = req.query;
  const cacheKey = `${city.toLowerCase()}_${role.toLowerCase().replace(/\s+/g, '_')}`;
  
  // 1. Check Cache
  const cache = getCache();
  const cachedEntry = cache[cacheKey];
  const now = Date.now();

  if (cachedEntry && (now - cachedEntry.timestamp < CACHE_TTL)) {
    console.log(`[Cache Hit] Serving ${cacheKey} from local storage`);
    return res.json(cachedEntry.data);
  }

  console.log(`[Cache Miss] Fetching ${cacheKey} from live API`);
  const query = `${role} in ${city === 'all' ? 'India' : city + ' India'}`;

  try {
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: query,
        page: '1',
        num_pages: '1',
        country: 'in',
        date_posted: 'month'
      },
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST
      }
    });

    const jobsData = response.data.data || [];
    const baseCoords = CITY_COORDS[city.toLowerCase()] || CITY_COORDS.all;
    
    // Group by employer
    const companiesMap = {};
    
    jobsData.forEach((job, index) => {
      const employer = job.employer_name || 'Unknown Company';
      if (!companiesMap[employer]) {
        // Randomize coordinates slightly around city center to prevent overlapping
        const offset = 0.02; // Roughly 2km
        const lat = baseCoords.lat + (Math.random() - 0.5) * offset * 2;
        const lng = baseCoords.lng + (Math.random() - 0.5) * offset * 2;

        companiesMap[employer] = {
          id: employer.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: employer,
          logoUrl: job.employer_logo,
          logoInitial: employer.slice(0, 2).toUpperCase(),
          city: job.job_city || (city !== 'all' ? city : 'India'),
          cityKey: city.toLowerCase(),
          address: `${job.job_city || ''}, ${job.job_state || ''}, ${job.job_country || 'India'}`.trim().replace(/^,/, ''),
          about: job.job_description ? job.job_description.slice(0, 150) + '...' : 'No description available.',
          lat: lat,
          lng: lng,
          jobs: []
        };
      }

      companiesMap[employer].jobs.push({
        title: job.job_title,
        type: job.job_employment_type || 'Full-time',
        level: 'Mid-Senior', // JSearch doesn't always provide this clearly
        mode: job.job_is_remote ? 'Remote' : 'Onsite',
        experience: 'Not specified',
        category: role,
        tools: [], // Would need NLP to extract reliably
        skills: [], // Would need NLP to extract reliably
        source: job.job_publisher || 'JSearch',
        applyUrl: job.job_apply_link,
        applyLabel: `Apply on ${job.job_publisher || 'Original Site'}`
      });
    });

    const finalResult = Object.values(companiesMap);
    
    // 2. Update Cache
    const newCache = getCache();
    newCache[cacheKey] = {
      timestamp: Date.now(),
      data: finalResult
    };
    setCache(newCache);

    res.json(finalResult);
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
