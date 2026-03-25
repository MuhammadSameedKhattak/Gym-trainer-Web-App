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
      { name: 'Anda Paratha', items: ['Whole wheat paratha', 'Eggs', 'Onion', 'Green chili', 'Cooking oil'] },
      { name: 'Halwa Puri Nashta', items: ['Suji halwa', 'Puri', 'Channay', 'Yogurt'] },
      { name: 'Omelette & Roti', items: ['Eggs', 'Tomato', 'Onion', 'Whole wheat roti', 'Butter'] },
      { name: 'Doodh Dalia', items: ['Broken wheat (dalia)', 'Milk', 'Sugar', 'Almonds', 'Cardamom'] },
      { name: 'Nihari & Naan', items: ['Nihari (beef)', 'Whole wheat naan', 'Lemon', 'Ginger'] },
      { name: 'Aloo Paratha & Lassi', items: ['Aloo paratha', 'Yogurt lassi', 'Butter', 'Achaar'] },
      { name: 'Chana Chaat', items: ['Boiled chickpeas', 'Onion', 'Tomato', 'Lemon', 'Chaat masala'] },
    ],
    lunches: [
      { name: 'Chicken Karahi & Rice', items: ['Chicken', 'Tomatoes', 'Green chilies', 'Basmati rice', 'Cooking oil'] },
      { name: 'Daal Chawal', items: ['Masoor daal', 'Basmati rice', 'Onion', 'Ghee', 'Lemon'] },
      { name: 'Beef Biryani', items: ['Beef', 'Basmati rice', 'Yogurt', 'Onion', 'Biryani masala'] },
      { name: 'Chicken Chapli Kebab & Roti', items: ['Chicken mince', 'Onion', 'Tomato', 'Spices', 'Whole wheat roti'] },
      { name: 'Aloo Gosht & Roti', items: ['Mutton', 'Potatoes', 'Tomato', 'Spices', 'Whole wheat roti'] },
      { name: 'Murgh Cholay', items: ['Chicken', 'Chickpeas', 'Tomato gravy', 'Roti', 'Salad'] },
      { name: 'Keema Matar & Naan', items: ['Minced beef', 'Peas', 'Onion', 'Spices', 'Whole wheat naan'] },
    ],
    dinners: [
      { name: 'Grilled Chicken Tikka & Salad', items: ['Chicken breast', 'Yogurt marinade', 'Spices', 'Salad', 'Raita'] },
      { name: 'Fish Curry & Rice', items: ['Rohu fish', 'Tomato', 'Onion', 'Spices', 'Basmati rice'] },
      { name: 'Daal Mash & Roti', items: ['Urad daal', 'Ghee tarka', 'Whole wheat roti', 'Salad'] },
      { name: 'Chicken Pulao', items: ['Chicken', 'Basmati rice', 'Whole spices', 'Yogurt', 'Salad'] },
      { name: 'Seekh Kebab & Raita', items: ['Beef mince', 'Onion', 'Spices', 'Raita', 'Naan'] },
      { name: 'Palak Gosht & Roti', items: ['Mutton', 'Spinach', 'Tomato', 'Garlic', 'Whole wheat roti'] },
      { name: 'Chicken Sajji & Naan', items: ['Whole chicken leg', 'Rice stuffing', 'Spices', 'Naan', 'Chutney'] },
    ],
    snacks: [
      { name: 'Fruit Chaat', items: ['Banana', 'Apple', 'Guava', 'Chaat masala', 'Lemon'] },
      { name: 'Lassi & Almonds', items: ['Yogurt lassi', 'Almonds', 'Cardamom'] },
      { name: 'Boiled Eggs & Chai', items: ['Boiled eggs', 'Salt', 'Pepper', 'Green tea'] },
      { name: 'Dahi Bhalla', items: ['Lentil dumplings', 'Yogurt', 'Chutney', 'Chaat masala'] },
      { name: 'Roasted Chana', items: ['Roasted chickpeas', 'Salt', 'Lemon'] },
      { name: 'Peanut Gur Mix', items: ['Roasted peanuts', 'Jaggery (gur)', 'Sesame seeds'] },
      { name: 'Banana Shake', items: ['Banana', 'Milk', 'Honey', 'Almonds'] },
    ],
  },
  vegetarian: {
    breakfasts: [
      { name: 'Aloo Paratha & Dahi', items: ['Whole wheat paratha', 'Potato filling', 'Yogurt', 'Butter'] },
      { name: 'Doodh Dalia', items: ['Broken wheat (dalia)', 'Milk', 'Almonds', 'Honey', 'Cardamom'] },
      { name: 'Paneer Paratha', items: ['Whole wheat flour', 'Paneer', 'Spices', 'Yogurt'] },
      { name: 'Anda Bhurji & Roti', items: ['Eggs', 'Tomato', 'Onion', 'Green chili', 'Roti'] },
      { name: 'Halwa Puri', items: ['Suji halwa', 'Puri', 'Channay (chickpeas)', 'Achaar'] },
      { name: 'Omelette & Paratha', items: ['Eggs', 'Onion', 'Tomato', 'Whole wheat paratha'] },
      { name: 'Chana Chaat', items: ['Boiled chickpeas', 'Onion', 'Tomato', 'Chaat masala', 'Lemon'] },
    ],
    lunches: [
      { name: 'Daal Chawal', items: ['Masoor daal', 'Basmati rice', 'Ghee tarka', 'Lemon', 'Salad'] },
      { name: 'Chana Masala & Roti', items: ['Chickpeas', 'Tomato gravy', 'Onion', 'Spices', 'Whole wheat roti'] },
      { name: 'Paneer Tikka Bowl', items: ['Paneer', 'Bell peppers', 'Basmati rice', 'Yogurt sauce'] },
      { name: 'Aloo Matar & Roti', items: ['Potatoes', 'Peas', 'Tomato', 'Spices', 'Roti'] },
      { name: 'Rajma Chawal', items: ['Kidney beans', 'Basmati rice', 'Onion', 'Tomato', 'Spices'] },
      { name: 'Egg Fried Rice', items: ['Basmati rice', 'Eggs', 'Mixed vegetables', 'Soy sauce'] },
      { name: 'Daal Palak & Naan', items: ['Lentils', 'Spinach', 'Garlic tarka', 'Whole wheat naan'] },
    ],
    dinners: [
      { name: 'Palak Paneer & Roti', items: ['Spinach', 'Paneer', 'Spices', 'Whole wheat roti'] },
      { name: 'Vegetable Biryani', items: ['Mixed vegetables', 'Basmati rice', 'Yogurt', 'Biryani masala'] },
      { name: 'Daal Mash & Roti', items: ['Urad daal', 'Ghee tarka', 'Whole wheat roti', 'Salad'] },
      { name: 'Baingan Bharta & Naan', items: ['Roasted eggplant', 'Onion', 'Tomato', 'Naan'] },
      { name: 'Aloo Gobi & Roti', items: ['Potatoes', 'Cauliflower', 'Spices', 'Whole wheat roti'] },
      { name: 'Paneer Butter Masala & Rice', items: ['Paneer', 'Tomato gravy', 'Butter', 'Basmati rice'] },
      { name: 'Mixed Daal & Roti', items: ['Chana daal', 'Moong daal', 'Tarka', 'Roti', 'Raita'] },
    ],
    snacks: [
      { name: 'Fruit Chaat', items: ['Banana', 'Apple', 'Guava', 'Chaat masala'] },
      { name: 'Dahi & Kheera', items: ['Yogurt', 'Cucumber', 'Mint', 'Salt'] },
      { name: 'Roasted Chana', items: ['Roasted chickpeas', 'Salt', 'Lemon juice'] },
      { name: 'Lassi', items: ['Yogurt', 'Sugar', 'Cardamom', 'Ice'] },
      { name: 'Peanut Chikki', items: ['Roasted peanuts', 'Jaggery (gur)'] },
      { name: 'Boiled Eggs', items: ['Eggs', 'Salt', 'Pepper', 'Chaat masala'] },
      { name: 'Banana & Almonds', items: ['Banana', 'Almonds', 'Honey'] },
    ],
  },
  vegan: {
    breakfasts: [
      { name: 'Chana Chaat', items: ['Boiled chickpeas', 'Onion', 'Tomato', 'Chaat masala', 'Lemon'] },
      { name: 'Dalia Khichdi', items: ['Broken wheat', 'Mixed vegetables', 'Cooking oil', 'Spices'] },
      { name: 'Aloo Paratha (oil)', items: ['Whole wheat paratha', 'Potato filling', 'Cooking oil'] },
      { name: 'Fruit & Nut Bowl', items: ['Banana', 'Apple', 'Dates', 'Almonds', 'Walnuts'] },
      { name: 'Moong Daal Cheela', items: ['Moong daal batter', 'Onion', 'Tomato', 'Green chutney'] },
      { name: 'Oats & Banana', items: ['Oats', 'Water/plant milk', 'Banana', 'Peanut butter', 'Jaggery'] },
      { name: 'Vegetable Upma', items: ['Suji (semolina)', 'Mixed vegetables', 'Mustard seeds', 'Curry leaves'] },
    ],
    lunches: [
      { name: 'Daal Chawal', items: ['Masoor daal', 'Basmati rice', 'Oil tarka', 'Lemon', 'Salad'] },
      { name: 'Chana Masala & Roti', items: ['Chickpeas', 'Tomato gravy', 'Onion', 'Whole wheat roti'] },
      { name: 'Rajma Chawal', items: ['Kidney beans', 'Basmati rice', 'Onion', 'Tomato', 'Spices'] },
      { name: 'Aloo Matar & Roti', items: ['Potatoes', 'Peas', 'Tomato gravy', 'Whole wheat roti'] },
      { name: 'Vegetable Pulao', items: ['Basmati rice', 'Mixed vegetables', 'Whole spices', 'Cooking oil'] },
      { name: 'Sabzi & Roti', items: ['Mixed vegetable sabzi', 'Whole wheat roti', 'Salad', 'Lemon'] },
      { name: 'Moong Daal & Rice', items: ['Moong daal', 'Basmati rice', 'Garlic tarka', 'Salad'] },
    ],
    dinners: [
      { name: 'Aloo Gobi & Roti', items: ['Potatoes', 'Cauliflower', 'Spices', 'Whole wheat roti'] },
      { name: 'Daal Mash & Naan', items: ['Urad daal', 'Oil tarka', 'Whole wheat naan', 'Salad'] },
      { name: 'Baingan Bharta & Roti', items: ['Roasted eggplant', 'Onion', 'Tomato', 'Roti'] },
      { name: 'Vegetable Biryani', items: ['Mixed vegetables', 'Basmati rice', 'Biryani masala', 'Oil'] },
      { name: 'Chana Daal & Roti', items: ['Chana daal', 'Tarka', 'Whole wheat roti', 'Onion salad'] },
      { name: 'Bhindi Masala & Rice', items: ['Okra (bhindi)', 'Onion', 'Tomato', 'Basmati rice'] },
      { name: 'Karhi Pakora & Rice', items: ['Gram flour karhi', 'Pakoras', 'Basmati rice'] },
    ],
    snacks: [
      { name: 'Roasted Chana', items: ['Roasted chickpeas', 'Salt', 'Lemon juice'] },
      { name: 'Fruit Chaat', items: ['Banana', 'Apple', 'Guava', 'Chaat masala'] },
      { name: 'Peanut Gur Mix', items: ['Roasted peanuts', 'Jaggery (gur)'] },
      { name: 'Dates & Almonds', items: ['Dates', 'Almonds', 'Walnuts'] },
      { name: 'Shakarkandi Chaat', items: ['Roasted sweet potato', 'Lemon', 'Chaat masala'] },
      { name: 'Corn on the Cob', items: ['Boiled corn', 'Salt', 'Lemon', 'Chili powder'] },
      { name: 'Chanay ki Daal Namkeen', items: ['Roasted chana daal', 'Spices', 'Peanuts'] },
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
