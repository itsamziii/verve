"use client";

import Project from "@/components/Project";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Gallery = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("/api/projects").then(({ data }) => {
      setProjects(data.projects);
    });
  }, []);

  return (
    <section className="w-full bg-black flex items-center justify-center pt-20 h-screen">
      <div className="z-10">
        {projects.length === 0 ? (
          <h1 className="max-w-4xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-7xl">
            No projects found. <br /> Create a new project to see it here.
          </h1>
        ) : (
          <div className="h-[40rem] w-full items-center justify-center flex flex-row gap-8">
            {projects.map((project, idx) => (
              <Project key={idx} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
