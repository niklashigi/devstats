import gar = require('gar');
import chalk from 'chalk';

import show from './commands/show';
import add from './commands/add';
import remove from './commands/remove';

const args = gar(process.argv.slice(2)) as {
  i?: boolean | string;
  interactive?: boolean | string;
  help?: boolean | string;
  _: string[];
};

if (Boolean(args.help)) {
  console.log(chalk`
  {bold devstats}
  {blue Display the daily report for the current day}

  {bold devstats} -i {grey or} {bold devstats} --interactive
  {blue Switch between days interactively}

  {bold devstats} add <url>
  {dim {bold devstats} add https://github.com/shroudedcode}
  {blue Add a new account through its URL}

  {bold devstats} remove <url>
  {dim {bold devstats} add https://stackoverflow.com/users/6662225}
  {blue Remove an account through its URL}
  `);
} else if (args._.length === 0) {
  show({interactive: Boolean(args.i || args.interactive)});
} else {
  const command = args._.shift() as string;
  const commandArgs = args._;

  if (command === 'add') {
    add(typeof commandArgs[0] === 'string' ? commandArgs[0] : undefined);
  } else if (command === 'remove') {
    remove(typeof commandArgs[0] === 'string' ? commandArgs[0] : undefined);
  } else {
    console.log(chalk`{red The subcommand {bold ${command}} could not be found!}`);
    process.exit(1);
  }
}
