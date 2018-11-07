import chalk from 'chalk';

import {Account} from '../accounts/account';

import {GitHubAccount} from '../accounts/github';
import {StackOverflowAccount} from '../accounts/stackoverflow';
import {WakaTimeAccount} from '../accounts/wakatime';
import {GitLabAccount} from '../accounts/gitlab';
import {ReverseEngineeringAccount} from '../accounts/stackexchange/reverseengineering';
import {HackerRankAccount} from '../accounts/hackerrank';
import {CodeStatsAccount} from '../accounts/codestats';

export interface AccountType {
  new(url: string): Account;
  title: string;
  aliases: string[];
  statistic: string;
  theme(str: string): string;
  resolveUrlToId(url: string): string;
}

const accountTypes = [
  GitHubAccount,
  StackOverflowAccount,
  WakaTimeAccount,
  GitLabAccount,
  ReverseEngineeringAccount,
  HackerRankAccount,
  CodeStatsAccount
] as any as AccountType[];

export function getAccountType(account: Account): AccountType {
  return (account as any).constructor;
}

export function resolveAccountUrl(url: string): Account {
  for (const accountType of accountTypes) {
    try {
      const id = accountType.resolveUrlToId(url);
      return new accountType(id);
    } catch { /**/ }
  }
  throw chalk`{bold ${url}} could not be resolved to an account!`;
}

export function resolveAccountTypeAndId(type: string, id: string): Account {
  for (const accountType of accountTypes) {
    if (accountType.aliases.includes(type.toLowerCase())) {
      return new accountType(id);
    }
  }
  throw chalk`The account type {bold ${type}} could not be found!`;
}

export function resolveAccountArguments(args: string[]) {
  if (args.length === 1) return resolveAccountUrl(args[0]);
  if (args.length === 2) return resolveAccountTypeAndId(args[0], args[1]);

  throw chalk`Invalid number of arguments!

  {reset {blue You can only call this command like this:}

  {dim $} {bold devstats} add/remove <site> <username/user-id>
  {dim $} {bold devstats} add/remove <url>

  {blue For a list of all commands and examples, run:}

  {dim $} {bold devstats} --help}`;
}
