import React, { useState } from "react";

const PostProjectForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    collaborationType: "",
    techStack: "",
    customTech: "",
    difficulty: "",
    roles: "",
    customRoles: "",
    maxTeamSize: "",
    deadline: "",
    tags: "",
    openForCollab: false, // ✅ NEW
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Project Submitted:", formData);
    alert("✅ Project submitted successfully!");
  };

  const inputClass =
    "w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const sectionClass =
    "space-y-6 bg-gray-950 p-6 rounded-xl border border-gray-800";

  return (
    <div className="min-h-screen px-6 py-12 bg-black text-white">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold">Post a Project</h1>
          <p className="text-gray-400 mt-1">
            Kickstart your idea and invite collaborators!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Info */}
          <div className={sectionClass}>
            <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>

            <div>
              <label className="block mb-1">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. CodeMatch"
              />
            </div>

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={inputClass}
                placeholder="Describe the problem and your solution..."
              />
            </div>
          </div>

          {/* Collaboration */}
          <div className={sectionClass}>
            <h2 className="text-2xl font-semibold mb-4">Collaboration Details</h2>

            <div>
              <label className="block mb-1">Project Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option>Ideation</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Collaboration Type</label>
              <select
                name="collaborationType"
                value={formData.collaborationType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option>Open to all</option>
                <option>Invite only</option>
              </select>
            </div>

            {/* ✅ Open for Collaboration checkbox */}
            <div className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                name="openForCollab"
                checked={formData.openForCollab}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-300">
                Open for Collaboration
              </label>
            </div>
          </div>

          {/* Tech Requirements */}
          <div className={sectionClass}>
            <h2 className="text-2xl font-semibold mb-4">Technical Requirements</h2>

            <div>
              <label className="block mb-1">Tech Stack Needed</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                className={inputClass}
                placeholder="React, Node.js..."
              />
            </div>

            <div>
              <label className="block mb-1">Custom Tech Input</label>
              <input
                type="text"
                name="customTech"
                value={formData.customTech}
                onChange={handleChange}
                className={inputClass}
                placeholder="Any other tools?"
              />
            </div>

            <div>
              <label className="block mb-1">Difficulty Level</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          {/* Team Requirements */}
          <div className={sectionClass}>
            <h2 className="text-2xl font-semibold mb-4">Team Requirements</h2>

            <div>
              <label className="block mb-1">Roles Open</label>
              <input
                type="text"
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Frontend Developer, Designer"
              />
            </div>

            <div>
              <label className="block mb-1">Add Custom Role</label>
              <input
                type="text"
                name="customRoles"
                value={formData.customRoles}
                onChange={handleChange}
                className={inputClass}
                placeholder="Any other role?"
              />
            </div>

            <div>
              <label className="block mb-1">Maximum Team Size</label>
              <input
                type="number"
                name="maxTeamSize"
                value={formData.maxTeamSize}
                onChange={handleChange}
                className={inputClass}
                placeholder="5"
              />
            </div>
          </div>

          {/* Additional */}
          <div className={sectionClass}>
            <h2 className="text-2xl font-semibold mb-4">Additional Details</h2>

            <div>
              <label className="block mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block mb-1">Project Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className={inputClass}
                placeholder="Hackathon, AI, WebApp..."
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold text-lg hover:opacity-90"
          >
            Post Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProjectForm;