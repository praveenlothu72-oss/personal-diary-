
import React from 'react';
import { usePosts } from '../context/PostContext';
import EntryCard from '../components/EntryCard';
import { Visibility } from '../types';
import { Globe, TrendingUp, Loader2 } from 'lucide-react';

const Feed: React.FC = () => {
  const { posts, loading } = usePosts();
  const publicPosts = posts.filter(p => p.visibility === Visibility.PUBLIC);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Gathering experiences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-4">
          <Globe className="w-4 h-4" />
          <span>Global Community</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Shared Experiences</h1>
        <p className="text-gray-500 text-lg">Discover moments of growth, joy, and reflection from souls around the world.</p>
      </div>

      <div className="space-y-6">
        {publicPosts.length > 0 ? (
          publicPosts.map(post => (
            <EntryCard key={post.id} post={post} />
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
             <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-gray-900">The feed is quiet</h3>
             <p className="text-gray-500">Be the first to share an experience with the community.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
