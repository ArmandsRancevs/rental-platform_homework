// frontend/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_BASE } from '../config';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: 0
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data } = await axios.get(`${ADMIN_BASE}/products`);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function saveProduct() {
    try {
      const method = editingId ? 'put' : 'post';
      const url = editingId
        ? `${ADMIN_BASE}/products/${editingId}`
        : `${ADMIN_BASE}/products`;
      await axios[method](url, form);
      fetchProducts();
      setForm({ title: '', description: '', location: '', pricePerNight: 0 });
      setEditingId(null);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  }

  function editProduct(p) {
    setForm({ title: p.title, description: p.description, location: p.location, pricePerNight: p.pricePerNight });
    setEditingId(p._id);
  }

  async function deleteProduct(id) {
    try {
      await axios.delete(`${ADMIN_BASE}/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  }

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      <section className="form-section">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <input
          name="pricePerNight"
          type="number"
          value={form.pricePerNight}
          onChange={handleChange}
          placeholder="Price"
        />
        <button onClick={saveProduct}>
          {editingId ? 'Save Changes' : 'Create Product'}
        </button>
      </section>
      <section className="list-section">
        {products.length > 0 ? (
          <ul>
            {products.map(p => (
              <li key={p._id}>
                <h3>{p.title}</h3>
                <p>{p.location} - {p.pricePerNight}</p>
                <div className="button-row">
                  <button onClick={() => editProduct(p)}>Edit</button>
                  <button onClick={() => deleteProduct(p._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products</p>
        )}
      </section>
    </div>
  );
}
