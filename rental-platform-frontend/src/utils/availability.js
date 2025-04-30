// utils/availability.js

import { utcMidnight } from './date.js';

export function parseIntervals(intervals) {
  return intervals.map(period => ({
    start: new Date(period.startDate),
    end: new Date(period.endDate) // end is exclusive
  }));
}

export function isDayCovered(day, intervals) {
  return intervals.some(interval => day >= interval.start && day < interval.end);
}

export function checkAvailability(availabilityPeriods, startDate, endDate) {
  const intervals = parseIntervals(availabilityPeriods);

  const startUTC = utcMidnight(startDate);
  const endUTC = utcMidnight(endDate);

  let current = new Date(startUTC);
  while (current <= endUTC) {
    if (!isDayCovered(current, intervals)) {
      return false;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return true;
}
