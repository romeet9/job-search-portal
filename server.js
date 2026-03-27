const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const BRANDFETCH_KEY = process.env.BRANDFETCH_KEY;

const supabase = (supabaseUrl && supabaseUrl.startsWith('https://') && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabase) {
  console.warn('[SUPABASE MISSING] Falling back to local JSON cache. Add valid SUPABASE_URL (starting with https) and SUPABASE_KEY to .env.');
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const RAPID_API_KEY = process.env.RAPID_API_KEY || 'e2d172c084msh0ccf954955ecd6fp107de0jsn4af14df2e55f';
const RAPID_API_HOST = 'jsearch.p.rapidapi.com';

if (!RAPID_API_KEY) {
  console.warn('WARNING: RAPID_API_KEY is not defined in .env file.');
} else {
  console.log(`[RAPID_API] Using key starting with: ${RAPID_API_KEY.slice(0, 4)}...`);
}

const CITY_COORDS = {
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.2090 }
};

const CACHE_FILE = path.join(__dirname, 'jobs_cache.json');

const LOGO_MAPPINGS = {
  'tata digital': 'tatadigital.com',
  'tata consultancy services': 'tcs.com',
  'reliance industries': 'ril.com',
  'zomato': 'zomato.com',
  'swiggy': 'swiggy.com',
  'ola': 'olacabs.com',
  'razorpay': 'razorpay.com',
  'paytm': 'paytm.com',
  'flipkart': 'flipkart.com',
  'phonepe': 'phonepe.com',
  'cred': 'cred.club',
  'adobe': 'adobe.com',
  'google': 'google.com',
  'apple': 'apple.com',
  'microsoft': 'microsoft.com'
};

function extractDomain(url, employer) {
  if (url) {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.replace('www.', '');
      // If it's a generic job board, ignore it
      const boards = ['linkedin.com', 'glassdoor.com', 'indeed.com', 'naukri.com', 'lever.co', 'greenhouse.io', 'ashbyhq.com'];
      if (!boards.some(b => hostname.includes(b))) {
        return hostname;
      }
    } catch (e) {}
  }
  const cleanName = employer.toLowerCase().trim();
  if (LOGO_MAPPINGS[cleanName]) return LOGO_MAPPINGS[cleanName];
  
  // Last resort heuristic
  return employer.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '') + '.com';
}

function getLogoUrl(domain) {
  // 1. Prioritize Brandfetch if key is available
  if (BRANDFETCH_KEY) {
    return `https://cdn.brandfetch.io/${domain}/logo?c=${BRANDFETCH_KEY}`;
  }
  // 2. Clearbit at 512px
  return `https://logo.clearbit.com/${domain}?size=500`;
}
// Strict rule: Fetch once per day per city/role to stay within 200/month limit

async function getCache() {
  if (supabase) {
    const { data, error } = await supabase.from('jobs_cache').select('*');
    if (error) console.error('[Supabase Cache Read Error]', error.message);
    if (!error && data && data.length > 0) {
      console.log(`[Supabase Hit] Found ${data.length} entries`);
      const cache = {};
      data.forEach(item => cache[item.key] = { date: item.date, data: item.data, timestamp: item.timestamp });
      return { cache, source: 'Supabase' };
    }
  }
  if (!fs.existsSync(CACHE_FILE)) return { cache: {}, source: 'Local' };
  try { 
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    return { cache, source: 'Local' };
  } catch (e) { 
    return { cache: {}, source: 'Local' }; 
  }
}

async function setCache(cacheKey, date, data) {
  if (supabase) {
    const { error } = await supabase.from('jobs_cache').upsert({
      key: cacheKey,
      date: date,
      data: data,
      timestamp: Date.now()
    });
    if (!error) return;
    console.error('[Supabase Cache Error]', error.message);
  }
  const cache = await getCache();
  cache[cacheKey] = { date, timestamp: Date.now(), data };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

const USAGE_FILE = path.join(__dirname, 'usage_stats.json');

async function getUsageStats() {
  const today = new Date().toISOString().split('T')[0];
  const defaultStats = { totalJobs: 0, monthlyRequests: 0, dailyRequests: 0, lastDate: today, lastMonth: new Date().getMonth() };

  if (supabase) {
    const { data, error } = await supabase.from('usage_stats').select('*').eq('id', 1).single();
    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows found'
       console.error('[Supabase Stats Read Error]', error.message, error.details);
    }
    if (!error && data) {
      let stats = data;
      // Reset daily
      if (stats.last_date !== today) {
        stats.daily_requests = 0;
        stats.last_date = today;
      }
      // Reset monthly
      if (stats.last_month !== new Date().getMonth()) {
        stats.monthly_requests = 0;
        stats.last_month = new Date().getMonth();
      }
      return {
        totalJobs: stats.total_jobs,
        monthlyRequests: stats.monthly_requests,
        dailyRequests: stats.daily_requests,
        lastDate: stats.last_date,
        lastMonth: stats.last_month
      };
    }
  }

  if (!fs.existsSync(USAGE_FILE)) return defaultStats;
  try {
    let stats = JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8'));
    if (stats.lastDate !== today) { stats.dailyRequests = 0; stats.lastDate = today; }
    if (stats.lastMonth !== new Date().getMonth()) { stats.monthlyRequests = 0; stats.lastMonth = new Date().getMonth(); }
    return stats;
  } catch (e) { return defaultStats; }
}

async function updateUsageStats(update) {
  const stats = await getUsageStats();
  const newStats = { ...stats, ...update };
  
  if (supabase) {
    const { error } = await supabase.from('usage_stats').upsert({
      id: 1,
      total_jobs: newStats.totalJobs,
      monthly_requests: newStats.monthlyRequests,
      daily_requests: newStats.dailyRequests,
      last_date: newStats.lastDate,
      last_month: newStats.lastMonth
    });
    if (!error) return newStats;
    console.error('[Supabase Stats Error]', error.message);
  }

  fs.writeFileSync(USAGE_FILE, JSON.stringify(newStats, null, 2));
  return newStats;
}

app.get('/api/jobs', async (req, res) => {
  const { city = 'all', role = 'Product Designer' } = req.query;
  const cacheKey = `${city.toLowerCase()}_${role.toLowerCase().replace(/\s+/g, '_')}`;

  // 1. Check Cache
  const { cache, source } = await getCache();
  const stats = await getUsageStats();
  const cachedEntry = cache[cacheKey];
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

  const responseWithStats = (data) => ({
    data,
    stats: {
      totalJobs: stats.totalJobs,
      requestsToday: stats.dailyRequests,
      requestsMonth: stats.monthlyRequests,
      dailyLeft: Math.max(0, 3 - stats.dailyRequests),
      monthlyLeft: Math.max(0, 200 - stats.monthlyRequests)
    }
  });

  if (cachedEntry && cachedEntry.date === today) {
    console.log(`[API CONNECTION CUT] Serving ${cacheKey} for ${today} from ${source}`);
    return res.json(responseWithStats(cachedEntry.data));
  }

  console.log(`[Cache Miss] Fetching ${cacheKey} for ${today} from live API`);
  const query = `${role} in ${city === 'all' ? 'India' : city + ' India'}`;

  try {
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: query,
        page: '1',
        num_pages: '3',
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

        const domain = extractDomain(job.job_apply_link, employer);

        companiesMap[employer] = {
          id: employer.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: employer,
          logoUrl: job.employer_logo || getLogoUrl(domain),
          domain: domain,
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
        applyLabel: `Apply on ${job.job_publisher || 'Original Site'}`,
        postedAt: job.job_posted_at_datetime_utc
      });
    });

    const finalResult = Object.values(companiesMap);

    await setCache(cacheKey, today, finalResult);

    const updatedStats = await updateUsageStats({
      totalJobs: stats.totalJobs + finalResult.length,
      dailyRequests: stats.dailyRequests + 1,
      monthlyRequests: stats.monthlyRequests + 1
    });

    res.json(responseWithStats(finalResult));
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('RapidAPI Error Detail:', error.response.data);
    }
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
