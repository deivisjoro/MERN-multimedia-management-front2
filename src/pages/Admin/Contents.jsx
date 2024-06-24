import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faSave, faFile } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const Content = () => {
  const [contents, setContents] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    contentSource: 'file',
    file: null,
    url: '',
    contentType: '',
    category: '',
    topic: '',
  });
  const [currentContent, setCurrentContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState(null);
  const { token, user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentResponse = await axios.get('/admin/contents', {
          headers: {
            Authorization: token
          }
        });
        setContents(contentResponse.data.data);

        const contentTypeResponse = await axios.get('/admin/content-types', {
          headers: {
            Authorization: token
          }
        });
        setContentTypes(contentTypeResponse.data.data);

        const categoryResponse = await axios.get('/admin/categories', {
          headers: {
            Authorization: token
          }
        });
        setCategories(categoryResponse.data.data);

        const topicResponse = await axios.get('/admin/topics', {
          headers: {
            Authorization: token
          }
        });
        setTopics(topicResponse.data.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, [token]);

  const showFlashMessage = (message, type) => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setNewContent({ ...newContent, [name]: files[0] });
    } else {
      setNewContent({ ...newContent, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newContent.title) newErrors.title = 'Title is required';
    if (!newContent.description) newErrors.description = 'Description is required';
    if (newContent.contentSource === 'file' && !newContent.file) newErrors.file = 'File is required';
    if (newContent.contentSource === 'url' && !newContent.url) newErrors.url = 'URL is required';
    if (!newContent.contentType) newErrors.contentType = 'Content Type is required';
    if (!newContent.category) newErrors.category = 'Category is required';
    if (!newContent.topic) newErrors.topic = 'Topic is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', newContent.title);
    formData.append('description', newContent.description);
    formData.append('contentSource', newContent.contentSource);
    if (newContent.contentSource === 'file') {
      formData.append('file', newContent.file);
    } else {
      formData.append('url', newContent.url);
    }
    formData.append('contentType', newContent.contentType);
    formData.append('category', newContent.category);
    formData.append('topic', newContent.topic);
    formData.append('creator', user.id);

    try {
      const response = await axios.post('/admin/contents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        }
      });
      setContents([...contents, response.data.data]);
      setNewContent({
        title: '',
        description: '',
        contentSource: 'file',
        file: null,
        url: '',
        contentType: '',
        category: '',
        topic: '',
      });
      setShowModal(false);
      showFlashMessage('Content added successfully', 'success');
    } catch (error) {
      console.error('Error adding content', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      await axios.delete(`/admin/contents/${id}`, {
        headers: {
          Authorization: token
        }
      });
      setContents(contents.filter(content => content._id !== id));
      showFlashMessage('Content deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting content', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEdit = content => {
    setCurrentContent(content);
    setShowEditModal(true);
    setShowViewModal(false); // Close the view modal when opening the edit modal
  };

  const handleUpdate = async e => {
    e.preventDefault();

    const updatedContent = {
      title: currentContent.title,
      description: currentContent.description,
      contentSource: currentContent.contentSource,
      url: currentContent.contentSource === 'url' ? currentContent.url : '',
      contentType: currentContent.contentType,
      category: currentContent.category,
      topic: currentContent.topic
    };

    try {
      const response = await axios.put(`/admin/contents/${currentContent._id}`, updatedContent, {
        headers: {
          Authorization: token
        }
      });
      setContents(contents.map(content => content._id === currentContent._id ? response.data.data : content));
      setShowEditModal(false);
      setCurrentContent(null);
      showFlashMessage('Content updated successfully', 'success');
    } catch (error) {
      console.error('Error updating content', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setCurrentContent({ ...currentContent, [name]: value });
  };

  const handleView = content => {
    setCurrentContent(content);
    setShowViewModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contents</h1>

      {flashMessage && (
        <div className={`p-4 mb-4 text-sm ${flashMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
          {flashMessage.message}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Content
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Add New Content</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newContent.title}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={newContent.description}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>
              <div>
                <label className="block mb-1">Content Source</label>
                <select
                  name="contentSource"
                  value={newContent.contentSource}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="file">File</option>
                  <option value="url">URL</option>
                </select>
              </div>
              {newContent.contentSource === 'file' ? (
                <div>
                  <label className="block mb-1">File</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    className="input mb-1 border rounded p-1 w-full"
                  />
                  {errors.file && <p className="text-red-500 text-xs">{errors.file}</p>}
                </div>
              ) : (
                <div>
                  <label className="block mb-1">URL</label>
                  <input
                    type="text"
                    name="url"
                    value={newContent.url}
                    onChange={handleChange}
                    className="input mb-1 border rounded p-1 w-full"
                  />
                  {errors.url && <p className="text-red-500 text-xs">{errors.url}</p>}
                </div>
              )}
              <div>
                <label className="block mb-1">Content Type</label>
                <select
                  name="contentType"
                  value={newContent.contentType}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="">Select Content Type</option>
                  {contentTypes.map(contentType => (
                    <option key={contentType._id} value={contentType._id}>{contentType.name}</option>
                  ))}
                </select>
                {errors.contentType && <p className="text-red-500 text-xs">{errors.contentType}</p>}
              </div>
              <div>
                <label className="block mb-1">Category</label>
                <select
                  name="category"
                  value={newContent.category}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
              </div>
              <div>
                <label className="block mb-1">Topic</label>
                <select
                  name="topic"
                  value={newContent.topic}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="">Select Topic</option>
                  {topics.map(topic => (
                    <option key={topic._id} value={topic._id}>{topic.name}</option>
                  ))}
                </select>
                {errors.topic && <p className="text-red-500 text-xs">{errors.topic}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary flex items-center text-orange-600 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" /> Cancel
                </button>
                <button type="submit" className="btn btn-primary flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded">
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Add Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && currentContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Edit Content</h2>
            <form onSubmit={handleUpdate} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={currentContent.title}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={currentContent.description}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Content Source</label>
                <select
                  name="contentSource"
                  value={currentContent.contentSource}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="file">File</option>
                  <option value="url">URL</option>
                </select>
              </div>
              {currentContent.contentSource === 'url' && (
                <div>
                  <label className="block mb-1">URL</label>
                  <input
                    type="text"
                    name="url"
                    value={currentContent.url}
                    onChange={handleEditChange}
                    className="input mb-1 border rounded p-1 w-full"
                  />
                </div>
              )}
              <div>
                <label className="block mb-1">Content Type</label>
                <select
                  name="contentType"
                  value={currentContent.contentType}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="">Select Content Type</option>
                  {contentTypes.map(contentType => (
                    <option key={contentType._id} value={contentType._id}>{contentType.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Category</label>
                <select
                  name="category"
                  value={currentContent.category}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Topic</label>
                <select
                  name="topic"
                  value={currentContent.topic}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="">Select Topic</option>
                  {topics.map(topic => (
                    <option key={topic._id} value={topic._id}>{topic.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary flex items-center text-orange-600 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" /> Cancel
                </button>
                <button type="submit" className="btn btn-primary flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded">
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && currentContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">View Content</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 font-bold">Title</label>
                <p className="text-blue-600">{currentContent.title}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Description</label>
                <p className="text-blue-600">{currentContent.description}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Content Source</label>
                <p className="text-blue-600">{currentContent.contentSource}</p>
              </div>
              {currentContent.contentSource === 'url' && (
                <div>
                  <label className="block mb-1 font-bold">URL</label>
                  <p className="text-blue-600">{currentContent.url}</p>
                </div>
              )}
              <div>
                <label className="block mb-1 font-bold">Content Type</label>
                <p className="text-blue-600">{contentTypes.find(ct => ct._id === currentContent.contentType)?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Category</label>
                <p className="text-blue-600">{categories.find(cat => cat._id === currentContent.category)?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Topic</label>
                <p className="text-blue-600">{topics.find(topic => topic._id === currentContent.topic)?.name || 'N/A'}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleEdit(currentContent)}
                  className="btn btn-primary flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="btn btn-secondary flex items-center text-orange-600 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">File Name</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Content Source</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contents.map(content => (
            <tr key={content._id} className="hover:bg-gray-100 odd:bg-white even:bg-gray-50">
              <td className="border px-4 py-2">
                <FontAwesomeIcon icon={faFile} className="mr-1" /> {content.fileName || 'N/A'}
              </td>
              <td className="border px-4 py-2">
                <a href="#" onClick={() => handleView(content)} className="text-blue-500 hover:underline">{content.title}</a>
              </td>
              <td className="border px-4 py-2">{content.description}</td>
              <td className="border px-4 py-2">{content.contentSource}</td>
              <td className="border px-4 py-2">
                <button className="text-yellow-500 mr-2" onClick={() => handleEdit(content)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-500" onClick={() => handleDelete(content._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        Total Contents: {contents.length}
      </div>
    </div>
  );
};

export default Content;
