import fs from "fs";
import path from "path";

const regex = /```html(.*?)```/gs;

export const finalizeHtml = (name, creator, body) => {
  if (body.includes("```html")) {
    body = [...body.matchAll(regex)].map((match) => match[1]).join("\n");
  }

  return `
    <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <title>${name} by ${creator}</title>
    </head>
    ${body}
  </html>
    `;
};

export const setupProject = (
  name,
  projectId,
  creator,
  uploadImages,
  resultPrompt,
  finalHtml
) => {
  try {
    const baseDirectory = path.join(process.cwd(), "public", "outputs");
    const assetsDirectory = path.join(process.cwd(), "public", "assets");

    const projectDirectory = path.join(baseDirectory, projectId);

    if (!fs.existsSync(projectDirectory)) {
      fs.mkdirSync(projectDirectory);
    }

    fs.copyFileSync(
      path.join(assetsDirectory, "placeholder.svg"),
      path.join(projectDirectory, "placeholder.svg")
    );

    // Write the HTML file and the about.json file for info gathering later, Better to use a DB for this (p.s. I'm not a fan of JSON files for this purpose)

    fs.writeFileSync(path.join(projectDirectory, "index.html"), finalHtml);
    fs.writeFileSync(
      path.join(projectDirectory, "about.json"),
      JSON.stringify({
        projectId,
        name,
        creator,
        uploadImages,
        prompt: resultPrompt,
      })
    );

    console.log(`[PROJECT SETUP] ${projectId} has been setup successfully`);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
