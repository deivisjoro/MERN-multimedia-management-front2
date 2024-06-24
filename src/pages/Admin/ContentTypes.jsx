import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faSave, faFile } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const ContentTypes = () => {
  const [contentTypes, setContentTypes] = useState([]);
  const [newContentType, setNewContentType] = useState({ name: '', icon: '' });
  const [currentContentType, setCurrentContentType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState(null);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
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
    fetchContentTypes();
  }, [token]);

  const showFlashMessage = (message, type) => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewContentType({ ...newContentType, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newContentType.name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post('/admin/content-types', newContentType, {
        headers: {
          Authorization: token
        }
      });
      setContentTypes([...contentTypes, response.data.data]);
      setNewContentType({ name: '', icon: '' });
      setShowModal(false);
      showFlashMessage('Content Type added successfully', 'success');
    } catch (error) {
      console.error('Error adding content type', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this content type?')) return;
    try {
      await axios.delete(`/admin/content-types/${id}`, {
        headers: {
          Authorization: token
        }
      });
      setContentTypes(contentTypes.filter(contentType => contentType._id !== id));
      showFlashMessage('Content Type deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting content type', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEdit = contentType => {
    setCurrentContentType(contentType);
    setShowEditModal(true);
    setShowViewModal(false); // Close the view modal when opening the edit modal
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const updatedContentType = {
      name: currentContentType.name,
      icon: currentContentType.icon
    };

    try {
      const response = await axios.put(`/admin/content-types/${currentContentType._id}`, updatedContentType, {
        headers: {
          Authorization: token
        }
      });
      setContentTypes(contentTypes.map(contentType => contentType._id === currentContentType._id ? response.data.data : contentType));
      setShowEditModal(false);
      setCurrentContentType(null);
      showFlashMessage('Content Type updated successfully', 'success');
    } catch (error) {
      console.error('Error updating content type', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setCurrentContentType({ ...currentContentType, [name]: value });
  };

  const handleView = contentType => {
    setCurrentContentType(contentType);
    setShowViewModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Content Types</h1>

      {flashMessage && (
        <div className={`p-4 mb-4 text-sm ${flashMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
          {flashMessage.message}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Content Type
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Add New Content Type</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newContentType.name}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div>
                <label className="block mb-1">Icon</label>
                <input
                  type="text"
                  name="icon"
                  value={newContentType.icon}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.icon && <p className="text-red-500 text-xs">{errors.icon}</p>}
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
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Add Content Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && currentContentType && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Edit Content Type</h2>
            <form onSubmit={handleUpdate} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentContentType.name}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Icon</label>
                <input
                  type="text"
                  name="icon"
                  value={currentContentType.icon}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
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

      {showViewModal && currentContentType && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">View Content Type</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 font-bold">Name</label>
                <p className="text-blue-600">{currentContentType.name}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Icon</label>
                <FontAwesomeIcon icon={currentContentType.icon ? currentContentType.icon : faFile} className="text-blue-600" />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleEdit(currentContentType)}
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
            <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentTypes.map((contentType) => (
            <tr key={contentType._id} className="hover:bg-gray-100 odd:bg-white even:bg-gray-50">
              <td className="border px-4 py-2 text-center">
                <FontAwesomeIcon icon={contentType.icon ? contentType.icon : faFile} />
              </td>
              <td className="border px-4 py-2">
                <a href="#" onClick={() => handleView(contentType)} className="text-blue-500 hover:underline">{contentType.name}</a>
              </td>
              <td className="border px-4 py-2">
                <button className="text-yellow-500 mr-2" onClick={() => handleEdit(contentType)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-500" onClick={() => handleDelete(contentType._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        Total Content Types: {contentTypes.length}
      </div>
    </div>
  );
};

export default ContentTypes;
