import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Quote, ArrowRight } from 'lucide-react';
import { caseStudies } from '../data/caseStudies';

export default function CaseStudyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const study = caseStudies.find(s => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/#contact');
  };

  if (!study) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Case Study Not Found</h2>
          <Link to="/case-studies" className="text-brand-accent hover:underline">
            View all case studies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img 
          src={study.heroImage || study.image} 
          alt={study.company} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="flex items-center text-brand-secondary mb-4">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link to="/case-studies" className="hover:underline">Case Studies</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span>{study.company}</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6">{study.title}</h1>
              <p className="text-xl text-brand-secondary">{study.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Challenge */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
              <p className="text-gray-600 mb-8">{study.challenge}</p>
              <div className="bg-gray-100 rounded-xl p-8">
                <Quote className="w-8 h-8 text-brand-accent mb-4" />
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  {study.clientQuote}
                </blockquote>
                <cite className="text-gray-600">
                  - {study.clientName}, {study.clientTitle}
                </cite>
              </div>
            </section>

            {/* Solution */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Solution</h2>
              <p className="text-gray-600 mb-8">{study.solution}</p>
              <div className="grid md:grid-cols-2 gap-8">
                {study.solutionPoints.map((point, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                    <point.icon className="w-8 h-8 text-brand-accent mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                    <p className="text-gray-600">{point.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Results */}
            <section>
              <h2 className="text-3xl font-bold mb-6">The Results</h2>
              <p className="text-gray-600 mb-8">{study.results}</p>
              <div className="grid md:grid-cols-3 gap-6">
                {study.resultMetrics.map((metric, index) => (
                  <div key={index} className="bg-brand-primary text-white p-6 rounded-xl">
                    <metric.icon className="w-8 h-8 mb-4" />
                    <div className="text-3xl font-bold mb-2">{metric.value}</div>
                    <div className="text-brand-secondary">{metric.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded-xl p-8 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Project Details</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-gray-600">Industry</dt>
                  <dd className="font-semibold">{study.industry.name}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Team Size</dt>
                  <dd className="font-semibold">{study.metrics.teamSize}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Timeline</dt>
                  <dd className="font-semibold">{study.metrics.timeframe}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Services Used</dt>
                  <dd>
                    <ul className="list-disc list-inside space-y-1">
                      {study.services.map((service, index) => (
                        <li key={index} className="font-semibold">{service}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>

              <div className="mt-8 pt-8 border-t border-gray-300">
                <h3 className="text-xl font-bold mb-4">Ready to Transform?</h3>
                <p className="text-gray-600 mb-6">
                  Let's discuss how we can achieve similar results for your business.
                </p>
                <a
                  href="#contact"
                  onClick={scrollToContact}
                  className="inline-flex items-center gap-2 bg-brand-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}