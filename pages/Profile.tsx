
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { User, Mail, Calendar, Settings, Edit, Camera, Link as LinkIcon } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { posts } = usePosts();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');

  const myPosts = posts.filter(p => p.authorId === user?.id);

  const handleUpdate = () => {
    updateUser({ username, bio });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-indigo-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl mx-auto">
               <div className="w-full h-full rounded-[1.25rem] bg-indigo-50 border-4 border-white flex items-center justify-center text-indigo-700 text-4xl font-black">
                  {user?.username?.[0]?.toUpperCase() || '?'}
               </div>
               <button className="absolute bottom-2 right-1/2 translate-x-16 bg-white p-2 rounded-xl shadow-lg border border-gray-100 text-gray-500 hover:text-indigo-600 transition-colors">
                  <Camera className="w-4 h-4" />
               </button>
            </div>
          </div>

          <div className="text-center mb-10">
            {isEditing ? (
              <div className="space-y-4 max-w-sm mx-auto">
                 <input 
                  type="text"
                  className="w-full px-4 py-2 border rounded-xl text-center font-bold text-xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                 />
                 <textarea 
                  className="w-full px-4 py-2 border rounded-xl text-center text-gray-500 resize-none"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                 />
                 <div className="flex gap-2 justify-center">
                    <button onClick={handleUpdate} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">Save</button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold">Cancel</button>
                 </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-black text-gray-900 mb-2">{user?.username}</h1>
                <p className="text-gray-500 mb-4">{user?.bio || "No bio yet. Tell the world about your journey."}</p>
                <div className="flex justify-center gap-6 text-sm text-gray-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
             <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-indigo-600">{myPosts.length}</p>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Entries</p>
             </div>
             <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-indigo-600">{myPosts.filter(p => p.visibility === 'Public').length}</p>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Public</p>
             </div>
             <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-indigo-600">{myPosts.filter(p => p.visibility === 'Private').length}</p>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Private</p>
             </div>
          </div>

          {!isEditing && (
            <div className="space-y-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 border border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 border border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all">
                <Settings className="w-5 h-5" />
                Account Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
