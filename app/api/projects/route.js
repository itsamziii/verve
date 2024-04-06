import fs from "fs";
import path from "path";

export const GET = async () => {
  const projectsPath = path.join(process.cwd(), "public", "outputs");
  const projects = fs.readdirSync(projectsPath);

  if (projects.length === 0) {
    return new Response(
      JSON.stringify({
        projects: [],
      })
    );
  }

  let projectDetails = [];

  projects.forEach((project) => {
    const { name, creator, projectId } = JSON.parse(
      fs.readFileSync(path.join(projectsPath, project, "about.json"))
    );

    projectDetails.push({
      name,
      creator,
      projectId,
    });
  });

  return new Response(JSON.stringify({ projects: projectDetails }));
};
