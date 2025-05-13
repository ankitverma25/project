'use client'
import { useState } from 'react'
import { Upload, File, FileText, Trash2, Download } from 'lucide-react'

export default function DealerDocumentsPage() {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Business License.pdf', type: 'PDF', size: '2.5 MB', date: '2024-03-15' },
    { id: 2, name: 'Tax Certificate.pdf', type: 'PDF', size: '1.8 MB', date: '2024-03-14' },
    { id: 3, name: 'Insurance Document.pdf', type: 'PDF', size: '3.2 MB', date: '2024-03-13' }
  ])

  const handleUpload = () => {
    // TODO: Implement file upload functionality
  }

  const handleDelete = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Documents</h1>
        <button
          onClick={handleUpload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Upload size={20} />
          Upload Document
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={24} />
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{doc.date}</span>
                  <div className="flex gap-2">
                    <button 
                      className="p-1 hover:text-blue-600"
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-1 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
