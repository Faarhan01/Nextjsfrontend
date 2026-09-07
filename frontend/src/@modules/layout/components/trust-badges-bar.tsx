import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones, Award } from 'lucide-react';

interface TrustBadgesBarProps {
  themeColor?: string;
  getThemeClasses?: (color?: string) => any;
}

export const TrustBadgesBar: React.FC<TrustBadgesBarProps> = ({
  themeColor = 'blue',
  getThemeClasses
}) => {
  const currentTheme = getThemeClasses ? getThemeClasses(themeColor) : null;
  const badges = [
    {
      icon: Truck,
      title: 'Free Express Shipping',
      subtitle: 'On all orders over R500'
    },
    {
      icon: ShieldCheck,
      title: '100% Secure Checkout',
      subtitle: 'Encrypted SSL payments'
    },
    {
      icon: RefreshCw,
      title: 'Hassle-Free Returns',
      subtitle: '30-day money-back guarantee'
    },
    {
      icon: Headphones,
      title: '24/7 Priority Support',
      subtitle: 'Dedicated customer care'
    }
  ];

  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-white py-6 border-y border-slate-800/90 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 group">
                <div className={`p-2.5 rounded-xl ${currentTheme?.lightBg || 'bg-blue-500/10'} ${currentTheme?.text || 'text-blue-400'} border border-white/5 shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white tracking-tight">{badge.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5 font-medium">{badge.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustBadgesBar;
