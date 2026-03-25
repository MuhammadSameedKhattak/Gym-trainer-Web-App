import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, FitnessGoal, ActivityLevel, DietaryPreference, Gender } from '@/types/user';
import { storage } from '@/lib/storage';
import { generateWorkoutPlan, generateDietPlan } from '@/lib/planGenerator';
import { Dumbbell, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = ['Personal Info', 'Body Stats', 'Fitness Goals', 'Workout Preferences', 'Diet'];

const goalOptions: { value: FitnessGoal; label: string; emoji: string }[] = [
  { value: 'weight_loss', label: 'Weight Loss', emoji: '🔥' },
  { value: 'muscle_gain', label: 'Muscle Gain', emoji: '💪' },
  { value: 'recomposition', label: 'Body Recomposition', emoji: '⚡' },
  { value: 'improve_fitness', label: 'Improve Fitness', emoji: '🏃' },
  { value: 'bulk_up', label: 'Bulk Up', emoji: '🏋️' },
];

const activityOptions: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary (desk job)' },
  { value: 'lightly_active', label: 'Lightly Active (1-2x/week)' },
  { value: 'moderately_active', label: 'Moderately Active (3-5x/week)' },
  { value: 'very_active', label: 'Very Active (6-7x/week)' },
];

const dietOptions: { value: DietaryPreference; label: string }[] = [
  { value: 'no_restriction', label: 'No Restriction' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'high_protein', label: 'High Protein' },
  { value: 'low_carb', label: 'Low Carb' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'male' as Gender,
    weight: '',
    height: '',
    bodyFatPercent: '',
    fitnessGoal: 'muscle_gain' as FitnessGoal,
    activityLevel: 'moderately_active' as ActivityLevel,
    workoutDays: 4 as 3 | 4 | 5 | 6,
    injuries: '',
    dietaryPreference: 'no_restriction' as DietaryPreference,
  });

  const update = (field: string, value: string | number) => setForm(p => ({ ...p, [field]: value }));

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.age && Number(form.age) > 0;
    if (step === 1) return form.weight && form.height && Number(form.weight) > 0 && Number(form.height) > 0;
    return true;
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      weight: Number(form.weight),
      height: Number(form.height),
      bodyFatPercent: form.bodyFatPercent ? Number(form.bodyFatPercent) : undefined,
      fitnessGoal: form.fitnessGoal,
      activityLevel: form.activityLevel,
      workoutDays: form.workoutDays,
      injuries: form.injuries,
      dietaryPreference: form.dietaryPreference,
      createdAt: new Date().toISOString(),
    };
    storage.setProfile(profile);
    storage.setWorkoutPlan(generateWorkoutPlan(profile));
    storage.setDietPlan(generateDietPlan(profile));
    storage.addWeightEntry({ date: new Date().toISOString().split('T')[0], weight: profile.weight });
    storage.setOnboarded();
    onComplete();
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              FitForge
            </h1>
          </div>
          <p className="text-muted-foreground">Your AI-Powered Personal Trainer</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                i <= step ? 'gradient-primary' : 'bg-secondary'
              }`} />
              <span className={`text-xs hidden sm:block ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 glow-primary">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-display font-semibold text-foreground">Let's get to know you</h2>
                  <div>
                    <Label className="text-foreground">Name</Label>
                    <Input placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Age</Label>
                    <Input type="number" placeholder="25" value={form.age} onChange={e => update('age', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Gender</Label>
                    <div className="flex gap-2 mt-1.5">
                      {(['male', 'female', 'other'] as Gender[]).map(g => (
                        <button
                          key={g}
                          onClick={() => update('gender', g)}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                            form.gender === g
                              ? 'gradient-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-surface-hover'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-display font-semibold text-foreground">Body Stats</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground">Weight (kg)</Label>
                      <Input type="number" placeholder="75" value={form.weight} onChange={e => update('weight', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
                    </div>
                    <div>
                      <Label className="text-foreground">Height (cm)</Label>
                      <Input type="number" placeholder="175" value={form.height} onChange={e => update('height', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-foreground">Body Fat % (optional)</Label>
                    <Input type="number" placeholder="15" value={form.bodyFatPercent} onChange={e => update('bodyFatPercent', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-display font-semibold text-foreground">What's your goal?</h2>
                  <div className="space-y-2">
                    {goalOptions.map(g => (
                      <button
                        key={g.value}
                        onClick={() => update('fitnessGoal', g.value)}
                        className={`w-full p-3.5 rounded-xl text-left text-sm font-medium transition-all flex items-center gap-3 ${
                          form.fitnessGoal === g.value
                            ? 'gradient-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-surface-hover'
                        }`}
                      >
                        <span className="text-lg">{g.emoji}</span>
                        {g.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <Label className="text-foreground">Activity Level</Label>
                    <div className="space-y-2 mt-2">
                      {activityOptions.map(a => (
                        <button
                          key={a.value}
                          onClick={() => update('activityLevel', a.value)}
                          className={`w-full p-3 rounded-xl text-left text-sm font-medium transition-all ${
                            form.activityLevel === a.value
                              ? 'gradient-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-surface-hover'
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-display font-semibold text-foreground">Workout Preferences</h2>
                  <div>
                    <Label className="text-foreground">Days per week you can workout</Label>
                    <div className="flex gap-2 mt-2">
                      {([3, 4, 5, 6] as const).map(d => (
                        <button
                          key={d}
                          onClick={() => update('workoutDays', d)}
                          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                            form.workoutDays === d
                              ? 'gradient-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-surface-hover'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-foreground">Any injuries or limitations?</Label>
                    <Textarea
                      placeholder="E.g., bad knee, lower back issues..."
                      value={form.injuries}
                      onChange={e => update('injuries', e.target.value)}
                      className="mt-1.5 bg-secondary border-border text-foreground"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-display font-semibold text-foreground">Dietary Preference</h2>
                  <div className="space-y-2">
                    {dietOptions.map(d => (
                      <button
                        key={d.value}
                        onClick={() => update('dietaryPreference', d.value)}
                        className={`w-full p-3.5 rounded-xl text-left text-sm font-medium transition-all ${
                          form.dietaryPreference === d.value
                            ? 'gradient-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-surface-hover'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="gradient-primary text-primary-foreground hover:opacity-90"
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                className="gradient-primary text-primary-foreground hover:opacity-90"
              >
                <Check className="w-4 h-4 mr-1" /> Start Training
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
