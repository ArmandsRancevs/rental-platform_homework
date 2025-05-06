// frontend/src/pages/BrowsePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toUTCISODate, formatDate } from '../utils/date.js';
import { API_BASE } from '../config';

export default function BrowsePage() {
  const [originalListings, setOriginalListings] = useState([]);
  const [listings, setListings] = useState([]);
  const [reservation, setReservation] = useState({
    startDate: null,
    endDate: null,
    user: ''
  });

  useEffect(() => {
    fetchListings();
    fetchUser();
  }, []);

  async function fetchListings() {
    try {
      const { data } = await axios.get(`${API_BASE}/listings`);
      setOriginalListings(data);
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${API_BASE}/user1`);
      setReservation(prev => ({ ...prev, user: data._id }));
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }

  function canReserve(listing) {
    const { startDate, endDate } = reservation;
    if (!reservation.user || !startDate || !endDate) return false;
    let current = new Date(startDate);
    const last = new Date(endDate);

    while (current <= last) {
      const period = listing.availability.find(p => {
        const s = new Date(p.startDate);
        const e = new Date(p.endDate);
        return current >= s && current <= e;
      });
      if (!period || period.quantity < 1) return false;
      current.setDate(current.getDate() + 1);
    }
    return true;
  }

  async function handleReservation(listingId) {
    const { startDate, endDate, user } = reservation;
    if (!startDate || !endDate) {
      alert('Please select start and end dates.');
      return;
    }
    try {
      await axios.post(`${API_BASE}/reservations`, {
        listing: listingId,
        user,
        startDate: toUTCISODate(startDate),
        endDate: toUTCISODate(endDate)
      });
      fetchListings();
      alert('Reservation successful!');
    } catch (err) {
      console.error('Error making reservation:', err);
      alert('Error: ' + err.response?.data?.message || err.message);
    }
  }

  function applyFilters() {
    const { startDate, endDate } = reservation;
    if (!startDate || !endDate) {
      setListings(originalListings);
      return;
    }
    setListings(originalListings.filter(canReserve));
  }

  return (
    <div className="container">
      <h1>Browse Listings</h1>
      <div className="date-picker-row">
        <label>From:</label>
        <DatePicker
          selected={reservation.startDate}
          onChange={date => setReservation(prev => ({ ...prev, startDate: date }))}
          selectsStart
          startDate={reservation.startDate}
          endDate={reservation.endDate}
          placeholderText="Start date"
          className="field-row-input"
        />
        <label>To:</label>
        <DatePicker
          selected={reservation.endDate}
          onChange={date => setReservation(prev => ({ ...prev, endDate: date }))}
          selectsEnd
          startDate={reservation.startDate}
          endDate={reservation.endDate}
          minDate={reservation.startDate}
          placeholderText="End date"
          className="field-row-input"
        />
        <button type="button" onClick={applyFilters}>Apply Filters</button>
      </div>
      {listings.length > 0 ? (
        <ul>
          {listings.map(listing => (
            <li key={listing._id}>
              <h3>{listing.title} - {listing.location}</h3>
              <p>Price per night: {listing.pricePerNight}</p>
              <ul>
                {listing.availability.map((p, i) => (
                  <li key={i}>
                    {formatDate(new Date(p.startDate))} to {formatDate(new Date(p.endDate))} (
                    {p.quantity} available)
                  </li>
                ))}
              </ul>
              <button disabled={!canReserve(listing)} onClick={() => handleReservation(listing._id)}>
                {canReserve(listing) ? 'Reserve' : 'Unavailable'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No listings available</p>
      )}
    </div>
);
}
