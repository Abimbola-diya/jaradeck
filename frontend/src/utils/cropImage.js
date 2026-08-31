/**
 * Canvas Image Crop & Transformation Helper
 * 
 * Performs 2D context rotation, flipping, CSS filter application, and pixel cropping,
 * exporting a lightweight WebP image Data URL.
 */

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Returns a cropped and transformed image as WebP DataURL.
 */
export async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  filter = 'none',
  brightness = 100,
  contrast = 100,
  outputSize = 600
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context unavailable.');
  }

  const rotRad = getRadianAngle(rotation);

  // Compute rotated bounding box
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to center point for rotation & flip
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Apply visual filter & adjustments
  let filterString = `brightness(${brightness}%) contrast(${contrast}%)`;
  if (filter === 'vivid') {
    filterString += ' saturate(140%) contrast(110%)';
  } else if (filter === 'warm') {
    filterString += ' sepia(30%) saturate(120%)';
  } else if (filter === 'bw') {
    filterString += ' grayscale(100%) contrast(115%)';
  } else if (filter === 'vintage') {
    filterString += ' sepia(50%) hue-rotate(-20deg) contrast(95%)';
  }
  ctx.filter = filterString;

  // Draw full transformed image onto bounding canvas
  ctx.drawImage(image, 0, 0);

  // Create crop canvas of final square dimensions
  const cropCanvas = document.createElement('canvas');
  const cropCtx = cropCanvas.getContext('2d');

  if (!cropCtx) {
    throw new Error('Crop Canvas 2D context unavailable.');
  }

  cropCanvas.width = outputSize;
  cropCanvas.height = outputSize;

  cropCtx.imageSmoothingEnabled = true;
  cropCtx.imageSmoothingQuality = 'high';

  // Draw cropped region from bounding canvas onto crop canvas
  cropCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  // Export as WebP DataURL with high quality (0.85)
  const webpDataUrl = cropCanvas.toDataURL('image/webp', 0.85);

  const kbSize = Math.round((webpDataUrl.length * (3 / 4)) / 1024);
  console.log(`[CropImage] Exported cropped avatar: ${outputSize}x${outputSize} WebP (~${kbSize}KB)`);

  return webpDataUrl;
}
