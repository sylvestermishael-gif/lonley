import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, Phone, Mail, User, ChevronRight } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AlertCircle } from 'lucide-react';

export default function ReservationSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isVerified = auth.currentUser?.emailVerified;

  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
    phone: '',
    guests: '2',
    date: '',
    time: '19:00',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setErrorMessage('Please sign in to make a reservation.');
      return;
    }
    if (!auth.currentUser.emailVerified) {
      setErrorMessage('Please verify your email before making a reservation. Check the notification banner at the top.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await addDoc(collection(db, 'reservations'), {
        ...formData,
        userId: auth.currentUser?.uid || null,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({
        name: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        phone: '',
        guests: '2',
        date: '',
        time: '19:00',
        notes: ''
      });
    } catch (err: unknown) {
      console.error('Reservation Error:', err);
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to submit reservation. Please try again.');
      handleFirestoreError(err, OperationType.CREATE, 'reservations');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservations" className="section-padding bg-brand-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="text-brand-secondary font-medium tracking-[0.3em] uppercase text-xs">Reservations</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">Secure Your <br/> Table in Paradise</h2>
            <p className="text-gray-600 font-light leading-relaxed max-w-md">
              Whether it's an intimate date night or a grand celebration, Zuma Hearth provides the perfect backdrop for unforgettable moments.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-brand-primary/10 flex items-center justify-center text-brand-primary rounded-none">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs mb-1">Operating Hours</h4>
                <p className="text-sm text-gray-500">Mon – Fri: 12:00 PM – 10:00 PM</p>
                <p className="text-sm text-gray-500">Sat – Sun: 10:00 AM – 11:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-brand-primary/10 flex items-center justify-center text-brand-primary rounded-none">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs mb-1">Direct Inquiries</h4>
                <p className="text-sm text-gray-500">+234 (0) 812 938 2695</p>
                <p className="text-sm text-gray-500">reservations@zumahearth.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="bg-white shadow-2xl p-8 md:p-12 relative z-10 border border-gray-100"
        >
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-6"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <Calendar size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif">Reservation Received</h3>
                <p className="text-gray-500 text-sm">
                  We'll contact you shortly at <b>{formData.email}</b> to confirm your booking.
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsSuccess(false);
                  setErrorMessage(null);
                }}
                className="btn-premium px-8"
              >
                Book Another Table
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              {auth.currentUser && !isVerified && (
                <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>Please verify your email to book a table</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">FullName</label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name"
                      className="w-full border-b-2 border-gray-100 py-3 pl-8 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="your@email.com"
                      className="w-full border-b-2 border-gray-100 py-3 pl-8 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                    <input 
                      type="tel" 
                      required
                      placeholder="+234..."
                      className="w-full border-b-2 border-gray-100 py-3 pl-8 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                    <select
                      className="w-full border-b-2 border-gray-100 py-3 pl-8 focus:outline-none focus:border-brand-primary transition-colors text-sm bg-transparent appearance-none"
                      value={formData.guests}
                      onChange={e => setFormData({...formData, guests: e.target.value})}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                      <option value="9+">Large Party (9+)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border-b-2 border-gray-100 py-3 pl-8 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                    <select
                      className="w-full border-b-2 border-gray-100 py-3 pl-8 focus:outline-none focus:border-brand-primary transition-colors text-sm bg-transparent appearance-none"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    >
                      {['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Special Notes (Optional)</label>
                <textarea 
                  rows={2}
                  placeholder="Dietary requests, special occasion, etc."
                  className="w-full border-2 border-gray-100 p-4 focus:outline-none focus:border-brand-primary transition-colors text-sm resize-none"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || (!!auth.currentUser && !isVerified)}
                className="w-full btn-premium py-4 flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400"
              >
                {isSubmitting ? 'Confirming Availability...' : (
                  <>
                    Confirm Reservation <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
