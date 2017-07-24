export default function getSvgDataUrlFromText(text) {
  const excerpt = text.length > 256 ? `${text.slice(0, 256)}……` : text;
  const svgTextNotation = `<text fill="#FFF" font-size="16"><tspan x="0" dy="16">${excerpt.replace(/\n|\r/g, '</tspan><tspan x="0" dy="16">')}</tspan></text>`;
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">${svgTextNotation}</svg>`;
  return `data:image/svg+xml,${encodeURI(svgContent)}`;
}
