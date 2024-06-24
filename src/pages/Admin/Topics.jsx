import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faSave, faList } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [newTopic, setNewTopic] = useState({ name: '', allowedContentTypes: [] });
  const [currentTopic, setCurrentTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState(null);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('/admin/topics', {
          headers: {
            Authorization: token
          }
        });
        setTopics(response.data.data);
      } catch (error) {
        console.error('Error fetching topics', error);
      }
    };

    const fetchContentTypes = async () => {
      try {
        const response = await axios.get('/admin/content-types', {
          headers: {
            Authorization: token
          }
        });
        setContentTypes(response.data.data);
      } catch (error) {
        console.error('Error fetching content types', error);
      }
    };

    fetchTopics();
    fetchContentTypes();
  }, [token]);

  const showFlashMessage = (message, type) => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  };

  const handleChange = e => {
    const { name, value, options } = e.target;
    if (name === 'allowedContentTypes') {
      const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
      setNewTopic({ ...newTopic, [name]: selectedOptions });
    } else {
      setNewTopic({ ...newTopic, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newTopic.name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post('/admin/topics', newTopic, {
        headers: {
          Authorization: token
        }
      });
      setTopics([...topics, response.data.data]);
      setNewTopic({ name: '', allowedContentTypes: [] });
      setShowModal(false);
      showFlashMessage('Topic added successfully', 'success');
    } catch (error) {
      console.error('Error adding topic', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;
    try {
      await axios.delete(`/admin/topics/${id}`, {
        headers: {
          Authorization: token
        }
      });
      setTopics(topics.filter(topic => topic._id !== id));
      showFlashMessage('Topic deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting topic', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEdit = topic => {
    setCurrentTopic(topic);
    setShowEditModal(true);
    setShowViewModal(false); // Close the view modal when opening the edit modal
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const updatedTopic = {
      name: currentTopic.name,
      allowedContentTypes: currentTopic.allowedContentTypes
    };

    try {
      const response = await axios.put(`/admin/topics/${currentTopic._id}`, updatedTopic, {
        headers: {
          Authorization: token
        }
      });
      setTopics(topics.map(topic => topic._id === currentTopic._id ? response.data.data : topic));
      setShowEditModal(false);
      setCurrentTopic(null);
      showFlashMessage('Topic updated successfully', 'success');
    } catch (error) {
      console.error('Error updating topic', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEditChange = e => {
    const { name, value, options } = e.target;
    if (name === 'allowedContentTypes') {
      const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
      setCurrentTopic({ ...currentTopic, [name]: selectedOptions });
    } else {
      setCurrentTopic({ ...currentTopic, [name]: value });
    }
  };

  const handleView = topic => {
    setCurrentTopic(topic);
    setShowViewModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Topics</h1>

      {flashMessage && (
        <div className={`p-4 mb-4 text-sm ${flashMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
          {flashMessage.message}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Topic
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Add New Topic</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newTopic.name}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div>
                <label className="block mb-1">Allowed Content Types</label>
                <select
                  name="allowedContentTypes"
                  multiple
                  value={newTopic.allowedContentTypes}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  {contentTypes.map(contentType => (
                    <option key={contentType._id} value={contentType._id}>{contentType.name}</option>
                  ))}
                </select>
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
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && currentTopic && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Edit Topic</h2>
            <form onSubmit={handleUpdate} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentTopic.name}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Allowed Content Types</label>
                <select
                  name="allowedContentTypes"
                  multiple
                  value={currentTopic.allowedContentTypes}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  {contentTypes.map(contentType => (
                    <option key={contentType._id} value={contentType._id}>{contentType.name}</option>
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

      {showViewModal && currentTopic && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">View Topic</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 font-bold">Name</label>
                <p className="text-blue-600">{currentTopic.name}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Allowed Content Types</label>
                <ul className="text-blue-600">
                  {currentTopic.allowedContentTypes.map(contentTypeId => {
                    const contentType = contentTypes.find(ct => ct._id === contentTypeId);
                    return <li key={contentTypeId}>{contentType ? contentType.name : 'Unknown'}</li>;
                  })}
                </ul>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleEdit(currentTopic)}
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
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Allowed Content Types</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((topic) => (
            <tr key={topic._id} className="hover:bg-gray-100 odd:bg-white even:bg-gray-50">
              <td className="border px-4 py-2">
                <a href="#" onClick={() => handleView(topic)} className="text-blue-500 hover:underline">{topic.name}</a>
              </td>
              <td className="border px-4 py-2">
                <ul>
                  {topic.allowedContentTypes.map(contentTypeId => {
                    const contentType = contentTypes.find(ct => ct._id === contentTypeId);
                    return <li key={contentTypeId}>{contentType ? contentType.name : 'Unknown'}</li>;
                  })}
                </ul>
              </td>
              <td className="border px-4 py-2">
                <button className="text-yellow-500 mr-2" onClick={() => handleEdit(topic)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-500" onClick={() => handleDelete(topic._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        Total Topics: {topics.length}
      </div>
    </div>
  );
};

export default Topics;
