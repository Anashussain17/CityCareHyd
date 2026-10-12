// Escapes text before it is placed inside an HTML email, so a title like
// "<a href=...>" shows as text instead of becoming a link.
export default function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
