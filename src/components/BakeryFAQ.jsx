import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star, Cake, Cookie, Croissant, Gift, Phone, Clock, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import "./FAQ.css";

// Enhanced FAQ data with more human, engaging answers
const faqs = [
  {
    category: "Cakes & Celebration",
    icon: <Cake className="w-5 h-5" />,
    questions: [
      {
        q: "Can you bring my dream cake to life?",
        a: "Absolutely! 🎂 We love creating magical cakes for birthdays, weddings, anniversaries, and all your special moments. Just share your vision—we'll add our baking magic!"
      },
      {
        q: "How many flavors and fillings can I choose from?",
        a: "We've got a delicious palette for you! Choose from 12+ flavors including velvety chocolate, vanilla bean, red velvet romance, tropical pineapple, and more. Pair them with luscious fillings like Belgian chocolate ganache, fresh fruit compotes, or silky creams."
      },
      {
        q: "Do you accommodate dietary preferences?",
        a: "Of course! We offer eggless, vegan, and gluten-friendly options. Just let us know your needs—we believe everyone deserves delicious cake!"
      },
      {
        q: "What's your timeline for custom orders?",
        a: "For most cakes, 2-3 days works perfectly. For grand tiered creations or wedding cakes, we recommend 5-7 days so we can make every detail perfect just for you."
      },
      {
        q: "How do I keep my cake fresh and fabulous?",
        a: "Your cake will stay fresh and delicious for 2-3 days when refrigerated. We provide care instructions with every order!"
      }
    ]
  },
  {
    category: "Sweet Treats & Pastries",
    icon: <Croissant className="w-5 h-5" />,
    questions: [
      {
        q: "Are your pastries baked fresh?",
        a: "Every single day! 🌅 Our bakers arrive at dawn to create fresh pastries using the finest ingredients. That morning-fresh taste? That's our promise to you."
      },
      {
        q: "What pastry varieties do you offer?",
        a: "From buttery croissants to fruity danishes, chocolate eclairs to cream puffs—our display case is always filled with tempting treats. We also feature seasonal specials!"
      },
      {
        q: "Can I pre-order for events?",
        a: "Yes! We recommend pre-ordering for parties and events to ensure we prepare exactly what you need, fresh and ready for your celebration."
      }
    ]
  },
  {
    category: "Cookies & More",
    icon: <Cookie className="w-5 h-5" />,
    questions: [
      {
        q: "What makes your cookies special?",
        a: "Our cookies are baked with love and premium ingredients! We use real butter, quality chocolate, and special recipes passed down through generations. You can taste the difference!"
      },
      {
        q: "Do you offer gift boxes?",
        a: "Absolutely! 🎁 Our beautifully crafted gift boxes are perfect for corporate gifts, thank-yous, or just because. We can customize them with your message or logo."
      },
      {
        q: "Any options for special diets?",
        a: "We have delicious eggless options and can prepare gluten-free cookies with advance notice. Your health and happiness matter to us!"
      }
    ]
  },
  {
    category: "Ordering & Delivery",
    icon: <Truck className="w-5 h-5" />,
    questions: [
      {
        q: "What's the easiest way to order?",
        a: "Choose what works best for you! Order online via our website, message us on WhatsApp, DM on Instagram, call us directly, or visit our cozy bakery—we're here to help!"
      },
      {
        q: "Do you deliver to my area?",
        a: "We deliver across the city! 🚗 Delivery charges vary by distance, and we ensure your treats arrive fresh and perfect. We even have express delivery options for last-minute cravings!"
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major payment methods: UPI, credit/debit cards, cash, and online payments. Your convenience is our priority!"
      }
    ]
  },
  {
    category: "Events & Bulk Orders",
    icon: <Gift className="w-5 h-5" />,
    questions: [
      {
        q: "Can you cater my wedding or corporate event?",
        a: "We'd be honored! 👑 We specialize in creating stunning dessert tables, custom wedding cakes, and corporate gifting solutions. Let's plan something memorable together!"
      },
      {
        q: "What bulk order options do you offer?",
        a: "From dessert platters and custom gift boxes to return gifts and party favors—we create packages that make your event truly special. Minimum quantities apply."
      },
      {
        q: "Is there a discount for large orders?",
        a: "Yes! We offer special pricing for bulk orders. The larger the order, the sweeter the deal! Contact us for a personalized quote."
      }
    ]
  },
  {
    category: "General",
    icon: <Star className="w-5 h-5" />,
    questions: [
      {
        q: "What are your bakery hours?",
        a: "We're open 8 AM to 9 PM daily, including weekends and holidays! Because sweet cravings don't keep office hours. 😊"
      },
      {
        q: "Do you offer baking classes?",
        a: "Yes! Join our monthly baking workshops where we share family recipes and baking secrets. Perfect for dates, family bonding, or just fun!"
      },
      {
        q: "Can I request a product not on your menu?",
        a: "We love creativity! If you have a special request, we'll do our best to make it happen. Just give us a call—let's bake something unique together!"
      }
    ]
  }
];

// Floating Elements Component
const FloatingElement = ({ emoji, size, delay, duration }) => (
  <motion.div
    className="absolute pointer-events-none text-3xl"
    style={{
      width: size,
      height: size,
      fontSize: size / 2
    }}
    initial={{ y: -100, opacity: 0, rotate: 0 }}
    animate={{ 
      y: ["0%", "20%", "0%"],
      opacity: [0.7, 1, 0.7],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  >
    {emoji}
  </motion.div>
);

// Enhanced Glitter Effect
const Glitter = ({ x, y, delay, color, size }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      backgroundColor: color,
      left: x,
      top: y,
      width: size,
      height: size,
      filter: `drop-shadow(0 0 6px ${color})`
    }}
    initial={{ scale: 0, rotate: 0 }}
    animate={{ 
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 0.8, 0]
    }}
    transition={{ 
      duration: 2, 
      delay: delay, 
      repeat: Infinity,
      repeatDelay: Math.random() * 2 + 1 
    }}
  />
);

// Enhanced FAQ Item Component
const FAQItem = ({ q, a, isOpen, onClick, index }) => (
  <motion.div 
    layout
    className="faq-item bg-white rounded-2xl mb-4 p-5 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4"
    style={{ borderLeftColor: isOpen ? '#EC4899' : '#10B981' }}
    whileHover={{ scale: 1.01, y: -2 }}
  >
    <button
      className="flex justify-between items-center w-full text-left focus:outline-none group"
      onClick={onClick}
    >
      <div className="flex items-center">
        <motion.div 
          className="w-8 h-8 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: isOpen ? '#FDF2F8' : '#F0FDF4' }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm font-bold" style={{ color: isOpen ? '#EC4899' : '#10B981' }}>
            0{index + 1}
          </span>
        </motion.div>
        <span className="text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-200">
          {q}
        </span>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 ml-4 p-2 rounded-full bg-gradient-to-r from-pink-50 to-green-50"
      >
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-pink-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-green-500" />
        )}
      </motion.div>
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-pink-500">
                <Star className="w-4 h-4" />
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                {a}
              </p>
            </div>
            {index % 2 === 0 && (
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-1" />
                <span>Need more details? Call us anytime!</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const BakeryFAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState(faqs[0].category);
  const [openIndex, setOpenIndex] = useState(0); // Open first question by default
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glitters, setGlitters] = useState([]);

  const currentFAQ = faqs.find((f) => f.category === selectedCategory);

  // Initialize floating elements and glitters
  useEffect(() => {
    const initialGlitters = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      delay: Math.random() * 2,
      color: Math.random() > 0.5 ? "#EC4899" : "#10B981",
      size: Math.random() * 6 + 2
    }));
    setGlitters(initialGlitters);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Add glitter on mouse move with lower frequency
      if (Math.random() > 0.85) {
        const newGlitter = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 80,
          y: e.clientY + (Math.random() - 0.5) * 80,
          delay: 0,
          color: Math.random() > 0.5 ? "#EC4899" : "#10B981",
          size: Math.random() * 8 + 3
        };
        setGlitters((prev) => [...prev.slice(-15), newGlitter]);
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white to-pink-50 font-sans">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {glitters.map((g) => (
          <Glitter key={g.id} {...g} />
        ))}
        
        {/* Floating decorative emojis */}
        <FloatingElement emoji="🎂" size="60px" delay={0} duration={8} style={{ left: "5%", top: "10%" }} />
        <FloatingElement emoji="🍪" size="50px" delay={1} duration={7} style={{ right: "10%", top: "15%" }} />
        <FloatingElement emoji="🥐" size="55px" delay={2} duration={9} style={{ left: "15%", bottom: "20%" }} />
        <FloatingElement emoji="🎁" size="45px" delay={3} duration={6} style={{ right: "5%", bottom: "15%" }} />
        
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-pink-100 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-100 to-transparent rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Interactive cursor glow */}
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{ x: mousePos.x - 24, y: mousePos.y - 24 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-300 to-green-300 opacity-20 blur-xl"></div>
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent">
              Sweet Answers to Your Questions
            </h1>
            <Star className="w-6 h-6 text-yellow-500 ml-2" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            Everything you need to know about our bakery, cakes, and sweet treats. 
            Can't find your answer? We're just a call away! 📞
          </p>
        </motion.div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {faqs.map(({ category, icon }) => (
            <motion.button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setOpenIndex(0);
              }}
              className={`flex items-center px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-md ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:shadow-lg hover:scale-105"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{icon}</span>
              {category}
            </motion.button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FAQ Questions Column */}
          <motion.div
            layout
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-100 to-green-100 mr-4">
                {currentFAQ.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentFAQ.category}</h2>
                <p className="text-gray-500">Select a question to reveal the answer</p>
              </div>
            </div>

            <div className="space-y-4">
              {currentFAQ.questions.map((item, idx) => (
                <FAQItem 
                  key={idx} 
                  q={item.q} 
                  a={item.a} 
                  isOpen={openIndex === idx} 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  index={idx}
                />
              ))}
            </div>

            {/* Call to Action */}
            <motion.div 
              className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-green-50 border border-pink-100 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-pink-500 mr-3" />
                <div>
                  <h3 className="font-bold text-gray-800">Still have questions?</h3>
                  <p className="text-gray-600">We're here to help! Call us at <strong className="text-pink-600">+91 9440051099</strong> or visit our bakery.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Column */}
          <motion.div 
            className="order-1 lg:order-2 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-300 to-green-300 rounded-3xl blur-xl opacity-30"></div>
              
              {/* Main image container */}
              <motion.div
                className="relative bg-white rounded-2xl p-8 shadow-2xl border-4 border-white"
                whileHover={{ rotate: 2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
               <motion.img
  src="/logoM.png"
  alt="Bakery Delights"
  className="w-[90%] h-74 md:h-80 object-cover rounded-xl shadow-lg mx-auto"
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.3 }}
/>

                
                {/* Overlay text */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-pink-500 mr-2" />
                    <span className="font-semibold text-gray-800">Fresh Daily • 8AM-9PM</span>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                {[
                  { value: "500+", label: "Happy Customers", emoji: "😊" },
                  { value: "50+", label: "Cake Designs", emoji: "🎂" },
                  { value: "24/7", label: "Support", emoji: "📞" }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white p-4 rounded-xl shadow-md text-center"
                    whileHover={{ y: -5, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-2xl font-bold text-pink-600 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                    <div className="text-lg mt-2">{stat.emoji}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div 
          className="mt-16 text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm">
            Every treat is baked with ❤️ at <strong className="text-pink-600">So Fresh Delights</strong> • 
            Since 2010 • Making your moments sweeter
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BakeryFAQ;