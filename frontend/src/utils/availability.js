// frontend/src/utils/availability.js
/**
 * Checks if a listing has available quantity for each day in the given date range.
 * @param {Object} listing - The listing object with an availability array.
 * @param {Date} startDate - The desired start date.
 * @param {Date} endDate - The desired end date.
 * @returns {boolean} True if available, false otherwise.
 */
export function isAvailable(listing, startDate, endDate) {
  let current = new Date(startDate);
  const last = new Date(endDate);

  while (current <= last) {
    const period = Array.isArray(listing.availability)
      ? listing.availability.find(p => {
          const s = new Date(p.startDate);
          const e = new Date(p.endDate);
          return current >= s && current <= e;
        })
      : null;
    if (!period || period.quantity < 1) return false;
    current.setDate(current.getDate() + 1);
  }
  return true;
}
