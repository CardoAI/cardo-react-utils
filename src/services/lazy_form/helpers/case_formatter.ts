const snakeToTitleCase = (text: string): string => {
  return text.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

const camelToTitleCase = (text: string): string => {
  const withSpaces = text.replace(/([A-Z])/g, " $1");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export const toTitleCase = (text: string): string => {
  if (text.includes('_')) return snakeToTitleCase(text);
  return camelToTitleCase(text);
}
