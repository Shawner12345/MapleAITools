import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { Post, MediaItem, Comment } from '../types/post';

const postsCollection = collection(db, 'ladsPosts');

export const createPost = async (
  userId: string,
  userName: string,
  userEmail: string,
  content: string,
  media: MediaItem[]
): Promise<string> => {
  try {
    const postData = {
      userId,
      userName,
      userEmail,
      content,
      media,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      likes: [],
      comments: [],
    };

    const docRef = await addDoc(postsCollection, postData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Post;
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

export const subscribeToPost = (
  callback: (posts: Post[]) => void
): (() => void) => {
  const q = query(postsCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const posts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Post;
      });
      callback(posts);
    },
    (error) => {
      console.error('Error subscribing to posts:', error);
    }
  );
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'ladsPosts', postId));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const likePost = async (postId: string, userId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'ladsPosts', postId);
    await updateDoc(postRef, {
      likes: arrayUnion(userId),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikePost = async (postId: string, userId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'ladsPosts', postId);
    await updateDoc(postRef, {
      likes: arrayRemove(userId),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const addComment = async (
  postId: string,
  userId: string,
  userName: string,
  content: string
): Promise<void> => {
  try {
    const postRef = doc(db, 'ladsPosts', postId);
    const comment: Comment = {
      id: Date.now().toString(),
      userId,
      userName,
      content,
      createdAt: new Date(),
    };

    await updateDoc(postRef, {
      comments: arrayUnion(comment),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};
