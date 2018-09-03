import gar = require('gar');
import chalk from 'chalk';

import './libs/handle-errors';
import showUpdateNotification from './libs/update-notifier';

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
  {blue Display the daily report for the current day:}

  {dim $} {bold devstats}

  {blue Switch between days interactively:}

  {dim $} {bold devstats} -i {dim or} {bold devstats} --interactive

  {blue Add a new account through its URL:}

  {dim $} {bold devstats} add <url>
  {grey {dim $} {bold devstats} add https://github.com/shroudedcode}

  {blue Remove an account through its URL:}

  {dim $} {bold devstats} remove <url>
  {grey {dim $} {bold devstats} remove https://stackoverflow.com/users/6662225}
  `);

  showUpdateNotification();
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
