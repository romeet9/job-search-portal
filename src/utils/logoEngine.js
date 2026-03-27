/**
 * Adaptive Logo Engine
 * Analyzes logo pixels to ensure legibility on dark backgrounds.
 */
export async function getAdaptiveLogo(url) {
  if (!url) return null;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          if (data[i+3] > 100) { // Only count non-transparent
            r += data[i]; g += data[i+1]; b += data[i+2];
            count++;
          }
        }
        
        if (count === 0) return resolve(url);
        
        const brightness = (r/count * 0.299 + g/count * 0.587 + b/count * 0.114);
        // If logo is too dark, we can apply an invert filter or just return
        resolve({ url, brightness, needsInvert: brightness < 60 });
      } catch (e) {
        resolve(url);
      }
    };
    
    img.onerror = () => resolve(url);
  });
}
