import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice } from '../lib/utils';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout
}: CartSidebarProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 80, mass: 1.2 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-background z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-brand-primary" />
                <h2 className="text-2xl font-serif">Your Order</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="font-serif text-xl italic">Your taste buds are waiting... <br/> Add something delicious.</p>
                  <button 
                    onClick={onClose}
                    className="text-brand-primary font-bold uppercase tracking-widest text-xs underline underline-offset-8"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-lg leading-tight truncate">{item.name}</h4>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-brand-secondary font-medium mb-3">{formatPrice(item.price)}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-full">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 px-2 hover:text-brand-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 px-2 hover:text-brand-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-200 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span className="text-brand-primary">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-gray-500 italic">Delivery fees and taxes calculated at checkout.</p>
                <button
                  onClick={onCheckout}
                  className="w-full btn-premium py-4 font-bold flex items-center justify-center gap-3"
                >
                  Proceed to Checkout <Plus size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
