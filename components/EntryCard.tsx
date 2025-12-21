
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, Lock, Globe, Edit2, Trash2, Heart } from 'lucide-react';
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
  const { deletePost, comments } = usePosts();
  const isOwner = user?.id === post.authorId;
  const moodInfo = post.mood ? MOOD_DATA[post.mood] : null;
  const postComments = comments.filter(c => c.postId === post.id);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Delete this entry?')) {
      deletePost(post.id);
    }
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
                 {post.authorName[0].toUpperCase()}
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
            <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{Math.floor(Math.random() * 5)}</span>
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
