"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface SplashScreenProps {
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showSplash, setShowSplash] = useState(true)
  const [animationPhase, setAnimationPhase] = useState('enter') // enter, burn, exit

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationPhase('burn')
    }, 6000) // Show character for 6s

    const timer2 = setTimeout(() => {
      setAnimationPhase('exit')
    }, 8000) // Start burning effect at 8s

    const timer3 = setTimeout(() => {
      setShowSplash(false)
      onComplete()
    }, 10000) // Complete at 10s

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const fireParticles = Array.from({ length: 30 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-3 h-3 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 rounded-full"
      initial={{ 
        x: Math.random() * 300 - 150,
        y: 0,
        opacity: 0,
        scale: 0
      }}
      animate={animationPhase === 'burn' ? {
        x: Math.random() * 600 - 300,
        y: -Math.random() * 400 - 150,
        opacity: [0, 1, 0.8, 0],
        scale: [0, 1.5, 1, 0]
      } : {}}
      transition={{
        duration: 2,
        delay: Math.random() * 0.8,
        ease: "easeOut"
      }}
      style={{
        left: '50%',
        top: '50%'
      }}
    />
  ))

  const energyParticles = Array.from({ length: 10 }, (_, i) => (
    <motion.div
      key={`energy-${i}`}
      className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
      initial={{ 
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        opacity: 0,
        scale: 0
      }}
      animate={animationPhase === 'enter' ? {
        x: [Math.random() * 400 - 200, Math.random() * 200 - 100],
        y: [Math.random() * 400 - 200, Math.random() * 200 - 100],
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0]
      } : {}}
      transition={{
        duration: 2.5,
        delay: Math.random() * 1.5,
        ease: "easeInOut"
      }}
      style={{
        left: '50%',
        top: '50%'
      }}
    />
  ))

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background particles */}
          <div className="absolute inset-0">
            {/* Cheerful twinkling stars */}
            {Array.from({ length: 80 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 rounded-full"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                  opacity: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: Math.random() * 2 + 1.5,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Happy energy particles during enter phase */}
            {animationPhase === 'enter' && Array.from({ length: 15 }, (_, i) => (
              <motion.div
                key={`energy-${i}`}
                className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 rounded-full shadow-lg"
                initial={{ 
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  x: [Math.random() * 400 - 200, Math.random() * 200 - 100],
                  y: [Math.random() * 400 - 200, Math.random() * 200 - 100],
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                  rotate: [0, 720]
                }}
                transition={{
                  duration: Math.random() * 1.5 + 1,
                  delay: Math.random() * 0.8,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                style={{
                  left: '50%',
                  top: '50%'
                }}
              />
            ))}
            
            {/* Joyful power rings */}
            {Array.from({ length: 4 }, (_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute border-3 border-yellow-400/40 rounded-full"
                style={{
                  width: `${180 + i * 90}px`,
                  height: `${180 + i * 90}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderImage: 'linear-gradient(45deg, #fbbf24, #f472b6, #fb923c) 1'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2.5 + i * 0.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Floating hearts */}
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={`heart-${i}`}
                className="absolute text-pink-400 text-lg opacity-60"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2, 0.5],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              >
                ♥
              </motion.div>
            ))}
          </div>

          {/* Main character container */}
          <div className="relative flex flex-col items-center">
            {/* GOLDIUM Logo Image */}
            <motion.div
              className="mb-4"
              initial={{ y: -80, opacity: 0, scale: 0.5 }}
              animate={{ 
                y: 0, 
                opacity: animationPhase === 'exit' ? 0 : 1,
                scale: animationPhase === 'exit' ? 0.5 : 1
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                className="w-24 h-24 md:w-32 md:h-32"
                animate={animationPhase === 'burn' ? {
                  scale: [1, 1.2, 0.8],
                  opacity: [1, 0.8, 0],
                  rotate: [0, 10, -10, 0]
                } : {
                  scale: [1, 1.1, 1],
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={animationPhase === 'burn' ? { 
                  duration: 2.5, 
                  ease: "easeInOut" 
                } : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/goldium-logo.png"
                  alt="GOLDIUM Logo"
                  width={128}
                  height={128}
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* GOLDIUM Text */}
            <motion.div
              className="mb-8"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                animate={animationPhase === 'burn' ? {
                  scale: [1, 1.1, 0.8],
                  opacity: [1, 0.8, 0]
                } : {
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  scale: [1, 1.05, 1],
                  y: [0, -5, 0]
                }}
                transition={animationPhase === 'burn' ? { duration: 2.5, ease: "easeInOut" } : {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                GOLDIUM
              </motion.h1>
            </motion.div>

            {/* Characters Container - Line Formation */}
            <div className="relative flex items-center justify-center">
              {/* Character Line Formation */}
              <div className="flex items-center space-x-8 md:space-x-12">
                {/* Character 1 - K2 (Happy) */}
                 <motion.div
                   className="relative z-10"
                   initial={{ scale: 0, x: -200, opacity: 0 }}
                   animate={{ 
                     scale: animationPhase === 'exit' ? 0 : 1.1, 
                     x: 0,
                     opacity: animationPhase === 'exit' ? 0 : 1
                   }}
                   transition={{ 
                     duration: 1.5,
                     ease: "easeOut",
                     delay: 0.3
                   }}
                 >
                   <motion.div
                     className="w-32 h-32 md:w-44 md:h-44"
                     style={{ willChange: 'transform' }}
                     animate={{
                       y: [0, -12, 0],
                       rotate: [0, -8, 8, 0],
                       scale: [1, 1.05, 1]
                     }}
                     transition={{
                       duration: 3.5,
                       repeat: Infinity,
                       ease: "easeInOut",
                       delay: 0.8
                     }}
                   >
                     <Image
                       src="/K2.png"
                       alt="GOLDIUM Happy Character 1"
                       width={176}
                       height={176}
                       className="object-contain drop-shadow-xl"
                     />
                   </motion.div>
                 </motion.div>

                {/* Character 2 - K4 (Happy) */}
                 <motion.div
                   className="relative z-10"
                   initial={{ scale: 0, x: -100, opacity: 0 }}
                   animate={{ 
                     scale: animationPhase === 'exit' ? 0 : 1.2, 
                     x: 0,
                     opacity: animationPhase === 'exit' ? 0 : 1
                   }}
                   transition={{ 
                     duration: 1.5,
                     ease: "easeOut",
                     delay: 0.6
                   }}
                 >
                   <motion.div
                     className="w-36 h-36 md:w-48 md:h-48"
                     style={{ willChange: 'transform' }}
                     animate={{
                       y: [0, -15, 0],
                       rotate: [0, 5, -5, 0],
                       scale: [1, 1.08, 1]
                     }}
                     transition={{
                       duration: 3.3,
                       repeat: Infinity,
                       ease: "easeInOut",
                       delay: 0.5
                     }}
                   >
                     <Image
                       src="/K4.png"
                       alt="GOLDIUM Happy Character 2"
                       width={192}
                       height={192}
                       className="object-contain drop-shadow-xl"
                     />
                   </motion.div>
                 </motion.div>

                {/* Character 3 - K5 (Main/Center) */}
                <motion.div
                  className="relative z-20"
                  initial={{ scale: 0, y: 50, opacity: 0 }}
                  animate={{ 
                    scale: animationPhase === 'exit' ? 0 : 1, 
                    y: animationPhase === 'burn' ? -20 : 0,
                    opacity: animationPhase === 'exit' ? 0 : 1
                  }}
                  transition={{ 
                    duration: animationPhase === 'exit' ? 2.0 : 1.5, 
                    ease: "easeOut",
                    delay: 0.9
                  }}
                >
                  {/* Main Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div
                     className="relative z-10 w-40 h-40 md:w-52 md:h-52"
                     style={{ willChange: 'transform, filter' }}
                     animate={animationPhase === 'burn' ? {
                       filter: ['brightness(1)', 'brightness(2)', 'brightness(0.3)'],
                       scale: [1, 1.15, 0.95],
                       rotate: [0, 8, -8, 0]
                     } : {
                       y: [0, -18, 0],
                       rotate: [0, -5, 5, 0],
                       scale: [1, 1.1, 1]
                     }}
                     transition={{ 
                       duration: animationPhase === 'burn' ? 2.5 : 3.8,
                       repeat: animationPhase === 'burn' ? 0 : Infinity,
                       ease: "easeInOut"
                     }}
                   >
                     <Image
                       src="/K6.png"
                       alt="GOLDIUM Happy Main Character"
                       width={208}
                       height={208}
                       className="object-contain drop-shadow-2xl"
                       priority
                     />
                  </motion.div>

                  {/* Fire particles */}
                  {animationPhase === 'burn' && (
                    <div className="absolute inset-0 pointer-events-none">
                      {fireParticles}
                    </div>
                  )}
                </motion.div>

                {/* Character 4 - K3 (Happy) */}
                 <motion.div
                   className="relative z-10"
                   initial={{ scale: 0, x: 100, opacity: 0 }}
                   animate={{ 
                     scale: animationPhase === 'exit' ? 0 : 1.2, 
                     x: 0,
                     opacity: animationPhase === 'exit' ? 0 : 1
                   }}
                   transition={{ 
                     duration: 1.5,
                     ease: "easeOut",
                     delay: 1.2
                   }}
                 >
                   <motion.div
                     className="w-36 h-36 md:w-48 md:h-48"
                     style={{ willChange: 'transform' }}
                     animate={{
                       y: [0, -14, 0],
                       rotate: [0, 6, -6, 0],
                       scale: [1, 1.06, 1]
                     }}
                     transition={{
                       duration: 3.7,
                       repeat: Infinity,
                       ease: "easeInOut",
                       delay: 1.0
                     }}
                   >
                     <Image
                       src="/K3.png"
                       alt="GOLDIUM Happy Character 4"
                       width={192}
                       height={192}
                       className="object-contain drop-shadow-xl"
                     />
                   </motion.div>
                 </motion.div>

                {/* Character 5 - K1 (Happy) */}
                 <motion.div
                   className="relative z-10"
                   initial={{ scale: 0, x: 200, opacity: 0 }}
                   animate={{ 
                     scale: animationPhase === 'exit' ? 0 : 1.1, 
                     x: 0,
                     opacity: animationPhase === 'exit' ? 0 : 1
                   }}
                   transition={{ 
                     duration: 1.5,
                     ease: "easeOut",
                     delay: 1.5
                   }}
                 >
                   <motion.div
                     className="w-32 h-32 md:w-44 md:h-44"
                     style={{ willChange: 'transform' }}
                     animate={{
                       y: [0, -11, 0],
                       rotate: [0, 7, -7, 0],
                       scale: [1, 1.04, 1]
                     }}
                     transition={{
                       duration: 3.6,
                       repeat: Infinity,
                       ease: "easeInOut",
                       delay: 1.3
                     }}
                   >
                     <Image
                       src="/K1.png"
                       alt="GOLDIUM Happy Character 5"
                       width={176}
                       height={176}
                       className="object-contain drop-shadow-xl"
                     />
                   </motion.div>
                 </motion.div>
              </div>
            </div>

            {/* Loading text */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <motion.p 
                className="text-xl text-yellow-400 font-semibold tracking-wider"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Loading DeFi Platform...
              </motion.p>
              
              {/* Loading dots */}
              <div className="flex justify-center mt-4 space-x-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-4 h-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-500 rounded-full shadow-lg"
                    animate={{
                      y: [0, -15, 0],
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 1, 0.6],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 1.6,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Burn overlay effect */}
          {animationPhase === 'burn' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-red-900/50 via-orange-600/30 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen