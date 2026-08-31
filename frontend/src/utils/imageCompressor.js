/**
 * Client-Side Image Compressor Utility
 * 
 * Downscales and compresses user-uploaded images using HTML5 Canvas to WebP format.
 * Reduces raw 5MB-10MB camera uploads down to ~30KB-80KB WebP images in the browser
 * before transmitting to Cloudinary and backend servers.
 */

export async function compressImageToWebP(file, maxDimension = 600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided for compression.'));
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = (err) => reject(err);

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio downscaled bounds
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP DataURL
        const webpDataUrl = canvas.toDataURL('image/webp', quality);

        // Compute compression savings log
        const originalKb = Math.round(file.size / 1024);
        const compressedKb = Math.round((webpDataUrl.length * (3 / 4)) / 1024);
        console.log(`[ImageCompressor] Compressed ${file.name}: ${originalKb}KB -> ${compressedKb}KB WebP (${Math.round((1 - compressedKb / originalKb) * 100)}% reduction)`);

        resolve({
          dataUrl: webpDataUrl,
          width,
          height,
          originalSizeKb: originalKb,
          compressedSizeKb: compressedKb,
        });
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}
