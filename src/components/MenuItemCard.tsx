import React from 'react';
import { motion } from 'motion/react';
import { Plus, Heart, Star } from 'lucide-react';
import { MenuItem } from '../types';
import { formatPrice, cn } from '../lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
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
      <div className="relative h-64 overflow-hidden">
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
        
        <button className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:text-red-500 transition-colors">
          <Heart size={18} />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-700">
          <button
            onClick={() => onAddToCart(item)}
            className="w-full bg-brand-primary text-white py-3 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors duration-700 hover:bg-brand-secondary"
          >
            <Plus size={16} /> Add to Cart
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl group-hover:text-brand-primary transition-colors">{item.name}</h3>
          <span className="font-medium text-brand-secondary">{formatPrice(item.price)}</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
