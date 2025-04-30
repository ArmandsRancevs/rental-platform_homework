// src/pages/BrowsePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toUTCISODate, formatDate } from '../utils/date.js';
import { API_BASE } from '../config';

export default function BrowsePage() {
  const [originalListings, setOriginalListings] = useState([]);
  const [listings, setListings] = useState([]);
  const [reservation, setReservation] = useState({ listing: '', user: '', startDate: null, endDate: null });

  useEffect(() => {
    fetchListings();
    fetchUser();
  }, []);

  async function fetchListings() {
    try {
      const res = await axios.get(`${API_BASE}/api/listings`);
      let data = res.data;
      // Unwrap Netlify Function envelope if needed
      if (data && data.body && typeof data.body === 'string') {
        data = JSON.parse(data.body);
      }
      setOriginalListings(data);
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    }
  }

  async function fetchUser() {
    try {
      const res = await axios.get(`${API_BASE}/api/user1`);
      let data = res.data;
      if (data && data.body && typeof data.body === 'string') {
        data = JSON.parse(data.body);
      }
      setReservation(prev => ({ ...prev, user: data._id }));
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }

  function canReserve(listing) {
    const { startDate, endDate, user } = reservation;
    if (!user || !startDate || !endDate) return false;
    let current = new Date(startDate);
    const last = new Date(endDate);
    while (current <= last) {
      const period = listing.availability.find(p => {
        const s = new Date(p.startDate);
        const e = new Date(p.endDate);
        return current >= s && current < e;
      });
      if (!period || period.quantity < 1) return false;
      current.setDate(current.getDate() + 1);
    }
    return true;
  }

  async function handleReservation(listingId) {
    const { startDate, endDate, user } = reservation;
    if (!user) await fetchUser();
    if (!startDate || !endDate) {
      alert('Lūdzu, izvēlieties sākuma un beigu datumu.');
      return;
    }
    try {
      const payload = {
        listing: listingId,
        user: reservation.user,
        startDate: toUTCISODate(startDate),
        endDate: toUTCISODate(endDate)
      };
      console.log('Reservation payload:', payload);
      await axios.post(`${API_BASE}/api/reservations`, payload);
      // Refresh listings so updated quantity is reflected
      await fetchListings();
      alert('Rezervācija veikta!');
    } catch (err) {
      console.error('Reservation error:', err);
      alert('Kļūda: ' + (err.response?.data?.message || err.message));
    }
  }

  function applyFilters() {
    const { startDate, endDate } = reservation;
    if (!startDate || !endDate) {
      setListings(originalListings);
    } else {
      setListings(originalListings.filter(listing => canReserve(listing)));
    }
  }

  return (
    <div className="container">
      <h1>Sludinājumu pārlūkošana</h1>
      <div className="date-picker-row">
        <label>Rezervācijas sākuma datums:</label>
        <DatePicker
          selected={reservation.startDate}
          onChange={date => setReservation(prev => ({ ...prev, startDate: date }))}
          selectsStart
          startDate={reservation.startDate}
          endDate={reservation.endDate}
          placeholderText="Sākuma datums"
          className="field-row-input"
        />
        <label>Rezervācijas beigu datums:</label>
        <DatePicker
          selected={reservation.endDate}
          onChange={date => setReservation(prev => ({ ...prev, endDate: date }))}
          selectsEnd
          startDate={reservation.startDate}
          endDate={reservation.endDate}
          minDate={reservation.startDate}
          placeholderText="Beigu datums"
          className="field-row-input"
        />
        <button type="button" onClick={applyFilters}>Piemērot filtrus</button>
      </div>

      {Array.isArray(listings) && listings.length > 0 ? (
        <ul>
          {listings.map(listing => (
            <li key={listing._id}>
              <h3>{listing.title} - {listing.location}</h3>
              <p>Cena par nakti: {listing.pricePerNight}</p>
              <p>Pieejamības periodi:</p>
              <ul>
                {Array.isArray(listing.availability) && listing.availability.map((period, idx) => (
                  <li key={idx}>
                    <span className="highlight">
                      {formatDate(new Date(period.startDate))} - {formatDate(new Date(period.endDate))}
                    </span>
                    <span> Daudzums: {period.quantity}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={!canReserve(listing)}
                onClick={() => handleReservation(listing._id)}
              >
                {canReserve(listing) ? 'Rezervēt' : 'Nav pieejams'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nav piedāvājumu</p>
      )}
    </div>
  );
}
