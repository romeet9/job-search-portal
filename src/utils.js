export function timeAgo(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function analyzeLogo(img) {
  const container = img.parentElement;
  if (!container) return;
  
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 10; canvas.height = 10;
    img.crossOrigin = "Anonymous";
    ctx.drawImage(img, 0, 0, 10, 10);
    const data = ctx.getImageData(0, 0, 10, 10).data;
    
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 20) { 
        r += data[i]; g += data[i + 1]; b += data[i + 2];
        count++;
      }
    }
    if (count === 0) return;
    const avg = (r + g + b) / (count * 3);
    if (avg > 180) container.style.background = '#0b0b0b'; 
    else if (avg < 110) container.style.background = '#ffffff'; 
    else container.style.background = '#f8f8f8';
  } catch (e) {}
}

export function safeInitial(name, initial) {
  return initial || name.slice(0, 2).toUpperCase();
}
