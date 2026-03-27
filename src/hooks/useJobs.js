import { useState, useEffect } from 'react';

const PROXY_URL = '/api/jobs';

export function useJobs(city) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchJobs = async (force = false) => {
    setLoading(true);
    try {
      const resp = await fetch(`${PROXY_URL}?city=${city}&force=${force}`);
      const data = await resp.json();
      
      if (data.status === 'success') {
        // Randomize lat/lng slightly for overlapping markers
        const randomized = data.data.map(job => ({
          ...job,
          lat: (job.lat || 12.97) + (Math.random() - 0.5) * 0.005,
          lng: (job.lng || 77.59) + (Math.random() - 0.5) * 0.005
        }));
        setJobs(randomized);
        setStats(data.usage);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [city]);

  return { jobs, loading, error, stats, refresh: () => fetchJobs(true) };
}
