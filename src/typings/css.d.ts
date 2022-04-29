declare module '*.module.css' {
  const rules: { [selector: string]: string };
  export = rules;
}
