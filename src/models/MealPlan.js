const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  meals: [
    {
      type: { type: String, required: true },
      recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
      name: { type: String, required: true },
      calories: { type: Number, required: true },
      macros: {
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fat: { type: Number, required: true }
      },
      imageUrl: { type: String },
    }
  ],
  totalCalories: { type: Number, required: true },
  totalMacros: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  targetCalories: { type: Number, required: true },
});

module.exports = mongoose.models.MealPlan || mongoose.model('MealPlan', MealPlanSchema);
