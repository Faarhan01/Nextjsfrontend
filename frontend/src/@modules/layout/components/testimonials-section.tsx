import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

interface TestimonialsSectionProps {
  themeColor?: string;
  getThemeClasses?: (color?: string) => any;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  themeColor = 'blue',
  getThemeClasses
}) => {
  const currentTheme = getThemeClasses ? getThemeClasses(themeColor) : null;
  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Verified Buyer',
      rating: 5,
      comment: 'The noise-cancelling headphones arrived in two days. Outstanding build quality and crystal clear audio depth!',
      date: '2 days ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'
    },
    {
      name: 'Marcus Vance',
      role: 'VIP Customer',
      rating: 5,
      comment: 'Consistently exceptional experience. Wholesale pricing option made ordering for my entire studio team effortless.',
      date: '1 week ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
    },
    {
      name: 'Elena Rostova',
      role: 'Verified Buyer',
      rating: 5,
      comment: 'The ergonomic velvet armchair transforms my living room workspace. Seamless packaging and prompt delivery!',
      date: '2 weeks ago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
    }
  ];

  const pillClass = currentTheme
    ? `${currentTheme.lightBg} ${currentTheme.text} ${currentTheme.border}`
    : 'bg-blue-50 dark:bg-blue-950/50 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs ${pillClass}`}>
          <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> Customer Stories
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Trusted by 10,000+ Happy Shoppers
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
          Read genuine reviews from verified customers who shop our curated catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-200 dark:text-slate-700" />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-6">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/80">
              <img 
                src={rev.avatar} 
                alt={rev.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.name}</h4>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-emerald-50" />
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{rev.role} • {rev.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
