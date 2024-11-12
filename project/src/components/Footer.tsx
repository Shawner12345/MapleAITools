import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

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
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <footer className="bg-brand-dark border-t border-brand-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-brand-accent transform rotate-[200deg]" />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-accent/80">
                Maple AI
              </span>
            </Link>
            <p className="text-brand-secondary">
              Transforming businesses through AI training and consulting
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-brand-light">Services</h3>
            <ul className="space-y-2 text-brand-secondary">
              <li><a href="/#services" onClick={scrollToServices} className="hover:text-brand-accent">AI Training</a></li>
              <li><a href="/#services" onClick={scrollToServices} className="hover:text-brand-accent">Process Optimization</a></li>
              <li><a href="/#services" onClick={scrollToServices} className="hover:text-brand-accent">Strategic Consulting</a></li>
              <li><a href="/#services" onClick={scrollToServices} className="hover:text-brand-accent">Team Coaching</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-brand-light">Company</h3>
            <ul className="space-y-2 text-brand-secondary">
              <li><Link to="/" className="hover:text-brand-accent">About Us</Link></li>
              <li><Link to="/case-studies" className="hover:text-brand-accent">Case Studies</Link></li>
              <li><Link to="/blog" className="hover:text-brand-accent">Blog</Link></li>
              <li><a href="#contact" onClick={scrollToContact} className="hover:text-brand-accent">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-brand-light">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://twitter.com/mapleai" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-brand-accent">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/company/mapleai" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-brand-accent">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:contact@mapleai.com" className="text-brand-secondary hover:text-brand-accent">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-brand-primary/20 text-center text-brand-secondary">
          <p>&copy; {new Date().getFullYear()} Maple AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}