'use client'
import { Upload, Star, AlertCircle } from 'lucide-react'
import axios from 'axios';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function NewRequestForm({ formik, ownerId }) {
  const [photos, setPhotos] = useState([]);
  const [rcBook, setRcBook] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [aiPrice, setAiPrice] = useState(null);
  const carModelInputRef = useRef();

  const getConditionString = (num) => {
    if (num >= 5) return 'excellent';
    if (num >= 3) return 'good';
    return 'poor';
  };

  const handleAIEstimate = (e) => {
    e.preventDefault();
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
    setUploading(true);
    try {
      if (!photos.length) throw new Error('At least one vehicle photo is required.');
      if (!rcBook) throw new Error('RC Book file is required.');
      
      const formData = new FormData();
      formData.append('owner', ownerId || 'USER_ID_PLACEHOLDER');
      formData.append('model', formik.values.carModel);
      formData.append('year', formik.values.year);
      formData.append('description', formik.values.description);
      formData.append('fuelType', formik.values.fuelType);
      formData.append('condition', getConditionString(formik.values.condition));
      if (formik.values.mileage) formData.append('mileage', formik.values.mileage);
      formData.append('vehicleNumber', formik.values.vehicleNumber);
      formData.append('address[state]', formik.values.state);
      formData.append('address[city]', formik.values.city);
      formData.append('address[pincode]', formik.values.pincode);
      
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }
      formData.append('rcBook', rcBook);
      
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/car/addCar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });

      toast.success('Car details saved successfully!');
      setPhotos([]);
      setRcBook(null);
      formik.resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save car details');
    }
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Car Model <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={carModelInputRef}
              list="car-models"
              name="carModel"
              value={formik.values.carModel || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          </div>
          {formik.touched.carModel && formik.errors.carModel && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.carModel}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manufacturing Year <span className="text-red-500">*</span>
          </label>
          <div>
            <input
              type="range"
              name="year"
              min="1980"
              max="2025"
              value={formik.values.year || new Date().getFullYear()}
              onChange={formik.handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>1980</span>
              <span className="font-medium text-blue-600">{formik.values.year}</span>
              <span>2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="vehicleNumber"
            value={formik.values.vehicleNumber || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. DL8CAF1234"
          />
          {formik.touched.vehicleNumber && formik.errors.vehicleNumber && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.vehicleNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type <span className="text-red-500">*</span>
          </label>
          <select
            name="fuelType"
            value={formik.values.fuelType || ''}
            onChange={formik.handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select Fuel Type</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="cng">CNG</option>
          </select>
          {formik.touched.fuelType && formik.errors.fuelType && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.fuelType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mileage (km)
          </label>
          <input
            type="number"
            name="mileage"
            value={formik.values.mileage || ''}
            onChange={formik.handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter vehicle mileage"
          />
          {formik.touched.mileage && formik.errors.mileage && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.mileage}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Condition <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          {['excellent', 'good', 'poor'].map((condition) => (
            <label key={condition} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="condition"
                value={condition}
                checked={formik.values.condition === condition}
                onChange={formik.handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">{condition}</span>
            </label>
          ))}
        </div>
        {formik.touched.condition && formik.errors.condition && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.condition}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formik.values.state || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter state"
          />
          {formik.touched.state && formik.errors.state && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formik.values.city || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter city"
          />
          {formik.touched.city && formik.errors.city && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pincode"
            value={formik.values.pincode || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter pincode"
          />
          {formik.touched.pincode && formik.errors.pincode && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.pincode}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Photos <span className="text-red-500">*</span>
          </label>
          <div className={`mt-1 border-2 border-dashed rounded-lg p-4 sm:p-6 transition-colors duration-200 ${photos.length ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}>
            <div className="text-center">
              <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <div className="mt-2">
                <label className="cursor-pointer inline-block">
                  <span className="mt-2 block text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    Upload vehicle photos
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => setPhotos([...e.target.files])}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from(photos).map((file, idx) => (
                <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                  {file.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RC Book <span className="text-red-500">*</span>
          </label>
          <div className={`mt-1 border-2 border-dashed rounded-lg p-4 sm:p-6 transition-colors duration-200 ${rcBook ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}>
            <div className="text-center">
              <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <div className="mt-2">
                <label className="cursor-pointer inline-block">
                  <span className="mt-2 block text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    Upload RC Book
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => setRcBook(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PDF or Image files</p>
              </div>
            </div>
          </div>
          {rcBook && (
            <div className="mt-2">
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                {rcBook.name}
              </span>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formik.values.description || ''}
          onChange={formik.handleChange}
          rows="4"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your vehicle's condition, features, and any other relevant details..."
        />
        {formik.touched.description && formik.errors.description && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
        )}
      </div>

      {aiPrice && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-600" />
            <p className="text-blue-800 font-semibold">
              Estimated Value: ₹{aiPrice.toLocaleString('en-IN')}
            </p>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            This is an AI-generated estimate based on your vehicle details
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
        <button
          type="button"
          onClick={handleAIEstimate}
          disabled={uploading}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-blue-600 text-blue-600 rounded-lg 
                   hover:bg-blue-50 active:bg-blue-100 transition-colors font-medium focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Get AI Valuation
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium focus:outline-none 
                   focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Upload className="animate-spin h-5 w-5" />
              Uploading...
            </span>
          ) : (
            'Submit Request'
          )}
        </button>
      </div>
    </form>
  );
}