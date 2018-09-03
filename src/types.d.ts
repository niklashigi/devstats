declare module 'gar' {
  function parseArgv(argv: string[]): {[key: string]: boolean | string | string[]}
  export = parseArgv
}
