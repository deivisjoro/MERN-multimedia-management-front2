import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faSmile, faStar, faEye, faFile, faLink, faUser, faTags, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

const ContentDetail = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const { token, user } = useSelector(state => state.auth);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [reactionType, setReactionType] = useState('');

  const fetchContent = async () => {
    try {
      const response = await axios.get(`/contents/${id}`, {
        headers: {
          Authorization: token
        }
      });
      setContent(response.data.data);
    } catch (error) {
      console.error('Error fetching content', error);
    }
  };

  useEffect(() => {    
    fetchContent();
  }, [id, token]);

  const handleCommentSubmit = async () => {
    try {
      await axios.post('/contents/comment', { contentId: id, userId: user._id, text: newComment }, {
        headers: {
          Authorization: token
        }
      });
      setShowCommentModal(false);
      setNewComment('');
      fetchContent();
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleReactionSubmit = async () => {
    try {
      await axios.post('/contents/reaction', { contentId: id, userId: user.id, type: reactionType }, {
        headers: {
          Authorization: token
        }
      });
      setShowReactionModal(false);
      setReactionType('');
      fetchContent();
    } catch (error) {
      console.error('Error adding reaction', error);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      await axios.post('/contents/rating', { contentId: id, userId: user.id, value: rating }, {
        headers: {
          Authorization: token
        }
      });
      setShowRatingModal(false);
      setRating(0);
      fetchContent();
    } catch (error) {
      console.error('Error adding rating', error);
    }
  };

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
      <div className="flex">
        <div className="w-2/3 p-4 shadow-md rounded-lg">
          {content.contentSource === 'url' && content.url.includes('youtube.com') ? (
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${content.url.split('v=')[1]}`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex justify-center items-center h-full">
              <a href={content.contentSource === 'url' ? content.url : `http://localhost:5000/${content.filePath}`} className="btn btn-blue flex items-center justify-center mt-2 mx-2 py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 rounded" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faEye} className="mr-1" /> View Content
              </a>
            </div>
          )}
        </div>
        <div className="w-1/3 p-4 h-full shadow-md rounded-lg ">
            <div className="bg-white p-4 h-full">
                <p className="text-sm text-gray-600 my-4"><FontAwesomeIcon icon={faUser} className="text-red-500 mr-1" /> <span className="font-bold text-red-500">Author:</span> {content.creator.username}</p>
                <p className="text-sm text-gray-600 my-4"><FontAwesomeIcon icon={faFolderOpen} className="text-green-500 mr-1" /> <span className="font-bold text-green-500">Category:</span> {content.category.name}</p>
                <p className="text-sm text-gray-600 my-4"><FontAwesomeIcon icon={faTags} className="text-purple-500 mr-1" /> <span className="font-bold text-purple-500">Topic:</span> {content.topic.name}</p>
                <p className="text-sm text-gray-600 my-4"><FontAwesomeIcon icon={faSmile} className="text-orange-500 mr-1" /> <span className="font-bold text-orange-500">Content Type:</span> {content.contentType.name}</p>
                <p className="text-sm text-gray-600 my-4"><FontAwesomeIcon icon={faComment} className="mr-1" /> Comments: {content.commentsCount || 0}</p>
                <p className="text-sm text-gray-600 my-4"><FontAwesomeIcon icon={faSmile} className="mr-1" /> Reactions: {content.reactionsCount || 0}</p>
                <p className="text-sm text-gray-600 my-4"><FontAwesomeIcon icon={faStar} className="mr-1" /> Ratings: {content.ratingsCount || 0} ({content.averageRating || 0})</p>
            </div>
            </div>

      </div>

      <div className="mt-4 flex space-x-4">
        <button onClick={() => setShowCommentModal(true)} className="btn btn-blue flex items-center justify-center py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 rounded">
          <FontAwesomeIcon icon={faComment} className="mr-1" /> Add Comment
        </button>
        <button onClick={() => setShowReactionModal(true)} className="btn btn-blue flex items-center justify-center py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 rounded">
          <FontAwesomeIcon icon={faSmile} className="mr-1" /> Add Reaction
        </button>
        <button onClick={() => setShowRatingModal(true)} className="btn btn-blue flex items-center justify-center py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 rounded">
          <FontAwesomeIcon icon={faStar} className="mr-1" /> Add Rating
        </button>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl mb-4">Add Comment</h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows="4"
              placeholder="Write your comment..."
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowCommentModal(false)} className="btn btn-secondary text-gray-600 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded">
                Cancel
              </button>
              <button onClick={handleCommentSubmit} className="btn btn-blue flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reaction Modal */}
      {showReactionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl mb-4">Add Reaction</h2>
            <select
              value={reactionType}
              onChange={(e) => setReactionType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="">Select a reaction type</option>
              <option value="like">Like</option>
              <option value="love">Love</option>
              <option value="funny">Funny</option>
              <option value="angry">Angry</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowReactionModal(false)} className="btn btn-secondary text-gray-600 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded">
                Cancel
              </button>
              <button onClick={handleReactionSubmit} className="btn btn-blue flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl mb-4">Add Rating</h2>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowRatingModal(false)} className="btn btn-secondary text-gray-600 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded">
                Cancel
              </button>
              <button onClick={handleRatingSubmit} className="btn btn-blue flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        {content.comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          content.comments.map(comment => (
            <div key={comment._id} className="bg-gray-100 p-4 mb-2 rounded-md">
              <p className="text-sm text-gray-600"><FontAwesomeIcon icon={faUser} className="mr-1" /> {comment.user.username}</p>
              <p>{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentDetail;
