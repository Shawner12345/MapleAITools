import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Only apply sticky behavior on homepage
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const scrollToServices = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
    setIsMenuOpen(false);
  };

  const navClasses = `w-full z-50 transition-all duration-300 ${
    isHomePage ? 'fixed' : 'relative'
  } ${
    isScrolled && isHomePage ? 'bg-brand-primary/90 backdrop-blur-lg' : isHomePage ? 'bg-transparent' : 'bg-brand-primary'
  }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link 
            to="/"
            className="flex items-center gap-2"
          >
            <Leaf className="h-8 w-8 text-brand-accent transform rotate-[200deg]" />
            <span className="text-2xl font-bold text-brand-light">
              Maple AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a 
                href="/#services" 
                onClick={scrollToServices}
                className="text-brand-secondary hover:text-brand-light transition-colors"
              >
                About Us
              </a>
              <Link 
                to="/case-studies" 
                className="text-brand-secondary hover:text-brand-light transition-colors"
              >
                Case Studies
              </Link>
              <Link 
                to="/blog" 
                className="text-brand-secondary hover:text-brand-light transition-colors"
              >
                Blog
              </Link>
              <Link 
                to="/tools" 
                className="text-brand-secondary hover:text-brand-light transition-colors"
              >
                Tools
              </Link>
              <a 
                href="#contact" 
                onClick={scrollToContact}
                className="bg-brand-accent text-brand-light px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-brand-light"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-brand-primary/90 backdrop-blur-lg py-4 border-t border-brand-primary/20">
            <div className="flex flex-col space-y-4 px-4">
              <a 
                href="/#services" 
                onClick={scrollToServices}
                className="text-brand-secondary hover:text-brand-light transition-colors"
              >
                About Us
              </a>
              <Link 
                to="/case-studies" 
                className="text-brand-secondary hover:text-brand-light transition-colors"
              >
                Case Studies
              </Link>
              <Link 
                to="/blog" 
                className="text-brand-secondary hover:text-brand-light transition-colors"
              >
                Blog
              </Link>
              <Link 
                to="/tools" 
                className="text-brand-secondary hover:text-brand-light transition-colors"
              >
                Tools
              </Link>
              <a 
                href="#contact" 
                onClick={scrollToContact}
                className="bg-brand-accent text-brand-light px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors inline-block"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}