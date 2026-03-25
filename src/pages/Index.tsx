import { useState } from 'react';
import { storage } from '@/lib/storage';
import Onboarding from '@/components/Onboarding';
import DashboardPage from './DashboardPage';

export default function Index() {
  const [onboarded, setOnboarded] = useState(storage.isOnboarded());

  if (!onboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)} />;
  }

  return <DashboardPage />;
}
