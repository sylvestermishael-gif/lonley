import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Play } from 'lucide-react';
import VideoModal from './VideoModal';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const STORY_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-steak-on-the-grill-34440-large.mp4"; // Direct cinematic food video

  return (
    <>
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070"
            alt="Restaurant Ambiance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/40 to-transparent" />
        </div>

        <div className="section-padding relative z-10 w-full text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="text-brand-accent tracking-[0.3em] uppercase text-sm font-medium mb-4 block"
            >
              Abuja's Premier Dining Destination
            </motion.span>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif mb-6 leading-tight">
              Elevated <br />
              <span className="italic font-light">Heritage</span>
            </h1>
            
            <p className="text-base md:text-xl text-white/80 mb-10 leading-relaxed font-light font-sans max-w-lg">
              Experience the soulful fusion of traditional Nigerian flavors and modern culinary artistry in the heart of the capital.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                onClick={onExplore}
                className="btn-premium group flex items-center justify-center w-full sm:w-auto gap-2 bg-brand-accent text-brand-dark hover:bg-white"
              >
                Explore Menu
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-700" />
              </motion.button>
              
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 1 }}
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center justify-center w-full sm:w-auto gap-3 px-6 py-3 text-xs md:text-sm font-medium tracking-widest uppercase hover:text-brand-accent transition-colors duration-700"
              >
                <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                  <Play size={14} fill="currentColor" />
                </span>
                Watch Story
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-white">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoUrl={STORY_VIDEO_URL} 
      />
    </>
  );
}
