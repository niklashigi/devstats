const {stdin, stdout} = process;
import * as readline from 'readline';

let lines = 0;

export function interactify() {
  stdin.setEncoding('utf8');
  stdin.setRawMode && stdin.setRawMode(true);
}

export function render(str: string) {
  if (lines) {
    readline.moveCursor(stdout, 0, -lines);
    readline.clearScreenDown(stdout);
  }

  lines = (str.match(/\n/g) || []).length;
  stdout.write(str);
}
