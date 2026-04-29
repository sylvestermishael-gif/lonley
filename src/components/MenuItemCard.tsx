import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Heart, Star } from 'lucide-react';
import { MenuItem } from '../types';
import { formatPrice } from '../lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10 }}
      className="group bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-1000 border border-brand-primary/5"
    >
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        
        {item.isPopular && (
          <div className="absolute top-4 left-4 bg-brand-accent text-brand-dark px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg">
            <Star size={10} fill="currentColor" /> Chef's Signature
          </div>
        )}
        
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-4 right-4 p-2 backdrop-blur-md rounded-full transition-all z-10 ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' 
              : 'bg-white/20 text-white hover:text-red-500'
          }`}
        >
          <motion.div
            animate={{ scale: isFavorite ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </motion.div>
        </button>

        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full lg:group-hover:translate-y-0 transition-transform duration-700 hidden lg:block">
          <button
            onClick={() => onAddToCart(item)}
            className="w-full bg-brand-primary text-white py-3 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors duration-700 hover:bg-brand-secondary shadow-xl"
          >
            <Plus size={16} /> Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-lg md:text-xl group-hover:text-brand-primary transition-colors pr-2">{item.name}</h3>
            <span className="font-medium text-brand-secondary whitespace-nowrap">{formatPrice(item.price)}</span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 mb-4">
            {item.description}
          </p>
        </div>
        
        {/* Mobile Add to Cart Button */}
        <button
          onClick={() => onAddToCart(item)}
          className="w-full lg:hidden bg-brand-primary text-white py-3 flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all"
        >
          <Plus size={14} /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
