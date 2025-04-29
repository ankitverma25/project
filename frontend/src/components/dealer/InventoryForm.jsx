// components/dealer/InventoryForm.js
'use client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { X } from 'lucide-react'

export default function InventoryForm({ onClose }) {
  const formik = useFormik({
    initialValues: {
      materialType: '',
      weight: '',
      purity: 90,
      location: ''
    },
    validationSchema: Yup.object({
      materialType: Yup.string().required('Required'),
      weight: Yup.number().required('Required').min(1),
      purity: Yup.number().min(1).max(100),
      location: Yup.string().required('Required')
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
          <h3 className="text-lg font-semibold">Add Inventory Item</h3>
          <button onClick={onClose} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Material Type</label>
              <select
                name="materialType"
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Material</option>
                <option value="steel">Steel</option>
                <option value="aluminum">Aluminum</option>
                <option value="copper">Copper</option>
                <option value="plastic">Plastic</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Purity (%)</label>
              <input
                type="number"
                name="purity"
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Storage Location</label>
              <input
                type="text"
                name="location"
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
              />
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
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Add Item
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}