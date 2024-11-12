import React from 'react';
import { ArrowRight, ChevronRight, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { caseStudies } from '../data/caseStudies';
import GlobalCTA from '../components/GlobalCTA';

export default function CaseStudiesPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-brand-primary text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Client Success Stories</h1>
            <p className="text-xl text-brand-secondary mb-8">
              Discover how we've helped businesses transform their operations through AI implementation and training.
            </p>
            <div className="flex items-center text-brand-accent">
              <Link to="/" className="hover:underline">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span>Case Studies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {caseStudies.map((study) => (
            <Link 
              key={study.id}
              to={`/case-studies/${study.id}`}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64">
                <img 
                  src={study.image} 
                  alt={study.company} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 text-brand-accent mb-4">
                  <study.industry.icon className="w-5 h-5" />
                  <span>{study.industry.name}</span>
                </div>

                <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-accent transition-colors">
                  {study.company}
                </h3>

                <p className="text-gray-600 mb-6">{study.summary}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{study.metrics.improvement}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600">{study.metrics.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-600">{study.metrics.teamSize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-brand-accent" />
                    <span className="text-gray-600">{study.metrics.completion}</span>
                  </div>
                </div>

                <div className="flex items-center text-brand-accent font-semibold">
                  Read case study 
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <GlobalCTA />
    </div>
  );
}