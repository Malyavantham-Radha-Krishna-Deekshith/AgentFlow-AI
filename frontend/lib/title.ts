export function generateTitleFromText(text: string) {
  return text
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .slice(0, 5)
    .join(" ")
    .trim();
}
