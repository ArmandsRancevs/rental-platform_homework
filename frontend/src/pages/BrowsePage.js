// frontend/src/pages/BrowsePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

export default function BrowsePage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchUser();
  }, []);

  async function fetchProducts() {
    try {
      const { data } = await axios.get(`${API_BASE}/products`);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${API_BASE}/user1`);
      setUser(data._id);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }

  async function handleReservation(productId) {
    try {
      await axios.post(`${API_BASE}/reservations`, {
        listing: productId,
        user
      });
      alert('Reservation successful!');
    } catch (err) {
      console.error('Error making reservation:', err);
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  }

  return (
    <div className="container">
      <h1>Browse Products</h1>
      {products.length > 0 ? (
        <ul>
          {products.map(product => (
            <li key={product._id}>
              <h3>{product.title} – {product.location}</h3>
              <p>Price: {product.pricePerNight}</p>
              <button onClick={() => handleReservation(product._id)}>
                Reserve
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}
