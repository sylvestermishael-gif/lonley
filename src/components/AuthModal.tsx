import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Chrome, LogIn, Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle, supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onClose();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (signUpError) throw signUpError;
        setSuccess('Account created! Please check your inbox for a verification email.');
        setTimeout(() => {
          setIsLogin(true);
        }, 5000);
      }
    } catch (err: unknown) {
      console.error('Auth error:', err);
      const error = err as { message?: string };
      setError(error.message || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // OAuth redirect will happen, so we don't necessarily call onClose() here
    } catch (err: unknown) {
      console.error('Google Auth Error:', err);
      const error = err as { message?: string };
      setError(error.message || 'An error occurred during Google Sign-In.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md z-[120]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 m-auto w-full max-w-md h-fit bg-brand-background shadow-2xl z-[130] overflow-hidden"
          >
            <div className="relative p-8 md:p-12">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif mb-2">
                  {isLogin ? 'Welcome Back' : 'Join the Table'}
                </h2>
                <p className="text-sm text-gray-500 italic">
                  {isLogin ? 'Sign in to access your culinary vault.' : 'Register to begin your Zuma Hearth experience.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-medium border-l-4 border-red-500">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-600 text-xs font-medium border-l-4 border-green-500">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={16} />
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        className="w-full border-b border-gray-200 py-2 pl-7 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                        placeholder="Zuma Guest"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={16} />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      className="w-full border-b border-gray-200 py-2 pl-7 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-primary" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      required
                      className="w-full border-b border-gray-200 py-2 pl-7 pr-10 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-premium py-4 flex items-center justify-center gap-2"
                >
                  {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
                  {!loading && <LogIn size={18} />}
                </button>
              </form>

              <div className="mt-10">
                <div className="relative flex items-center justify-center mb-10">
                  <div className="w-full border-t border-gray-200"></div>
                  <span className="absolute px-4 bg-brand-background text-[10px] font-bold uppercase tracking-widest text-gray-400">Or Continue With</span>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm rounded-none"
                >
                  <Chrome size={18} />
                  Google
                </button>
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
