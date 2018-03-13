import * as yargs from 'yargs';

interface Args extends yargs.Arguments {
  interactive: boolean;
}

export default yargs.option('interactive', {
  alias: 'i',
  default: false
}).argv as Args;
