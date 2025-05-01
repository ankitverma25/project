'use client';
import { useState } from 'react';
import axios from 'axios';

export default function UserSettingsPage() {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [notif, setNotif] = useState(true);

  const handleNameChange = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.put(`http://localhost:8000/user/update/${user._id}`, { name });
      setSuccess('Name updated!');
      user.name = name;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setError('Failed to update name');
    }
  };

  const handleAvatarChange = async (e) => {
    setError(''); setSuccess('');
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dylnn5dcz/image/upload', formData);
      const url = res.data.secure_url;
      await axios.put(`http://localhost:8000/user/update/${user._id}`, { avatar: url });
      setAvatar(url);
      user.avatar = url;
      localStorage.setItem('user', JSON.stringify(user));
      setSuccess('Avatar updated!');
    } catch {
      setError('Failed to update avatar');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!password || !newPassword) return setError('Fill both fields');
    try {
      await axios.put(`http://localhost:8000/user/change-password/${user._id}`, { password, newPassword });
      setSuccess('Password changed!');
      setPassword(''); setNewPassword('');
    } catch {
      setError('Failed to change password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      <div className="flex items-center gap-4 mb-6">
        <img src={avatar || '/avatar-placeholder.png'} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
        <div>
          <label className="block text-sm font-medium mb-1">Change Avatar</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
      </div>
      <form onSubmit={handleNameChange} className="mb-6">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Name</button>
      </form>
      <form onSubmit={handlePasswordChange} className="mb-6">
        <label className="block text-sm font-medium mb-1">Change Password</label>
        <input type="password" placeholder="Current Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Change Password</button>
      </form>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Notifications</label>
        <label className="inline-flex items-center">
          <input type="checkbox" checked={notif} onChange={() => setNotif(!notif)} className="form-checkbox" />
          <span className="ml-2">Enable email notifications</span>
        </label>
      </div>
      <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
      {success && <div className="text-green-600 mt-4">{success}</div>}
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </main>
  );
}
