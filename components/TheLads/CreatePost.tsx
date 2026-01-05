import React, { useState } from 'react';
import { Image, Video, X, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPost } from '../../services/postService';
import { uploadMultipleMedia } from '../../services/storageService';

export const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Add to selected files
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!content.trim() && selectedFiles.length === 0) || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Upload media files if any
      let mediaItems = [];
      if (selectedFiles.length > 0) {
        mediaItems = await uploadMultipleMedia(selectedFiles, user.uid);
      }

      // Create the post
      await createPost(
        user.uid,
        user.displayName || 'Anonymous',
        user.email || '',
        content.trim(),
        mediaItems
      );

      // Reset form
      setContent('');
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
        <p className="text-gray-600">Please sign in to create posts</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        {/* User Avatar and Input */}
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {user.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {/* File Previews */}
        {previewUrls.length > 0 && (
          <div className={`grid gap-2 mb-4 ${previewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {previewUrls.map((url, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden bg-gray-100">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                {selectedFiles[index].type.startsWith('image/') ? (
                  <img
                    src={url}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <video
                    src={url}
                    className="w-full h-48 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <label className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
              <Image className="w-5 h-5" />
              <span className="text-sm font-medium">Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
            <label className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
              <Video className="w-5 h-5" />
              <span className="text-sm font-medium">Video</span>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={(!content.trim() && selectedFiles.length === 0) || isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
