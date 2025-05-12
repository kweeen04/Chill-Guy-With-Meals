const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
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

module.exports = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);