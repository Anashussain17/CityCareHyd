// Photos are stored as full Cloudinary URLs. Older issues saved a path on the
// API server (e.g. /uploads/123.jpg), so those still need the API address.
export const imageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${import.meta.env.VITE_API_URL}${path}`;
};
