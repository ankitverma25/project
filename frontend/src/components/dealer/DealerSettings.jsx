// components/dealer/DealerSettings.js
'use client'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function DealerSettings() {
  const formik = useFormik({
    initialValues: {
      companyName: 'ScrapDealerX',
      email: 'contact@scrapdealerx.com',
      phone: '+91 9876543210',
      address: '123 Recycling Lane, Mumbai'
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      phone: Yup.string().matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
      address: Yup.string().required('Required')
    }),
    onSubmit: values => {
      console.log(values)
    }
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-blue-800 font-medium mb-2">Simplified Interface</h2>
        <p className="text-blue-700 text-sm">
          We've streamlined the dealer interface to focus on core functionality:
          bidding on cars, managing active bids, and scheduling pickups. This makes
          it easier to manage your essential tasks efficiently.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}