import path from "path"

export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./uploads")
export const MAX_UPLOAD_BYTES =
  Number(process.env.MAX_UPLOAD_MB || 50) * 1024 * 1024

/** Resolve a stored file name inside UPLOAD_DIR, rejecting traversal */
export function storedPath(storedName: string) {
  if (!/^[a-z0-9]+(\.[a-z0-9]{1,10})?$/i.test(storedName)) return null
  return path.join(UPLOAD_DIR, storedName)
}

// Types the browser may render inline; everything else is downloaded
export const INLINE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "text/plain",
])
