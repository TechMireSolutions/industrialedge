export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (typeof imagePath !== 'string') return '';
  
  // Return blob/data URIs as-is
  if (imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Handle absolute URLs (including legacy localhost paths in DB)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // If it points to our server's uploads (either localhost or production domain)
    if (imagePath.includes('/uploads/')) {
      try {
        const urlObj = new URL(imagePath);
        const uploadPath = urlObj.pathname.split('/uploads/')[1];
        if (uploadPath) {
          // Send via proxy to bypass Nginx static caching
          return `/api/image-proxy?path=${encodeURIComponent(uploadPath)}`;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    return imagePath;
  }

  // Handle relative paths stored in DB (e.g., /uploads/images/...)
  if (imagePath.includes('uploads/')) {
    const uploadPath = imagePath.split('uploads/')[1];
    if (uploadPath) {
      return `/api/image-proxy?path=${encodeURIComponent(uploadPath)}`;
    }
  }

  const prefix = imagePath.startsWith('/') ? '' : '/';
  return prefix + imagePath;
};
