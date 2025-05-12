export default function ProgressIndicator({ step }) {
  const steps = ["Basic Info", "Lifestyle", "Preferences", "Meals"];
  const progressPercent = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full px-4 py-6 mt-12">
      {/* Progress Line */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="absolute h-2 bg-cyan-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Circles */}
      <div className="flex justify-between relative">
        {steps.map((label, index) => {
          const isActive = index + 1 === step;
          const isCompleted = step > index + 1;

          return (
            <div key={label} className="flex flex-col items-center w-1/4">
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-full border-2 text-sm z-10 ${
                  isCompleted
                    ? 'bg-cyan-600 border-cyan-600 text-white'
                    : isActive
                    ? 'bg-black border-cyan-600 text-white'
                    : 'border-gray-300 text-gray-500 bg-white'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className="text-xs mt-2 text-center">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
