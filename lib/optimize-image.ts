import { resizeImage } from "img-toolkit";

/**
 * Configuration for image optimization
 */
export interface ImageOptimizationConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "webp" | "jpg" | "png";
  resampling?: number; // 0 (fastest) to 10 (highest quality)
}

/**
 * Supported image MIME types
 */
export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
] as const;

/**
 * Default optimization settings optimized for web performance
 */
export const DEFAULT_CONFIG: Required<ImageOptimizationConfig> = {
  maxWidth: 1920, // Max width for high-quality displays
  maxHeight: 1920, // Max height for high-quality displays
  quality: 0.85, // Good balance between quality and file size
  format: "webp", // Best compression with good quality
  resampling: 2, // Fast resampling with decent quality (Lanczos3)
};

/**
 * Preset configurations for different use cases
 * Note: These constraints apply to BOTH dimensions, maintaining aspect ratio
 */
export const OPTIMIZATION_PRESETS = {
  // For thumbnails and small images
  thumbnail: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.8,
    format: "webp" as const,
    resampling: 1,
  },
  // For moment/story images (portrait-oriented but handles landscape too)
  // Constrains longest side to 1920px, maintains aspect ratio
  moment: {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.82,
    format: "webp" as const,
    resampling: 2,
  },
  // For marker photos (works for any orientation)
  // Portrait (9:16): ~900x1600px, Landscape (16:9): ~1600x900px, Square: ~1600x1600px
  // 1600px longest side is perfect for retina displays, 78% quality is imperceptible
  marker: {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.78,
    format: "webp" as const,
    resampling: 1, // Faster processing, still good quality
  },
  // For profile/avatar images (should be square)
  avatar: {
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.85,
    format: "webp" as const,
    resampling: 2,
  },
} as const;

/**
 * Error thrown when image validation fails
 */
export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageValidationError";
  }
}

/**
 * Validates image file type
 */
export function validateImageType(file: File): void {
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type as any)) {
    throw new ImageValidationError(
      "지원되지 않은 이미지 형식입니다. JPEG, PNG, WebP 형식의 이미지를 업로드해주세요."
    );
  }
}

/**
 * Validates image file size (in MB)
 */
export function validateImageSize(file: File, maxSizeMB: number = 30): void {
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    throw new ImageValidationError(
      `이미지 크기는 최대 ${maxSizeMB}MB까지 가능합니다.`
    );
  }
}

/**
 * Calculates optimal dimensions while maintaining aspect ratio
 * Intelligently handles portrait, landscape, and square images
 */
function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width?: number; height?: number } {
  // If image is already smaller than constraints, don't resize
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return {};
  }

  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;

  // Determine if portrait, landscape, or square
  const isPortrait = originalHeight > originalWidth;
  const isLandscape = originalWidth > originalHeight;

  // Calculate scale factor based on the longest dimension
  let targetWidth: number;
  let targetHeight: number;

  if (isPortrait) {
    // Portrait: constrain height, scale width proportionally
    targetHeight = Math.min(originalHeight, maxHeight);
    targetWidth = Math.round(targetHeight * aspectRatio);

    // If width still exceeds max, constrain by width instead
    if (targetWidth > maxWidth) {
      targetWidth = maxWidth;
      targetHeight = Math.round(targetWidth / aspectRatio);
    }
  } else if (isLandscape) {
    // Landscape: constrain width, scale height proportionally
    targetWidth = Math.min(originalWidth, maxWidth);
    targetHeight = Math.round(targetWidth / aspectRatio);

    // If height still exceeds max, constrain by height instead
    if (targetHeight > maxHeight) {
      targetHeight = maxHeight;
      targetWidth = Math.round(targetHeight * aspectRatio);
    }
  } else {
    // Square: constrain to smaller of the two max dimensions
    const maxDimension = Math.min(maxWidth, maxHeight);
    targetWidth = maxDimension;
    targetHeight = maxDimension;
  }

  return {
    width: Math.round(targetWidth),
    height: Math.round(targetHeight),
  };
}

/**
 * Gets image dimensions from a File
 */
async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 로드할 수 없습니다."));
    };

    img.src = url;
  });
}

/**
 * Optimizes a single image file
 *
 * Intelligently handles images of any aspect ratio:
 * - Portrait photos (3024x4032) → scaled to fit within maxHeight
 * - Landscape photos (4032x3024) → scaled to fit within maxWidth
 * - Square photos → scaled to fit within min(maxWidth, maxHeight)
 * - Maintains original aspect ratio perfectly
 *
 * @param file - The image file to optimize
 * @param config - Optimization configuration (uses DEFAULT_CONFIG if not provided)
 * @param validate - Whether to validate the file (default: true)
 * @returns Promise<File> - The optimized image file
 *
 * @example
 * ```typescript
 * // Using default settings
 * const optimized = await optimizeImage(file);
 *
 * // Using a preset (adaptive to any orientation)
 * const optimized = await optimizeImage(file, OPTIMIZATION_PRESETS.marker);
 * // Portrait 3024x4032 → ~900x1600px
 * // Landscape 4032x3024 → ~1600x900px
 *
 * // Using custom settings
 * const optimized = await optimizeImage(file, { maxWidth: 800, quality: 0.9 });
 * ```
 */
export async function optimizeImage(
  file: File,
  config: ImageOptimizationConfig = {},
  validate: boolean = true
): Promise<File> {
  // Validate if requested
  if (validate) {
    validateImageType(file);
    validateImageSize(file);
  }

  // Merge with default config
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    // Get original dimensions
    const { width: originalWidth, height: originalHeight } =
      await getImageDimensions(file);

    // Calculate optimal dimensions
    const { width, height } = calculateOptimalDimensions(
      originalWidth,
      originalHeight,
      finalConfig.maxWidth,
      finalConfig.maxHeight
    );

    // Optimize image
    const optimizedFile = await resizeImage(file, {
      width,
      height,
      quality: finalConfig.quality,
      format: finalConfig.format,
      resampling: finalConfig.resampling,
    });

    return optimizedFile;
  } catch (error) {
    if (error instanceof ImageValidationError) {
      throw error;
    }
    throw new Error(
      `이미지 최적화 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}

/**
 * Optimizes multiple images in parallel
 *
 * @param files - Array of image files to optimize
 * @param config - Optimization configuration
 * @param validate - Whether to validate files (default: true)
 * @returns Promise<File[]> - Array of optimized image files
 *
 * @example
 * ```typescript
 * const optimized = await optimizeImages(files, OPTIMIZATION_PRESETS.marker);
 * ```
 */
export async function optimizeImages(
  files: File[],
  config: ImageOptimizationConfig = {},
  validate: boolean = true
): Promise<File[]> {
  return Promise.all(files.map((file) => optimizeImage(file, config, validate)));
}

/**
 * Validates multiple image files
 */
export function validateImages(
  files: File[],
  maxFiles: number = 5,
  maxSizeMB: number = 30
): void {
  if (files.length > maxFiles) {
    throw new ImageValidationError(
      `최대 ${maxFiles}개까지 등록 가능합니다.`
    );
  }

  files.forEach((file) => {
    validateImageType(file);
    validateImageSize(file, maxSizeMB);
  });
}
