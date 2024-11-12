import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import GlobalCTA from '../components/GlobalCTA';

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <Link to="/blog" className="text-brand-accent hover:underline">
            View all articles
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts based on category
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/#contact');
  };

  return (
    <div className="pt-20 bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-brand-accent mb-6 hover:text-brand-accent/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </button>
            <div className="max-w-3xl">
              <div className="flex items-center text-brand-secondary mb-4">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link to="/blog" className="hover:underline">Blog</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span>{post.title}</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6">{post.title}</h1>
              <div className="flex items-center gap-6 text-brand-secondary">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </article>
            
            {/* Author Bio */}
            <div className="mt-12 p-8 bg-gray-100 rounded-xl">
              <div className="flex items-center gap-4">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-lg text-gray-900">{post.author.name}</div>
                  <div className="text-gray-600">{post.author.role}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {relatedPosts.length > 0 && (
            <div>
              <div className="sticky top-24">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Related Articles</h3>
                <div className="space-y-6">
                  {relatedPosts.map(relatedPost => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="group block"
                    >
                      <div className="aspect-[16/9] rounded-lg overflow-hidden mb-3">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-brand-accent transition-colors">
                        {relatedPost.title}
                      </h4>
                      <div className="text-sm text-gray-500">{relatedPost.readTime}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <GlobalCTA />
    </div>
  );
}