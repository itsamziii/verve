import path from "path";
import fs from "fs";
import JSZip from "jszip";

export const GET = async (req) => {
  const projectId = req.nextUrl.searchParams.get("id");
  if (!projectId) {
    return new Response("Project ID is required", { status: 400 });
  }

  const projectDir = path.join(process.cwd(), "public", "outputs", projectId);

  if (!fs.existsSync(projectDir)) {
    return new Response("Project not found", { status: 404 });
  }

  const zip = new JSZip();

  try {
    await addFilesToZip(projectDir, zip);

    const zipContent = await zip.generateAsync({ type: "blob" });

    return new Response(zipContent, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${projectId}.zip`,
      },
    });
  } catch (error) {
    console.error("Error creating ZIP archive:", error);
    return new Response("Failed to create ZIP archive", { status: 500 });
  }
};

async function addFilesToZip(dirPath, zip) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await addFilesToZip(filePath, zip.folder(file));
    } else {
      const fileContent = fs.readFileSync(filePath);
      zip.file(file, fileContent);
    }
  }
}
