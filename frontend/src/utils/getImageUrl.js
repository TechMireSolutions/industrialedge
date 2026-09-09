export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Return blob/data URIs as-is
  if (imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Handle absolute URLs (including legacy localhost paths in DB)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // If the DB contains a localhost path but we are in production, rewrite it
    if (imagePath.includes('localhost:') || imagePath.includes('127.0.0.1:')) {
      try {
        const urlObj = new URL(imagePath);
        // Extract the pathname (e.g., /uploads/images/xxx.webp or /api/uploads/...)
        let pathname = urlObj.pathname;
        
        // Ensure it has the /api prefix if missing, so Nginx proxies it correctly
        if (pathname.startsWith('/uploads')) {
          pathname = '/api' + pathname;
        }
        
        // Use the current environment's origin
        const currentOrigin = window.location.origin; 
        return currentOrigin + pathname;
      } catch (e) {
        return imagePath;
      }
    }
    // If it's a valid remote URL (like Vercel Blob or external CDN), return it
    return imagePath;
  }

  // Handle relative paths stored in DB (e.g., /uploads/images/...)
  const prefix = imagePath.startsWith('/') ? '' : '/';
  
  // If the relative path lacks the /api prefix, add it so Nginx routes it to the backend
  if (imagePath.startsWith('/uploads') || imagePath.startsWith('uploads')) {
    return '/api' + prefix + imagePath;
  }

  return prefix + imagePath;
};
