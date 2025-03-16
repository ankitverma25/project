import React from 'react'

const Faqsection = () => {
  return (
    <div className="py-20 bg-green-100 border-b-2 border-green-800">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600">
          Everything you need to know about our launch
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">
            When are you launching?
          </h3>
          <p className="text-gray-600">
            We're launching in Q2 2025. Join our early access list to be
            among the first to use our platform and receive exclusive
            benefits.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">
            How does the bidding system work?
          </h3>
          <p className="text-gray-600">
            Our platform connects you with verified dealers who compete to
            offer the best price for your vehicle, potentially increasing
            your earnings by up to 30%.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">
            Is the service available nationwide?
          </h3>
          <p className="text-gray-600">
            Initially, we'll be launching in major metropolitan areas across
            the United States, with plans to expand nationwide within the
            first year.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">
            What makes your AI valuation different?
          </h3>
          <p className="text-gray-600">
            Our AI technology analyzes millions of data points from recent
            market transactions, considering factors like location,
            condition, and current market trends.
          </p>
        </div>
      </div>
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Still have questions? We're here to help!
        </p>
        <button className="bg-gray-900 text-white px-8 py-3 !rounded-button hover:bg-gray-800 cursor-pointer whitespace-nowrap">
          Contact Our Team
        </button>
      </div>
    </div>
  </div>
  )
}

export default Faqsection