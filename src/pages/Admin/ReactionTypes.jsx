import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faSave, faSmile } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const ReactionTypes = () => {
  const [reactionTypes, setReactionTypes] = useState([]);
  const [newReactionType, setNewReactionType] = useState({ name: '', icon: '' });
  const [currentReactionType, setCurrentReactionType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState(null);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchReactionTypes = async () => {
      try {
        const response = await axios.get('/admin/reaction-types', {
          headers: {
            Authorization: token
          }
        });
        setReactionTypes(response.data.data);
      } catch (error) {
        console.error('Error fetching reaction types', error);
      }
    };
    fetchReactionTypes();
  }, [token]);

  const showFlashMessage = (message, type) => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewReactionType({ ...newReactionType, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newReactionType.name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post('/admin/reaction-types', newReactionType, {
        headers: {
          Authorization: token
        }
      });
      setReactionTypes([...reactionTypes, response.data.data]);
      setNewReactionType({ name: '', icon: '' });
      setShowModal(false);
      showFlashMessage('Reaction Type added successfully', 'success');
    } catch (error) {
      console.error('Error adding reaction type', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this reaction type?')) return;
    try {
      await axios.delete(`/admin/reaction-types/${id}`, {
        headers: {
          Authorization: token
        }
      });
      setReactionTypes(reactionTypes.filter(reactionType => reactionType._id !== id));
      showFlashMessage('Reaction Type deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting reaction type', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEdit = reactionType => {
    setCurrentReactionType(reactionType);
    setShowEditModal(true);
    setShowViewModal(false); // Close the view modal when opening the edit modal
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const updatedReactionType = {
      name: currentReactionType.name,
      icon: currentReactionType.icon
    };

    try {
      const response = await axios.put(`/admin/reaction-types/${currentReactionType._id}`, updatedReactionType, {
        headers: {
          Authorization: token
        }
      });
      setReactionTypes(reactionTypes.map(reactionType => reactionType._id === currentReactionType._id ? response.data.data : reactionType));
      setShowEditModal(false);
      setCurrentReactionType(null);
      showFlashMessage('Reaction Type updated successfully', 'success');
    } catch (error) {
      console.error('Error updating reaction type', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setCurrentReactionType({ ...currentReactionType, [name]: value });
  };

  const handleView = reactionType => {
    setCurrentReactionType(reactionType);
    setShowViewModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Reaction Types</h1>

      {flashMessage && (
        <div className={`p-4 mb-4 text-sm ${flashMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
          {flashMessage.message}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Reaction Type
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Add New Reaction Type</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newReactionType.name}
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
                  value={newReactionType.icon}
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
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Add Reaction Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && currentReactionType && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Edit Reaction Type</h2>
            <form onSubmit={handleUpdate} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentReactionType.name}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Icon</label>
                <input
                  type="text"
                  name="icon"
                  value={currentReactionType.icon}
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

      {showViewModal && currentReactionType && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">View Reaction Type</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 font-bold">Name</label>
                <p className="text-blue-600">{currentReactionType.name}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Icon</label>
                <FontAwesomeIcon icon={currentReactionType.icon ? currentReactionType.icon : faSmile} className="text-blue-600" />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleEdit(currentReactionType)}
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
          {reactionTypes.map((reactionType) => (
            <tr key={reactionType._id} className="hover:bg-gray-100 odd:bg-white even:bg-gray-50">
              <td className="border px-4 py-2 text-center">
                <FontAwesomeIcon icon={reactionType.icon ? reactionType.icon : faSmile} />
              </td>
              <td className="border px-4 py-2">
                <a href="#" onClick={() => handleView(reactionType)} className="text-blue-500 hover:underline">{reactionType.name}</a>
              </td>
              <td className="border px-4 py-2">
                <button className="text-yellow-500 mr-2" onClick={() => handleEdit(reactionType)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-500" onClick={() => handleDelete(reactionType._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        Total Reaction Types: {reactionTypes.length}
      </div>
    </div>
  );
};

export default ReactionTypes;
