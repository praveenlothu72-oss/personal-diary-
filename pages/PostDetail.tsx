
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MessageCircle, 
  Lock, 
  Globe, 
  Edit2,
  Trash2,
  Send,
  Loader2,
  Heart
} from 'lucide-react';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { Visibility } from '../types';
import { MOOD_DATA } from '../constants';

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, comments, loading, addComment, deleteComment, deletePost, toggleLike } = usePosts();
  
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  
  const post = posts.find(p => p.id === id);
  const postComments = comments
    .filter(c => c.postId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (loading && !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Opening entry...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
        <Link to="/dashboard" className="text-indigo-600 hover:underline mt-4 inline-block">Return to dashboard</Link>
      </div>
    );
  }

  const isOwner = user?.id === post.authorId;
  const moodInfo = post.mood ? MOOD_DATA[post.mood] : null;

  const handlePostDelete = async () => {
    if (confirm('Permanently delete this entry?')) {
      await deletePost(post.id);
      navigate('/dashboard');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    await addComment(post.id, commentText);
    setCommentText('');
    setIsSubmitting(false);
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await toggleLike(post.id);
    setTimeout(() => setIsLiking(false), 300);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
       <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-10 relative">
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 text-2xl font-black border border-indigo-100">
               {post.authorName[0].toUpperCase()}
             </div>
             <div>
               <h2 className="font-bold text-xl text-gray-900">{post.authorName}</h2>
               <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                 <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                 </div>
                 <span className="text-gray-200">|</span>
                 {post.visibility === Visibility.PRIVATE ? (
                    <div className="flex items-center gap-1 text-amber-600 font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Private Diary</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Public Story</span>
                    </div>
                  )}
               </div>
             </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${isLiking ? 'scale-125' : 'scale-100'} ${post.hasLiked ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <Heart className={`w-5 h-5 ${post.hasLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-bold">{post.likesCount}</span>
            </button>
            
            {isOwner && (
              <>
                 <Link to={`/edit/${post.id}`} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                    <Edit2 className="w-5 h-5" />
                 </Link>
                 <button onClick={handlePostDelete} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                 </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
           {moodInfo && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm ${moodInfo.color}`}>
                {moodInfo.icon}
                {post.mood}
              </div>
           )}
           <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">{post.title}</h1>
        </div>

        <div className="prose prose-indigo max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap mb-10">
          {post.content}
        </div>
      </article>

      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-20">
        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Reflections ({postComments.length})
        </h3>

        {post.visibility === Visibility.PUBLIC ? (
          <>
            <form onSubmit={handleCommentSubmit} className="mb-10">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                   <textarea 
                    placeholder="Share your thoughts..."
                    className="w-full px-5 py-4 bg-gray-50 border-transparent border focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl outline-none transition-all resize-none min-h-[100px]"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting || !commentText.trim()}
                    className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-8">
              {postComments.map(comment => (
                <div key={comment.id} className="group animate-fade-in">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                          {comment.authorName[0].toUpperCase()}
                       </div>
                       <div>
                         <h4 className="font-bold text-gray-900 text-sm">{comment.authorName}</h4>
                         <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                       </div>
                    </div>
                    {comment.authorId === user?.id && (
                       <button 
                        onClick={() => deleteComment(comment.id)}
                        className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    )}
                  </div>
                  <p className="text-gray-600 pl-11 text-sm md:text-base leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
              {postComments.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-400 italic">No reflections yet. Be the first to start the conversation.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
             <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
             <p className="text-sm text-gray-500 font-medium">Comments are disabled for private entries.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default PostDetail;
