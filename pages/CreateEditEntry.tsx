
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Lock, 
  Globe, 
  Sparkles, 
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react';
import { usePosts } from '../context/PostContext';
import { Mood, Visibility } from '../types';
import { MOOD_DATA } from '../constants';
import { generateStoryIdea, refineEntry } from '../services/geminiService';

const CreateEditEntry: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, addPost, updatePost } = usePosts();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PRIVATE);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = posts.find(p => p.id === id);
      if (existing) {
        setTitle(existing.title);
        setContent(existing.content);
        setMood(existing.mood);
        setVisibility(existing.visibility);
      }
    }
  }, [id, posts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || isSaving) return;

    setIsSaving(true);
    let success = false;
    
    if (id) {
      success = await updatePost(id, { title, content, mood, visibility });
    } else {
      success = await addPost({ title, content, mood, visibility });
    }
    
    if (success) {
      navigate('/dashboard');
    } else {
      alert("Something went wrong while saving. Please check your connection.");
      setIsSaving(false);
    }
  };

  const handleAIAssist = async () => {
    if (!mood) {
      alert("Please select a mood first for better AI suggestions!");
      return;
    }
    setIsAIThinking(true);
    const suggestion = await generateStoryIdea(mood);
    setTitle(suggestion.split('\n')[0].replace('#', '').trim());
    setIsAIThinking(false);
  };

  const handleAIRefine = async () => {
    if (!content) return;
    setIsAIThinking(true);
    const refined = await refineEntry(content);
    setContent(refined);
    setIsAIThinking(false);
  };

  return (
    <div className="max-w-3xl mx-auto animate-slide-up pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-8">{id ? 'Edit Your Journey' : 'Begin a New Entry'}</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Visibility Selector - NOW MUCH MORE PROMINENT */}
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
               <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Privacy & Visibility</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setVisibility(Visibility.PRIVATE)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                      visibility === Visibility.PRIVATE 
                        ? 'bg-white border-indigo-600 shadow-md ring-4 ring-indigo-50' 
                        : 'bg-white border-transparent hover:border-gray-200 opacity-60'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${visibility === Visibility.PRIVATE ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                         <span className={`font-bold ${visibility === Visibility.PRIVATE ? 'text-indigo-600' : 'text-gray-900'}`}>Private Diary</span>
                         {visibility === Visibility.PRIVATE && <Check className="w-4 h-4 text-indigo-600" />}
                       </div>
                       <p className="text-xs text-gray-500 mt-1">Only visible to you. A personal space for reflection.</p>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setVisibility(Visibility.PUBLIC)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                      visibility === Visibility.PUBLIC 
                        ? 'bg-white border-indigo-600 shadow-md ring-4 ring-indigo-50' 
                        : 'bg-white border-transparent hover:border-gray-200 opacity-60'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${visibility === Visibility.PUBLIC ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                         <span className={`font-bold ${visibility === Visibility.PUBLIC ? 'text-indigo-600' : 'text-gray-900'}`}>Public Story</span>
                         {visibility === Visibility.PUBLIC && <Check className="w-4 h-4 text-indigo-600" />}
                       </div>
                       <p className="text-xs text-gray-500 mt-1">Visible to the community. Others can read and reflect with you.</p>
                    </div>
                  </button>
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">How are you feeling?</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(MOOD_DATA).map(([key, data]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMood(key as Mood)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm transition-all border ${
                      mood === key 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 font-bold' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-200'
                    }`}
                  >
                    {data.icon}
                    <span>{key}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Title</label>
                 {!id && (
                   <button 
                    type="button"
                    onClick={handleAIAssist}
                    disabled={isAIThinking || !mood}
                    className="flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-700 disabled:opacity-40 transition-all px-3 py-1 bg-indigo-50 rounded-full"
                   >
                     {isAIThinking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                     AI Suggested Title
                   </button>
                 )}
              </div>
              <input
                type="text"
                placeholder="Name your experience..."
                className="w-full px-6 py-5 bg-gray-50 border-transparent border-2 focus:bg-white focus:border-indigo-500 focus:ring-0 rounded-3xl outline-none transition-all text-xl font-bold text-gray-900 placeholder:text-gray-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">The Experience</label>
                 {content.length > 20 && (
                   <button 
                    type="button"
                    onClick={handleAIRefine}
                    disabled={isAIThinking}
                    className="flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-700 disabled:opacity-40 transition-all px-3 py-1 bg-emerald-50 rounded-full"
                   >
                     {isAIThinking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                     Refine with AI
                   </button>
                 )}
              </div>
              <textarea
                placeholder="Pour your heart out here..."
                className="w-full px-6 py-5 bg-gray-50 border-transparent border-2 focus:bg-white focus:border-indigo-500 focus:ring-0 rounded-3xl outline-none transition-all min-h-[400px] text-gray-700 resize-none leading-relaxed text-lg placeholder:text-gray-300"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {visibility === Visibility.PUBLIC && (
              <div className="flex gap-4 p-5 bg-indigo-50 rounded-3xl border border-indigo-100 animate-fade-in">
                <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <p className="text-sm text-indigo-800 leading-relaxed font-medium">
                  <strong>Heads up!</strong> This entry will be visible to everyone on the public feed. Others will be able to leave reflections and comments on your experience.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:flex-1 bg-indigo-600 text-white font-black py-5 rounded-3xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Documenting...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    {id ? 'Save Changes' : 'Document My Journey'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-10 py-5 bg-gray-100 text-gray-600 font-bold rounded-3xl hover:bg-gray-200 transition-all text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEditEntry;
