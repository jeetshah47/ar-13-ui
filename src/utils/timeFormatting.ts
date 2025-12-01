/**
 * Utility functions for formatting time consistently across the application
 */

/**
 * Format minutes to a human-readable string (e.g., "2h 30m" or "45m")
 * @param minutes - Time in minutes
 * @returns Formatted time string
 */
export function formatTime(minutes: number): string {
  if (minutes < 0) {
    return "0m";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}

/**
 * Format minutes to decimal hours (e.g., "2.5h")
 * @param minutes - Time in minutes
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted time string
 */
export function formatTimeDecimal(minutes: number, decimals: number = 1): string {
  if (minutes < 0) {
    return "0h";
  }

  const hours = minutes / 60;
  return `${hours.toFixed(decimals)}h`;
}

/**
 * Format minutes to detailed string with days if needed (e.g., "1d 2h 30m")
 * @param minutes - Time in minutes
 * @returns Formatted time string
 */
export function formatTimeDetailed(minutes: number): string {
  if (minutes < 0) {
    return "0m";
  }

  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = minutes % 60;

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (mins > 0 || parts.length === 0) {
    parts.push(`${mins}m`);
  }

  return parts.join(" ");
}

/**
 * Parse a time string back to minutes
 * Supports formats like "2h 30m", "2.5h", "45m", "1d 2h 30m"
 * @param timeString - Time string to parse
 * @returns Time in minutes, or 0 if parsing fails
 */
export function parseTimeString(timeString: string): number {
  if (!timeString || timeString.trim() === "") {
    return 0;
  }

  let totalMinutes = 0;
  const str = timeString.toLowerCase().trim();

  // Match patterns like "2h 30m", "1d 2h 30m", etc.
  const patterns = [
    { regex: /(\d+)d/i, multiplier: 24 * 60 },
    { regex: /(\d+)h/i, multiplier: 60 },
    { regex: /(\d+)m/i, multiplier: 1 },
  ];

  for (const pattern of patterns) {
    const match = str.match(pattern.regex);
    if (match) {
      const value = parseInt(match[1], 10);
      totalMinutes += value * pattern.multiplier;
    }
  }

  // Also handle decimal hours like "2.5h"
  const decimalHourMatch = str.match(/(\d+\.?\d*)h/i);
  if (decimalHourMatch && !str.match(/\d+m/i)) {
    // Only use decimal format if there are no minutes specified
    const hours = parseFloat(decimalHourMatch[1]);
    totalMinutes = Math.round(hours * 60);
  }

  return totalMinutes;
}

/**
 * Format seconds to time string (for real-time display)
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return formatTime(minutes);
}

/**
 * Get total minutes from an array of TimeSpent entries
 * @param timeSpent - Array of time spent entries
 * @returns Total minutes
 */
export function getTotalMinutes(timeSpent: Array<{ timeSpent: number }>): number {
  if (!timeSpent || timeSpent.length === 0) {
    return 0;
  }
  return timeSpent.reduce((total, entry) => total + (entry.timeSpent || 0), 0);
}

