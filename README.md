# DevStats

DevStats is a CLI application written in TypeScript that fetches statistics from StackOverflow, WakaTime and GitHub and displays them. I wrote it as a prototype for an application I wrote during an internship, so I didn't worry about finishing it until [its demo on Asciinema](https://asciinema.org/a/170671) got featured and [someone hit me up on Twitter about it](https://twitter.com/pawel_lukasik/status/986572947795140608).

Unfortunately I don't have the time and motivation  to continue working on this project at the moment, but if anyone's interested in contributing: pull requests are welcome. Here are some things you could work on:

* make DevStats configurable (currently the accounts are hard-coded)
* fix the issue of incoming responses from other days overwriting stats of the current day
* implement proper error handling (currently errors are just caught and ignored)

To test out this package, install the dependencies using `npm install`, build the TypeScript code using `npm run build` and link the binary using `npm link`. You can then use the `devstats` CLI.

## License

MIT © [Niklas Higi](https://shroudedcode.com)
