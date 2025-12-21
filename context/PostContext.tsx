
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment, Visibility, Mood } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface PostContextType {
  posts: Post[];
  comments: Comment[];
  loading: boolean;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => Promise<boolean>;
  updatePost: (id: string, post: Partial<Post>) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const mapPost = (p: any): Post => ({
    id: p.id,
    authorId: p.author_id,
    authorName: p.author_name,
    title: p.title,
    content: p.content,
    mood: p.mood as Mood,
    visibility: p.visibility as Visibility,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  });

  const mapComment = (c: any): Comment => ({
    id: c.id,
    postId: c.post_id,
    authorId: c.author_id,
    authorName: c.author_name,
    content: c.content,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  });

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data.map(mapPost));
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data.map(mapComment));
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchPosts(), fetchComments()]);
  };

  useEffect(() => {
    const initData = async () => {
      if (!user) {
        setPosts([]);
        setComments([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    initData();

    const entriesChannel = supabase
      .channel('entries-realtime')
      .on('postgres_changes', { event: '*', table: 'entries' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPosts((prev) => {
            if (prev.find(p => p.id === payload.new.id)) return prev;
            return [mapPost(payload.new), ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          setPosts((prev) => prev.map((p) => (p.id === payload.new.id ? mapPost(payload.new) : p)));
        } else if (payload.eventType === 'DELETE') {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      })
      .subscribe();

    const commentsChannel = supabase
      .channel('comments-realtime')
      .on('postgres_changes', { event: '*', table: 'comments' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setComments((prev) => {
            if (prev.find(c => c.id === payload.new.id)) return prev;
            return [...prev, mapComment(payload.new)];
          });
        } else if (payload.eventType === 'UPDATE') {
          setComments((prev) => prev.map((c) => (c.id === payload.new.id ? mapComment(payload.new) : c)));
        } else if (payload.eventType === 'DELETE') {
          setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(entriesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, [user]);

  const addPost = async (postData: any) => {
    if (!user) return false;
    const { data, error } = await supabase.from('entries').insert([
      {
        author_id: user.id,
        author_name: user.username,
        title: postData.title,
        content: postData.content,
        mood: postData.mood,
        visibility: postData.visibility,
      }
    ]).select();

    if (error) {
      console.error("Supabase Save Error:", error.message);
      return false;
    }
    
    if (data && data[0]) {
      const newPost = mapPost(data[0]);
      setPosts(prev => [newPost, ...prev]);
    }
    return true;
  };

  const updatePost = async (id: string, postData: Partial<Post>) => {
    const { data, error } = await supabase
      .from('entries')
      .update({
        title: postData.title,
        content: postData.content,
        mood: postData.mood,
        visibility: postData.visibility,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Supabase Update Error:", error.message);
      return false;
    }

    if (data && data[0]) {
      const updatedPost = mapPost(data[0]);
      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p));
    }
    return true;
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) {
      console.error("Supabase Delete Error:", error.message);
      return false;
    }
    setPosts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;
    const { data, error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        author_id: user.id,
        author_name: user.username,
        content: content,
      }
    ]).select();

    if (!error && data && data[0]) {
      setComments(prev => [...prev, mapComment(data[0])]);
    }
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  return (
    <PostContext.Provider value={{ posts, comments, loading, addPost, updatePost, deletePost, addComment, deleteComment, refreshData }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within PostProvider');
  return context;
};
