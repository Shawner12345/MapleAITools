export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  thumbnailUrl?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  media: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface CreatePostData {
  content: string;
  media: File[];
}
