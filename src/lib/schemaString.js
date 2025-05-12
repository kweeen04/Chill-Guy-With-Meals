export const MealPlanSchemaString = `
const MealPlanSchema = {
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
};
`;

export const RecipeSchemaString = `
const RecipeSchema = {
  title: { type: String, required: true },
  description: String,
  ingredients: [{
    name: String,
    amount: String,
  }],
  instructions: [String],
  calories: Number,
  macros: {
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  diet: { type: String, enum: ['none', 'vegan', 'vegetarian', 'keto', 'paleo', 'gluten-free'] },
  imageUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
}`
