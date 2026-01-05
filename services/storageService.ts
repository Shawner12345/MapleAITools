import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MediaItem } from '../types/post';

export const uploadMedia = async (
  file: File,
  userId: string
): Promise<MediaItem> => {
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `posts/${fileName}`);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the download URL
    const url = await getDownloadURL(storageRef);

    // Determine media type
    const mediaType: 'image' | 'video' = file.type.startsWith('image/')
      ? 'image'
      : 'video';

    return {
      url,
      type: mediaType,
    };
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

export const uploadMultipleMedia = async (
  files: File[],
  userId: string
): Promise<MediaItem[]> => {
  try {
    const uploadPromises = files.map((file) => uploadMedia(file, userId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple media:', error);
    throw error;
  }
};
