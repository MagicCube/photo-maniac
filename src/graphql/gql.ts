export function gql(strings: TemplateStringsArray, ...expressions: string[]) {
  let result = '';
  strings.forEach((str, i) => {
    result += str + (expressions[i] || '');
  });
  return result;
}
