export const GET = async () => {
  return new Response(JSON.stringify({ images: [1, 2, 3] }));
};
