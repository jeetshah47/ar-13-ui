import { describe, it, expect } from 'vitest';
import { isAdminAccessError, extractErrorMessage } from './errorUtils';

describe('errorUtils', () => {
  describe('isAdminAccessError', () => {
    it('should return true for admin access error messages', () => {
      expect(isAdminAccessError('Admin access required')).toBe(true);
      expect(isAdminAccessError('admin access required')).toBe(true);
      expect(isAdminAccessError('ADMIN ACCESS REQUIRED')).toBe(true);
      expect(isAdminAccessError('You need admin access required to perform this action')).toBe(true);
    });

    it('should return false for non-admin error messages', () => {
      expect(isAdminAccessError('Invalid credentials')).toBe(false);
      expect(isAdminAccessError('User not found')).toBe(false);
      expect(isAdminAccessError('Permission denied')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isAdminAccessError(null)).toBe(false);
      expect(isAdminAccessError(undefined)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isAdminAccessError('')).toBe(false);
    });
  });

  describe('extractErrorMessage', () => {
    it('should extract message from string error', () => {
      expect(extractErrorMessage('Simple error message')).toBe('Simple error message');
      expect(extractErrorMessage('Another error')).toBe('Another error');
    });

    it('should extract message from Error object', () => {
      const error = new Error('Error message');
      expect(extractErrorMessage(error)).toBe('Error message');
    });

    it('should extract message from axios error response', () => {
      const axiosError = {
        response: {
          data: {
            message: 'API error message',
          },
        },
      };
      expect(extractErrorMessage(axiosError)).toBe('API error message');
    });

    it('should extract error field from axios error response if message not available', () => {
      const axiosError = {
        response: {
          data: {
            error: 'API error',
          },
        },
      };
      expect(extractErrorMessage(axiosError)).toBe('API error');
    });

    it('should return "Unknown error" for axios error without message or error', () => {
      const axiosError = {
        response: {
          data: {},
        },
      };
      expect(extractErrorMessage(axiosError)).toBe('Unknown error');
    });

    it('should return "Unknown error" for unknown error types', () => {
      expect(extractErrorMessage({})).toBe('Unknown error');
      expect(extractErrorMessage(123)).toBe('Unknown error');
      expect(extractErrorMessage(null)).toBe('Unknown error');
      expect(extractErrorMessage(undefined)).toBe('Unknown error');
    });

    it('should prioritize message over error in axios response', () => {
      const axiosError = {
        response: {
          data: {
            message: 'Priority message',
            error: 'Secondary error',
          },
        },
      };
      expect(extractErrorMessage(axiosError)).toBe('Priority message');
    });
  });
});

