const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isFirstLogin: { type: Boolean, default: true },
  profile: {
    weight: Number,
    height: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    age: Number,
    workHabits: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very active'] },
    eatingHabits: { type: String, enum: ['light', 'moderate', 'heavy', 'snacker'] },
    diet: { type: String, enum: ['none', 'vegan', 'vegetarian', 'keto', 'paleo', 'gluten-free'] },
    allergies: [String],
    meals: [{ type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] }],
    profileImageUrl: String,
  },
  subscription: {
    status: { type: String, enum: ['free', 'monthly', 'yearly'], default: 'free' },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);