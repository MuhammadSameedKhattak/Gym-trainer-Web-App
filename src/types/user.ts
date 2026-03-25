export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'recomposition' | 'improve_fitness' | 'bulk_up';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
export type DietaryPreference = 'no_restriction' | 'vegetarian' | 'vegan' | 'high_protein' | 'low_carb';
export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  weight: number; // kg
  height: number; // cm
  bodyFatPercent?: number;
  fitnessGoal: FitnessGoal;
  activityLevel: ActivityLevel;
  workoutDays: 3 | 4 | 5 | 6;
  injuries: string;
  dietaryPreference: DietaryPreference;
  createdAt: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface WaterEntry {
  date: string;
  glasses: number; // out of 8
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  description: string;
}

export interface WorkoutDay {
  day: string;
  isRest: boolean;
  muscleGroup?: string;
  warmup?: string[];
  exercises?: Exercise[];
  cooldown?: string[];
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items: string[];
}

export interface DietDay {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
  totalCalories: number;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}
