import StepLayout from "../components/StepLayout";

const Step3Preferences = ({ formData, handleChange, onNext }) => (
  <StepLayout title="Step 1: Basic Info">
     <div className="mb-4">
              <label className="block text-gray-700">Diet Preference</label>
              <select
                name="diet"
                value={formData.diet}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="none">None</option>
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Allergies (comma-separated)</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies.join(', ')}
                onChange={handleAllergiesChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., nuts, dairy"
              />
            </div>
    <div className="mb-4">
      <label className="block text-gray-700">Age</label>
      <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" required />
    </div>
    <button onClick={onNext} type="button" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
      Next
    </button>
  </StepLayout>
);

export default Step3Preferences;
