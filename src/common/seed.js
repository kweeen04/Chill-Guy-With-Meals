const mongoose = require('mongoose');
const connectDB = require('./db');
const Recipe = require('../models/Recipe');

async function seed() {
  await connectDB();
  await Recipe.deleteMany({});
  await Recipe.insertMany([
    {
      title: 'Vegan Pancakes',
      description: 'Fluffy vegan pancakes.',
      ingredients: [{ name: 'flour', amount: '1 cup' }, { name: 'almond milk', amount: '1 cup' }],
      instructions: ['Mix ingredients', 'Cook on skillet'],
      calories: 300,
      macros: { protein: 5, carbs: 50, fat: 10 },
      diet: 'vegan',
    },
    {
      title: 'Keto Chicken',
      description: 'Low-carb chicken dish.',
      ingredients: [{ name: 'chicken breast', amount: '200g' }, { name: 'butter', amount: '2 tbsp' }],
      instructions: ['Season chicken', 'Pan-fry in butter'],
      calories: 400,
      macros: { protein: 40, carbs: 0, fat: 25 },
      diet: 'keto',
    },
  ]);
  console.log('Recipes seeded!');
  mongoose.connection.close();
}

seed();