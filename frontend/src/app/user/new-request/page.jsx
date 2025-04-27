'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import NewRequestForm from '@/components/NewRequestForm'

export default function NewRequestPage() {
  const formik = useFormik({
    initialValues: {
      carModel: '',
      year: 2015,
      condition: 3,
      running: 'yes',
      photos: [],
      rcFile: null,
      idFile: null,
      address: '',
      pickupDate: '',
      timeSlot: ''
    },
    validationSchema: Yup.object({
      carModel: Yup.string().required('Required'),
      year: Yup.number().min(2000).max(new Date().getFullYear()),
      condition: Yup.number().min(1).max(5),
      running: Yup.string().oneOf(['yes', 'no']),
      address: Yup.string().required('Pickup address is required'),
      pickupDate: Yup.date().required('Pickup date is required'),
      timeSlot: Yup.string().required('Time slot is required')
    }),
    onSubmit: values => {
      console.log(values)
      // Handle form submission
    }
  })

  return (
    <main className="p-4 sm:p-2"> {/* Changed to mobile-first padding */}
    <div className="mx-auto max-w-3xl"> {/* Added max-width constraint */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6"> {/* Responsive padding */}
        <h2 className="text-lg sm:text-xl font-semibold mb-4"> {/* Responsive text */}
          New Scrap Request
        </h2>
        <NewRequestForm formik={formik} />
      </div>
    </div>
  </main>
  )
}