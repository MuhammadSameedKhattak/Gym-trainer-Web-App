import { UserProfile, WeightEntry, WaterEntry, WorkoutDay, DietDay } from '@/types/user';

const KEYS = {
  profile: 'gym_trainer_profile',
  weightLog: 'gym_trainer_weight_log',
  waterLog: 'gym_trainer_water_log',
  workoutPlan: 'gym_trainer_workout',
  dietPlan: 'gym_trainer_diet',
  onboarded: 'gym_trainer_onboarded',
};

function get<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getProfile: () => get<UserProfile>(KEYS.profile),
  setProfile: (p: UserProfile) => set(KEYS.profile, p),

  getWeightLog: () => get<WeightEntry[]>(KEYS.weightLog) || [],
  addWeightEntry: (entry: WeightEntry) => {
    const log = storage.getWeightLog();
    log.push(entry);
    set(KEYS.weightLog, log);
  },

  getWaterLog: () => get<WaterEntry[]>(KEYS.waterLog) || [],
  setWaterToday: (glasses: number) => {
    const log = storage.getWaterLog();
    const today = new Date().toISOString().split('T')[0];
    const idx = log.findIndex(e => e.date === today);
    if (idx >= 0) log[idx].glasses = glasses;
    else log.push({ date: today, glasses });
    set(KEYS.waterLog, log);
  },
  getWaterToday: (): number => {
    const today = new Date().toISOString().split('T')[0];
    const log = storage.getWaterLog();
    return log.find(e => e.date === today)?.glasses || 0;
  },

  getWorkoutPlan: () => get<WorkoutDay[]>(KEYS.workoutPlan),
  setWorkoutPlan: (p: WorkoutDay[]) => set(KEYS.workoutPlan, p),

  getDietPlan: () => get<DietDay[]>(KEYS.dietPlan),
  setDietPlan: (p: DietDay[]) => set(KEYS.dietPlan, p),

  isOnboarded: () => localStorage.getItem(KEYS.onboarded) === 'true',
  setOnboarded: () => localStorage.setItem(KEYS.onboarded, 'true'),

  clearAll: () => Object.values(KEYS).forEach(k => localStorage.removeItem(k)),
};
