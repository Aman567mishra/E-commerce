import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Send,
  ArrowRight,
} from 'lucide-react';

const BakeryFooter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <footer
      className="relative text-white overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #03140f 0%, #082a1d 100%)',
      }}
    >
      {/* Soft blur accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-24 left-10 w-72 h-72 bg-green-400 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-24 right-10 w-96 h-96 bg-emerald-500 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-light text-white mb-4">So Fresh Delight</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-lime-500 rounded-full mb-4"></div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Handmade pastries, elegant cakes, and artisan sweets crafted fresh
              every day with love and quality ingredients.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Treats</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Cakes', 'Cookies', 'Cupcakes', 'Pastries', 'Gift Boxes', 'Seasonal'].map(
                (item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="flex items-center hover:text-white group transition"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100" />
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">About</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Our Story', 'Careers', 'Press', 'Contact', 'FAQs'].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="flex items-center hover:text-white group transition"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay in Touch</h4>
            <p className="text-gray-400 text-sm mb-4">
              Join our sweet list for exclusive updates & seasonal offers.
            </p>
            <div className="flex mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-2 text-sm rounded-l bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                onClick={handleSubscribe}
                className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 px-4 rounded-r text-sm font-medium"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-400">
              {[{ icon: Phone, text: '+1 (555) 123-4567' },
                { icon: Mail, text: 'sofreshdelights@gmail.com' },
                { icon: MapPin, text: 'Rampally,Hyderabad- 501301' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center">
                  <Icon size={14} className="mr-3 text-green-400" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-light text-white mb-4">
            Let us bake your next celebration.
          </h3>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Weddings, birthdays, or just because—it’s sweeter with So Fresh Delight.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-lime-500 text-white font-medium hover:scale-105 transition-transform"
            >
              <Mail size={18} className="mr-2" />
              Start an Order
            </a>
            <a
              href="/Gallery"
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/10 hover:border-white/30 text-white hover:bg-white/5 transition"
            >
              View Gallery
              <ArrowRight size={18} className="ml-2" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500 text-xs">
          <span>© 2024 So Fresh Delight. All rights reserved.</span>
          <div className="flex space-x-6 mt-2 sm:mt-0">
            {['Privacy Policy', 'Terms', 'Accessibility'].map((item, i) => (
              <a key={i} href="#" className="hover:text-white transition">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BakeryFooter;
