const FormPage = () => {
  return (
    <div className="bg-blue-50 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          ! Where can we send you the results?{' '}
          <span className="text-yellow-500">👇</span>
        </h1>

        
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <p className="text-lg font-bold text-blue-600 mb-4">
            Step 1:{' '}
            <span className="font-normal text-gray-700">
           Basic information
            </span>
          </p>
          <div>
            <input
              type="text"
              placeholder="Your First Name"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition duration-300"
            >
              NEXT STEP »
            </button>
          </div>
         
          <p className="text-gray-500 text-sm mt-4">
            Your email is safe and we don’t share it with anyone.
          </p>
        </div>


      </div>
    </div>
  );
};

export default FormPage;