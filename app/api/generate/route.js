import axios from "axios";

import {
  BASE_USER_PROMPT_CODELLAMA,
  BASE_USER_PROMPT_LLAVA,
  CODELLAMA_MODEL,
  LLAVA_MODEL,
  MAX_LEN_CODLLAMA,
  TEMPERATURE_CODELLAMA,
  TEMPERATURE_LLAVA,
} from "./constants.js";

import { finalizeHtml, setupProject } from "@/utils/setupProject.js";
import { randomId } from "@/utils/randomId.js";

export const POST = async (req) => {
  try {
    const body = await req.json();

    const projectId = randomId(7);
    const { name, creator, uploadImages } = body;

    const { data } = await axios({
      method: "post",
      url: process.env.LLAVA_ENDPOINT + "/api/generate",
      data: JSON.stringify({
        model: LLAVA_MODEL,
        prompt:
          BASE_USER_PROMPT_LLAVA +
          `\nThe website's name should be ${name}. Only respond with the prompt with no conclusions or explanations.`,
        images: uploadImages,
        stream: false,
        options: {
          temperature: TEMPERATURE_LLAVA,
        },
      }),
    });

    let finalBodyTag;
    const resultPrompt = data.response;

    if (!process.env.TOGETHER_API_KEY) {
      const { data: bodyTagData } = await axios({
        method: "post",
        url: process.env.CODELLAMA_ENDPOINT + "/api/generate",
        data: JSON.stringify({
          model: LLAVA_MODEL,
          prompt:
            BASE_USER_PROMPT_CODELLAMA +
            resultPrompt +
            '\nOnly respond with the body tag of the HTML code with no explanations. Only use "placeholder.svg" for all images.',
          stream: false,
          options: {
            temperature: TEMPERATURE_CODELLAMA,
          },
        }),
      });

      finalBodyTag = bodyTagData.response;
    } else {
      const { data: bodyTagData } = await axios({
        method: "post",
        url: process.env.CODELLAMA_ENDPOINT,
        data: {
          model: CODELLAMA_MODEL,
          messages: [
            {
              role: "user",
              content:
                BASE_USER_PROMPT_CODELLAMA +
                resultPrompt +
                '\nOnly respond with the body tag of the HTML code with no explanations. Only use "placeholder.svg" for all images.',
            },
          ],
          stream: false,
          max_tokens: MAX_LEN_CODLLAMA,
          temperature: TEMPERATURE_CODELLAMA,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      });

      finalBodyTag = bodyTagData.choices[0].message.content;
    }

    const finalHtml = finalizeHtml(name, creator, finalBodyTag);

    const setup = setupProject(
      name,
      projectId,
      creator,
      uploadImages,
      resultPrompt,
      finalHtml
    );

    if (!setup) {
      console.log(`${projectId} failed to setup`);
      return new Response(JSON.stringify({ success: false }, { status: 500 }));
    } else
      return new Response(
        JSON.stringify({
          projectId,
          success: true,
        })
      );
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ success: false }, { status: 500 }));
  }
};
