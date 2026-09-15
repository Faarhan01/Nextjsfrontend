'use client';

import React from 'react';
import { 
  LayoutGrid,
  Percent,
  Laptop,
  Headphones,
  Home,
  Shirt,
  Heart,
  Sparkles,
  Watch,
  Car,
  Briefcase,
  Plug,
  PawPrint,
  Dumbbell,
  Gamepad2,
  Wrench,
  ShoppingBag,
  ShieldAlert,
  Footprints,
  Armchair,
  Lightbulb,
  Folder
} from 'lucide-react';

export interface CategoryIconProps {
  category: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = React.memo(({ category, className = 'w-3 h-3' }) => {
  const cat = category.toLowerCase().trim();

  if (cat === 'all') return <LayoutGrid className={className} />;
  if (cat.includes('sale') || cat.includes('deal')) return <Percent className={className} />;
  if (cat.includes('electron') || cat.includes('tech') || cat.includes('gadget')) return <Laptop className={className} />;
  if (cat.includes('audio') || cat.includes('headphone') || cat.includes('sound')) return <Headphones className={className} />;
  if (cat.includes('home') || cat.includes('kitchen') || cat.includes('living')) return <Home className={className} />;
  if (cat.includes('apparel') || cat.includes('fashion') || cat.includes('cloth')) return <Shirt className={className} />;
  if (cat.includes('personal') || cat.includes('wellness') || cat.includes('health') || cat.includes('care')) return <Heart className={className} />;
  if (cat.includes('beauty') || cat.includes('cosmetic')) return <Sparkles className={className} />;
  if (cat.includes('accessori') || cat.includes('jewelry') || cat.includes('watch')) return <Watch className={className} />;
  if (cat.includes('auto') || cat.includes('car')) return <Car className={className} />;
  if (cat.includes('station') || cat.includes('office')) return <Briefcase className={className} />;
  if (cat.includes('appliance')) return <Plug className={className} />;
  if (cat.includes('pet')) return <PawPrint className={className} />;
  if (cat.includes('sport') || cat.includes('outdoor') || cat.includes('fitness')) return <Dumbbell className={className} />;
  if (cat.includes('toy') || cat.includes('game')) return <Gamepad2 className={className} />;
  if (cat.includes('tool') || cat.includes('hardware')) return <Wrench className={className} />;
  if (cat.includes('food') || cat.includes('grocer')) return <ShoppingBag className={className} />;
  if (cat.includes('pest')) return <ShieldAlert className={className} />;
  if (cat.includes('shoe') || cat.includes('footwear') || cat.includes('sneaker')) return <Footprints className={className} />;
  if (cat.includes('furnit')) return <Armchair className={className} />;
  if (cat.includes('light') || cat.includes('lamp')) return <Lightbulb className={className} />;

  return <Folder className={className} />;
});

CategoryIcon.displayName = 'CategoryIcon';
