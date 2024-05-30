import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons'; 

function PostCard({ urlSlug, $id, title, featuredImage, author, likes, onUpdate, onDelete }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check if the post is liked by the user when component mounts
    const checkLikedStatus = async () => {
      const userId = await authService.getUserId();
      const likeExists = await appwriteService.getLikesByUserAndPost(userId, $id);
      setLiked(likeExists);
    };

    checkLikedStatus();
  }, [$id]); // Re-run effect when post id changes

  const handleLikeClick = async () => {
    try {
      const userId = await authService.getUserId();
      if (!liked) {
        // If not liked, create a like
        await appwriteService.createLike($id, urlSlug);
      } else {
        // If liked, delete the like
        await appwriteService.deleteLike(`${userId}_${$id}`);
      }
      // Toggle liked state
      setLiked(!liked);
      // Update likes count in parent component
      onUpdate({ $id, likes: liked ? likes - 1 : likes + 1 });
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  return (
    <>
      <Link to={`/post/${urlSlug}`}>
        <div className='flex flex-col items-center text-center card-hover rounded-xl p-4 h-auto shadow-lg transition-shadow duration-300 hover:shadow-xl'>
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(featuredImage)}
              alt={title}
              className="rounded-xl w-full h-auto object-cover"
            />
          </div>
          <h2 className="text-xl font-bold">{title}</h2>

          <div className="flex items-center gap-10">
            <p className="text-gray-500 justify-left">
              {author ? author : 'Anonymous'}
            </p>
            <div className="flex items-center text-sm" onClick={handleLikeClick}>
              <FontAwesomeIcon icon={faHeart} className="mr-1" />
              <span className="text-sm">{likes}</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default PostCard
