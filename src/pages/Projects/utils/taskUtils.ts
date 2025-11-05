import type { FileAttachment } from "../../../store/types/Task/TaskTypes";

/**
 * Parse Firebase timestamp to Date object
 */
export const parseFirebaseTimestamp = (
  timestamp: string | { _seconds: number; _nanoseconds: number }
): Date => {
  if (typeof timestamp === "object" && timestamp._seconds) {
    return new Date(timestamp._seconds * 1000);
  }
  return new Date(timestamp as string);
};

/**
 * Check if attachment is an image
 */
export const isImageAttachment = (attachment: FileAttachment): boolean => {
  if (attachment.mimeType) {
    return attachment.mimeType.startsWith("image/");
  }
  // Fallback: check file extension
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];
  const fileName = attachment.fileName.toLowerCase();
  return imageExtensions.some((ext) => fileName.endsWith(ext));
};
