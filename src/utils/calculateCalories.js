
export function calculateCalories({ weight, height, age, gender, workHabits }) {
    // BMR calculation using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multiplier
    const activityLevels = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        'very active': 1.9,
    };

    const multiplier = activityLevels[workHabits] || 1.2; // fallback to sedentary
    return Math.round(bmr * multiplier);
}


