'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DocumentVerification from '@/components/admin/DocumentVerification';

export default function AdminDocumentVerification() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, verified, rejected

    useEffect(() => {
        fetchCars();
    }, [filter]);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8000/admin/cars-documents?status=${filter}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setCars(response.data);
        } catch (err) {
            console.error('Error fetching cars:', err);
            toast.error('Failed to fetch cars');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Document Verification</h1>

            <div className="mb-6 flex space-x-4">
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-md ${
                        filter === 'pending'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter('verified')}
                    className={`px-4 py-2 rounded-md ${
                        filter === 'verified'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    Verified
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`px-4 py-2 rounded-md ${
                        filter === 'rejected'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    Rejected
                </button>
            </div>

            {cars.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    No cars found with {filter} documents
                </div>
            ) : (
                <div className="space-y-8">
                    {cars.map((car) => (
                        <div key={car._id} className="border rounded-lg p-6 bg-white shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold">
                                    {car.model} - {car.vehicleNumber}
                                </h2>
                                <p className="text-gray-600">
                                    Owner: {car.owner.name} ({car.owner.email})
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(car.documents).map(([type, doc]) => (
                                    <DocumentVerification
                                        key={type}
                                        carId={car._id}
                                        document={doc}
                                        type={type}
                                        onVerificationComplete={fetchCars}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}