import path from "path";
import fs from "fs";

export const POST = async (req) => {
  try {
    const { projectId } = await req.json();

    const projectPath = path.join(
      process.cwd(),
      "public",
      "outputs",
      projectId ? projectId : ""
    );

    if (!projectId || !fs.existsSync(projectPath)) {
      return new Response({ status: 200 });
    }

    const getAboutJSON = JSON.parse(
      fs.readFileSync(path.join(projectPath, "about.json"), "utf-8")
    );
    const getHtmlCode = fs.readFileSync(
      path.join(projectPath, "index.html"),
      "utf-8"
    );

    return new Response(
      JSON.stringify({
        messages: [
          {
            role: "user",
            content: getAboutJSON.prompt,
            images: getAboutJSON.uploadImages,
          },
          {
            role: "assistant",
            content: `${getHtmlCode}`,
          },
        ],
      })
    );
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return new Response(err.message, { status: 500 });
    }
    return new Response("Internal Server Error!", { status: 500 });
  }
};
