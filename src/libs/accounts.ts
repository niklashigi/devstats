import chalk from 'chalk';

import {Account} from '../accounts/account';

import {GitHubAccount} from '../accounts/github';
import {StackOverflowAccount} from '../accounts/stackoverflow';
import {WakaTimeAccount} from '../accounts/wakatime';
import {GitLabAccount} from '../accounts/gitlab';
import {ReverseEngineeringAccount} from '../accounts/stackexchange/reverseengineering';
import {HackerRankAccount} from '../accounts/hackerrank';

const accountTypes = [
  GitHubAccount,
  StackOverflowAccount,
  WakaTimeAccount,
  GitLabAccount,
  ReverseEngineeringAccount,
  HackerRankAccount,
];

export function resolveAccountUrl(url: string): Account {
  for (const accountType of accountTypes) {
    try {
      return new accountType(url);
    } catch { /**/ }
  }
  throw new Error(chalk`{bold ${url}} could not be resolved to an account!`);
}
