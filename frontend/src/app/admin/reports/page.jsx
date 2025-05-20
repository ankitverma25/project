'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReportsPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('http://localhost:8000/contact/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data);
    } catch (error) {
      toast.error('Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`http://localhost:8000/contact/update/${contactId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setContacts(contacts.map(contact => 
        contact._id === contactId ? { ...contact, status: newStatus } : contact
      ));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      'in-progress': 'text-blue-600',
      resolved: 'text-green-600'
    };
    return colors[status] || 'text-gray-600';
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Messages</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition hover:shadow-md ${
                  selectedContact?._id === contact._id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{contact.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {contact.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{contact.message}</p>
              </div>
            ))}
          </div>

          {/* Message Detail View */}
          {selectedContact && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Message Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedContact._id, 'pending')}
                      className={`px-4 py-2 rounded ${
                        selectedContact.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedContact._id, 'in-progress')}
                      className={`px-4 py-2 rounded ${
                        selectedContact.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedContact._id, 'resolved')}
                      className={`px-4 py-2 rounded ${
                        selectedContact.status === 'resolved'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      Resolved
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}