// src/pages/AdminPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_BASE } from '../config';

export default function AdminPage() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: ''
  });
  const [period, setPeriod] = useState({
    startDate: null,
    endDate: null,
    quantity: 1
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    try {
      const { data } = await axios.get(`${API_BASE}/admin/listings`);
      setListings(data);
    } catch (err) {
      console.error(err);
      alert('Neizdevās ielādēt sludinājumus');
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handlePeriodChange(field, value) {
    setPeriod(prev => ({ ...prev, [field]: value }));
  }

  async function saveListing() {
    const { title, description, location, pricePerNight } = form;
    const { startDate, endDate, quantity } = period;
    if (
      !title ||
      !description ||
      !location ||
      !pricePerNight ||
      !startDate ||
      !endDate ||
      quantity < 1
    ) {
      alert('Aizpildiet visus laukus');
      return;
    }

    const payload = {
      title,
      description,
      location,
      pricePerNight: Number(pricePerNight),
      availability: [{ startDate, endDate, quantity }]
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/listings/${editingId}`, payload);
        alert('Sludinājums atjaunināts');
      } else {
        await axios.post(`${API_BASE}/admin/listings`, payload);
        alert('Sludinājums izveidots');
      }
      resetForm();
      fetchListings();
    } catch (err) {
      console.error(err);
      alert('Neizdevās saglabāt sludinājumu');
    }
  }

  function resetForm() {
    setForm({
      title: '',
      description: '',
      location: '',
      pricePerNight: ''
    });
    setPeriod({ startDate: null, endDate: null, quantity: 1 });
    setEditingId(null);
  }

  function editListing(listing) {
    setForm({
      title: listing.title,
      description: listing.description,
      location: listing.location,
      pricePerNight: String(listing.pricePerNight)
    });

    if (listing.availability?.length) {
      const p = listing.availability[0];
      setPeriod({
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate),
        quantity: p.quantity
      });
    }

    setEditingId(listing._id);
  }

  async function deleteListing(id) {
    if (!window.confirm('Dzēst šo sludinājumu?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/listings/${id}`);
      fetchListings();
    } catch (err) {
      console.error(err);
      alert('Neizdevās dzēst sludinājumu');
    }
  }

  async function deleteAll() {
    if (!window.confirm('Dzēst VISUS sludinājumus?')) return;
    try {
      await Promise.all(
        listings.map(l =>
          axios.delete(`${API_BASE}/admin/listings/${l._id}`)
        )
      );
      fetchListings();
    } catch (err) {
      console.error(err);
      alert('Neizdevās dzēst visus sludinājumus');
    }
  }

  return (
    <div className="container">
      <h1>Admin lapa</h1>

      <div className="button-row">
        <button onClick={deleteAll}>Dzēst visus</button>
      </div>

      <section>
        <h2>{editingId ? 'Rediģēt sludinājumu' : 'Pievienot sludinājumu'}</h2>

        <div className="field-row">
          <input
            name="title"
            placeholder="Nosaukums"
            value={form.title}
            onChange={handleFormChange}
          />
          <input
            name="description"
            placeholder="Apraksts"
            value={form.description}
            onChange={handleFormChange}
          />
          <input
            name="location"
            placeholder="Atrašanās vieta"
            value={form.location}
            onChange={handleFormChange}
          />
          <input
            type="number"
            name="pricePerNight"
            placeholder="Cena"
            value={form.pricePerNight}
            onChange={handleFormChange}
          />
        </div>

        <div className="field-row">
          <input
            type="number"
            min="1"
            value={period.quantity}
            onChange={e => handlePeriodChange('quantity', Number(e.target.value))}
            placeholder="Daudzums"
          />
          <DatePicker
            className="field-row-input"
            selected={period.startDate}
            onChange={date => handlePeriodChange('startDate', date)}
            placeholderText="Sākuma datums"
          />
          <DatePicker
            className="field-row-input"
            selected={period.endDate}
            onChange={date => handlePeriodChange('endDate', date)}
            placeholderText="Beigu datums"
          />
        </div>

        <div className="button-row">
          <button onClick={saveListing}>
            {editingId ? 'Saglabāt izmaiņas' : 'Saglabāt sludinājumu'}
          </button>
          {editingId && <button onClick={resetForm}>Atcelt</button>}
        </div>
      </section>

      <section>
        <h2>Esošie sludinājumi</h2>
        <ul className="listing-list">
          {listings.map(l => (
            <li key={l._id} className="listing-item">
              <h3>
                {l.title} – {l.location}
              </h3>
              <p>Cena: {l.pricePerNight}</p>
              {l.availability?.[0] && (
                <p>
                  Periods: {new Date(l.availability[0].startDate).toLocaleDateString()} –{' '}
                  {new Date(l.availability[0].endDate).toLocaleDateString()}, Daudzums:{' '}
                  {l.availability[0].quantity}
                </p>
              )}
              <div className="button-row">
                <button onClick={() => editListing(l)}>Rediģēt</button>
                <button onClick={() => deleteListing(l._id)}>Dzēst</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
