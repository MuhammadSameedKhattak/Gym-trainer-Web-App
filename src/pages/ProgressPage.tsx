import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';
import { getProgressMessage } from '@/lib/calculations';
import { TrendingUp, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressPage() {
  const profile = storage.getProfile()!;
  const [weightLog, setWeightLog] = useState(storage.getWeightLog());
  const [newWeight, setNewWeight] = useState('');

  const addWeight = () => {
    if (!newWeight || Number(newWeight) <= 0) return;
    const entry = { date: new Date().toISOString().split('T')[0], weight: Number(newWeight) };
    storage.addWeightEntry(entry);
    setWeightLog(storage.getWeightLog());
    setNewWeight('');
  };

  const chartData = useMemo(() =>
    weightLog.map(e => ({ date: e.date.slice(5), weight: e.weight })),
    [weightLog]
  );

  const progressMsg = useMemo(() => getProgressMessage(weightLog, profile.fitnessGoal), [weightLog]);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Progress Tracker</h1>
        <p className="text-muted-foreground mt-1">Track your journey over time</p>
      </motion.div>

      {/* Progress Message */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground">{progressMsg}</p>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">Weight Over Time</h3>
        {chartData.length > 1 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="date" stroke="hsl(215 12% 50%)" fontSize={12} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="hsl(215 12% 50%)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: '12px', color: 'hsl(210 20% 92%)' }}
                />
                <Line type="monotone" dataKey="weight" stroke="hsl(160 84% 44%)" strokeWidth={2.5} dot={{ fill: 'hsl(160 84% 44%)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">Log at least 2 entries to see your chart.</p>
        )}
      </motion.div>

      {/* Add Weight */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <h3 className="font-display font-semibold text-foreground mb-3">Log Today's Weight</h3>
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="Weight in kg"
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            className="bg-secondary border-border text-foreground"
          />
          <Button onClick={addWeight} className="gradient-primary text-primary-foreground hover:opacity-90 shrink-0">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </motion.div>

      {/* Weight History */}
      {weightLog.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-3">History</h3>
          <div className="space-y-2">
            {[...weightLog].reverse().slice(0, 10).map((entry, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground">{entry.date}</span>
                <span className="text-foreground font-medium">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
