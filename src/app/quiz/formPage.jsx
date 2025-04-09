const FormPage = () => {
    return (
      <div className="bg-blue-50 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Done! Where can we send you the results?{' '}
            <span className="text-yellow-500">👇</span>
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <p className="text-lg font-bold text-blue-600 mb-4">
              Awesome!{' '}
              <span className="font-normal text-gray-700">
                Please enter your email to receive your results + short video explanation.
              </span>
            </p>
            <form>
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
            </form>
            <div className="flex items-center justify-center mt-4">
              <img
                src="https://placehold.co/40x40"
                alt="Person 1"
                className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              />
              <img
                src="https://placehold.co/40x40"
                alt="Person 2"
                className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              />
              <img
                src="https://placehold.co/40x40"
                alt="Person 3"
                className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              />
              <img
                src="https://placehold.co/40x40"
                alt="Person 4"
                className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              />
              <img
                src="https://placehold.co/40x40"
                alt="Person 5"
                className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              />
              <img
                src="https://placehold.co/40x40"
                alt="Person 6"
                className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              />
              <div className="w-10 h-10 rounded-full border-2 border-white -ml-2 bg-gray-200 flex items-center justify-center text-sm font-bold">
                1.5k+
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Your email is safe and we don’t share it with anyone. (pinky promise)
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default FormPage;