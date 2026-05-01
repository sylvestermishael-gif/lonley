import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, handleSupabaseError, OperationType } from '../lib/supabase';
import { Order, OrderStatus } from '../types';
import { formatPrice } from '../lib/utils';
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowLeft, ChevronRight } from 'lucide-react';

import { User as SupabaseUser } from '@supabase/supabase-js';

interface OrderTrackingProps {
  onBack: () => void;
}

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="text-amber-500" size={20} />,
  confirmed: <Package className="text-blue-500" size={20} />,
  delivering: <Truck className="text-brand-secondary" size={20} />,
  completed: <CheckCircle2 className="text-green-500" size={20} />,
  cancelled: <XCircle className="text-red-500" size={20} />,
};

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivering: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderTracking({ onBack }: OrderTrackingProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const fetchOrders = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        // Map camelCase to snake_case if necessary, but we'll try to keep consistency
        const mappedOrders = (data || []).map((o) => ({
          ...o,
          userId: o.user_id,
          createdAt: { toDate: () => new Date(o.created_at) } // Mock Firestore date for minimal JSX changes
        })) as unknown as Order[];

        setOrders(mappedOrders);
      } catch (error) {
        handleSupabaseError(error as { message?: string }, OperationType.LIST, 'orders');
      } finally {
        setLoading(false);
      }
    };

    const setupAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        fetchOrders(session.user.id);
      } else {
        setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user ?? null;
        setCurrentUser(user);
        if (user) {
          fetchOrders(user.id);
        } else {
          setOrders([]);
          setLoading(false);
        }
      });

      return subscription;
    };

    let authSub: { unsubscribe: () => void } | undefined;
    setupAuth().then(sub => { authSub = sub; });

    return () => authSub?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="section-padding min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="text-right">
            <h2 className="text-3xl md:text-5xl font-serif mb-2">My Orders</h2>
            <p className="text-gray-500 text-sm font-light">Track your culinary experiences in real-time.</p>
          </div>
        </div>

        {!currentUser ? (
          <div className="text-center py-20 bg-white border border-brand-primary/5 shadow-sm p-12">
            <XCircle className="mx-auto text-gray-300 mb-6" size={48} />
            <h3 className="text-2xl font-serif mb-4">Sign In Required</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Please sign in to view and track your orders.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-brand-primary/5 shadow-sm p-12">
            <Package className="mx-auto text-gray-300 mb-6" size={48} />
            <h3 className="text-2xl font-serif mb-4">No Orders Found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
              It seems you haven't placed any orders yet. Explore our menu and start your journey.
            </p>
            <button 
              onClick={onBack}
              className="btn-premium"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                layout
                className="bg-white border border-brand-primary/5 shadow-sm overflow-hidden"
              >
                <div 
                  className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID: #{order.id.slice(-6).toUpperCase()}</span>
                    <h4 className="text-xl font-serif">
                      {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {order.createdAt?.toDate().toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
                      <p className="text-lg font-bold text-brand-primary">{formatPrice(order.total)}</p>
                    </div>

                    <div className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest',
                      statusColors[order.status]
                    )}>
                      {statusIcons[order.status]}
                      {order.status}
                    </div>

                    <ChevronRight 
                      size={20} 
                      className={cn(
                        "text-gray-400 transition-transform duration-500",
                        selectedOrder?.id === order.id && "rotate-90"
                      )} 
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {selectedOrder?.id === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-brand-primary/5"
                    >
                      <div className="p-6 md:p-8 bg-gray-50/30 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 py-8 border-y border-brand-primary/5 my-4">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-10 text-center">Order Journey</h5>
                          <div className="relative flex justify-between items-center max-w-3xl mx-auto px-4">
                            {/* Track line */}
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 z-0" />
                            <div 
                              className="absolute top-1/2 left-0 h-[2px] bg-brand-primary -translate-y-1/2 z-0 transition-all duration-1000" 
                              style={{ 
                                width: order.status === 'pending' ? '12.5%' : 
                                       order.status === 'confirmed' ? '37.5%' : 
                                       order.status === 'delivering' ? '62.5%' : 
                                       order.status === 'completed' ? '100%' : '0%' 
                              }} 
                            />

                            {(['pending', 'confirmed', 'delivering', 'completed'] as OrderStatus[]).map((status, index) => {
                              const isPast = (['pending', 'confirmed', 'delivering', 'completed'] as OrderStatus[]).indexOf(order.status) >= index;
                              const isCurrent = order.status === status;

                              return (
                                <div key={status} className="relative z-10 flex flex-col items-center">
                                  <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                                    isPast ? "bg-brand-primary border-brand-primary text-white" : "bg-white border-gray-100 text-gray-300",
                                    isCurrent && "scale-125 shadow-lg shadow-brand-primary/20 ring-4 ring-brand-primary/10"
                                  )}>
                                    {React.cloneElement(statusIcons[status] as React.ReactElement, { size: 20, className: isPast ? 'text-white' : 'text-gray-300' })}
                                  </div>
                                  <div className="absolute -bottom-8 w-max flex flex-col items-center">
                                    <span className={cn(
                                      "text-[8px] font-bold uppercase tracking-widest transition-colors",
                                      isPast ? "text-brand-primary" : "text-gray-400"
                                    )}>
                                      {status}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-6">Delivery Details</h5>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Method</p>
                              <p className="text-sm font-medium capitalize">{order.type}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Address</p>
                              <p className="text-sm font-medium">{order.address}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</p>
                              <p className="text-sm font-medium">{order.name} ({order.phone})</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-6">Order Items</h5>
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <p className="font-medium">
                                  <span className="text-brand-secondary font-bold mr-2">{item.quantity}x</span>
                                  {item.name}
                                </p>
                                <p className="text-gray-500">{formatPrice(item.price * item.quantity)}</p>
                              </div>
                            ))}
                            <div className="h-px bg-gray-200 my-4" />
                            <div className="flex justify-between items-center">
                              <p className="text-xs font-bold uppercase tracking-wider">Total Amount</p>
                              <p className="text-lg font-bold text-brand-primary">{formatPrice(order.total)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
