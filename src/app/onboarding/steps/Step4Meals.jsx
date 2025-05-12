import StepLayout from "../components/StepLayout";

const Step4Meals = ({ formData, handleChange, onNext }) => (
  <StepLayout title="Step 1: Basic Info">
    <div className="mb-4">
      <label className="block text-gray-700">Weight (kg)</label>
      <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 border rounded" required />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Height (cm)</label>
      <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full p-2 border rounded" required />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Gender</label>
      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
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

export default Step4Meals;
