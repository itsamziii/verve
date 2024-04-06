export const LLAVA_MODEL = "llava:7b-v1.6-mistral-q5_K_M";

export const CODELLAMA_MODEL = "codellama/CodeLlama-70b-Instruct-hf";

export const BASE_USER_PROMPT_LLAVA = `
You are a professional prompt engineer \
Analyze the images provided and generate a prompt to create a website similiar to the one in the image \
Don't mention the image directly in the prompt \
Try to answer the following questions with reference to the image: \

1. What is the color scheme and design style for the website? \
2. What is the layout of the website? \
3. What section of the website is shown in the image? \

Put an emphasis on only building the section shown in the image. 
`;

export const BASE_USER_PROMPT_CODELLAMA = `You are a professional web developer who uses HTML and Tailwind CSS to create beautiful and user-friendly websites. Your task is to`;

export const TEMPERATURE_LLAVA = 0;

export const TEMPERATURE_CODELLAMA = 0.1;

export const MAX_LEN_CODLLAMA = 3500;
