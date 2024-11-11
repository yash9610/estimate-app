// src/hooks/useEstimate.js
import { useState } from 'react';
import axios from 'axios';

export const useEstimate = () => {
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState(null);

  const fetchEstimate = async (platform) => {
    try {
      const response = await axios.get(`http://localhost:5000/estimate/${platform}`);
      setEstimate(response.data.price);
      setError(null);
    } catch (err) {
      setError('Failed to fetch estimate. Please try again.');
      setEstimate(null);
    }
  };

  return { estimate, error, fetchEstimate };
};
