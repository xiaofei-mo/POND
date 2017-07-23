export default function getSvgDataUrlFromText(text) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><text x="8" y="15" fill="#FFF" font-size="15">${text}</text></svg>`;
  return `data:image/svg+xml,${encodeURI(svgContent)}`;
}
