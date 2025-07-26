/**
 * Format utilities for common text formatting operations
 */

/**
 * Formats a timestamp into a human-readable "time ago" string
 * @param timestamp - The timestamp to format (in milliseconds)
 * @param currentTime - The current time (in milliseconds)
 * @returns A formatted string like "2m 30s ago" or "Just now"
 *
 * @example
 * const timeAgo = formatTimeAgo(Date.now() - 90000, Date.now()); // "1m 30s ago"
 * const justNow = formatTimeAgo(Date.now() - 2000, Date.now()); // "Just now"
 */
export const formatTimeAgo = (
  timestamp: number,
  currentTime: number
): string => {
  const diff = currentTime - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor(diff / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s ago`;
  } else if (seconds > 5) {
    return `${seconds}s ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Truncates text to a maximum length and adds ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - The maximum length before truncation
 * @returns The truncated text with ellipsis if needed
 *
 * @example
 * const short = formatTextMaxEllipsis("Hello World", 20); // "Hello World"
 * const long = formatTextMaxEllipsis("This is a very long text that needs truncation", 20); // "This is a very long..."
 */
export const formatTextMaxEllipsis = (
  text: string,
  maxLength: number
): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
};

/**
 * Converts seconds to a human-readable time format (hours and minutes only)
 * @param seconds - The number of seconds to format
 * @returns A formatted string like "2h30m", "45m", or "0m"
 *
 * @example
 * const hours = formatTicksToReadableTime(9000); // "2h30m"
 * const minutes = formatTicksToReadableTime(2700); // "45m"
 * const short = formatTicksToReadableTime(30); // "0m"
 */
export const formatTicksToReadableTime = (seconds: number): string => {
  if (!seconds || seconds <= 0) {
    return '0m';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h${minutes}m`;
    } else {
      return `${hours}h`;
    }
  } else {
    return `${minutes}m`;
  }
};
