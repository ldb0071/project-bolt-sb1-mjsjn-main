import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Download, Zap, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

// Optimized variants with creative animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, rotate: -5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export const GettingStartedPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  
  // Smooth spring-based scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effects
  const heroY = useTransform(smoothProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const backgroundY = useTransform(smoothProgress, [0, 1], ['0%', '20%']);

  // Disable animations if user prefers reduced motion
  const animations = prefersReducedMotion ? { animate: false } : {};

  return (
    <div className="min-h-screen bg-navy-900 relative overflow-hidden">
      {/* Enhanced background with morphing gradients */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-primary-500/10 will-change-transform"
        style={{ y: backgroundY }}
        animate={{
          background: [
            "linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
            "linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        {...animations}
      />
      
      {/* Hero Section with enhanced animations */}
      <motion.div 
        className="relative"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Creative decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] opacity-20 will-change-transform"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              borderRadius: ["60% 40% 30% 70%", "30% 60% 70% 40%", "60% 40% 30% 70%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-primary-500/30 to-accent-500/30 blur-2xl" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] opacity-20 will-change-transform"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              borderRadius: ["50% 50% 50% 70%", "50% 50% 70% 50%", "50% 50% 50% 70%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-accent-500/30 to-primary-500/30 blur-2xl" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            {...animations}
          >
            <motion.div 
              className="relative inline-block mb-6 group"
              variants={itemVariants}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent relative z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Welcome to PDF Assistant
              </motion.h1>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl z-0"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <motion.p 
              className="text-xl text-gray-400 mb-8"
              variants={itemVariants}
            >
              Your intelligent companion for document analysis and management, powered by advanced AI
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/projects"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 
                    text-white rounded-xl font-medium overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <span className="relative">Get Started</span>
                  <motion.div
                    className="relative"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid with enhanced card animations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div className="inline-block">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <motion.div
              className="h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </motion.div>
          <p className="text-gray-400 text-lg mt-4">
            Everything you need to manage and analyze your documents
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            {
              icon: FileText,
              title: "Smart Document Management",
              description: "Organize and manage your PDFs with ease. Convert, search, and analyze your documents in one place.",
              color: "primary",
            },
            {
              icon: MessageSquare,
              title: "AI Chat Assistant",
              description: "Chat with our AI about your documents. Get insights, summaries, and answers to your questions.",
              color: "accent",
            },
            {
              icon: Download,
              title: "ArXiv Integration",
              description: "Search and download research papers directly from ArXiv. Stay up-to-date with the latest research.",
              color: "emerald",
            },
            {
              icon: Brain,
              title: "Advanced Analysis",
              description: "Get deep insights from your documents with our advanced AI analysis tools and visualization features.",
              color: "purple",
            },
            {
              icon: Sparkles,
              title: "Smart Search",
              description: "Find exactly what you need with our intelligent search capabilities across all your documents.",
              color: "yellow",
            },
            {
              icon: Zap,
              title: "Fast Processing",
              description: "Lightning-fast document processing and conversion with our optimized backend.",
              color: "red",
            },
          ].map(({ icon: Icon, title, description, color }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover="hover"
              className={`group relative bg-navy-800/50 rounded-xl p-6 border border-navy-700 
                transition-all duration-300 backdrop-blur-sm overflow-hidden`}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r from-${color}-500/10 to-${color}-500/5 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300`}
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
              <motion.div 
                className={`relative w-12 h-12 bg-${color}-500/10 rounded-lg flex items-center justify-center mb-4 
                  group-hover:bg-${color}-500/20 transition-colors will-change-transform`}
                whileHover={{
                  scale: 1.1,
                  rotate: 360,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <Icon className={`w-6 h-6 text-${color}-400`} />
              </motion.div>
              <h3 className="relative text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="relative text-gray-400">{description}</p>
              <motion.div
                className={`absolute bottom-0 left-0 h-1 bg-${color}-500/50`}
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Call to Action */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 rounded-3xl blur-xl"
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="relative bg-navy-800/50 rounded-2xl p-12 backdrop-blur-sm border border-navy-700"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join now and experience the power of AI-assisted document management
            </p>
            <motion.div
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/projects"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 
                  text-white rounded-xl font-medium overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <span className="relative">Create Your First Project</span>
                <motion.div
                  className="relative"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
