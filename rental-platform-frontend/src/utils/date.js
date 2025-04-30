// utils/date.js

export function toUTCISODate(date) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const utcDate = new Date(Date.UTC(y, m, d));
    return utcDate.toISOString();
  }
  
  export function utcMidnight(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }
  
  export function formatDate(date) {
    const d = String(date.getUTCDate()).padStart(2, '0');
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const y = date.getUTCFullYear();
    return `${d}.${m}.${y}`;
  }
  