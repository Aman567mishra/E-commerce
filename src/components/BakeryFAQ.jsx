import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bakeryImage from "../assets/faq.jpg";

const faqs = [
  // same FAQ data...
  {
    category: "Cakes",
    questions: [
      {
        q: "Do you make custom cakes?",
        a: "Yes! We create custom cakes for birthdays, weddings, anniversaries, and any special occasion. You can share your design or choose from our theme options."
      },
      {
        q: "Can I choose the flavor and filling?",
        a: "Absolutely. We offer a variety of flavors like chocolate, vanilla, red velvet, butterscotch, pineapple, and more—plus multiple fillings like ganache, fruit, or cream."
      },
      {
        q: "Do you make eggless or vegan cakes?",
        a: "Yes, we offer both eggless and vegan options on request."
      },
      {
        q: "How much notice do you need for a custom cake?",
        a: "We recommend placing your order at least 2–3 days in advance. For larger or tiered cakes, 5–7 days is ideal."
      },
      {
        q: "How long does the cake stay fresh?",
        a: "Our cakes stay fresh for 2–3 days when refrigerated properly."
      }
    ]
  },
  {
    category: "Cupcakes",
    questions: [
      {
        q: "What cupcake flavors are available?",
        a: "We rotate flavors weekly, but popular options include chocolate, vanilla, red velvet, Oreo, and caramel."
      },
      {
        q: "Do you offer mini cupcakes?",
        a: "Yes, mini cupcakes are available for parties and bulk orders."
      },
      {
        q: "Can I customize the cupcakes?",
        a: "Yes! We can create custom toppers, themes, or logos for special events."
      }
    ]
  },
  {
    category: "Pastries",
    questions: [
      {
        q: "Are your pastries made fresh daily?",
        a: "Yes, all our pastries are baked fresh each day using premium ingredients."
      },
      {
        q: "Do you have eggless pastry options?",
        a: "Yes, we have a selection of eggless pastries available every day."
      },
      {
        q: "Can I pre-order pastries?",
        a: "Definitely! You can place pre-orders for pickups or events."
      }
    ]
  },
  {
    category: "Cookies",
    questions: [
      {
        q: "What types of cookies do you have?",
        a: "We bake chocolate chip, nutty, oatmeal, sugar, and seasonal special cookies."
      },
      {
        q: "Can I order in bulk for gifting?",
        a: "Yes, we offer beautifully packed cookie boxes for events, return gifts, and holidays."
      },
      {
        q: "Are your cookies eggless or gluten-free?",
        a: "We have a few eggless options—gluten-free cookies are available on request."
      }
    ]
  },
  {
    category: "Order & Delivery",
    questions: [
      {
        q: "How can I place an order?",
        a: "You can order via our website, WhatsApp, Instagram, or visit our store directly."
      },
      {
        q: "Do you offer delivery?",
        a: "Yes, we offer local delivery within city limits. Charges may apply depending on distance."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, cards, cash, and online payment gateways."
      }
    ]
  },
  {
    category: "Events & Bulk Orders",
    questions: [
      {
        q: "Can you cater to events or corporate orders?",
        a: "Yes! We provide customized bulk orders for parties, weddings, and corporate events."
      },
      {
        q: "Do you offer dessert tables or gifting packages?",
        a: "Yes, we can create dessert platters, gift boxes, and return gifts tailored to your occasion."
      }
    ]
  }
];

// Pink + green sparkles for visibility on white
const Glitter = ({ x, y, delay, color }) => (
  <motion.div
    className={`absolute w-1.5 h-1.5 rounded-full opacity-80`}
    style={{ backgroundColor: color, left: x, top: y, filter: `drop-shadow(0 0 4px ${color})` }}
    initial={{ scale: 0, rotate: 0 }}
    animate={{ scale: [0, 1, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
    transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: Math.random() * 3 }}
  />
);

const FAQItem = ({ q, a, isOpen, onClick }) => (
  <motion.div layout className="border border-green-200 mb-3 bg-white rounded-xl px-4 py-3 shadow-sm">
    <button
      className="flex justify-between items-center w-full text-left text-green-900 hover:text-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-lg"
      onClick={onClick}
    >
      <span className="text-sm sm:text-base font-medium leading-snug pr-2">{q}</span>
      <div className="flex-shrink-0 ml-2 text-green-500">
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-green-700 mt-2 pl-1 text-xs sm:text-sm leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const BakeryFAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState(faqs[0].category);
  const [openIndex, setOpenIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glitters, setGlitters] = useState([]);

  const currentFAQ = faqs.find((f) => f.category === selectedCategory);

  useEffect(() => {
    const initialGlitters = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 2,
      color: Math.random() > 0.5 ? "rgba(236, 72, 153, 0.9)" : "rgba(34, 197, 94, 0.9)" // pink or green
    }));
    setGlitters(initialGlitters);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (Math.random() > 0.7) {
        const newGlitter = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 100,
          y: e.clientY + (Math.random() - 0.5) * 100,
          delay: 0,
          color: Math.random() > 0.5 ? "rgba(236, 72, 153, 0.9)" : "rgba(34, 197, 94, 0.9)"
        };
        setGlitters((prev) => [...prev.slice(-20), newGlitter]);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden font-sans bg-white">
      {glitters.map((g) => (
        <Glitter key={g.id} x={g.x} y={g.y} delay={g.delay} color={g.color} />
      ))}

      <motion.div
        className="absolute w-8 h-8 pointer-events-none z-10"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        <div className="w-full h-full rounded-full" style={{ boxShadow: "0 0 24px 8px rgba(236, 72, 153, 0.3)" }} />
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-3 sm:px-4 pt-6">
        {faqs.map(({ category }) => (
          <motion.button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setOpenIndex(null);
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border ${
              selectedCategory === category
                ? "bg-green-500 text-white border-green-500 shadow-md"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-3 sm:px-4 md:px-6 py-8 sm:py-12 max-w-7xl mx-auto">
        <div className="order-2 lg:order-1">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-green-900 text-center lg:text-left"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {selectedCategory} FAQs
          </motion.h2>

          <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {currentFAQ.questions.map((item, idx) => (
              <FAQItem key={idx} q={item.q} a={item.a} isOpen={openIndex === idx} onClick={() => setOpenIndex(openIndex === idx ? null : idx)} />
            ))}
          </motion.div>
        </div>

        <div className="order-1 lg:order-2 flex items-center justify-center">
          <motion.div
            className="w-56 sm:w-64 md:w-72 h-56 sm:h-64 md:h-72 bg-white rounded-2xl border border-green-200 flex items-center justify-center shadow-md"
            initial={{ opacity: 0, rotate: -4 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ rotate: 3, scale: 1.04 }}
          >
            <motion.img
              src={bakeryImage}
              alt="Bakery"
              className="w-40 sm:w-48 md:w-56 h-40 sm:h-48 md:h-56 object-cover rounded-xl shadow"
              whileHover={{ scale: 1.06, rotate: 2 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BakeryFAQ;

