import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faLink, faUser, faTags, faFolderOpen, faStar, faComment, faSmile, faEye } from '@fortawesome/free-solid-svg-icons';

const ContentsByCategory = () => {
  const { categoryId } = useParams();
  const [contents, setContents] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(`/categories/${categoryId}`, {
          headers: {
            Authorization: token
          }
        });
        setCategoryName(response.data.data.name);
      } catch (error) {
        console.error('Error fetching category name', error);
      }
    };
    fetchCategoryName();
  }, [categoryId, token]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get(`/contents`, {
          params: { category: categoryId },
          headers: {
            Authorization: token
          }
        });
        setContents(response.data.data);
      } catch (error) {
        console.error('Error fetching contents', error);
      }
    };
    fetchContents();
  }, [categoryId, token]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category: {categoryName || 'Loading...'}</h1>
      {contents.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">No contents available</p>
          <p>There are no contents for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map(content => (
            <div key={content._id} className="bg-white shadow-md rounded-lg p-4 border-t-4 border-blue-500">
              <div className="flex items-center mb-2">
                {content.contentSource === 'url' ? (
                  <FontAwesomeIcon icon={faLink} className="text-blue-500 mr-2" />
                ) : (
                  <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 mr-2" />
                )}
                <h2 className="text-xl font-semibold mb-2">
                  <Link to={`/content/${content._id}`} className="hover:underline">{content.title}</Link>
                </h2>

              </div>
              <p className="text-gray-700 mb-2">{content.description}</p>
              {content.contentSource === 'url' && (
                <a href={content.url} className="btn btn-blue flex items-center justify-center mt-2 mx-2 py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 rounded" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faEye} className="mr-1" /> View Content
                </a>
              )}
              {content.contentSource === 'file' && (
                <a href={`http://localhost:5000/${content.filePath}`} className="btn btn-blue flex items-center justify-center mt-2 mx-2 py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 rounded" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faEye} className="mr-1" /> View Content
                </a>
              )}


              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  <FontAwesomeIcon icon={faUser} className="text-red-500 mr-1" />
                  <span className="font-bold text-red-500">Autor:</span> {content.creator?.username || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  <FontAwesomeIcon icon={faFolderOpen} className="text-green-500 mr-1" />
                  <span className="font-bold text-green-500">Category:</span> {content.category?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  <FontAwesomeIcon icon={faTags} className="text-purple-500 mr-1" />
                  <span className="font-bold text-purple-500">Topic:</span> {content.topic?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  <FontAwesomeIcon icon={faFileAlt} className="text-orange-500 mr-1" />
                  <span className="font-bold text-orange-500">Content Type:</span> {content.contentType?.name || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-100 p-2 mt-4 rounded-md flex justify-around">
                <p className="text-sm text-gray-600 flex items-center">
                  <FontAwesomeIcon icon={faComment} className="mr-1" /> {content.commentsCount || 0}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FontAwesomeIcon icon={faSmile} className="mr-1" /> {content.reactionsCount || 0}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FontAwesomeIcon icon={faStar} className="mr-1" /> {content.ratingsCount || 0} ({content.averageRating || 0})
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentsByCategory;
