import React, { useState } from 'react';

const FarmerQueryForm = () => {
  // State to manage form inputs
  const [farmerName, setFarmerName] = useState('');
  const [email, setEmail] = useState('');
  const [queryType, setQueryType] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [isQueryPosted, setIsQueryPosted] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!farmerName || !email || !queryType || !queryDescription) {
      alert('Please fill in all fields');
      return;
    }

    // In a real-world scenario, you would send this data to a backend
    console.log('Query Submitted:', {
      farmerName,
      email,
      queryType,
      queryDescription
    });

    // Show query posted message
    setIsQueryPosted(true);

    // Optional: Reset form after submission
    setFarmerName('');
    setEmail('');
    setQueryType('');
    setQueryDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Farmer Query Form
        </h2>

        {isQueryPosted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Query Posted Successfully! </strong>
            <span className="block sm:inline">Our team will get back to you soon.</span>
            <button 
              onClick={() => setIsQueryPosted(false)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Farmer Name Input */}
            <div>
              <label htmlFor="farmerName" className="block text-gray-700 font-semibold mb-2">
                Farmer Name
              </label>
              <input
                type="text"
                id="farmerName"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Query Type Input */}
            <div>
              <label htmlFor="queryType" className="block text-gray-700 font-semibold mb-2">
                Query Type
              </label>
              <input
                type="text"
                id="queryType"
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                placeholder="Enter query type (e.g., Crop Advice)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Query Description Textarea */}
            <div>
              <label htmlFor="queryDescription" className="block text-gray-700 font-semibold mb-2">
                Query Description
              </label>
              <textarea
                id="queryDescription"
                value={queryDescription}
                onChange={(e) => setQueryDescription(e.target.value)}
                placeholder="Describe your query in detail"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-300 font-semibold"
            >
              Post Query
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FarmerQueryForm;