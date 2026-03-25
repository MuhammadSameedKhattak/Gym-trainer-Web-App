import { UserProfile, WorkoutDay, DietDay, Exercise, Meal } from '@/types/user';
import { calculateMacros } from './calculations';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WARMUP = ['5 min light cardio (jump rope or jogging)', 'Dynamic stretches — arm circles, leg swings', 'Activation drills for target muscle group'];
const COOLDOWN = ['5 min slow walking', 'Static stretches — hold 20-30 seconds each', 'Foam rolling target muscles'];

interface MuscleGroupPlan {
  group: string;
  exercises: Exercise[];
}

const EXERCISE_DB: MuscleGroupPlan[] = [
  {
    group: 'Chest & Triceps',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90s', description: 'Lie flat on bench, press barbell from chest to lockout.' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '75s', description: 'On an incline bench, press dumbbells upward targeting upper chest.' },
      { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '60s', description: 'Stand between cables, bring handles together in a hugging motion.' },
      { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60s', description: 'Lower body on parallel bars focusing on tricep engagement.' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s', description: 'Extend dumbbell overhead, keeping elbows close to head.' },
    ],
  },
  {
    group: 'Back & Biceps',
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '6-8', rest: '120s', description: 'Hinge at hips, lift barbell from floor with flat back.' },
      { name: 'Pull-Ups', sets: 3, reps: '8-10', rest: '90s', description: 'Hang from bar, pull chin above bar using back muscles.' },
      { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '75s', description: 'Pull cable handle to torso, squeezing shoulder blades.' },
      { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '60s', description: 'Curl barbell up keeping elbows pinned at sides.' },
      { name: 'Hammer Curls', sets: 3, reps: '12-15', rest: '60s', description: 'Curl dumbbells with neutral grip targeting brachialis.' },
    ],
  },
  {
    group: 'Legs & Glutes',
    exercises: [
      { name: 'Barbell Squats', sets: 4, reps: '8-10', rest: '120s', description: 'Bar on upper back, squat to parallel keeping chest up.' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: '90s', description: 'Hinge forward with slight knee bend, stretching hamstrings.' },
      { name: 'Leg Press', sets: 3, reps: '10-12', rest: '75s', description: 'Press platform away using quads and glutes on machine.' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '60s', description: 'Step forward into lunge, alternating legs across the floor.' },
      { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45s', description: 'Rise onto toes on elevated platform, slow controlled reps.' },
    ],
  },
  {
    group: 'Shoulders & Abs',
    exercises: [
      { name: 'Overhead Press', sets: 4, reps: '8-10', rest: '90s', description: 'Press barbell overhead from shoulder height to full lockout.' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '60s', description: 'Raise dumbbells to sides until arms are parallel to floor.' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s', description: 'Pull rope attachment to face level, squeezing rear delts.' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', rest: '60s', description: 'Hang from bar and raise legs to 90 degrees.' },
      { name: 'Plank Hold', sets: 3, reps: '45-60s', rest: '45s', description: 'Hold rigid position on forearms, engaging entire core.' },
    ],
  },
  {
    group: 'Upper Body Power',
    exercises: [
      { name: 'Push Press', sets: 4, reps: '6-8', rest: '90s', description: 'Use leg drive to press barbell explosively overhead.' },
      { name: 'Weighted Pull-Ups', sets: 3, reps: '6-8', rest: '90s', description: 'Add weight belt and perform strict pull-ups.' },
      { name: 'Dumbbell Row', sets: 3, reps: '8-10', rest: '75s', description: 'Row dumbbell to hip, keeping back flat on bench.' },
      { name: 'Close-Grip Bench Press', sets: 3, reps: '8-10', rest: '75s', description: 'Bench press with narrow grip emphasizing triceps.' },
      { name: 'Barbell Shrugs', sets: 3, reps: '12-15', rest: '60s', description: 'Shrug shoulders up toward ears holding heavy barbell.' },
    ],
  },
  {
    group: 'Full Body HIIT',
    exercises: [
      { name: 'Burpees', sets: 4, reps: '10', rest: '45s', description: 'Squat thrust with push-up and explosive jump.' },
      { name: 'Kettlebell Swings', sets: 4, reps: '15', rest: '45s', description: 'Swing kettlebell from between legs to chest height.' },
      { name: 'Box Jumps', sets: 3, reps: '10', rest: '60s', description: 'Jump onto elevated box, step down and repeat.' },
      { name: 'Battle Ropes', sets: 3, reps: '30s', rest: '30s', description: 'Alternate arms creating waves in heavy ropes.' },
      { name: 'Mountain Climbers', sets: 3, reps: '20 each', rest: '30s', description: 'Sprint in place from plank position, driving knees forward.' },
    ],
  },
];

function getWorkoutSplit(days: number): string[][] {
  switch (days) {
    case 3:
      return [
        ['Chest & Triceps'],
        ['Back & Biceps'],
        ['Legs & Glutes'],
      ];
    case 4:
      return [
        ['Chest & Triceps'],
        ['Back & Biceps'],
        ['Legs & Glutes'],
        ['Shoulders & Abs'],
      ];
    case 5:
      return [
        ['Chest & Triceps'],
        ['Back & Biceps'],
        ['Legs & Glutes'],
        ['Shoulders & Abs'],
        ['Upper Body Power'],
      ];
    case 6:
      return [
        ['Chest & Triceps'],
        ['Back & Biceps'],
        ['Legs & Glutes'],
        ['Shoulders & Abs'],
        ['Upper Body Power'],
        ['Full Body HIIT'],
      ];
    default:
      return [['Chest & Triceps'], ['Back & Biceps'], ['Legs & Glutes']];
  }
}

function getWorkoutDayIndices(days: number): number[] {
  switch (days) {
    case 3: return [0, 2, 4]; // Mon, Wed, Fri
    case 4: return [0, 1, 3, 4]; // Mon, Tue, Thu, Fri
    case 5: return [0, 1, 2, 3, 4]; // Mon-Fri
    case 6: return [0, 1, 2, 3, 4, 5]; // Mon-Sat
    default: return [0, 2, 4];
  }
}

export function generateWorkoutPlan(profile: UserProfile): WorkoutDay[] {
  const split = getWorkoutSplit(profile.workoutDays);
  const workoutIndices = getWorkoutDayIndices(profile.workoutDays);

  let splitIdx = 0;
  return DAYS.map((day, i) => {
    if (workoutIndices.includes(i)) {
      const groups = split[splitIdx];
      splitIdx++;
      const muscleGroup = groups[0];
      const plan = EXERCISE_DB.find(p => p.group === muscleGroup);
      return {
        day,
        isRest: false,
        muscleGroup,
        warmup: WARMUP,
        exercises: plan?.exercises || [],
        cooldown: COOLDOWN,
      };
    }
    return { day, isRest: true };
  });
}

// Diet plan generation
const MEAL_TEMPLATES = {
  no_restriction: {
    breakfasts: [
      { name: 'Oatmeal Power Bowl', items: ['Oats', 'Banana', 'Whey protein', 'Almonds', 'Honey'] },
      { name: 'Egg & Avocado Toast', items: ['Whole grain toast', 'Eggs', 'Avocado', 'Cherry tomatoes'] },
      { name: 'Greek Yogurt Parfait', items: ['Greek yogurt', 'Granola', 'Mixed berries', 'Chia seeds'] },
      { name: 'Protein Pancakes', items: ['Oat flour', 'Eggs', 'Protein powder', 'Banana', 'Maple syrup'] },
      { name: 'Smoothie Bowl', items: ['Frozen berries', 'Protein powder', 'Spinach', 'Almond milk', 'Granola'] },
      { name: 'Scrambled Eggs & Veggies', items: ['Eggs', 'Bell peppers', 'Spinach', 'Whole grain toast'] },
      { name: 'Overnight Oats', items: ['Oats', 'Milk', 'Peanut butter', 'Banana', 'Honey'] },
    ],
    lunches: [
      { name: 'Grilled Chicken Salad', items: ['Chicken breast', 'Mixed greens', 'Quinoa', 'Olive oil dressing'] },
      { name: 'Turkey Wrap', items: ['Turkey breast', 'Whole wheat wrap', 'Lettuce', 'Tomato', 'Mustard'] },
      { name: 'Salmon Rice Bowl', items: ['Grilled salmon', 'Brown rice', 'Broccoli', 'Soy sauce'] },
      { name: 'Chicken Stir Fry', items: ['Chicken', 'Mixed vegetables', 'Brown rice', 'Teriyaki sauce'] },
      { name: 'Tuna Pasta', items: ['Whole wheat pasta', 'Tuna', 'Olive oil', 'Cherry tomatoes', 'Arugula'] },
      { name: 'Beef & Veggie Bowl', items: ['Lean ground beef', 'Sweet potato', 'Green beans', 'Olive oil'] },
      { name: 'Chicken Caesar Wrap', items: ['Chicken', 'Romaine', 'Parmesan', 'Caesar dressing', 'Wrap'] },
    ],
    dinners: [
      { name: 'Baked Salmon & Veggies', items: ['Salmon fillet', 'Asparagus', 'Sweet potato', 'Lemon'] },
      { name: 'Chicken & Rice', items: ['Chicken thighs', 'Jasmine rice', 'Steamed broccoli', 'Garlic'] },
      { name: 'Lean Steak & Potatoes', items: ['Sirloin steak', 'Baked potato', 'Green salad'] },
      { name: 'Turkey Meatballs & Pasta', items: ['Ground turkey', 'Whole wheat pasta', 'Marinara sauce', 'Parmesan'] },
      { name: 'Grilled Chicken & Quinoa', items: ['Chicken breast', 'Quinoa', 'Roasted vegetables'] },
      { name: 'Shrimp & Vegetables', items: ['Shrimp', 'Zucchini', 'Bell peppers', 'Brown rice'] },
      { name: 'Pork Tenderloin', items: ['Pork tenderloin', 'Roasted sweet potato', 'Green beans'] },
    ],
    snacks: [
      { name: 'Protein Shake', items: ['Whey protein', 'Banana', 'Almond milk'] },
      { name: 'Trail Mix', items: ['Almonds', 'Walnuts', 'Dark chocolate', 'Dried cranberries'] },
      { name: 'Apple & Peanut Butter', items: ['Apple slices', 'Natural peanut butter'] },
      { name: 'Cottage Cheese & Fruit', items: ['Cottage cheese', 'Pineapple chunks'] },
      { name: 'Rice Cakes & Hummus', items: ['Rice cakes', 'Hummus', 'Cucumber slices'] },
      { name: 'Hard Boiled Eggs', items: ['Eggs', 'Salt', 'Pepper'] },
      { name: 'Greek Yogurt & Honey', items: ['Greek yogurt', 'Honey', 'Walnuts'] },
    ],
  },
  vegetarian: {
    breakfasts: [
      { name: 'Veggie Omelette', items: ['Eggs', 'Spinach', 'Mushrooms', 'Cheese', 'Toast'] },
      { name: 'Overnight Oats', items: ['Oats', 'Milk', 'Chia seeds', 'Berries', 'Honey'] },
      { name: 'Paneer Paratha', items: ['Whole wheat flour', 'Paneer', 'Spices', 'Yogurt'] },
      { name: 'Smoothie Bowl', items: ['Banana', 'Spinach', 'Protein powder', 'Granola', 'Almond milk'] },
      { name: 'Avocado Toast & Eggs', items: ['Sourdough', 'Avocado', 'Poached eggs', 'Seeds'] },
      { name: 'Cottage Cheese Pancakes', items: ['Cottage cheese', 'Oat flour', 'Eggs', 'Blueberries'] },
      { name: 'Granola Bowl', items: ['Granola', 'Greek yogurt', 'Banana', 'Almonds'] },
    ],
    lunches: [
      { name: 'Veggie Buddha Bowl', items: ['Chickpeas', 'Quinoa', 'Roasted veggies', 'Tahini'] },
      { name: 'Caprese Sandwich', items: ['Mozzarella', 'Tomato', 'Basil', 'Ciabatta', 'Pesto'] },
      { name: 'Lentil Soup & Bread', items: ['Red lentils', 'Carrots', 'Onion', 'Whole grain bread'] },
      { name: 'Paneer Tikka Bowl', items: ['Paneer', 'Bell peppers', 'Rice', 'Yogurt sauce'] },
      { name: 'Falafel Wrap', items: ['Falafel', 'Hummus', 'Lettuce', 'Tomato', 'Pita'] },
      { name: 'Veggie Pasta', items: ['Pasta', 'Zucchini', 'Mushrooms', 'Parmesan', 'Olive oil'] },
      { name: 'Egg Fried Rice', items: ['Rice', 'Eggs', 'Mixed vegetables', 'Soy sauce', 'Sesame oil'] },
    ],
    dinners: [
      { name: 'Eggplant Parmesan', items: ['Eggplant', 'Marinara', 'Mozzarella', 'Breadcrumbs'] },
      { name: 'Stuffed Bell Peppers', items: ['Bell peppers', 'Rice', 'Black beans', 'Cheese', 'Salsa'] },
      { name: 'Vegetable Curry', items: ['Chickpeas', 'Coconut milk', 'Mixed veggies', 'Rice'] },
      { name: 'Mushroom Risotto', items: ['Arborio rice', 'Mushrooms', 'Parmesan', 'White wine'] },
      { name: 'Spinach & Ricotta Pasta', items: ['Pasta', 'Spinach', 'Ricotta', 'Garlic', 'Pine nuts'] },
      { name: 'Bean Tacos', items: ['Black beans', 'Corn tortillas', 'Cheese', 'Salsa', 'Guacamole'] },
      { name: 'Palak Paneer & Naan', items: ['Spinach', 'Paneer', 'Spices', 'Whole wheat naan'] },
    ],
    snacks: [
      { name: 'Trail Mix', items: ['Almonds', 'Cashews', 'Dark chocolate', 'Raisins'] },
      { name: 'Hummus & Veggies', items: ['Hummus', 'Carrot sticks', 'Cucumber', 'Bell pepper'] },
      { name: 'Cheese & Crackers', items: ['Cheddar cheese', 'Whole grain crackers'] },
      { name: 'Protein Smoothie', items: ['Whey protein', 'Banana', 'Peanut butter', 'Milk'] },
      { name: 'Yogurt & Granola', items: ['Greek yogurt', 'Granola', 'Honey'] },
      { name: 'Fruit & Nuts', items: ['Apple', 'Almonds', 'Walnuts'] },
      { name: 'Edamame', items: ['Steamed edamame', 'Sea salt'] },
    ],
  },
  vegan: {
    breakfasts: [
      { name: 'Tofu Scramble', items: ['Firm tofu', 'Spinach', 'Tomatoes', 'Turmeric', 'Toast'] },
      { name: 'Açaí Bowl', items: ['Açaí puree', 'Banana', 'Granola', 'Coconut flakes', 'Berries'] },
      { name: 'Oatmeal & Seeds', items: ['Oats', 'Almond milk', 'Flax seeds', 'Walnuts', 'Maple syrup'] },
      { name: 'PB Banana Smoothie', items: ['Peanut butter', 'Banana', 'Oat milk', 'Protein powder'] },
      { name: 'Avocado Toast', items: ['Sourdough', 'Avocado', 'Hemp seeds', 'Lemon', 'Chili flakes'] },
      { name: 'Chia Pudding', items: ['Chia seeds', 'Coconut milk', 'Mango', 'Agave'] },
      { name: 'Granola Bowl', items: ['Granola', 'Coconut yogurt', 'Mixed berries', 'Almonds'] },
    ],
    lunches: [
      { name: 'Buddha Bowl', items: ['Chickpeas', 'Quinoa', 'Roasted veggies', 'Tahini dressing'] },
      { name: 'Lentil Curry', items: ['Red lentils', 'Coconut milk', 'Rice', 'Spinach'] },
      { name: 'Black Bean Burrito', items: ['Black beans', 'Rice', 'Guacamole', 'Salsa', 'Tortilla'] },
      { name: 'Tempeh Stir Fry', items: ['Tempeh', 'Mixed vegetables', 'Rice noodles', 'Soy sauce'] },
      { name: 'Falafel Wrap', items: ['Falafel', 'Hummus', 'Mixed greens', 'Tomato', 'Pita'] },
      { name: 'Sweet Potato Bowl', items: ['Roasted sweet potato', 'Black beans', 'Avocado', 'Lime'] },
      { name: 'Veggie Sushi Rolls', items: ['Sushi rice', 'Nori', 'Avocado', 'Cucumber', 'Carrot'] },
    ],
    dinners: [
      { name: 'Tofu & Vegetable Curry', items: ['Tofu', 'Coconut milk', 'Mixed vegetables', 'Rice'] },
      { name: 'Pasta Primavera', items: ['Whole wheat pasta', 'Zucchini', 'Tomatoes', 'Basil', 'Olive oil'] },
      { name: 'Stuffed Peppers', items: ['Bell peppers', 'Quinoa', 'Black beans', 'Corn', 'Salsa'] },
      { name: 'Cauliflower Tikka', items: ['Cauliflower', 'Chickpeas', 'Tikka sauce', 'Basmati rice'] },
      { name: 'Bean Chili', items: ['Kidney beans', 'Black beans', 'Tomatoes', 'Corn', 'Rice'] },
      { name: 'Mushroom Bolognese', items: ['Mushrooms', 'Lentils', 'Pasta', 'Marinara sauce'] },
      { name: 'Thai Peanut Noodles', items: ['Rice noodles', 'Tofu', 'Peanut sauce', 'Vegetables'] },
    ],
    snacks: [
      { name: 'Energy Balls', items: ['Dates', 'Oats', 'Peanut butter', 'Cacao nibs'] },
      { name: 'Hummus & Veggies', items: ['Hummus', 'Carrots', 'Celery', 'Bell pepper'] },
      { name: 'Trail Mix', items: ['Almonds', 'Cashews', 'Dark chocolate', 'Dried mango'] },
      { name: 'Fruit Smoothie', items: ['Banana', 'Mixed berries', 'Oat milk', 'Flax seeds'] },
      { name: 'Rice Cakes & Almond Butter', items: ['Rice cakes', 'Almond butter', 'Banana slices'] },
      { name: 'Roasted Chickpeas', items: ['Chickpeas', 'Olive oil', 'Spices'] },
      { name: 'Edamame Bowl', items: ['Steamed edamame', 'Sea salt', 'Lime'] },
    ],
  },
};

function getMealTemplates(pref: string) {
  if (pref === 'vegetarian') return MEAL_TEMPLATES.vegetarian;
  if (pref === 'vegan') return MEAL_TEMPLATES.vegan;
  return MEAL_TEMPLATES.no_restriction;
}

function distributeCalories(total: number, macros: { protein: number; carbs: number; fats: number }) {
  const bfRatio = 0.25, lunchRatio = 0.30, dinnerRatio = 0.30, snackRatio = 0.15;
  const distribute = (ratio: number) => ({
    calories: Math.round(total * ratio),
    protein: Math.round(macros.protein * ratio),
    carbs: Math.round(macros.carbs * ratio),
    fats: Math.round(macros.fats * ratio),
  });
  return {
    breakfast: distribute(bfRatio),
    lunch: distribute(lunchRatio),
    dinner: distribute(dinnerRatio),
    snack: distribute(snackRatio),
  };
}

export function generateDietPlan(profile: UserProfile): DietDay[] {
  const macros = calculateMacros(profile);
  const templates = getMealTemplates(profile.dietaryPreference);
  const dist = distributeCalories(macros.calories, macros);

  return DAYS.map((day, i) => {
    const bf = templates.breakfasts[i % templates.breakfasts.length];
    const lunch = templates.lunches[i % templates.lunches.length];
    const dinner = templates.dinners[i % templates.dinners.length];
    const snack = templates.snacks[i % templates.snacks.length];

    return {
      day,
      breakfast: { name: bf.name, items: bf.items, ...dist.breakfast },
      lunch: { name: lunch.name, items: lunch.items, ...dist.lunch },
      dinner: { name: dinner.name, items: dinner.items, ...dist.dinner },
      snack: { name: snack.name, items: snack.items, ...dist.snack },
      totalCalories: macros.calories,
    };
  });
}
