import { UserProfile, MacroTargets } from '@/types/user';

export function calculateBMR(profile: UserProfile): number {
  // Mifflin-St Jeor
  if (profile.gender === 'female') {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  return Math.round(bmr * multipliers[profile.activityLevel]);
}

export function calculateMacros(profile: UserProfile): MacroTargets {
  const tdee = calculateTDEE(profile);
  let calories: number;
  let proteinRatio: number;
  let fatRatio: number;

  switch (profile.fitnessGoal) {
    case 'weight_loss':
      calories = tdee - 500;
      proteinRatio = 0.35;
      fatRatio = 0.25;
      break;
    case 'muscle_gain':
      calories = tdee + 300;
      proteinRatio = 0.30;
      fatRatio = 0.25;
      break;
    case 'bulk_up':
      calories = tdee + 500;
      proteinRatio = 0.30;
      fatRatio = 0.25;
      break;
    case 'recomposition':
      calories = tdee;
      proteinRatio = 0.35;
      fatRatio = 0.25;
      break;
    default:
      calories = tdee;
      proteinRatio = 0.25;
      fatRatio = 0.30;
  }

  if (profile.dietaryPreference === 'high_protein') {
    proteinRatio = Math.min(proteinRatio + 0.05, 0.40);
  } else if (profile.dietaryPreference === 'low_carb') {
    fatRatio += 0.10;
  }

  const carbRatio = 1 - proteinRatio - fatRatio;
  return {
    calories: Math.round(calories),
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * carbRatio) / 4),
    fats: Math.round((calories * fatRatio) / 9),
  };
}

export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function getProgressMessage(entries: { weight: number }[], goal: string): string {
  if (entries.length < 2) return 'Keep logging your weight to track progress!';
  const first = entries[0].weight;
  const last = entries[entries.length - 1].weight;
  const diff = last - first;

  if (goal === 'weight_loss') {
    if (diff < -0.5) return '🔥 Great progress! You\'re losing weight steadily.';
    if (diff > 0.5) return '⚠️ Weight trending up. Consider reviewing your diet plan.';
    return '📊 Holding steady. Stay consistent with your plan!';
  }
  if (goal === 'muscle_gain' || goal === 'bulk_up') {
    if (diff > 0.3) return '💪 Gaining well! Keep up the training intensity.';
    if (diff < -0.5) return '⚠️ Weight dropping. You may need more calories.';
    return '📊 Steady weight. Ensure you\'re in a caloric surplus.';
  }
  return '📊 Tracking well. Stay consistent with your routine!';
}
