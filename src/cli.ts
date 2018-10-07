import gar = require('gar');
import chalk from 'chalk';

import './libs/handle-errors';
import showUpdateNotification from './libs/update-notifier';

import show from './commands/show';
import add from './commands/add';
import remove from './commands/remove';

const args = gar(process.argv.slice(2));
const positionalArgs = args._ as string[];

if (Boolean(args.help)) {
  console.log(chalk`
  {blue Display the daily report for the current day:}

  {dim $} {bold devstats}

  {blue Switch between days interactively:}

  {dim $} {bold devstats} -i {dim or} {bold devstats} --interactive

  {blue Add an account:}

  {dim $} {bold devstats} add <site> <username/user-id>
  {grey {dim $} {bold devstats} add github shroudedcode}

  {dim $} {bold devstats} add <url>
  {grey {dim $} {bold devstats} add https://github.com/shroudedcode}

  {blue Remove an account:}

  {dim $} {bold devstats} remove <site> <username/user-id>
  {grey {dim $} {bold devstats} remove stackoverflow 6662225}

  {dim $} {bold devstats} remove <url>
  {grey {dim $} {bold devstats} remove https://stackoverflow.com/users/6662225}
  `);

  showUpdateNotification();
} else if (positionalArgs.length === 0) {
  show({
    interactive: Boolean(args.i || args.interactive),
    days: Number(args.d || args.days),
    week: Boolean(args.w || args.week),
  });
} else {
  const command = positionalArgs.shift() as string;
  const commandArgs = positionalArgs;

  if (command === 'add') {
    add(commandArgs);
  } else if (command === 'remove') {
    remove(commandArgs);
  } else {
    console.log(chalk`{red The subcommand {bold ${command}} could not be found!}`);
    process.exit(1);
  }
}
