
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, Lock, Globe, Edit2, Trash2, Heart, AlertCircle } from 'lucide-react';
import { Post, Visibility } from '../types';
import { MOOD_DATA } from '../constants';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';

interface EntryCardProps {
  post: Post;
  showAuthor?: boolean;
}

const EntryCard: React.FC<EntryCardProps> = ({ post, showAuthor = true }) => {
  const { user } = useAuth();
  const { deletePost, toggleLike, comments } = usePosts();
  const [isLiking, setIsLiking] = useState(false);
  const [showVerifyTooltip, setShowVerifyTooltip] = useState(false);
  
  const isOwner = user?.id === post.authorId;
  const moodInfo = post.mood ? MOOD_DATA[post.mood] : null;
  const postComments = comments.filter(c => c.postId === post.id);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Delete this entry?')) {
      deletePost(post.id);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.emailConfirmed) {
      setShowVerifyTooltip(true);
      setTimeout(() => setShowVerifyTooltip(false), 3000);
      return;
    }

    if (isLiking) return;
    
    setIsLiking(true);
    await toggleLike(post.id);
    setTimeout(() => setIsLiking(false), 300);
  };

  return (
    <Link 
      to={`/post/${post.id}`}
      className="block group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="p-5 md:p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {showAuthor && !isOwner && (
               <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                 {post.authorName?.[0]?.toUpperCase() || '?'}
               </div>
            )}
            <div>
              {showAuthor && !isOwner && <h4 className="font-semibold text-gray-900">{post.authorName}</h4>}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="text-gray-300">•</span>
                {post.visibility === Visibility.PRIVATE ? (
                  <div className="flex items-center gap-1 text-amber-600 font-medium">
                    <Lock className="w-3 h-3" />
                    <span>Private</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-green-600 font-medium">
                    <Globe className="w-3 h-3" />
                    <span>Public</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {moodInfo && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${moodInfo.color}`}>
              {moodInfo.icon}
              <span className="hidden sm:inline">{post.mood}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 line-clamp-3 text-sm md:text-base leading-relaxed mb-6">
          {post.content}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{postComments.length}</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-all duration-300 transform ${isLiking ? 'scale-150' : 'scale-100'} ${post.hasLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'} ${!user?.emailConfirmed ? 'opacity-30' : ''}`}
                title={!user?.emailConfirmed ? "Verify email to like" : "Like story"}
              >
                <Heart className={`w-4 h-4 transition-all ${post.hasLiked ? 'fill-current' : ''}`} />
                <span>{post.likesCount}</span>
              </button>
              
              {showVerifyTooltip && (
                <div className="absolute bottom-full left-0 mb-3 w-48 p-2.5 bg-gray-900 text-white text-[10px] rounded-xl shadow-2xl animate-bounce z-50">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Check your inbox! Verify your email to like experiences.</span>
                  </div>
                  <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 rotate-45 -translate-y-1"></div>
                </div>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Link 
                to={`/edit/${post.id}`}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </Link>
              <button 
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EntryCard;
