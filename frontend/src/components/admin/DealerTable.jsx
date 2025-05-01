import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DealerTable() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/user/allDealers')
      .then(res => setDealers(res.data))
      .catch(() => setError('Failed to load dealers'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading dealers...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {dealers.map(dealer => (
          <tr key={dealer._id}>
            <td className="px-6 py-4 whitespace-nowrap">{dealer.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{dealer.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">{dealer.businessName}</td>
            <td className="px-6 py-4 whitespace-nowrap">{dealer.isApproved ? 'Approved' : 'Pending'}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <a href={`/admin/manage-dealer/${dealer._id}`} className="text-blue-600 hover:underline mr-3">View</a>
              {!dealer.isApproved && <button className="text-green-600 hover:underline">Approve</button>}
              <button className="text-red-600 hover:underline ml-2">Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}