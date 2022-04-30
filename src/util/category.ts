export function formatCategoryName(category: string) {
  const parts = category.split('_').map((part) => camelCase(part));
  return parts.join(' ');
}

function camelCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLocaleLowerCase();
}
