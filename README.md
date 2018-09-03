# devstats

> A CLI application that fetches stats from developer sites.

![](https://user-images.githubusercontent.com/29176678/44999492-f17d4a80-afbd-11e8-965d-feb70142ac01.png)

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

Switch between days interactively:

$ devstats -i or devstats --interactive

Add a new account through its URL:

$ devstats add <url>
$ devstats add https://github.com/shroudedcode

Remove an account through its URL:

$ devstats remove <url>
$ devstats remove https://stackoverflow.com/users/6662225
```

### Supported sites

- GitHub
- GitLab
- StackOverflow
- WakaTime
- Hackerrank
- Reverse Engineering SE

## License

MIT © [Niklas Higi](https://shroudedcode.com)
