
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment, Visibility, Mood } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface PostContextType {
  posts: Post[];
  comments: Comment[];
  loading: boolean;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'likesCount' | 'hasLiked'>) => Promise<boolean>;
  updatePost: (id: string, post: Partial<Post>) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const mapPost = (p: any, likes: string[] = userLikes): Post => ({
    id: p.id,
    authorId: p.author_id || '',
    authorName: p.author_name || 'Anonymous',
    title: p.title || 'Untitled Entry',
    content: p.content || '',
    mood: (p.mood as Mood) || Mood.REFLECTIVE,
    visibility: (p.visibility as Visibility) || Visibility.PRIVATE,
    createdAt: p.created_at || new Date().toISOString(),
    updatedAt: p.updated_at || new Date().toISOString(),
    likesCount: p.likes_count || 0,
    hasLiked: likes.includes(p.id)
  });

  const mapComment = (c: any): Comment => ({
    id: c.id,
    postId: c.post_id || '',
    authorId: c.author_id || '',
    authorName: c.author_name || 'Anonymous',
    content: c.content || '',
    createdAt: c.created_at || new Date().toISOString(),
    updatedAt: c.updated_at || new Date().toISOString(),
  });

  const fetchLikes = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', userId);
      
      if (!error && data) {
        const likedIds = data.map(l => l.post_id);
        setUserLikes(likedIds);
        return likedIds;
      }
    } catch (e) {
      console.warn("Likes table might not exist yet.");
    }
    return [];
  };

  const fetchPosts = async (likedIds: string[] = userLikes) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data.map(p => mapPost(p, likedIds)));
      }
    } catch (err) {
      console.error("Fetch Posts Error:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setComments(data.map(mapComment));
      }
    } catch (err) {
      console.error("Fetch Comments Error:", err);
    }
  };

  const refreshData = async () => {
    if (!user) return;
    const likedIds = await fetchLikes(user.id);
    await Promise.all([fetchPosts(likedIds), fetchComments()]);
  };

  useEffect(() => {
    if (!user) {
      setPosts([]);
      setComments([]);
      setUserLikes([]);
      setLoading(false);
      return;
    }

    const initData = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    initData();
  }, [user?.id, user?.emailConfirmed]);

  const toggleLike = async (postId: string) => {
    if (!user || !user.emailConfirmed) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isCurrentlyLiked = post.hasLiked;
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hasLiked: !isCurrentlyLiked,
          likesCount: isCurrentlyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1
        };
      }
      return p;
    }));

    try {
      if (isCurrentlyLiked) {
        setUserLikes(prev => prev.filter(id => id !== postId));
        const { error } = await supabase.from('likes').delete().match({ user_id: user.id, post_id: postId });
        if (!error) {
          await supabase.from('entries').update({ likes_count: Math.max(0, post.likesCount - 1) }).eq('id', postId);
        } else {
          throw error;
        }
      } else {
        setUserLikes(prev => [...prev, postId]);
        const { error } = await supabase.from('likes').insert([{ user_id: user.id, post_id: postId }]);
        if (!error) {
          await supabase.from('entries').update({ likes_count: post.likesCount + 1 }).eq('id', postId);
        } else {
          throw error;
        }
      }
    } catch (err) {
      console.error("Like operation failed:", err);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, hasLiked: isCurrentlyLiked, likesCount: post.likesCount };
        }
        return p;
      }));
    }
  };

  const addPost = async (postData: any) => {
    if (!user) return false;
    try {
      const { data, error } = await supabase.from('entries').insert([{
          author_id: user.id,
          author_name: user.username,
          title: postData.title,
          content: postData.content,
          mood: postData.mood,
          visibility: postData.visibility || Visibility.PRIVATE,
          likes_count: 0
        }]).select();

      if (error) throw error;
      if (data && data[0]) {
        setPosts(prev => [mapPost(data[0]), ...prev]);
        return true;
      }
    } catch (err) {
      console.error("Add Post Error:", err);
    }
    return false;
  };

  const updatePost = async (id: string, postData: Partial<Post>) => {
    try {
      const { data, error } = await supabase.from('entries').update({
          title: postData.title,
          content: postData.content,
          mood: postData.mood,
          visibility: postData.visibility,
          updated_at: new Date().toISOString(),
        }).eq('id', id).select();

      if (error) throw error;
      if (data && data[0]) {
        setPosts(prev => prev.map(p => p.id === id ? mapPost(data[0]) : p));
        return true;
      }
    } catch (err) {
      console.error("Update Post Error:", err);
    }
    return false;
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase.from('entries').delete().eq('id', id);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      console.error("Delete Post Error:", err);
    }
    return false;
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('comments').insert([{
          post_id: postId,
          author_id: user.id,
          author_name: user.username,
          content: content,
        }]).select();

      if (!error && data && data[0]) {
        setComments(prev => [...prev, mapComment(data[0])]);
      }
    } catch (err) {
      console.error("Add Comment Error:", err);
    }
  };

  const deleteComment = async (id: string) => {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (!error) setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Delete Comment Error:", err);
    }
  };

  return (
    <PostContext.Provider value={{ posts, comments, loading, addPost, updatePost, deletePost, addComment, deleteComment, toggleLike, refreshData }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within PostProvider');
  return context;
};
