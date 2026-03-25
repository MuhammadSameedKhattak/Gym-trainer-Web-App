import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';
import { generateWorkoutPlan, generateDietPlan } from '@/lib/planGenerator';
import { calculateBMI, getBMICategory, calculateMacros } from '@/lib/calculations';
import { UserProfile, FitnessGoal, ActivityLevel, DietaryPreference, Gender } from '@/types/user';
import { User, Save, RefreshCw, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ProfilePageProps {
  onReset: () => void;
}

export default function ProfilePage({ onReset }: ProfilePageProps) {
  const profile = storage.getProfile()!;
  const [form, setForm] = useState({ ...profile, age: String(profile.age), weight: String(profile.weight), height: String(profile.height), bodyFatPercent: profile.bodyFatPercent ? String(profile.bodyFatPercent) : '' });

  const update = (field: string, value: string | number) => setForm(p => ({ ...p, [field]: value }));

  const bmi = useMemo(() => calculateBMI(Number(form.weight), Number(form.height)), [form.weight, form.height]);

  const handleSave = () => {
    const updated: UserProfile = {
      ...profile,
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
    };
    storage.setProfile(updated);
    toast.success('Profile updated!');
  };

  const handleRegenerate = () => {
    handleSave();
    const p = storage.getProfile()!;
    storage.setWorkoutPlan(generateWorkoutPlan(p));
    storage.setDietPlan(generateDietPlan(p));
    toast.success('Plans regenerated!');
  };

  const handleReset = () => {
    storage.clearAll();
    onReset();
  };

  const SelectButtons = ({ label, options, value, field }: { label: string; options: { value: string; label: string }[]; value: string; field: string }) => (
    <div>
      <Label className="text-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {options.map(o => (
          <button key={o.value} onClick={() => update(field, o.value)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${value === o.value ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-surface-hover'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your settings and preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5"
      >
        {/* BMI Card */}
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Your BMI</p>
          <p className="text-3xl font-display font-bold text-primary">{bmi}</p>
          <p className="text-sm text-muted-foreground">{getBMICategory(bmi)}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground">Name</Label>
            <Input value={form.name} onChange={e => update('name', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
          </div>
          <div>
            <Label className="text-foreground">Age</Label>
            <Input type="number" value={form.age} onChange={e => update('age', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
          </div>
          <div>
            <Label className="text-foreground">Weight (kg)</Label>
            <Input type="number" value={form.weight} onChange={e => update('weight', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
          </div>
          <div>
            <Label className="text-foreground">Height (cm)</Label>
            <Input type="number" value={form.height} onChange={e => update('height', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
          </div>
          <div>
            <Label className="text-foreground">Body Fat % (optional)</Label>
            <Input type="number" value={form.bodyFatPercent} onChange={e => update('bodyFatPercent', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
          </div>
        </div>

        <SelectButtons label="Gender" field="gender" value={form.gender}
          options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]}
        />

        <SelectButtons label="Fitness Goal" field="fitnessGoal" value={form.fitnessGoal}
          options={[
            { value: 'weight_loss', label: '🔥 Weight Loss' }, { value: 'muscle_gain', label: '💪 Muscle Gain' },
            { value: 'recomposition', label: '⚡ Recomposition' }, { value: 'improve_fitness', label: '🏃 Fitness' },
            { value: 'bulk_up', label: '🏋️ Bulk Up' },
          ]}
        />

        <SelectButtons label="Activity Level" field="activityLevel" value={form.activityLevel}
          options={[
            { value: 'sedentary', label: 'Sedentary' }, { value: 'lightly_active', label: 'Lightly Active' },
            { value: 'moderately_active', label: 'Moderately Active' }, { value: 'very_active', label: 'Very Active' },
          ]}
        />

        <div>
          <Label className="text-foreground">Workout Days/Week</Label>
          <div className="flex gap-2 mt-1.5">
            {([3, 4, 5, 6] as const).map(d => (
              <button key={d} onClick={() => update('workoutDays', d)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${form.workoutDays === d ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <SelectButtons label="Dietary Preference" field="dietaryPreference" value={form.dietaryPreference}
          options={[
            { value: 'no_restriction', label: 'No Restriction' }, { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'vegan', label: 'Vegan' }, { value: 'high_protein', label: 'High Protein' },
            { value: 'low_carb', label: 'Low Carb' },
          ]}
        />

        <div>
          <Label className="text-foreground">Injuries / Limitations</Label>
          <Textarea value={form.injuries} onChange={e => update('injuries', e.target.value)} className="mt-1.5 bg-secondary border-border text-foreground" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button onClick={handleSave} className="gradient-primary text-primary-foreground hover:opacity-90">
            <Save className="w-4 h-4 mr-1" /> Save Profile
          </Button>
          <Button onClick={handleRegenerate} variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <RefreshCw className="w-4 h-4 mr-1" /> Save & Regenerate Plans
          </Button>
          <Button onClick={handleReset} variant="ghost" className="text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-1" /> Reset All Data
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
