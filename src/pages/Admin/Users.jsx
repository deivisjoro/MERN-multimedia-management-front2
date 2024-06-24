import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faSave, faEye, faKey, faImage } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'lector',
    isVerified: false,
    verificationToken: '',
    profileImage: null,
    language: 'es',
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangeImageModal, setShowChangeImageModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState(null);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users', {
          headers: {
            Authorization: token
          }
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, [token]);

  const showFlashMessage = (message, type) => {
    setFlashMessage({ message, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      if (files.length > 0) {
        setNewUser({ ...newUser, [name]: files[0] });
      }
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newUser.username) newErrors.username = 'Username is required';
    if (!newUser.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newUser.email)) newErrors.email = 'Email is invalid';
    if (!newUser.password) newErrors.password = 'Password is required';
    if (!['admin', 'creador', 'lector'].includes(newUser.userType)) newErrors.userType = 'User type is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append('username', newUser.username);
    formData.append('email', newUser.email);
    formData.append('password', newUser.password);
    formData.append('userType', newUser.userType);
    formData.append('isVerified', newUser.isVerified);
    formData.append('verificationToken', newUser.verificationToken);
    formData.append('profileImage', newUser.profileImage);
    formData.append('language', newUser.language);

    try {
      const response = await axios.post('/admin/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        },
      });
      setUsers([...users, response.data.data]);
      setNewUser({
        username: '',
        email: '',
        password: '',
        userType: 'lector',
        isVerified: false,
        verificationToken: '',
        profileImage: null,
        language: 'es',
      });
      setShowModal(false);
      showFlashMessage('User added successfully', 'success');
    } catch (error) {
      console.error('Error adding user', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: token
        }
      });
      setUsers(users.filter((user) => user._id !== id));
      showFlashMessage('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
    setShowViewModal(false); // Close the view modal when opening the edit modal
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedUser = {
      username: currentUser.username,
      email: currentUser.email,
      userType: currentUser.userType,
      language: currentUser.language,
      isVerified: currentUser.isVerified,
    };

    try {
      const response = await axios.put(`/admin/users/${currentUser._id}`, updatedUser, {
        headers: {
          Authorization: token
        },
      });
      setUsers(users.map(user => user._id === currentUser._id ? response.data.data : user));
      setShowEditModal(false);
      setCurrentUser(null);
      showFlashMessage('User updated successfully', 'success');
    } catch (error) {
      console.error('Error updating user', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      if (files.length > 0) {
        setCurrentUser({ ...currentUser, [name]: files[0] });
      }
    } else {
      setCurrentUser({ ...currentUser, [name]: value });
    }
  };
  

  const handleView = (user) => {
    setCurrentUser(user);
    setShowViewModal(true);
  };

  const handleOpenChangePasswordModal = () => {
    setCurrentUser({ ...currentUser, oldPassword: '', newPassword: '' });
    setErrors({});
    setShowChangePasswordModal(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword } = currentUser;

    try {
      const response = await axios.post(`/admin/users/${currentUser._id}/password`, { oldPassword, newPassword }, {
        headers: {
          Authorization: token
        },
      });     

      setShowChangePasswordModal(false);
      setShowViewModal(true);
      showFlashMessage('Password updated successfully', 'success');
    } catch (error) {
      console.error('Error updating password', error);
      if (error.response && error.response.data) {
        setErrors({ ...errors, password: error.response.data.message });
      }
    }
  };

  const handleChangeImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profileImage', currentUser.profileImage);
  
    try {
      const response = await axios.post(`/admin/users/${currentUser._id}/profileImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        },
      });
      setUsers(users.map(user => user._id === currentUser._id ? response.data.data : user));
      setShowChangeImageModal(false);
      showFlashMessage('Profile image updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile image', error);
      if (error.response && error.response.data) {
        showFlashMessage(error.response.data.message, 'error');
      }
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      {flashMessage && (
        <div className={`p-4 mb-4 text-sm ${flashMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
          {flashMessage.message}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 rounded">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add User
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
              <div>
                <label className="block mb-1">User Type</label>
                <select
                  name="userType"
                  value={newUser.userType}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="admin">Admin</option>
                  <option value="creador">Creador</option>
                  <option value="lector">Lector</option>
                </select>
                {errors.userType && <p className="text-red-500 text-xs">{errors.userType}</p>}
              </div>
              <div>
                <label className="block mb-1">Language</label>
                <select
                  name="language"
                  value={newUser.language}
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
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
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={currentUser.username}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">User Type</label>
                <select
                  name="userType"
                  value={currentUser.userType}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="admin">Admin</option>
                  <option value="creador">Creador</option>
                  <option value="lector">Lector</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Language</label>
                <select
                  name="language"
                  value={currentUser.language}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Verified</label>
                <select
                  name="isVerified"
                  value={currentUser.isVerified}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
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

      {showViewModal && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">View User</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 font-bold">Username</label>
                <p className="text-blue-600">{currentUser.username}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Email</label>
                <p className="text-blue-600">{currentUser.email}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">User Type</label>
                <p className="text-blue-600">{currentUser.userType}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Language</label>
                <p className="text-blue-600">{currentUser.language}</p>
              </div>
              <div>
                <label className="block mb-1 font-bold">Verified</label>
                <p className="text-blue-600">{currentUser.isVerified ? 'Yes' : 'No'}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleOpenChangePasswordModal}
                  className="btn btn-primary flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faKey} className="mr-1" /> Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangeImageModal(true)}
                  className="btn btn-primary flex items-center text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faImage} className="mr-1" /> Change Image
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(currentUser)}
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

      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Old Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={currentUser.oldPassword || ''}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.oldPassword && <p className="text-red-500 text-xs">{errors.oldPassword}</p>}
              </div>
              <div>
                <label className="block mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={currentUser.newPassword || ''}
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword}</p>}
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
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

      {showChangeImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-xl mb-4">Change Profile Image</h2>
            <form onSubmit={handleChangeImage} className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleEditChange}
                  className="input mb-1 border rounded p-1 w-full"
                />
                {errors.profileImage && <p className="text-red-500 text-xs">{errors.profileImage}</p>}
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
            <th className="px-4 py-2">Profile Image</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">User Type</th>
            <th className="px-4 py-2">Language</th>
            <th className="px-4 py-2">Verified</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100 odd:bg-white even:bg-gray-50">
              <td className="border px-4 py-2">
                <img
                  src={user.profileImage ? `http://localhost:5000/${user.profileImage}` : '/profile.jpg'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="border px-4 py-2">
                <a href="#" onClick={() => handleView(user)} className="text-blue-500 hover:underline">{user.username}</a>
              </td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.userType}</td>
              <td className="border px-4 py-2">{user.language}</td>
              <td className="border px-4 py-2">{user.isVerified ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">
                <button className="text-yellow-500 mr-2" onClick={() => handleEdit(user)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-red-500" onClick={() => handleDelete(user._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        Total Users: {users.length}
      </div>
    </div>
  );
};

export default Users;
