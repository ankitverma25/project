'use client'
import { Upload, Star, Calendar as CalendarIcon, Clock } from 'lucide-react'

export default function NewRequestForm({ formik }) {
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        onClick={() => formik.setFieldValue('condition', star)}
        className="focus:outline-none"
      >
        {star <= formik.values.condition ? (
          <Star className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-current" />
        ) : (
          <Star className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
        )}
      </button>
    ))
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Car Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">
            Car Model
          </label>
          <select
            name="carModel"
            value={formik.values.carModel}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          >
            <option value="">Select Car Model</option>
            <option value="swift-dzire">Maruti Swift Dzire</option>
            <option value="honda-city">Honda City</option>
          </select>
          {formik.touched.carModel && formik.errors.carModel && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.carModel}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">
            Manufacturing Year
          </label>
          <input
            type="range"
            name="year"
            min="2000"
            max="2024"
            value={formik.values.year}
            onChange={formik.handleChange}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
            <span>2000</span>
            <span>{formik.values.year}</span>
            <span>2024</span>
          </div>
        </div>
      </div>

      {/* Vehicle Condition */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-2">
          Vehicle Condition
        </label>
        <div className="flex justify-center md:justify-start space-x-1">
          {renderStars()}
        </div>
        {formik.touched.condition && formik.errors.condition && (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.condition}
          </div>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm sm:text-base font-medium mb-2">
          Vehicle Photos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <Upload className="mx-auto text-gray-400 w-8 h-8 sm:w-10 sm:h-10" />
          <p className="text-sm text-gray-500 mt-2">
            Drag and drop photos or{' '}
            <span className="text-blue-600 cursor-pointer">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Maximum 5 photos (JPG, PNG) up to 5MB each
          </p>
        </div>
      </div>

      {/* Pickup Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">
            Pickup Address
          </label>
          <textarea
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="3"
            className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
          {formik.touched.address && formik.errors.address && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.address}
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Pickup Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="pickupDate"
                value={formik.values.pickupDate}
                onChange={formik.handleChange}
                className="w-full p-2.5 sm:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            {formik.touched.pickupDate && formik.errors.pickupDate && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.pickupDate}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Time Slot
            </label>
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
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.timeSlot}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
        <button
          type="button"
          className="w-full sm:w-auto px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
        >
          Save Draft
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
        >
          Submit Request
        </button>
      </div>
    </form>
  )
}