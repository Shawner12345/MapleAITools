import React from 'react';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import CaseStudies from '../components/CaseStudies';
import CTASection from '../components/CTASection';
import ContactForm from '../components/ContactForm';
import Services from '../components/Services';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Benefits />
      <CaseStudies />
      <CTASection />
      <ContactForm />
    </>
  );
}