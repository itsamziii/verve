import axios from "axios";

import { LLAVA_MODEL, TEMPERATURE_LLAVA } from "../../generate/constants";

export const POST = async (req) => {
  try {
    const { messages } = await req.json();

    /* 
    TODO: Add more logic here to handle the total message history
    */

    const { data } = await axios({
      method: "post",
      url: process.env.LLAVA_ENDPOINT + "/api/chat",
      data: JSON.stringify({
        model: LLAVA_MODEL,
        messages: messages,
        stream: false,
        options: {
          temperature: TEMPERATURE_LLAVA,
        },
      }),
    });

    return new Response(
      JSON.stringify({ success: 1, response: data.message }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return new Response({ success: 0 }, { status: 500 });
  }
};
