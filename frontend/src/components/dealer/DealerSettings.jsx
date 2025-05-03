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
    <div className="bg-white p-6 rounded-lg shadow">
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              className="w-full p-2 border rounded-md"
              rows="3"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}