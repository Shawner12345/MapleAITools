import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { blogPosts, type Category } from '../data/blogPosts';
import GlobalCTA from '../components/GlobalCTA';
import LoadingSpinner from '../components/LoadingSpinner';

const categories: Category[] = ['AI Strategy', 'Case Study', 'Industry Insights', 'Technical', 'Team Building', 'Innovation'];

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-white animate-fade-in">
      {/* Simple Header */}
      <div className="bg-brand-primary py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-brand-accent mb-2">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Blog</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Latest Insights</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                ${selectedCategory === 'all' 
                  ? 'bg-brand-accent text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Posts
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                  ${selectedCategory === category 
                    ? 'bg-brand-accent text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300"
          />
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Featured Article</h2>
          <Link 
            to={`/blog/${featuredPost.id}`}
            className="group grid md:grid-cols-2 gap-8 bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-brand-accent/50 transition-all duration-300 hover:shadow-lg"
          >
            <div className="aspect-[16/9] md:aspect-auto relative">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 text-brand-accent mb-4">
                <featuredPost.icon className="w-5 h-5" />
                <span>{featuredPost.category}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-accent transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={featuredPost.author.avatar} 
                    alt={featuredPost.author.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{featuredPost.author.name}</div>
                    <div className="text-gray-500">{featuredPost.date} · {featuredPost.readTime}</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-accent transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-brand-accent/50 transition-all duration-300 hover:shadow-lg animate-slide-in-from-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[16/9] relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-brand-accent mb-4">
                  <post.icon className="w-4 h-4" />
                  <span className="text-sm">{post.category}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-brand-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{post.author.name}</div>
                      <div className="text-gray-500">{post.readTime}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-brand-accent transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <GlobalCTA />
    </main>
  );
}