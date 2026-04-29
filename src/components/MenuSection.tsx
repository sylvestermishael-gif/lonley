import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';
import { Category, MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menu';
import MenuItemCard from './MenuItemCard';
import { cn } from '../lib/utils';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

const CATEGORIES: Category[] = ['Starters', 'Mains', 'Grill', 'Sides', 'Desserts', 'Drinks'];

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="section-padding scroll-mt-20">
      <div className="text-center mb-10 md:mb-16">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-brand-secondary font-medium tracking-[0.3em] uppercase text-[10px] md:text-xs mb-3 md:mb-4 block"
        >
          Our Offerings
        </motion.span>
        <h2 className="text-3xl md:text-6xl font-serif mb-4 md:mb-6 leading-tight">Culinary Masterpieces</h2>
        <div className="w-16 md:w-24 h-1 bg-brand-accent mx-auto" />
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12 sticky top-[60px] md:top-[72px] z-30 py-4 bg-brand-background/90 backdrop-blur-md px-4 rounded-xl shadow-sm border border-brand-primary/5 mx-2 md:mx-0">
        <div className="flex w-full overflow-x-auto no-scrollbar lg:flex-wrap justify-start lg:justify-center gap-2 pb-2 lg:pb-0">
          <button
            onClick={() => setActiveCategory('All')}
            className={cn(
              "px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all rounded-full whitespace-nowrap",
              activeCategory === 'All' ? "bg-brand-primary text-white" : "bg-white border border-gray-200 hover:border-brand-primary"
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all rounded-full whitespace-nowrap",
                activeCategory === cat ? "bg-brand-primary text-white" : "bg-white border border-gray-200 hover:border-brand-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search our flavors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm"
          />
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <div key={item.id}>
              <MenuItemCard item={item} onAddToCart={onAddToCart} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-24 opacity-50">
          <p className="font-serif text-2xl italic mb-4">No matches found for "{searchQuery}"</p>
          <button 
            onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
            className="text-brand-primary font-bold uppercase tracking-widest text-xs"
          >
            View Full Menu
          </button>
        </div>
      )}

      {/* Specialty Banner */}
      <div className="mt-24 relative overflow-hidden bg-brand-dark p-12 md:p-24 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1548" 
            className="w-full h-full object-cover"
            alt="Chef at work"
          />
        </div>
        <div className="relative z-10 max-w-xl">
          <span className="text-brand-accent tracking-[0.3em] font-medium uppercase text-xs mb-4 block">Seasonal Special</span>
          <h3 className="text-4xl md:text-5xl font-serif mb-6 italic italic">The Fisherman's <br/>Harvest Pottage</h3>
          <p className="text-lg text-white/70 mb-8 font-light">
            A celebration of the Niger Delta—fresh snails, periwinkles, and dried river fish slow-cooked with heritage yams.
          </p>
          <button className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs hover:text-brand-accent transition-colors group">
            Learn More <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
