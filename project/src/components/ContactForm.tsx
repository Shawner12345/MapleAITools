import React, { useState, useEffect } from 'react';
import FormContainer from './forms/FormContainer';
import FormInput from './forms/FormInput';
import FormSelect from './forms/FormSelect';
import FormTextarea from './forms/FormTextarea';
import FormSuccess from './forms/FormSuccess';
import FormError from './forms/FormError';
import MagneticButton from './forms/MagneticButton';
import { useServiceContext } from '../context/ServiceContext';
import { services } from './Services';
import { Users, Sparkles, ArrowRight } from 'lucide-react';

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  company: '',
  type: '',
  message: ''
};

const REQUIRED_FIELDS = ['name', 'email', 'type', 'message'];

export default function ContactForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedServices, clearServices } = useServiceContext();

  useEffect(() => {
    const filledFields = REQUIRED_FIELDS.filter(field => formData[field as keyof typeof formData]?.trim());
    const newProgress = (filledFields.length / REQUIRED_FIELDS.length) * 100;
    setProgress(newProgress);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setIsGlowing(true);
    setError(null);

    const selectedServiceTitles = selectedServices
      .map(id => services.find(s => s.id === id)?.title)
      .filter(Boolean)
      .join(', ');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '66f4db45-31b5-4422-b18a-502880afaec8',
          ...formData,
          services: selectedServiceTitles
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
      setFormData(INITIAL_FORM_STATE);
      clearServices();
    } catch (error) {
      setError('There was a problem submitting your form. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
      setTimeout(() => setIsGlowing(false), 1500);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const typeOptions = [
    { value: 'individual', label: 'Individual Training' },
    { value: 'small-business', label: 'Small Business (1-50 employees)' },
    { value: 'medium-business', label: 'Medium Business (51-200 employees)' },
    { value: 'enterprise', label: '201+ employees' }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated conversion element */}
        <div className="absolute left-4 lg:left-8 transform -translate-y-12 bg-brand-accent/5 backdrop-blur-sm border border-brand-accent/20 rounded-lg p-4 hover:scale-105 transition-transform duration-300 group animate-float">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Users className="w-6 h-6 text-brand-accent" />
              <Sparkles className="w-4 h-4 text-brand-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="pr-2">
              <div className="text-sm font-medium text-gray-900">Join 100+ Others</div>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                Start today
                <ArrowRight className="w-3 h-3 text-brand-accent transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>

        <FormContainer 
          isSubmitting={submitting} 
          progress={progress}
          isGlowing={isGlowing}
        >
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Start Your AI Journey Today</h2>
          <p className="text-gray-600 text-center mb-8">
            Get a free consultation and personalized AI training plan
          </p>

          {error && <FormError message={error} />}

          {submitted ? (
            <FormSuccess 
              title="Thank You!"
              message="We've received your message and will get back to you shortly."
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormSelect
                  id="type"
                  name="type"
                  label="Training Type"
                  options={typeOptions}
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  id="company"
                  name="company"
                  label="Company Name (Optional)"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <FormTextarea
                id="message"
                name="message"
                label="How can we help you with AI?"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
              />

              <MagneticButton 
                isSubmitting={submitting}
                onButtonClick={() => setIsGlowing(true)}
              />
            </form>
          )}
        </FormContainer>
      </div>
    </section>
  );
}