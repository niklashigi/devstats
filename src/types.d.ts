declare module 'gar' {
  function parseArgv(argv: string[]): {[key: string]: boolean | string | string[]}
  export = parseArgv
}

declare module '*/package.json' {
  const pkg: {
    name: string;
    version: string;
  };
  export = pkg;
}
