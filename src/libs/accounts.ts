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

const accounts = [
  'https://github.com/sindresorhus',
  'https://stackoverflow.com/users/6662225',
  'https://wakatime.com/@shroudedcode',
  'https://gitlab.com/nick.thomas',
  'https://reverseengineering.stackexchange.com/users/18014/paweł-Łukasik',
  'https://www.hackerrank.com/profile/uwi'
].map(url => {
  for (const accountType of accountTypes) {
    try {
      return new accountType(url);
    } catch { /**/ }
  }
  throw new Error(`${url} could not be resolved to an account!`);
}) as Account[];

export default accounts;
