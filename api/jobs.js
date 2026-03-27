const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Config
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const BRANDFETCH_KEY = process.env.BRANDFETCH_KEY;
const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = 'jsearch.p.rapidapi.com';

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const CITY_COORDS = {
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.2090 }
};

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
      const boards = ['linkedin.com', 'glassdoor.com', 'indeed.com', 'naukri.com', 'lever.co', 'greenhouse.io', 'ashbyhq.com'];
      if (!boards.some(b => hostname.includes(b))) return hostname;
    } catch (e) {}
  }
  const cleanName = employer.toLowerCase().trim();
  if (LOGO_MAPPINGS[cleanName]) return LOGO_MAPPINGS[cleanName];
  return employer.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '') + '.com';
}

function getLogoUrl(domain) {
  if (BRANDFETCH_KEY) return `https://cdn.brandfetch.io/${domain}/logo?c=${BRANDFETCH_KEY}`;
  return `https://logo.clearbit.com/${domain}?size=500`;
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { city = 'all', role = 'Product Designer' } = req.query;
  const cacheKey = `${city.toLowerCase()}_${role.toLowerCase().replace(/\s+/g, '_')}`;
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  try {
    // 1. Check Supabase Cache
    let cachedData = null;
    let stats = { totalJobs: 0, monthlyRequests: 0, dailyRequests: 0, lastDate: today, lastMonth: now.getMonth() };

    if (supabase) {
      const { data: cacheData } = await supabase.from('jobs_cache').select('*').eq('key', cacheKey).single();
      if (cacheData && cacheData.date === today) {
        cachedData = cacheData.data;
      }
      
      const { data: usageData } = await supabase.from('usage_stats').select('*').eq('id', 1).single();
      if (usageData) {
        stats = {
          totalJobs: usageData.total_jobs,
          monthlyRequests: usageData.monthly_requests,
          dailyRequests: usageData.daily_requests,
          lastDate: usageData.last_date,
          lastMonth: usageData.last_month
        };
        // Reset daily/monthly logic
        if (stats.lastDate !== today) { stats.dailyRequests = 0; stats.lastDate = today; }
        if (stats.lastMonth !== now.getMonth()) { stats.monthlyRequests = 0; stats.lastMonth = now.getMonth(); }
      }
    }

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

    if (cachedData) {
      return res.json(responseWithStats(cachedData));
    }

    // 2. Fetch Live
    const query = `${role} in ${city === 'all' ? 'India' : city + ' India'}`;
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: { query, page: '1', num_pages: '3', country: 'in', date_posted: 'month' },
      headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
    });

    const jobsData = response.data.data || [];
    const baseCoords = CITY_COORDS[city.toLowerCase()] || { lat: 20.5937, lng: 78.9629 };
    const companiesMap = {};

    jobsData.forEach(job => {
      const employer = job.employer_name || 'Unknown Company';
      if (!companiesMap[employer]) {
        const offset = 0.02;
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
          lat, lng, jobs: []
        };
      }
      companiesMap[employer].jobs.push({
        title: job.job_title,
        type: job.job_employment_type || 'Full-time',
        mode: job.job_is_remote ? 'Remote' : 'Onsite',
        experience: 'Not specified',
        source: job.job_publisher || 'JSearch',
        applyUrl: job.job_apply_link,
        postedAt: job.job_posted_at_datetime_utc
      });
    });

    const finalResult = Object.values(companiesMap);

    res.json({
      status: 'success',
      data: finalResult,
      usage: {
        totalJobs: stats.totalJobs,
        requestsToday: stats.dailyRequests,
        requestsMonth: stats.monthlyRequests,
        dailyLeft: Math.max(0, 3 - stats.dailyRequests),
        monthlyLeft: Math.max(0, 200 - stats.monthlyRequests)
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};
