import { PROXY_URL } from './constants.js';

export async function fetchJobs(city, role) {
  const resp = await fetch(`${PROXY_URL}?city=${city}&role=${role}`);
  if (!resp.ok) throw new Error('Failed to fetch jobs');
  return await resp.json();
}
