// frontend/src/pages/AdminPage.js
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
    pricePerNight: 0,
    availability: []
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    try {
      const { data } = await axios.get(`${API_BASE.replace('/api','')}/admin/listings`);
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handlePeriodChange(field, date) {
    setForm(prev => ({
      ...prev,
      availability: prev.availability.map((p, idx) =>
        idx === field ? { ...p, [date === p.startDate ? 'startDate' : 'endDate']: date } : p
      )
    }));
  }

  async function saveListing() {
    try {
      const method = editingId ? 'put' : 'post';
      const url = editingId
        ? `${API_BASE.replace('/api','')}/admin/listings/${editingId}`
        : `${API_BASE.replace('/api','')}/admin/listings`;
      const res = await axios[method](url, form);
      fetchListings();
      setForm({ title: '', description: '', location: '', pricePerNight: 0, availability: [] });
      setEditingId(null);
    } catch (err) {
      console.error('Error saving listing:', err);
    }
  }

  function editListing(l) {
    setForm({ ...l });
    setEditingId(l._id);
  }

  async function deleteListing(id) {
    try {
      await axios.delete(`${API_BASE.replace('/api','')}/admin/listings/${id}`);
      setListings(listings.filter(l => l._id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  }

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      <section className="form-section">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
        <input
          name="pricePerNight"
          type="number"
          value={form.pricePerNight}
          onChange={handleChange}
          placeholder="Price per night"
        />
        <button onClick={saveListing}>
          {editingId ? 'Save Changes' : 'Create Listing'}
        </button>
      </section>
      <section className="list-section">
        {listings.length > 0 ? (
          <ul>
            {listings.map(l => (
              <li key={l._id}>
                <h3>{l.title}</h3>
                <p>{l.location} - {l.pricePerNight}€/night</p>
                <div className="button-row">
                  <button onClick={() => editListing(l)}>Edit</button>
                  <button onClick={() => deleteListing(l._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No listings</p>
        )}
      </section>
    </div>
  );
}
