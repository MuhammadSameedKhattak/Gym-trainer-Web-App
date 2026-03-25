import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';
import { calculateMacros, calculateBMI, getBMICategory } from '@/lib/calculations';
import { generateWorkoutPlan, generateDietPlan } from '@/lib/planGenerator';
import { getDailyQuote } from '@/lib/quotes';
import { Target, Flame, Droplets, Scale, Activity, RefreshCw, Zap, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = storage.getProfile()!;
  const workoutPlan = storage.getWorkoutPlan()!;
  const dietPlan = storage.getDietPlan()!;
  const macros = useMemo(() => calculateMacros(profile), []);
  const bmi = useMemo(() => calculateBMI(profile.weight, profile.height), []);
  const quote = useMemo(() => getDailyQuote(), []);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayWorkout = workoutPlan.find(d => d.day === today) || workoutPlan[0];
  const todayDiet = dietPlan.find(d => d.day === today) || dietPlan[0];

  const [waterGlasses, setWaterGlasses] = useState(storage.getWaterToday());

  const toggleWater = (idx: number) => {
    const newVal = idx + 1 === waterGlasses ? idx : idx + 1;
    setWaterGlasses(newVal);
    storage.setWaterToday(newVal);
  };

  const handleRegenerate = () => {
    storage.setWorkoutPlan(generateWorkoutPlan(profile));
    storage.setDietPlan(generateDietPlan(profile));
    window.location.reload();
  };

  const goalLabels: Record<string, string> = {
    weight_loss: 'Weight Loss', muscle_gain: 'Muscle Gain', recomposition: 'Body Recomposition',
    improve_fitness: 'Improve Fitness', bulk_up: 'Bulk Up',
  };

  const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ delay: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Welcome back, <span className="text-primary glow-text">{profile.name}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Let's crush today's goals 💪</p>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground italic">"{quote}"</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Daily Calories', value: `${macros.calories}`, unit: 'kcal', icon: Flame, color: 'text-orange-400' },
          { label: 'Protein', value: `${macros.protein}g`, unit: '', icon: Target, color: 'text-primary' },
          { label: 'BMI', value: `${bmi}`, unit: getBMICategory(bmi), icon: Scale, color: 'text-info' },
          { label: 'Goal', value: goalLabels[profile.fitnessGoal], unit: '', icon: Trophy, color: 'text-warning' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label} {stat.unit && `· ${stat.unit}`}</p>
          </div>
        ))}
      </motion.div>

      {/* Macros Bar */}
      <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-3">Daily Macros</h3>
        <div className="space-y-3">
          {[
            { label: 'Protein', value: macros.protein, max: macros.protein, unit: 'g', color: 'bg-primary' },
            { label: 'Carbs', value: macros.carbs, max: macros.carbs, unit: 'g', color: 'bg-info' },
            { label: 'Fats', value: macros.fats, max: macros.fats, unit: 'g', color: 'bg-warning' },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{m.label}</span>
                <span className="text-foreground font-medium">{m.value}{m.unit}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${m.color} rounded-full`} style={{ width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Today's Workout & Diet */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => navigate('/workout')}
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Today's Workout</h3>
          </div>
          {todayWorkout.isRest ? (
            <p className="text-muted-foreground">Rest Day — Recovery & Stretching 🧘</p>
          ) : (
            <div>
              <p className="text-primary font-medium mb-2">{todayWorkout.muscleGroup}</p>
              <ul className="space-y-1">
                {todayWorkout.exercises?.slice(0, 4).map((ex, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {ex.name} — {ex.sets}×{ex.reps}</li>
                ))}
              </ul>
              {(todayWorkout.exercises?.length || 0) > 4 && (
                <p className="text-xs text-primary mt-2">+ {(todayWorkout.exercises?.length || 0) - 4} more exercises →</p>
              )}
            </div>
          )}
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => navigate('/diet')}
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="font-display font-semibold text-foreground">Today's Meals</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Breakfast', name: todayDiet.breakfast.name, cal: todayDiet.breakfast.calories },
              { label: 'Lunch', name: todayDiet.lunch.name, cal: todayDiet.lunch.calories },
              { label: 'Dinner', name: todayDiet.dinner.name, cal: todayDiet.dinner.calories },
              { label: 'Snack', name: todayDiet.snack.name, cal: todayDiet.snack.calories },
            ].map(m => (
              <div key={m.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{m.label}: <span className="text-foreground">{m.name}</span></span>
                <span className="text-muted-foreground">{m.cal} kcal</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Water Tracker */}
      <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Droplets className="w-5 h-5 text-info" />
          <h3 className="font-display font-semibold text-foreground">Water Intake</h3>
          <span className="text-sm text-muted-foreground ml-auto">{waterGlasses}/8 glasses</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              onClick={() => toggleWater(i)}
              className={`flex-1 h-10 rounded-lg transition-all ${
                i < waterGlasses ? 'bg-info/20 border-2 border-info' : 'bg-secondary border-2 border-transparent'
              }`}
            >
              <Droplets className={`w-4 h-4 mx-auto ${i < waterGlasses ? 'text-info' : 'text-muted-foreground/30'}`} />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Regenerate */}
      <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
        <button
          onClick={handleRegenerate}
          className="w-full bg-card border border-border rounded-2xl p-4 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate Workout & Diet Plan
        </button>
      </motion.div>
    </div>
  );
}
