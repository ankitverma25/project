'use client'
import { Upload, Star, Calendar as CalendarIcon, Clock } from 'lucide-react'
import axios from 'axios';
import { useState, useRef } from 'react';

export default function NewRequestForm({ formik, ownerId }) {
  const [photos, setPhotos] = useState([]);
  const [rcBook, setRcBook] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiPrice, setAiPrice] = useState(null);
  const carModelInputRef = useRef();

  const getConditionString = (num) => {
    if (num >= 5) return 'excellent';
    if (num >= 3) return 'good';
    return 'poor';
  };

  const handleAIEstimate = (e) => {
    e.preventDefault();
    // Simple mock: base + year + condition
    let base = 50000;
    let year = parseInt(formik.values.year) || 2015;
    let age = new Date().getFullYear() - year;
    let cond = formik.values.condition;
    let condFactor = cond === 'excellent' ? 1 : cond === 'good' ? 0.8 : 0.5;
    let price = Math.max(10000, Math.round(base * condFactor - age * 2000));
    setAiPrice(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);
    try {
      // Validation: check required files
      if (!photos.length) throw new Error('At least one vehicle photo is required.');
      if (!rcBook) throw new Error('RC Book file is required.');
      // Prepare form data
      const formData = new FormData();
      formData.append('owner', ownerId || 'USER_ID_PLACEHOLDER');
      formData.append('model', formik.values.carModel);
      formData.append('year', formik.values.year);
      formData.append('description', formik.values.description);
      formData.append('fuelType', formik.values.fuelType);
      formData.append('condition', getConditionString(formik.values.condition));
      if (formik.values.mileage) formData.append('mileage', formik.values.mileage);
      // Photos
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }
      // RC Book
      formData.append('rcBook', rcBook);
      // Send to backend
      // Get token from localStorage
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/car/addCar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      setSuccess('Car details saved!');
      setPhotos([]);
      setRcBook(null);
      formik.resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save car');
    }
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Car Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">Car Model</label>
          <input
            ref={carModelInputRef}
            list="car-models"
            name="carModel"
            value={formik.values.carModel}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            placeholder="Type or select car model"
          />
          <datalist id="car-models">
            <option value="Maruti Swift Dzire" />
            <option value="Honda City" />
            <option value="Hyundai i20" />
            <option value="Tata Nexon" />
            <option value="Alto" />
            <option value="WagonR" />
            <option value="Baleno" />
            <option value="Ertiga" />
            <option value="Creta" />
            <option value="Other" />
          </datalist>
          {formik.touched.carModel && formik.errors.carModel && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.carModel}</div>
          )}
        </div>
        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">Manufacturing Year</label>
          <input
            type="range"
            name="year"
            min="1980"
            max="2025"
            value={formik.values.year}
            onChange={formik.handleChange}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
            <span>1980</span>
            <span>{formik.values.year}</span>
            <span>2025</span>
          </div>
        </div>
      </div>
      {/* Vehicle Condition */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-2">Vehicle Condition</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input type="radio" name="condition" value="excellent" checked={formik.values.condition === 'excellent'} onChange={formik.handleChange} />
            <span className="ml-2">Excellent</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="condition" value="good" checked={formik.values.condition === 'good'} onChange={formik.handleChange} />
            <span className="ml-2">Good</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="condition" value="poor" checked={formik.values.condition === 'poor'} onChange={formik.handleChange} />
            <span className="ml-2">Poor</span>
          </label>
        </div>
        {formik.touched.condition && formik.errors.condition && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.condition}</div>
        )}
      </div>
      {/* Photo Upload */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-2">Vehicle Photos:</label>
        <input type="file" multiple accept="image/*" onChange={e => setPhotos([...e.target.files])} />
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.from(photos).map((file, idx) => (
              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{file.name}</span>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm sm:text-base font-medium mb-2">RC Book (PDF/Image):</label>
        <input type="file" accept="image/*,application/pdf" onChange={e => setRcBook(e.target.files[0])} />
        {rcBook && <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">{rcBook.name}</span>}
      </div>
      {/* Description */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-2">Description</label>
        <textarea name="description" value={formik.values.description} onChange={formik.handleChange} className="w-full p-2.5 border rounded-lg" />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
        )}
      </div>
      {/* Fuel Type */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-2">Fuel Type</label>
        <select name="fuelType" value={formik.values.fuelType} onChange={formik.handleChange} className="w-full p-2.5 border rounded-lg">
          <option value="">Select Fuel Type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="cng">CNG</option>
        </select>
        {formik.touched.fuelType && formik.errors.fuelType && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.fuelType}</div>
        )}
      </div>
      {/* Mileage */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-2">Mileage (km)</label>
        <input type="number" name="mileage" value={formik.values.mileage || ''} onChange={formik.handleChange} className="w-full p-2.5 border rounded-lg" />
        {formik.touched.mileage && formik.errors.mileage && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.mileage}</div>
        )}
      </div>
      {/* Pickup Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">Pickup Address</label>
          <textarea
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="3"
            className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
          {formik.touched.address && formik.errors.address && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.address}</div>
          )}
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">Pickup Date</label>
            <div className="relative">
              <input
                type="date"
                name="pickupDate"
                value={formik.values.pickupDate}
                onChange={formik.handleChange}
                className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
              {/* <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> */}
            </div>
            {formik.touched.pickupDate && formik.errors.pickupDate && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.pickupDate}</div>
            )}
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">Time Slot</label>
            <div className="relative">
              <select
                name="timeSlot"
                value={formik.values.timeSlot}
                onChange={formik.handleChange}
                className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base appearance-none"
              >
                <option value="">Select Time Slot</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                <option value="evening">Evening (3 PM - 6 PM)</option>
              </select>
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            {formik.touched.timeSlot && formik.errors.timeSlot && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.timeSlot}</div>
            )}
          </div>
        </div>
      </div>
      {/* Form Actions */}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      {aiPrice && (
        <div className="text-blue-600 text-sm font-semibold">Estimated AI Price: ₹{aiPrice}</div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
        <button
          type="button"
          className="w-full sm:w-auto px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base font-semibold"
          onClick={handleAIEstimate}
          disabled={uploading}
        >
          Get AI Valuation
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          disabled={uploading}
        >
          {uploading ? 'Saving...' : 'Submit Request'}
        </button>
      </div>
    </form>
  )
}