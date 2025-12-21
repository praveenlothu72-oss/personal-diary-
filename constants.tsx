
import React from 'react';
import { 
  Smile, 
  Frown, 
  Zap, 
  Coffee, 
  Sun, 
  CloudRain, 
  Wind,
  Moon,
  Heart
} from 'lucide-react';
import { Mood } from './types';

export const MOOD_DATA: Record<Mood, { icon: React.ReactNode; color: string }> = {
  [Mood.HAPPY]: { icon: <Smile className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-700' },
  [Mood.SAD]: { icon: <Frown className="w-5 h-5" />, color: 'bg-blue-100 text-blue-700' },
  [Mood.STRESSED]: { icon: <Zap className="w-5 h-5" />, color: 'bg-red-100 text-red-700' },
  [Mood.EXCITED]: { icon: <Sun className="w-5 h-5" />, color: 'bg-orange-100 text-orange-700' },
  [Mood.CALM]: { icon: <Wind className="w-5 h-5" />, color: 'bg-green-100 text-green-700' },
  [Mood.REFLECTIVE]: { icon: <Moon className="w-5 h-5" />, color: 'bg-purple-100 text-purple-700' },
  [Mood.ANXIOUS]: { icon: <CloudRain className="w-5 h-5" />, color: 'bg-slate-100 text-slate-700' },
};
