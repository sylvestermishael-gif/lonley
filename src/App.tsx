import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import OrderTracking from './components/OrderTracking';
import ReservationSection from './components/ReservationSection';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { MenuItem, CartItem, CheckoutData } from './types';
import { supabase, handleSupabaseError, OperationType } from './lib/supabase';
import { formatPrice } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Send } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<{data: CheckoutData, items: CartItem[]} | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);

  const handleResendVerification = async () => {
    if (user?.email) {
      try {
        await supabase.auth.resend({
          type: 'signup',
          email: user.email,
        });
        setIsEmailVerificationSent(true);
        setTimeout(() => setIsEmailVerificationSent(false), 5000);
      } catch (error) {
        console.error('Error resending verification:', error);
      }
    }
  };

  const handleRefreshAuth = async () => {
    if (user) {
      const { data } = await supabase.auth.refreshSession();
      if (data.user) setUser(data.user);
      window.location.reload();
    }
  };

  useEffect(() => {
    const syncUserProfile = async (u: User) => {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || null,
            updated_at: new Date().toISOString(),
          });
        if (error) console.warn('Profile sync note:', error);
      } catch (error) {
        console.warn('Profile sync error:', error);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) syncUserProfile(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        syncUserProfile(currentUser);
      } else {
        setIsTrackingOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleCheckout = async (data: CheckoutData) => {
    setIsProcessing(true);
    
    // Construct WhatsApp Message
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = data.type === 'delivery' ? 2500 : 0;
    const grandTotal = total + deliveryFee;

    const orderDetailsStr = cart.map(item => `• ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})`).join('%0A');
    const message = `*NEW ORDER - ZUMA HEARTH*%0A%0A*Customer:* ${data.name}%0A*Phone:* ${data.phone}%0A*Address:* ${data.address}%0A*Type:* ${data.type.toUpperCase()}%0A%0A*Order:*%0A${orderDetailsStr}%0A%0A*Subtotal:* ${formatPrice(total)}%0A*Delivery:* ${formatPrice(deliveryFee)}%0A*TOTAL:* ${formatPrice(grandTotal)}%0A%0A_Please confirm availability._`;
    const url = `https://wa.me/2348129382695?text=${message}`;

    try {
      // Save to Supabase
      const orderData = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        type: data.type,
        user_id: user?.id || null,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        total: grandTotal,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('orders').insert(orderData);
      if (error) throw error;

      setLastOrderDetails({ data, items: [...cart] });
      setWhatsappUrl(url);
      setIsProcessing(false);
      setIsCheckoutOpen(false);
      setIsOrderComplete(true);
      setCart([]);
    } catch (error) {
      setIsProcessing(false);
      handleSupabaseError(error, OperationType.CREATE, 'orders');
    }
  };

  const scrollToSection = (id: string) => {
    if (isTrackingOpen) {
      setIsTrackingOpen(false);
      // Give it a tiny bit to re-render the home page before scrolling
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onScrollTo={scrollToSection}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsTrackingOpen(true)}
      />

      <AnimatePresence>
        {user && user.app_metadata?.provider !== 'google' && !user.email_confirmed_at && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-20 left-0 right-0 z-[90] bg-brand-secondary text-white py-2 px-4 shadow-lg overflow-hidden"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <AlertCircle size={14} className="text-brand-accent shrink-0" />
                <span>Your email is not verified. Please check your inbox to access full features.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshAuth}
                  className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest bg-white text-brand-secondary hover:bg-brand-accent transition-colors px-3 py-1 rounded-none"
                >
                  Confirm Verified
                </button>
                <button
                  onClick={handleResendVerification}
                  disabled={isEmailVerificationSent}
                  className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 transition-colors px-3 py-1 rounded-none disabled:opacity-50"
                >
                  {isEmailVerificationSent ? 'Verification Sent' : 'Resend Email'}
                  {!isEmailVerificationSent && <Send size={12} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="pt-20">
        {isTrackingOpen ? (
          <OrderTracking onBack={() => setIsTrackingOpen(false)} />
        ) : (
          <>
            <Hero onExplore={() => scrollToSection('menu')} />
            
            {/* About Section Teaser */}
            <section id="about" className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative px-4 sm:px-0"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-none shadow-2xl relative">
                  <img 
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1548" 
                    alt="Chef in Action" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-[0.75rem] md:border-[1.5rem] border-brand-background/30 m-3 md:m-6" />
                </div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-brand-accent p-8 flex flex-col justify-end hidden md:flex">
                  <span className="text-brand-dark/30 text-8xl font-serif absolute top-2 right-4 leading-none">"</span>
                  <p className="text-brand-dark text-lg font-serif italic mb-4 leading-relaxed">
                    Flavor is the memory of the earth.
                  </p>
                  <p className="text-xs uppercase font-bold tracking-widest text-brand-dark/60">Chef Ope — Executive Chef</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="space-y-6 md:space-y-8"
              >
                <span className="text-brand-secondary font-medium tracking-[0.3em] uppercase text-[10px] md:text-xs">Our Story</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">Mastering the Art of <br/> Nigerian Fusion</h2>
                <p className="text-gray-600 leading-relaxed font-light text-base md:text-lg">
                  Born from a passion for the rich culinary landscape of Nigeria, Zuma Hearth reimagines heritage ingredients through international techniques. Our kitchen is a laboratory of taste, where Jollof becomes an infusion and Suya is elevated to fine-dining sculpture.
                </p>
                <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 md:pt-8">
                  <div>
                    <h4 className="text-3xl md:text-4xl font-serif text-brand-primary mb-1 md:mb-2">12+</h4>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Hours slow-cooking our signatures</p>
                  </div>
                  <div>
                    <h4 className="text-3xl md:text-4xl font-serif text-brand-primary mb-1 md:mb-2">100%</h4>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Ethically sourced local ingredients</p>
                  </div>
                </div>
              </motion.div>
            </section>

            <MenuSection onAddToCart={addToCart} />

            <ReservationSection />

            {/* Testimonials */}
            <section className="bg-brand-dark text-white py-16 md:py-24">
              <div className="section-padding space-y-12 md:space-y-16">
                <div className="text-center">
                  <span className="text-brand-accent tracking-[0.3em] font-medium uppercase text-[10px] md:text-xs mb-3 md:mb-4 block">The Experience</span>
                  <h2 className="text-3xl md:text-5xl font-serif">Guest Reflections</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                  {[
                    { name: 'Amaka O.', text: 'The Seafood Okra is a spiritual experience. The freshness of the seafood is unparalleled in Abuja.' },
                    { name: 'David W.', text: 'Incredibly sophisticated atmosphere. The Zobo cocktail is a revelation - perfectly balanced.' },
                    { name: 'Dr. Bello', text: 'Zuma Hearth has set a new global standard for Nigerian cuisine. A masterpiece of fusion.' }
                  ].map((t, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 1.2, ease: "easeOut" }}
                      className="bg-white/5 p-8 md:p-12 border border-white/10 relative"
                    >
                      <p className="text-base md:text-lg italic text-white/80 leading-relaxed mb-6 md:mb-8">"{t.text}"</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">{t.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
      
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal 
          key="checkout-modal"
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cart}
          onSubmit={handleCheckout}
          isProcessing={isProcessing}
        />
      )}

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <WhatsAppButton />

      <OrderSuccessModal 
        isOpen={isOrderComplete}
        onClose={() => setIsOrderComplete(false)}
        onTrackInApp={() => {
          setIsOrderComplete(false);
          setIsTrackingOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        orderData={lastOrderDetails?.data || null}
        items={lastOrderDetails?.items || []}
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}
