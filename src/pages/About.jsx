import React from 'react';
import BakeryFooter from '../components/Footer';
import DividerFooter from '../components/DividerAndFooter';

const About = () => {
  // Inline styles for the component
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fffef7'
    },
    
    // Hero Section
    hero: {
      textAlign: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f9d5e5 0%, #ffe6ee 100%)',
      borderRadius: '20px',
      marginBottom: '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    mainTitle: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      color: '#5d4037',
      marginBottom: '10px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      fontWeight: '700'
    },
    tagline: {
      fontSize: 'clamp(1rem, 3vw, 1.3rem)',
      color: '#8d6e63',
      fontStyle: 'italic',
      maxWidth: '800px',
      margin: '0 auto'
    },
    
    // Section Common Styles
    section: {
      padding: '30px',
      margin: '30px 0',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden'
    },
    cakeSection: {
      background: 'linear-gradient(to right, #fff8e1, #ffecb3)',
      borderLeft: '5px solid #ffb300'
    },
    cookieSection: {
      background: 'linear-gradient(to right, #f3e5f5, #e1bee7)',
      borderLeft: '5px solid #8e24aa'
    },
    brownieSection: {
      background: 'linear-gradient(to right, #d7ccc8, #bcaaa4)',
      borderLeft: '5px solid #5d4037'
    },
    jarSection: {
      background: 'linear-gradient(to right, #e8f5e9, #c8e6c9)',
      borderLeft: '5px solid #43a047'
    },
    
    // Typography
    sectionTitle: {
      fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
      color: '#4a148c',
      marginBottom: '5px',
      fontWeight: '700'
    },
    sectionSubtitle: {
      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
      color: '#6d4c41',
      marginBottom: '20px',
      fontWeight: '500'
    },
    
    // Badges & Tags
    sectionBadge: {
      display: 'inline-block',
      background: '#ff4081',
      color: 'white',
      padding: '5px 15px',
      borderRadius: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      fontSize: '0.9rem'
    },
    flavorTag: {
      display: 'inline-block',
      background: 'white',
      padding: '8px 15px',
      margin: '0 10px 10px 0',
      borderRadius: '25px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      fontWeight: '500'
    },
    
    // Cards & Grids
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      margin: '25px 0'
    },
    featureCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
    },
    featureIcon: {
      fontSize: '2.5rem',
      marginBottom: '15px'
    },
    
    // Highlight Boxes
    highlightBox: {
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '15px',
      borderRadius: '10px',
      margin: '20px 0',
      borderLeft: '4px solid #ff9800'
    },
    
    // Lists
    featureList: {
      listStyle: 'none',
      padding: '0',
      margin: '20px 0'
    },
    featureListItem: {
      padding: '8px 0 8px 30px',
      position: 'relative',
      marginBottom: '5px'
    },
    checkMark: {
      position: 'absolute',
      left: '0',
      color: '#4caf50',
      fontWeight: 'bold'
    },
    
    // Buttons
    ctaButton: {
      background: 'linear-gradient(135deg, #ff5252 0%, #ff4081 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '30px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'all 0.3s ease',
      display: 'inline-block'
    },
    
    // Advantages Section
    advantagesSection: {
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
      borderRadius: '15px',
      marginTop: '40px',
      textAlign: 'center'
    },
    advantagesTitle: {
      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
      color: '#5d4037',
      marginBottom: '30px'
    },
    advantagesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px',
      margin: '30px 0'
    },
    advantageCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    advantageIcon: {
      fontSize: '3rem',
      marginBottom: '15px'
    },
    
    // Final CTA
    finalCta: {
      textAlign: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)',
      borderRadius: '15px',
      marginTop: '40px'
    },
    ctaButtons: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      flexWrap: 'wrap'
    },
    primaryCta: {
      background: 'linear-gradient(135deg, #ff5252 0%, #ff4081 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '30px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    secondaryCta: {
      background: 'transparent',
      color: '#5d4037',
      border: '2px solid #5d4037',
      padding: '10px 20px',
      borderRadius: '30px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    
    // Brownie Variants
    brownieVariants: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      margin: '25px 0'
    },
    variantCard: {
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '20px',
      borderRadius: '10px',
      textAlign: 'center',
      transition: 'transform 0.3s ease'
    },
    variantHeader: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#5d4037'
    },
    
    // Jar Features
    jarFeatures: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '20px',
      margin: '25px 0'
    },
    jarFeature: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      textAlign: 'center',
      minWidth: '200px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
    },
    jarIcon: {
      fontSize: '2.5rem',
      marginBottom: '15px'
    },
    
    // Selling Points
    sellingPoints: {
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '15px',
      borderRadius: '10px',
      margin: '20px 0'
    },
    
    // Responsive
    '@media (max-width: 768px)': {
      ctaButtons: {
        flexDirection: 'column',
        alignItems: 'center'
      },
      jarFeatures: {
        flexDirection: 'column'
      }
    }
  };

  // Hover effects (applied inline with onMouseEnter/onMouseLeave)
  const handleCardHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.08)';
  };

  const handleButtonHover = (e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 64, 129, 0.4)';
  };

  const handleButtonLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  const handleSecondaryHover = (e) => {
    e.currentTarget.style.background = '#5d4037';
    e.currentTarget.style.color = 'white';
  };

  const handleSecondaryLeave = (e) => {
    e.currentTarget.style.background = 'transparent';
    e.currentTarget.style.color = '#5d4037';
  };

  return (
    <div>
    <div style={styles.container}>
      
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.mainTitle}>Indulge in Sweet Perfection</h1>
        <p style={styles.tagline}>Artisanal Desserts Crafted with Passion & Precision</p>
      </div>

      {/* Classic Cakes */}
      <section style={{...styles.section, ...styles.cakeSection}}>
        <div style={styles.sectionBadge}>🎂 Customer Favorite</div>
        <h2 style={styles.sectionTitle}>Heavenly Classic Cakes</h2>
        <p style={styles.sectionSubtitle}>Moist, Fluffy & Baked Fresh Just For You</p>
        
        <div style={styles.highlightBox}>
          <p><span style={{fontWeight: 'bold'}}>🎨 Custom Creations:</span> Tell us your vision – we'll bake it to life!</p>
          <p><span style={{fontWeight: 'bold'}}>⭐ Signature Flavors:</span> Chocolate Dream | Vanilla Cloud | Butterscotch Bliss | Red Velvet Romance</p>
        </div>
        
        <ul style={styles.featureList}>
          <li style={styles.featureListItem}>
            <span style={styles.checkMark}>✓</span> Custom-designed for birthdays, anniversaries & milestones
          </li>
          <li style={styles.featureListItem}>
            <span style={styles.checkMark}>✓</span> Premium ingredients, zero compromise on taste
          </li>
          <li style={styles.featureListItem}>
            <span style={styles.checkMark}>✓</span> Multiple sizes – from intimate gatherings to grand celebrations
          </li>
          <li style={styles.featureListItem}>
            <span style={styles.checkMark}>✓</span> Order today, delivered fresh tomorrow
          </li>
        </ul>
        
        <button 
          style={styles.ctaButton}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
          onClick={() => alert('Redirecting to cake customization page!')}
        >
          🎂 Design Your Dream Cake →
        </button>
      </section>

      {/* Cookies */}
      <section style={{...styles.section, ...styles.cookieSection}}>
        <h2 style={styles.sectionTitle}>Irresistible Cookies</h2>
        <p style={{...styles.sectionSubtitle, fontStyle: 'italic'}}>"The perfect crunch-meets-chew experience"</p>
        
        <div style={styles.featureGrid}>
          <div 
            style={styles.featureCard}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.featureIcon}>🧈</div>
            <h3>Real Butter, Real Goodness</h3>
            <p>Made with 100% real butter for that authentic, melt-in-mouth texture</p>
          </div>
          
          <div 
            style={styles.featureCard}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.featureIcon}>☕</div>
            <h3>Perfect Pairing</h3>
            <p>Designed to elevate your tea, coffee, or milk moments</p>
          </div>
          
          <div 
            style={styles.featureCard}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.featureIcon}>🛍️</div>
            <h3>Freshness Sealed</h3>
            <p>Hygienically packed to lock in that just-baked freshness</p>
          </div>
        </div>
        
        <div style={{margin: '20px 0'}}>
          <span style={styles.flavorTag}>🍫 Choco-Chip Heaven</span>
          <span style={styles.flavorTag}>🧈 Buttery Delight</span>
          <span style={styles.flavorTag}>🌾 Classic Butter</span>
        </div>
      </section>

      {/* Brownies */}
      <section style={{...styles.section, ...styles.brownieSection}}>
        <h2 style={styles.sectionTitle}>Decadent Brownies</h2>
        <p style={styles.sectionSubtitle}>So Rich, So Fudgy, One Bite Is Never Enough</p>
        
        <div style={styles.brownieVariants}>
          <div 
            style={styles.variantCard}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.variantHeader}>🍫 Classic</div>
            <p>Pure chocolate indulgence with that perfect crinkle top</p>
          </div>
          
          <div 
            style={styles.variantCard}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.variantHeader}>🥜 Nutty Bliss</div>
            <p>Loaded with crunchy walnuts & almonds for texture lovers</p>
          </div>
          
          <div 
            style={styles.variantCard}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.variantHeader}>🎉 Fully Loaded</div>
            <p>Chunks, chips, nuts & everything nice – the ultimate treat!</p>
          </div>
        </div>
        
        <div style={styles.sellingPoints}>
          <p>🎁 <span style={{fontWeight: 'bold'}}>Gift-Ready Packaging:</span> Beautiful boxes that say "you're special"</p>
          <p>🔥 <span style={{fontWeight: 'bold'}}>Freshly Baked Daily:</span> Maximum softness guaranteed</p>
        </div>
      </section>

      {/* Jar Cakes */}
      <section style={{...styles.section, ...styles.jarSection}}>
        <h2 style={styles.sectionTitle}>Charming Jar Cakes</h2>
        <p style={styles.sectionSubtitle}>Layered Happiness in a Jar</p>
        
        <div style={styles.jarFeatures}>
          <div style={styles.jarFeature}>
            <div style={styles.jarIcon}>🍰</div>
            <h3>Perfect Portion</h3>
            <p>Individual-sized indulgence – no sharing required!</p>
          </div>
          
          <div style={styles.jarFeature}>
            <div style={styles.jarIcon}>🎪</div>
            <h3>Party Perfection</h3>
            <p>Dessert tables, return gifts, or party favors – always a hit!</p>
          </div>
          
          <div style={styles.jarFeature}>
            <div style={styles.jarIcon}>💝</div>
            <h3>Portable Joy</h3>
            <p>Easy to carry, impossible to resist. Sweetness on the go!</p>
          </div>
        </div>
        
        <div style={{...styles.highlightBox, borderLeft: '4px solid #43a047'}}>
          <p>🌈 <span style={{fontWeight: 'bold'}}>Rainbow of Flavors:</span> Moist sponge + creamy frosting layers = pure magic!</p>
        </div>
      </section>

      {/* Our Advantages */}
      <section style={styles.advantagesSection}>
        <h2 style={styles.advantagesTitle}>Why We're Your Sweet Choice</h2>
        
        <div style={styles.advantagesGrid}>
          <div 
            style={styles.advantageCard}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.advantageIcon}>🏆</div>
            <h3>Premium Quality Promise</h3>
            <p>We handpick the finest ingredients because your dessert moments deserve nothing less.</p>
          </div>
          
          <div 
            style={styles.advantageCard}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.advantageIcon}>👩‍🍳</div>
            <h3>Authentic Taste, Every Time</h3>
            <p>Generations-old recipes meet modern precision for consistently delightful flavors.</p>
          </div>
          
          <div 
            style={styles.advantageCard}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.advantageIcon}>✨</div>
            <h3>Endless Creativity</h3>
            <p>We dream, design, and delight – constantly innovating to surprise your taste buds.</p>
          </div>
        </div>
        
        <div style={styles.finalCta}>
          <h3 style={{color: '#1976d2', marginBottom: '10px'}}>Ready to Treat Yourself?</h3>
          <p style={{color: '#424242', marginBottom: '20px'}}>Browse our full menu or chat with us for custom orders!</p>
          <div style={styles.ctaButtons}>
            <button 
              style={styles.primaryCta}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
              onClick={() => alert('Opening full menu!')}
            >
              🍰 View Complete Menu →
            </button>
            <button 
              style={styles.secondaryCta}
              onMouseEnter={handleSecondaryHover}
              onMouseLeave={handleSecondaryLeave}
              onClick={() => alert('Opening chat with bakers!')}
            >
              💬 Chat with Our Bakers
            </button>
          </div>
        </div>
      </section>
      
    </div>
    <DividerFooter />
    </div>
    
  );
  
};

export default About;