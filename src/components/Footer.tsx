import React, { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Check, Loader2 } from 'lucide-react';
import { supabase, handleSupabaseError, OperationType } from '../lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('subscribers')
        .upsert({
          email: email.toLowerCase().trim(),
          created_at: new Date().toISOString()
        }, { onConflict: 'email' });

      if (error) throw error;

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      handleSupabaseError(error as { message?: string }, OperationType.WRITE, 'subscribers');
    }
  };

  return (
    <footer id="contact" className="bg-brand-dark text-white pt-24 pb-12">
      <div className="section-padding grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold tracking-widest text-brand-accent italic">ZUMA HEARTH</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Where tradition meets innovation. We bring the spirit of Nigeria to the global table through refined culinary techniques and authentic soul.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-white/5 hover:bg-brand-accent hover:text-brand-dark transition-all rounded-full"><Instagram size={18} /></a>
            <a href="#" className="p-3 bg-white/5 hover:bg-brand-accent hover:text-brand-dark transition-all rounded-full"><Twitter size={18} /></a>
            <a href="#" className="p-3 bg-white/5 hover:bg-brand-accent hover:text-brand-dark transition-all rounded-full"><Facebook size={18} /></a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-8 block">Hours of Operation</h4>
          <div className="space-y-4 text-sm font-light">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/50 lowercase italic">Mon - Fri</span>
              <span>12:00 PM - 10:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/50 lowercase italic">Saturday</span>
              <span>12:00 PM - 11:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/50 lowercase italic">Sunday</span>
              <span>10:00 AM - 9:00 PM</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:pl-12">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-8 block">Contact Us</h4>
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <MapPin size={20} className="text-brand-secondary flex-shrink-0" />
              <p className="text-sm font-light text-white/70 leading-relaxed">
                42 Zuma Rock Way,<br /> Maitama, Abuja,<br /> Nigeria
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Phone size={20} className="text-brand-secondary" />
              <p className="text-sm font-light text-white/70">+234 812 938 2695</p>
            </div>
            <div className="flex items-center gap-6">
              <Mail size={20} className="text-brand-secondary" />
              <p className="text-sm font-light text-white/70">hello@zumahearth.ng</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-8 block">Newsletter</h4>
          <p className="text-xs text-white/50 mb-4 italic">Join our circle for exclusive Chef's specials and upcoming events.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input 
              type="email" 
              required
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              className="bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-colors disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                status === 'success' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-brand-accent text-brand-dark hover:bg-white'
              } disabled:opacity-80`}
            >
              {status === 'loading' && <Loader2 size={14} className="animate-spin" />}
              {status === 'success' && <Check size={14} />}
              {status === 'success' ? 'Subscribed' : status === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
            {status === 'error' && <p className="text-[10px] text-red-400 mt-1">Something went wrong. Please try again.</p>}
          </form>
        </div>
      </div>

      <div className="section-padding py-0 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30 uppercase tracking-[0.2em]">
        <p>&copy; 2024 Zuma Hearth Ltd. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
