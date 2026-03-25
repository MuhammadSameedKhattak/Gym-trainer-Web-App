const QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Strive for progress, not perfection.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't wish for it. Work for it.",
  "Discipline is choosing between what you want now and what you want most.",
  "Success is walking from failure to failure with no loss of enthusiasm.",
  "The secret of getting ahead is getting started.",
  "It never gets easier, you just get stronger.",
  "Sweat is just fat crying.",
  "Push harder than yesterday if you want a different tomorrow.",
  "Your health is an investment, not an expense.",
  "The only limit is the one you set yourself.",
  "Fall in love with taking care of yourself.",
  "Motivation gets you started. Habit keeps you going.",
  "Be stronger than your excuses.",
  "Every champion was once a contender who refused to give up.",
  "The body achieves what the mind believes.",
  "Train insane or remain the same.",
  "You don't have to be extreme, just consistent.",
  "Small daily improvements lead to stunning results.",
  "Make yourself proud.",
  "If it doesn't challenge you, it doesn't change you.",
  "Believe in yourself and all that you are.",
  "Strength does not come from the body. It comes from the will.",
  "The best project you will ever work on is you.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "One workout at a time. One day at a time. One meal at a time.",
  "You are one workout away from a good mood.",
];

export function getDailyQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
