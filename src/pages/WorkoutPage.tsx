import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '@/lib/storage';
import { Dumbbell, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function WorkoutPage() {
  const workoutPlan = storage.getWorkoutPlan()!;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [expandedDay, setExpandedDay] = useState<string | null>(today);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Weekly Workout Plan</h1>
        <p className="text-muted-foreground mt-1">Your personalized training schedule</p>
      </motion.div>

      <div className="space-y-3">
        {workoutPlan.map((day, i) => {
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    day.isRest ? 'bg-secondary' : 'gradient-primary'
                  }`}>
                    <Dumbbell className={`w-5 h-5 ${day.isRest ? 'text-muted-foreground' : 'text-primary-foreground'}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-display font-semibold text-foreground flex items-center gap-2">
                      {day.day}
                      {isToday && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Today</span>}
                    </p>
                    <p className={`text-sm ${day.isRest ? 'text-muted-foreground' : 'text-primary'}`}>
                      {day.isRest ? 'Rest Day' : day.muscleGroup}
                    </p>
                  </div>
                </div>
                {!day.isRest && (isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />)}
              </button>

              <AnimatePresence>
                {isExpanded && !day.isRest && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4">
                      {/* Warmup */}
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Warm-up</p>
                        <ul className="space-y-1">
                          {day.warmup?.map((w, j) => (
                            <li key={j} className="text-sm text-muted-foreground">• {w}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Exercises */}
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Exercises</p>
                        <div className="space-y-3">
                          {day.exercises?.map((ex, j) => (
                            <div key={j} className="bg-secondary/50 rounded-xl p-3.5">
                              <div className="flex items-start justify-between mb-1">
                                <p className="font-medium text-foreground text-sm">{ex.name}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-2">
                                  <Clock className="w-3 h-3" />
                                  {ex.rest}
                                </div>
                              </div>
                              <p className="text-xs text-primary font-medium mb-1">
                                {ex.sets} sets × {ex.reps} reps
                              </p>
                              <p className="text-xs text-muted-foreground">{ex.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cooldown */}
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Cool-down</p>
                        <ul className="space-y-1">
                          {day.cooldown?.map((c, j) => (
                            <li key={j} className="text-sm text-muted-foreground">• {c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isExpanded && day.isRest && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground">
                    Take today to recover. Focus on light stretching, walking, or yoga. 
                    Proper rest is essential for muscle growth and injury prevention. 🧘‍♂️
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
