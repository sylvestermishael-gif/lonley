import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, Phone, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { auth, logout } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollTo: (id: string) => void;
  onOpenAuth: () => void;
}

export default function Navbar({ cartCount, onOpenCart, onScrollTo, onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Menu', id: 'menu' },
    { name: 'Reservations', id: 'reservations' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed w-full z-50 transition-all duration-1000 py-4 px-6 md:px-12 flex items-center justify-between',
        isScrolled ? 'bg-white/95 shadow-md py-3 text-brand-dark' : 'bg-transparent text-white'
      )}
    >
      <div className="flex items-center gap-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <a 
          href="/" 
          className={cn(
            "text-2xl font-serif font-bold tracking-widest",
            !isScrolled && "text-brand-accent"
          )}
        >
          ZUMA <span className="font-light italic text-sm align-middle ml-1">HEARTH</span>
        </a>

        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onScrollTo(link.id)}
              className="text-sm font-medium uppercase tracking-widest hover:text-brand-secondary transition-colors"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-inherit">
          <Phone size={16} className="text-brand-secondary" />
          <span>+234 (0) 812 938 2695</span>
        </div>
        
        <button 
          onClick={onOpenCart}
          className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-secondary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
              {cartCount}
            </span>
          )}
        </button>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">Welcome</span>
              <span className="text-xs font-medium truncate max-w-[100px]">{user.displayName || user.email}</span>
            </div>
            <button 
              onClick={() => logout()}
              className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-full transition-colors"
            title="Sign In"
          >
            <User size={24} />
            <span className="hidden sm:block text-xs font-bold uppercase tracking-widest">Sign In</span>
          </button>
        )}

        <button 
          onClick={() => onScrollTo('menu')}
          className={cn(
            "hidden md:block btn-premium px-6 py-2 text-xs",
            isScrolled ? "bg-brand-primary" : "bg-white text-brand-dark hover:bg-brand-accent"
          )}
        >
          Order Now
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 w-full bg-white text-brand-dark shadow-2xl p-6 md:hidden flex flex-col gap-6 items-center"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onScrollTo(link.id);
                  setIsOpen(false);
                }}
                className="text-lg font-serif font-medium tracking-wider"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => { onOpenCart(); setIsOpen(false); }}
              className="flex items-center gap-2 text-lg font-serif"
            >
              <ShoppingCart size={20} /> View Cart ({cartCount})
            </button>
            {!user && (
              <button 
                onClick={() => { onOpenAuth(); setIsOpen(false); }}
                className="btn-premium w-full py-4"
              >
                Sign In / Register
              </button>
            )}
            {user && (
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="text-red-600 font-bold uppercase tracking-widest text-xs"
              >
                Sign Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
