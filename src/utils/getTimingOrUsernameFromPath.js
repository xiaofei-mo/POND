export default function getTimingOrUsernameFromPath(path) {
  if (/^\/filter\//.test(path)) return null;
  return path.replace(/^\//, '');
}
