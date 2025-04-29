// components/dealer/CreateBidModal.js
'use client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { X } from 'lucide-react'

export default function CreateBidModal({ onClose }) {
  const formik = useFormik({
    initialValues: {
      vehicle: '',
      amount: '',
      validity: 7,
      notes: ''
    },
    validationSchema: Yup.object({
      vehicle: Yup.string().required('Required'),
      amount: Yup.number().required('Required').min(1000),
      validity: Yup.number().min(1).max(30),
      notes: Yup.string().max(500)
    }),
    onSubmit: values => {
      console.log(values)
      onClose()
    }
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Bid</h3>
          <button onClick={onClose} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle ID</label>
              <input
                type="text"
                name="vehicle"
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
              />
              {formik.errors.vehicle && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.vehicle}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bid Amount (₹)</label>
              <input
                type="number"
                name="amount"
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
              />
              {formik.errors.amount && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.amount}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bid Validity (Days)</label>
              <input
                type="number"
                name="validity"
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Create Bid
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}