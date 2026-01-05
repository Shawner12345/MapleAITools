import React, { useState, useEffect } from 'react';
import { Users, Loader } from 'lucide-react';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { Post } from '../../types/post';
import { subscribeToPost } from '../../services/postService';
import { useAuth } from '../../contexts/AuthContext';

export const SocialFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToPost((updatedPosts) => {
      setPosts(updatedPosts);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Users className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">The Lads</h1>
        </div>
        <p className="text-gray-600 text-lg">Stay connected with your friends</p>
      </div>

      {/* Create Post */}
      <CreatePost />

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-500">
            {user
              ? "Be the first to share something with the lads!"
              : "Sign in to see posts from your friends"}
          </p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
