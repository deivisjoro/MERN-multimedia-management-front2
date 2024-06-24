import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faSave, faImage } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    permissions: [],
    coverImage: null,
  });
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showChangeImageModal, setShowChangeImageModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState(null);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/admin/categories', {
          headers: {
            Authorization: token
          }
        });
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, [token]);

  const showFlashMessage = (message, type) => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'coverImage') {
      if (files.length > 0) {
        setNewCategory({ ...newCategory, [name]: files[0] });
      }
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const handlePermissionChange = (index, field, value) => {
    const updatedPermissions = [...newCategory.permissions];
    updatedPermissions[index][field] = value;
    setNewCategory({ ...newCategory, permissions: updatedPermissions });
  };

  const addPermission = () => {
    setNewCategory({
      ...newCategory,
      permissions: [...newCategory.permissions, { userType: '', canRead: false, canWrite: false }],
    });
  };

  const removePermission = (index) => {
    const updatedPermissions = [...newCategory.permissions];
    updatedPermissions.splice(index, 1);
    setNewCategory({ ...newCategory, permissions: updatedPermissions });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newCategory.name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append('name', newCategory.name);
    formData.append('permissions', JSON.stringify(newCategory.permissions));
    formData.append('coverImage', newCategory.coverImage);

    try {
      const response = await axios.post('/admin/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        },
      });
      setCategories([...categories, response.data.data]);
      setNewCategory({
        name: '',
        permissions: [],
        coverImage: null,
      });
      setShowModal(false);
      showFlashMessage('Category added successfully', 'success');
    } catch (error) {
      console.error('Error adding category', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`/admin/categories/${id}`, {
        headers: {
          Authorization: token
        }
      });
      setCategories(categories.filter((category) => category._id !== id));
      showFlashMessage('Category deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting category', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setShowEditModal(true);
    setShowViewModal(false); // Close the view modal when opening the edit modal
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedCategory = {
      name: currentCategory.name,
      permissions: currentCategory.permissions
    };

    try {
      const response = await axios.put(`/admin/categories/${currentCategory._id}`, updatedCategory, {
        headers: {
          Authorization: token
        },
      });
      setCategories(categories.map(category => category._id === currentCategory._id ? response.data.data : category));
      setShowEditModal(false);
      setCurrentCategory(null);
      showFlashMessage('Category updated successfully', 'success');
    } catch (error) {
      console.error('Error updating category', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const handleView = (category) => {
    setCurrentCategory(category);
    setShowViewModal(true);
  };

  const handleChangeImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('coverImage', currentCategory.coverImage);
  
    try {
      const response = await axios.post(`/admin/categories/${currentCategory._id}/coverImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        },
      });
      setCategories(categories.map(category => category._id === currentCategory._id ? response.data.data : category));
      setShowChangeImageModal(false);
      showFlashMessage('Cover image updated successfully', 'success');
    } catch (error) {
      console.error('Error updating cover image', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>

      {flashMessage && (
        <div className={`p-4 mb-4 text-sm ${flashMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
          {flashMessage.message}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Category
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div>
                <label className="block mb-1">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Permissions</label>
                {newCategory.permissions.map((permission, index) => (
                  <div key={index} className="mb-2">
                    <select
                      name="userType"
                      value={permission.userType}
                      onChange={(e) => handlePermissionChange(index, 'userType', e.target.value)}
                      className="input mb-1 border rounded p-1 w-full"
                    >
                      <option value="">Select User Type</option>
                      <option value="admin">Admin</option>
                      <option value="creador">Creador</option>
                      <option value="lector">Lector</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permission.canRead}
                          onChange={(e) => handlePermissionChange(index, 'canRead', e.target.checked)}
                          className="mr-1"
                        />
                        Can Read
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permission.canWrite}
                          onChange={(e) => handlePermissionChange(index, 'canWrite', e.target.checked)}
                          className="mr-1"
                        />
                        Can Write
                      </label>
                      <button
                        type="button"
                        onClick={() => removePermission(index)}
                        className="btn btn-danger flex items-center text-white bg-red-500 hover:bg-red-700 py-1 px-2 rounded"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPermission}
                  className="btn btn-primary flex items-center bg-blue-500 text-white hover:bg-blue-700 py-1 px-2 rounded"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add Permission
                </button>
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
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && currentCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Edit Category</h2>
            <form onSubmit={handleUpdate} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Permissions</label>
                {currentCategory.permissions.map((permission, index) => (
                  <div key={index} className="mb-2">
                    <select
                      name="userType"
                      value={permission.userType}
                      onChange={(e) => {
                        const updatedPermissions = [...currentCategory.permissions];
                        updatedPermissions[index].userType = e.target.value;
                        setCurrentCategory({ ...currentCategory, permissions: updatedPermissions });
                      }}
                      className="input mb-1 border rounded p-1 w-full"
                    >
                      <option value="">Select User Type</option>
                      <option value="admin">Admin</option>
                      <option value="creador">Creador</option>
                      <option value="lector">Lector</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permission.canRead}
                          onChange={(e) => {
                            const updatedPermissions = [...currentCategory.permissions];
                            updatedPermissions[index].canRead = e.target.checked;
                            setCurrentCategory({ ...currentCategory, permissions: updatedPermissions });
                          }}
                          className="mr-1"
                        />
                        Can Read
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permission.canWrite}
                          onChange={(e) => {
                            const updatedPermissions = [...currentCategory.permissions];
                            updatedPermissions[index].canWrite = e.target.checked;
                            setCurrentCategory({ ...currentCategory, permissions: updatedPermissions });
                          }}
                          className="mr-1"
                        />
                        Can Write
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedPermissions = [...currentCategory.permissions];
                          updatedPermissions.splice(index, 1);
                          setCurrentCategory({ ...currentCategory, permissions: updatedPermissions });
                        }}
                        className="btn btn-danger flex items-center text-white bg-red-500 hover:bg-red-700 py-1 px-2 rounded"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updatedPermissions = [...currentCategory.permissions, { userType: '', canRead: false, canWrite: false }];
                    setCurrentCategory({ ...currentCategory, permissions: updatedPermissions });
                  }}
                  className="btn btn-primary flex items-center bg-blue-500 text-white hover:bg-blue-700 py-1 px-2 rounded"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add Permission
                </button>
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

      {showViewModal && currentCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">View Category</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 font-bold">Name</label>
                <p className="text-blue-600">{currentCategory.name}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Cover Image</label>
                <img
                  src={currentCategory.coverImage ? `http://localhost:5000/${currentCategory.coverImage}` : '/cover.jpg'}
                  alt="Cover"
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold">Permissions</label>
                {currentCategory.permissions.map((permission, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-blue-600">User Type: {permission.userType}</p>
                    <p className="text-blue-600">Can Read: {permission.canRead ? 'Yes' : 'No'}</p>
                    <p className="text-blue-600">Can Write: {permission.canWrite ? 'Yes' : 'No'}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowChangeImageModal(true)}
                  className="btn btn-primary flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faImage} className="mr-1" /> Change Image
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(currentCategory)}
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

      {showChangeImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Change Cover Image</h2>
            <form onSubmit={handleChangeImage} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.coverImage && <p className="text-red-500 text-xs">{errors.coverImage}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowChangeImageModal(false)}
                  className="btn btn-secondary flex items-center text-orange-600 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" /> Cancel
                </button>
                <button type="submit" className="btn btn-primary flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded">
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Cover Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id} className="hover:bg-gray-100 odd:bg-white even:bg-gray-50">
              <td className="border px-4 py-2 text-center">
                <img
                  src={category.coverImage ? `http://localhost:5000/${category.coverImage}` : '/cover.jpg'}
                  alt="Cover"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="border px-4 py-2">
                <a href="#" onClick={() => handleView(category)} className="text-blue-500 hover:underline">{category.name}</a>
              </td>
              <td className="border px-4 py-2">
                <button className="text-yellow-500 mr-2" onClick={() => handleEdit(category)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-500" onClick={() => handleDelete(category._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        Total Categories: {categories.length}
      </div>
    </div>
  );
};

export default Categories;
