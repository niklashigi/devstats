# devstats

# ![](https://user-images.githubusercontent.com/29176678/44999492-f17d4a80-afbd-11e8-965d-feb70142ac01.png)

> A CLI application that fetches stats from developer sites.


[![](https://img.shields.io/npm/v/devstats.svg)](https://www.npmjs.com/package/devstats)


DevStats is a CLI application written in TypeScript that fetches statistics from "developer sites" like StackOverflow, WakaTime and GitHub and displays them nicely.

## Installation

Install it globally using:

```console
$ npm install -g devstats
```

Or if you're using Yarn:

```console
$ yarn global add devstats
```

## Usage

Add accounts from the [supported sites](#supported-sites):

```console
$ devstats add https://github.com/shroudedcode
```

Display your daily report:

```console
$ devstats
```

Display your daily report and switch between days using your keyboard:

```console
$ devstats -i
```

### Full list of commands

From `devstats --help`:

```console
Display the daily report for the current day:

$ devstats

Display a summary of the current week:

$ devstats -w or devstats --week

Display a summary of the last <days> days:

$ devstats -d <days> or devstats --days <days>

Switch between days interactively:

$ devstats -i or devstats --interactive

Add an account:

$ devstats add <site> <username/user-id>
$ devstats add github shroudedcode

$ devstats add <url>
$ devstats add https://github.com/shroudedcode

Remove an account:

$ devstats remove <site> <username/user-id>
$ devstats remove stackoverflow 6662225

$ devstats remove <url>
$ devstats remove https://stackoverflow.com/users/6662225
```

### Supported sites

This is a list of sites currently supported by devstats. You can add your account using the name in parentheses.

- [GitHub](https://github.com) (`github`)
- [GitLab](https://gitlab.com) (`gitlab`)
- [StackOverflow](https://stackoverflow.com) (`stackoverflow`)
- [WakaTime](https://wakatime.com) (`wakatime`)
- [Hackerrank](https://hackerrank.com) (`hackerrank`)
- [Reverse Engineering SE](https://reverseengineering.stackexchange.com) (`reverseengineering`)
- [Code::Stats](https://codestats.net) (`codestats`)

Your favorite site is not on the list? Feel free to add support yourself and open a pull request.

## License

MIT © [Niklas Higi](https://shroudedcode.com)
