'use client'
import { X } from 'lucide-react';

export default function CarDetailsModal({ car, onClose }) {
  if (!car) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {car.model} ({car.year})
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Photo Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {car.photos && car.photos.length > 0 ? (
              car.photos.map((photo, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={photo}
                    alt={`${car.model} photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img
                  src="/car-placeholder.jpg"
                  alt={car.model}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">{car.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{car.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium">{car.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium">{car.fuelType}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Performance</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-medium">{car.mileage ? `${car.mileage} km` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Serviced</p>
                    <p className="font-medium">{car.lastServiced || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{car.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pincode</p>
                    <p className="font-medium">{car.pincode || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Additional Details</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium whitespace-pre-wrap">{car.description || 'No description available.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
