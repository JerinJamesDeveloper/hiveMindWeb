import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a user-friendly error message from an API error.
 */
export function getErrorMessage(error: any): string {
  if (error.response) {
    // The request was made and the server responded with a status code
    if (error.response.status === 401) {
      return 'Invalid email or password. Please try again.';
    }
    if (error.response.status === 409) {
      return 'An account with this email already exists.';
    }
    if (error.response.data?.message) {
      return error.response.data.message;
    }
    if (error.response.data?.error) {
      return error.response.data.error;
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your connection.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}
