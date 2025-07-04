import React, { useEffect, useState } from "react";
import { Edit, Eye, Users, X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const borderColors = [
  "hover:border-purple-500/30",
  "hover:border-blue-500/30",
  "hover:border-green-500/30",
  "hover:border-yellow-500/30",
  "hover:border-gray-500/30",
  "hover:border-red-500/30",
];

const inviteStatusColors = {
  Accepted: "bg-green-700/30 text-green-400",
  Pending: "bg-yellow-700/30 text-yellow-400",
};

export default function MyProjectsPage() {
  const { user } = useUser(); // Clerk user
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewProject, setViewProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [editInviteStatus, setEditInviteStatus] = useState("");

  // ✅ Fetch projects for this user
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/projects?createdBy=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProjects(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching projects:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleView = (project) => setViewProject(project);
  const handleEdit = (project) => {
    setEditProject(project);
    setEditInviteStatus(project.inviteStatus || "Pending");
  };
  const closeModal = () => {
    setViewProject(null);
    setEditProject(null);
  };
  const handleInviteStatusChange = (e) => setEditInviteStatus(e.target.value);
  const handleSave = () => {
    // TODO: Hook to backend to save inviteStatus
    if (editProject) {
      const updated = projects.map((p) =>
        p.id === editProject.id ? { ...p, inviteStatus: editInviteStatus } : p
      );
      setProjects(updated);
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pb-20">
      {/* Heading */}
      <div className="text-center pt-20 pb-10">
        <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight">
          My <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">Projects</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          View and manage your hackathon and collaboration projects. Track status, invites, and more.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <p className="text-center text-gray-500 text-lg">Loading your projects...</p>
      )}

      {/* Project Cards */}
      {!loading && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              You haven't posted any projects yet.
            </p>
          ) : (
            projects.map((project, idx) => (
              <div
                key={project.id}
                className={`bg-gradient-to-b from-gray-900/50 to-gray-900/20 border border-gray-700 rounded-2xl p-8 shadow-lg transition-all group relative overflow-hidden ${borderColors[idx % borderColors.length]}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-blue-400" size={28} />
                  <h2 className="text-3xl font-bold group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h2>
                </div>
                <p className="text-gray-300 text-lg mb-6">{project.description}</p>

                <div className="flex flex-wrap gap-6 items-center mb-6">
                  <div>
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${project.status === "Completed" ? "bg-green-700/30 text-green-400" : "bg-blue-700/30 text-blue-400"}`}>
                      {project.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Invite Status:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${inviteStatusColors[project.inviteStatus] || "bg-gray-700/30 text-gray-300"}`}>
                      {project.inviteStatus || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button onClick={() => handleView(project)} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors text-lg shadow">
                    <Eye size={20} /> View
                  </button>
                  <button onClick={() => handleEdit(project)} className="flex items-center gap-2 px-6 py-2 rounded-xl border border-gray-600 text-white font-semibold hover:border-blue-500 hover:text-blue-400 transition-colors text-lg">
                    <Edit size={20} /> Edit
                  </button>
                </div>
                <div className="absolute inset-0 pointer-events-none rounded-2xl group-hover:ring-2 group-hover:ring-blue-500/40 transition-all"></div>
              </div>
            ))
          )}
        </div>
      )}

      {/* View Modal */}
      {viewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gradient-to-b from-gray-900/90 to-gray-900/70 border border-gray-700 rounded-2xl p-10 max-w-2xl w-full shadow-2xl relative animate-fade-in">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors">
              <X size={28} />
            </button>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              {viewProject.title}
            </h2>
            <div className="space-y-3 text-lg">
              <div><span className="font-semibold text-gray-400">Description:</span> {viewProject.description}</div>
              <div><span className="font-semibold text-gray-400">Status:</span> {viewProject.status}</div>
              <div><span className="font-semibold text-gray-400">Invite Status:</span> {viewProject.inviteStatus || "Pending"}</div>
              <div><span className="font-semibold text-gray-400">Collaboration Type:</span> {viewProject.collaborationType}</div>
              <div><span className="font-semibold text-gray-400">Tech Stack:</span> {viewProject.techStack}</div>
              <div><span className="font-semibold text-gray-400">Custom Tech:</span> {viewProject.customTech}</div>
              <div><span className="font-semibold text-gray-400">Difficulty:</span> {viewProject.difficulty}</div>
              <div><span className="font-semibold text-gray-400">Roles Open:</span> {viewProject.roles}</div>
              <div><span className="font-semibold text-gray-400">Custom Roles:</span> {viewProject.customRoles}</div>
              <div><span className="font-semibold text-gray-400">Max Team Size:</span> {viewProject.maxTeamSize}</div>
              <div><span className="font-semibold text-gray-400">Deadline:</span> {viewProject.deadline}</div>
              <div><span className="font-semibold text-gray-400">Tags:</span> {viewProject.tags}</div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gradient-to-b from-gray-900/90 to-gray-900/70 border border-gray-700 rounded-2xl p-10 max-w-xl w-full shadow-2xl relative animate-fade-in">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors">
              <X size={28} />
            </button>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Edit Invite Status
            </h2>
            <div className="mb-8">
              <label className="block mb-2 text-lg font-semibold text-gray-400">Invite Status</label>
              <select
                value={editInviteStatus}
                onChange={handleInviteStatusChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Pending</option>
                <option>Accepted</option>
                <option>Declined</option>
                <option>Expired</option>
              </select>
            </div>
            <button
              onClick={handleSave}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold text-lg hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}