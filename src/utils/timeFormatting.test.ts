import { describe, it, expect } from 'vitest';
import {
  formatTime,
  formatTimeDecimal,
  formatTimeDetailed,
  parseTimeString,
  formatSeconds,
  getTotalMinutes,
} from './timeFormatting';

describe('timeFormatting', () => {
  describe('formatTime', () => {
    it('should format minutes less than 60 as minutes only', () => {
      expect(formatTime(0)).toBe('0m');
      expect(formatTime(30)).toBe('30m');
      expect(formatTime(59)).toBe('59m');
    });

    it('should format hours without minutes', () => {
      expect(formatTime(60)).toBe('1h');
      expect(formatTime(120)).toBe('2h');
      expect(formatTime(180)).toBe('3h');
    });

    it('should format hours with minutes', () => {
      expect(formatTime(90)).toBe('1h 30m');
      expect(formatTime(150)).toBe('2h 30m');
      expect(formatTime(125)).toBe('2h 5m');
    });

    it('should handle negative values', () => {
      expect(formatTime(-10)).toBe('0m');
      expect(formatTime(-100)).toBe('0m');
    });

    it('should handle large values', () => {
      expect(formatTime(1440)).toBe('24h');
      expect(formatTime(1500)).toBe('25h');
    });
  });

  describe('formatTimeDecimal', () => {
    it('should format minutes as decimal hours', () => {
      expect(formatTimeDecimal(0)).toBe('0.0h');
      expect(formatTimeDecimal(30)).toBe('0.5h');
      expect(formatTimeDecimal(60)).toBe('1.0h');
      expect(formatTimeDecimal(90)).toBe('1.5h');
      expect(formatTimeDecimal(150)).toBe('2.5h');
    });

    it('should respect decimal places parameter', () => {
      expect(formatTimeDecimal(90, 0)).toBe('2h');
      expect(formatTimeDecimal(90, 1)).toBe('1.5h');
      expect(formatTimeDecimal(90, 2)).toBe('1.50h');
      expect(formatTimeDecimal(90, 3)).toBe('1.500h');
    });

    it('should handle negative values', () => {
      expect(formatTimeDecimal(-10)).toBe('0h');
      expect(formatTimeDecimal(-100)).toBe('0h');
    });
  });

  describe('formatTimeDetailed', () => {
    it('should format minutes only', () => {
      expect(formatTimeDetailed(0)).toBe('0m');
      expect(formatTimeDetailed(30)).toBe('30m');
      expect(formatTimeDetailed(59)).toBe('59m');
    });

    it('should format hours only', () => {
      expect(formatTimeDetailed(60)).toBe('1h');
      expect(formatTimeDetailed(120)).toBe('2h');
    });

    it('should format hours with minutes', () => {
      expect(formatTimeDetailed(90)).toBe('1h 30m');
      expect(formatTimeDetailed(150)).toBe('2h 30m');
    });

    it('should format days with hours and minutes', () => {
      expect(formatTimeDetailed(1440)).toBe('1d');
      expect(formatTimeDetailed(1500)).toBe('1d 1h');
      expect(formatTimeDetailed(1530)).toBe('1d 1h 30m');
      expect(formatTimeDetailed(2880)).toBe('2d');
    });

    it('should handle negative values', () => {
      expect(formatTimeDetailed(-10)).toBe('0m');
    });
  });

  describe('parseTimeString', () => {
    it('should parse minutes only', () => {
      expect(parseTimeString('30m')).toBe(30);
      expect(parseTimeString('0m')).toBe(0);
      expect(parseTimeString('59m')).toBe(59);
    });

    it('should parse hours only', () => {
      expect(parseTimeString('1h')).toBe(60);
      expect(parseTimeString('2h')).toBe(120);
      expect(parseTimeString('24h')).toBe(1440);
    });

    it('should parse hours with minutes', () => {
      expect(parseTimeString('1h 30m')).toBe(90);
      expect(parseTimeString('2h 30m')).toBe(150);
      expect(parseTimeString('2h 5m')).toBe(125);
    });

    it('should parse decimal hours', () => {
      expect(parseTimeString('1.5h')).toBe(90);
      expect(parseTimeString('2.5h')).toBe(150);
      expect(parseTimeString('0.5h')).toBe(30);
    });

    it('should parse days with hours and minutes', () => {
      expect(parseTimeString('1d')).toBe(1440);
      expect(parseTimeString('1d 1h')).toBe(1500);
      expect(parseTimeString('1d 1h 30m')).toBe(1530);
      expect(parseTimeString('2d 2h 30m')).toBe(3150);
    });

    it('should handle case insensitive input', () => {
      expect(parseTimeString('1H 30M')).toBe(90);
      expect(parseTimeString('1D 2H')).toBe(1560);
    });

    it('should handle empty or invalid strings', () => {
      expect(parseTimeString('')).toBe(0);
      expect(parseTimeString('   ')).toBe(0);
      expect(parseTimeString('invalid')).toBe(0);
      expect(parseTimeString('abc123')).toBe(0);
    });

    it('should handle whitespace', () => {
      expect(parseTimeString(' 1h 30m ')).toBe(90);
      expect(parseTimeString('1h  30m')).toBe(90);
    });
  });

  describe('formatSeconds', () => {
    it('should format seconds to time string', () => {
      expect(formatSeconds(0)).toBe('0m');
      expect(formatSeconds(30)).toBe('0m');
      expect(formatSeconds(60)).toBe('1m');
      expect(formatSeconds(90)).toBe('1m');
      expect(formatSeconds(3600)).toBe('60m');
      expect(formatSeconds(5400)).toBe('90m');
    });
  });

  describe('getTotalMinutes', () => {
    it('should calculate total from array of time spent entries', () => {
      const timeSpent = [
        { timeSpent: 30 },
        { timeSpent: 60 },
        { timeSpent: 90 },
      ];
      expect(getTotalMinutes(timeSpent)).toBe(180);
    });

    it('should handle empty array', () => {
      expect(getTotalMinutes([])).toBe(0);
    });

    it('should handle null or undefined', () => {
      expect(getTotalMinutes(null as any)).toBe(0);
      expect(getTotalMinutes(undefined as any)).toBe(0);
    });

    it('should handle entries with zero or missing timeSpent', () => {
      const timeSpent = [
        { timeSpent: 30 },
        { timeSpent: 0 },
        { timeSpent: 60 },
        {} as any,
      ];
      expect(getTotalMinutes(timeSpent)).toBe(90);
    });

    it('should handle large arrays', () => {
      const timeSpent = Array(100).fill({ timeSpent: 10 });
      expect(getTotalMinutes(timeSpent)).toBe(1000);
    });
  });
});

