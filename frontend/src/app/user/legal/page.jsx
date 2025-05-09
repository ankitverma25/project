'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BsCheckCircleFill, BsXCircleFill, BsClockFill, BsUpload } from 'react-icons/bs';

export default function LegalDocuments() {
    const [documents, setDocuments] = useState({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentCar, setCurrentCar] = useState(null);
    const [userCars, setUserCars] = useState([]);

    useEffect(() => {
        fetchUserCars();
    }, []);

    useEffect(() => {
        if (currentCar) {
            fetchDocuments();
        }
    }, [currentCar]);

    const fetchUserCars = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/user/cars', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserCars(response.data);
            if (response.data.length > 0) {
                setCurrentCar(response.data[0]._id);
            }
        } catch (err) {
            console.error('Error fetching cars:', err);
            toast.error('Failed to fetch your cars');
        }
    };

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8000/user/car/${currentCar}/documents`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDocuments(response.data.documents || {});
        } catch (err) {
            console.error('Error fetching documents:', err);
            toast.error('Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, docType) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile({ file, type: docType });
        }
    };

    const uploadDocument = async () => {
        if (!selectedFile) return;

        try {
            setUploading(selectedFile.type);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('document', selectedFile.file);
            formData.append('documentType', selectedFile.type);

            await axios.post(
                `http://localhost:8000/user/car/${currentCar}/upload-document`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success('Document uploaded successfully');
            setSelectedFile(null);
            fetchDocuments();
        } catch (err) {
            console.error('Error uploading document:', err);
            toast.error('Failed to upload document');
        } finally {
            setUploading('');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified':
                return <BsCheckCircleFill className="text-green-500 text-xl" />;
            case 'rejected':
                return <BsXCircleFill className="text-red-500 text-xl" />;
            default:
                return <BsClockFill className="text-yellow-500 text-xl" />;
        }
    };

    const documentTypes = [
        { id: 'rc', name: 'RC Book', required: true },
        { id: 'insurance', name: 'Insurance', required: true },
        { id: 'pollution', name: 'Pollution Certificate', required: true },
        { id: 'fitness', name: 'Fitness Certificate', required: false }
    ];

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Legal Documents</h1>
            
            {userCars.length > 1 && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Select Car</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={currentCar}
                        onChange={(e) => setCurrentCar(e.target.value)}
                    >
                        {userCars.map(car => (
                            <option key={car._id} value={car._id}>
                                {car.model} - {car.vehicleNumber}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="space-y-6">
                {documentTypes.map((docType) => {
                    const doc = documents[docType.id];
                    return (
                        <div key={docType.id} className="border rounded-lg p-6 bg-white shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {docType.name}
                                        {docType.required && <span className="text-red-500 ml-1">*</span>}
                                    </h3>
                                    {doc && (
                                        <p className="text-sm text-gray-600 flex items-center mt-1">
                                            {getStatusIcon(doc.status)}
                                            <span className="ml-2 capitalize">{doc.status}</span>
                                        </p>
                                    )}
                                </div>
                                {doc?.url && (
                                    <a 
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        View Document
                                    </a>
                                )}
                            </div>

                            {doc?.notes && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-600">{doc.notes}</p>
                                </div>
                            )}

                            <div className="flex items-center space-x-4">
                                <input
                                    type="file"
                                    id={`file-${docType.id}`}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(e, docType.id)}
                                />
                                <label
                                    htmlFor={`file-${docType.id}`}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center"
                                >
                                    <BsUpload className="mr-2" />
                                    {doc ? 'Update Document' : 'Upload Document'}
                                </label>
                                {selectedFile?.type === docType.id && (
                                    <>
                                        <span className="text-sm text-gray-600">
                                            {selectedFile.file.name}
                                        </span>
                                        <button
                                            onClick={uploadDocument}
                                            disabled={uploading === docType.id}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {uploading === docType.id ? 'Uploading...' : 'Confirm Upload'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}