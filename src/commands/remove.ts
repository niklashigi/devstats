import chalk from 'chalk';

export default function remove(url?: string) {
  if (!url) {
    console.log(chalk.red('You have to specify an account URL to add.'));
    process.exit(1);
    return;
  }

  // TODO: Actually implement this command
  console.log(`Removed ${url}`);
}
