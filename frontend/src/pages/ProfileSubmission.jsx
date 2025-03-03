import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';

function ProfileSubmission() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', summary: '', experience: '', skills: '', education: '', linkedin_url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const skills = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      await api.post('/profiles', { user_id: user.id, ...formData, skills });
      setSuccess(true);
      setFormData({ name: '', summary: '', experience: '', skills: '', education: '', linkedin_url: '' });
      setTimeout(() => { navigate('/search'); }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Submit Your LinkedIn Profile</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Profile submitted successfully! Redirecting to search page...</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Profile Summary</label>
          <textarea name="summary" value={formData.summary} onChange={handleChange} required rows={4} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="A brief summary of your professional background and expertise" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Experience</label>
          <textarea name="experience" value={formData.experience} onChange={handleChange} required rows={6} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe your work experience, roles, and achievements" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="JavaScript, React, Node.js, etc." />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Education</label>
          <textarea name="education" value={formData.education} onChange={handleChange} rows={3} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your educational background" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">LinkedIn URL</label>
          <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://linkedin.com/in/yourprofile" />
        </div>
        <button type="submit" disabled={isSubmitting} className={`px-6 py-3 bg-blue-600 text-white rounded-md shadow ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
          {isSubmitting ? 'Submitting...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
}

export default ProfileSubmission;
