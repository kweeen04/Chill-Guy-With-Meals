import StepLayout from "../components/StepLayout";

const Step2Lifestyle = ({ formData, handleChange, onNext }) => (
  <StepLayout title="Step 1: Basic Info">
       <>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Lifestyle</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Work Habits</label>
              <select
                name="workHabits"
                value={formData.workHabits}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very active">Very Active</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Eating Habits</label>
              <select
                name="eatingHabits"
                value={formData.eatingHabits}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
                <option value="snacker">Snacker</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </>
    <button onClick={onNext} type="button" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
      Next
    </button>
  </StepLayout>
);

export default Step2Lifestyle;
