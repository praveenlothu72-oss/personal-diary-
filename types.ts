
export enum Mood {
  HAPPY = 'Happy',
  SAD = 'Sad',
  STRESSED = 'Stressed',
  EXCITED = 'Excited',
  CALM = 'Calm',
  REFLECTIVE = 'Reflective',
  ANXIOUS = 'Anxious'
}

export enum Visibility {
  PRIVATE = 'Private',
  PUBLIC = 'Public'
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  emailConfirmed: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  mood?: Mood;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  hasLiked: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
