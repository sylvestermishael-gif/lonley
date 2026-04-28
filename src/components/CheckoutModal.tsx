import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Truck, Package, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { CartItem, CheckoutData } from '../types';
import { formatPrice } from '../lib/utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onSubmit: (data: CheckoutData) => void;
  isProcessing?: boolean;
}

export default function CheckoutModal({ isOpen, onClose, cartItems, onSubmit, isProcessing }: CheckoutModalProps) {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<CheckoutData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    type: 'delivery'
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = formData.type === 'delivery' ? 2500 : 0;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 hover:bg-black/5 rounded-full">
          <X size={24} />
        </button>

        {/* Sidebar Order Summary */}
        <div className="w-full md:w-80 bg-gray-50 p-8 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto hidden md:block">
          <h3 className="text-xl font-serif mb-6 border-b border-gray-200 pb-4">Order Summary</h3>
          <div className="space-y-4 mb-8">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate mr-2">{item.quantity}x {item.name}</span>
                <span className="font-medium whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{formData.type === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-xl font-serif font-bold pt-4 text-brand-primary">
              <span>Total</span>
              <span>{formatPrice(total + deliveryFee)}</span>
            </div>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= i ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i}
                </div>
                {i < 3 && <div className={`w-8 h-px ${step > i ? 'bg-brand-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-serif mb-2">How do you want it?</h2>
                  <p className="text-gray-500 text-sm italic">Choose your preferred method of dining.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({...formData, type: 'delivery'})}
                    className={`p-6 border-2 transition-all text-left flex flex-col gap-3 rounded-none ${formData.type === 'delivery' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <Truck size={24} className={formData.type === 'delivery' ? 'text-brand-primary' : 'text-gray-400'} />
                    <div>
                      <h4 className="font-bold text-sm tracking-widest uppercase">Delivery</h4>
                      <p className="text-xs text-gray-500">Estimated 45-60 mins</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setFormData({...formData, type: 'pickup'})}
                    className={`p-6 border-2 transition-all text-left flex flex-col gap-3 rounded-none ${formData.type === 'pickup' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <Package size={24} className={formData.type === 'pickup' ? 'text-brand-primary' : 'text-gray-400'} />
                    <div>
                      <h4 className="font-bold text-sm tracking-widest uppercase">Pickup</h4>
                      <p className="text-xs text-gray-500">Ready in 20-30 mins</p>
                    </div>
                  </button>
                </div>
                
                <div className="pt-8 border-t border-gray-100 flex justify-end">
                  <button onClick={handleNext} className="btn-premium flex items-center gap-2">
                    Next Step <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-serif mb-6">Delivery Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full border-b-2 border-gray-100 py-3 focus:outline-none focus:border-brand-primary" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full border-b-2 border-gray-100 py-3 focus:outline-none focus:border-brand-primary" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                    <input 
                      type="text" 
                      className="w-full border-b-2 border-gray-100 py-3 pl-8 focus:outline-none focus:border-brand-primary" 
                      placeholder="e.g. Maitama, Abuja"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="pt-8 border-t border-gray-100 flex justify-between">
                  <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors">
                    Go Back
                  </button>
                  <button 
                    onClick={handleNext} 
                    disabled={!formData.name || !formData.phone || !formData.address}
                    className="btn-premium flex items-center gap-2"
                  >
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-brand-primary/5 p-6 space-y-4">
                  <h3 className="font-serif text-2xl">One Last Look</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CreditCard size={18} />
                    <span>Payment will be made on {formData.type === 'delivery' ? 'delivery' : 'pickup'} via POS or Cash.</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Guest</h5>
                      <p className="text-sm font-medium">{formData.name}</p>
                      <p className="text-sm text-gray-500">{formData.phone}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Location</h5>
                      <p className="text-sm font-medium">{formData.address}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors">
                    Go Back
                  </button>
                  <button 
                    onClick={() => onSubmit(formData)}
                    disabled={isProcessing}
                    className="btn-premium px-12 py-4 bg-brand-dark text-brand-accent hover:bg-brand-primary hover:text-white disabled:bg-gray-400 disabled:text-gray-200"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Package size={20} />
                        </motion.span>
                        Processing Order...
                      </span>
                    ) : (
                      'Confirm & Place Order'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
