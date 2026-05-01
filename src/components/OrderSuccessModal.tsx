import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, MapPin, MessageCircle } from 'lucide-react';
import { CartItem, CheckoutData } from '../types';
import { formatPrice } from '../lib/utils';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackInApp: () => void;
  orderData: CheckoutData | null;
  items: CartItem[];
  whatsappUrl: string;
}

export default function OrderSuccessModal({
  isOpen,
  onClose,
  onTrackInApp,
  orderData,
  items,
  whatsappUrl
}: OrderSuccessModalProps) {
  if (!orderData) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderData.type === 'delivery' ? 2500 : 0;
  const estimatedTime = orderData.type === 'delivery' ? '45-60 mins' : '20-30 mins';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
          >
            <div className="flex-1 p-8 md:p-12">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
                <CheckCircle size={32} />
              </div>

              <h2 className="text-4xl font-serif mb-4 leading-tight">Order Placed <br/><span className="italic font-light">Successfully</span></h2>
              <p className="text-gray-500 mb-8 font-light">
                Your order is being prepared by our master chefs. We'll notify you as soon as it's ready.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-brand-secondary text-[10px] font-bold uppercase tracking-widest mb-1">
                    <Clock size={12} /> Estimated Time
                  </div>
                  <p className="text-xl font-serif">{estimatedTime}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-brand-secondary text-[10px] font-bold uppercase tracking-widest mb-1">
                    <MapPin size={12} /> {orderData.type === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
                  </div>
                  <p className="text-sm font-medium">{orderData.type === 'delivery' ? orderData.address : 'Zuma Rock Way, Maitama'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                <button 
                  onClick={onTrackInApp}
                  className="btn-premium flex-1 bg-brand-primary text-white"
                >
                  Track in App
                </button>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#25D366] py-3.5 font-bold uppercase tracking-widest text-[10px] hover:bg-[#25D366] hover:text-white transition-all"
                >
                  WhatsApp <MessageCircle size={14} />
                </a>
              </div>
              <button 
                onClick={onClose}
                className="w-full mt-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-brand-primary transition-colors py-2"
              >
                Back to Home
              </button>
            </div>

            <div className="w-full md:w-64 bg-gray-50 p-8 border-t md:border-t-0 md:border-l border-gray-200">
              <h3 className="font-serif text-lg mb-6 border-b border-gray-200 pb-4">Receipt</h3>
              <div className="space-y-3 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-500">{item.quantity}x {item.name}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                  <span>{orderData.type}</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-serif font-bold pt-4 text-brand-primary">
                  <span>Total</span>
                  <span>{formatPrice(subtotal + deliveryFee)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
