import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '@/lib/storage';
import { UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react';

export default function DietPage() {
  const dietPlan = storage.getDietPlan()!;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [expandedDay, setExpandedDay] = useState<string | null>(today);

  const MealCard = ({ label, meal }: { label: string; meal: { name: string; calories: number; protein: number; carbs: number; fats: number; items: string[] } }) => (
    <div className="bg-secondary/50 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-primary font-semibold uppercase tracking-wider">{label}</p>
          <p className="font-medium text-foreground text-sm mt-0.5">{meal.name}</p>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">{meal.calories} kcal</span>
      </div>
      <div className="flex gap-3 text-xs text-muted-foreground mb-2">
        <span>P: {meal.protein}g</span>
        <span>C: {meal.carbs}g</span>
        <span>F: {meal.fats}g</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {meal.items.map((item, i) => (
          <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">{item}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Weekly Diet Plan</h1>
        <p className="text-muted-foreground mt-1">Nutrition tailored to your goals</p>
      </motion.div>

      <div className="space-y-3">
        {dietPlan.map((day, i) => {
          const isExpanded = expandedDay === day.day;
          const isToday = day.day === today;

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-card border rounded-2xl overflow-hidden transition-colors ${
                isToday ? 'border-primary/40 glow-primary' : 'border-border'
              }`}
            >
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                className="w-full p-4 sm:p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-display font-semibold text-foreground flex items-center gap-2">
                      {day.day}
                      {isToday && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Today</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{day.totalCalories} kcal total</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3">
                      <MealCard label="Breakfast" meal={day.breakfast} />
                      <MealCard label="Lunch" meal={day.lunch} />
                      <MealCard label="Dinner" meal={day.dinner} />
                      <MealCard label="Snack" meal={day.snack} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
