import React, { useState, useEffect } from "react";
import { dummyProjects } from "../data/dummyProjects";

const Explore = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setProjects(dummyProjects);
      setLoading(false);
    }, 1000); // simulate loading
  }, []);

  if (loading) {
    return <p className="text-center text-white mt-10">Loading projects...</p>;
  }

  if (projects.length === 0) {
    return <p className="text-center text-white mt-10">No open projects available.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Explore Open Projects</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-900 p-6 rounded-xl border border-gray-700"
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-400 mt-2">{project.description}</p>
            <p className="mt-2 text-sm">
              <strong>Tech Stack:</strong> {project.techStack.join(", ")}
            </p>
            <p className="text-sm">
              <strong>Status:</strong> {project.status}
            </p>
            <p className="text-sm">
              <strong>Roles Needed:</strong> {project.rolesNeeded.join(", ")}
            </p>
            <button
              onClick={() => console.log(`Interest in: ${project.title}`)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Show Interest
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;