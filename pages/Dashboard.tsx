
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import EntryCard from '../components/EntryCard';
import { Search, Filter, PlusCircle, Book, Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { posts, loading } = usePosts();
  const [searchTerm, setSearchTerm] = useState('');
  
  const myPosts = posts.filter(p => p.authorId === user?.id);
  const filteredPosts = myPosts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Opening your journal...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.username}</h1>
          <p className="text-gray-500">You have {myPosts.length} entries in your soul journal.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search entries..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="p-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map(post => (
            <EntryCard key={post.id} post={post} showAuthor={false} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No entries found</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {searchTerm ? "Try a different search term or clear the filter." : "Your journal is empty. Start documenting your journey today."}
          </p>
          {!searchTerm && (
            <a 
              href="/create"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all font-semibold"
            >
              <PlusCircle className="w-5 h-5" />
              Create First Entry
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
