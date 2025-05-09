import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function DocumentVerification({ carId, document, type, onVerificationComplete }) {
    const [isVerifying, setIsVerifying] = useState(false);
    const [comments, setComments] = useState('');

    const handleVerification = async (status) => {
        try {
            setIsVerifying(true);
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:8000/admin/verify-document`,
                {
                    carId,
                    documentType: type,
                    status,
                    comments
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success(`Document ${status} successfully`);
            onVerificationComplete();
        } catch (err) {
            console.error('Error verifying document:', err);
            toast.error('Failed to verify document');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 capitalize">{type.replace(/_/g, ' ')}</h3>
            
            <div className="mb-4">
                <p className="text-sm text-gray-600">Status: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        document.status === 'verified' ? 'bg-green-100 text-green-800' :
                        document.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                        {document.status}
                    </span>
                </p>
                {document.comments && (
                    <p className="text-sm text-gray-600 mt-2">
                        Comments: {document.comments}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <a 
                        href={document.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        View Document
                    </a>
                </div>

                {document.status === 'pending' && (
                    <>
                        <textarea
                            className="w-full p-2 border rounded-md text-sm"
                            placeholder="Add verification comments..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={2}
                        />

                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleVerification('verified')}
                                disabled={isVerifying}
                                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                                Verify
                            </button>
                            <button
                                onClick={() => handleVerification('rejected')}
                                disabled={isVerifying}
                                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}