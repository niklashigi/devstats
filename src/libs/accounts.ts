import {Account} from '../accounts/account';

import {GitHubAccount} from '../accounts/github';
import {StackOverflowAccount} from '../accounts/stackoverflow';
import {WakaTimeAccount} from '../accounts/wakatime';
import {GitLabAccount} from '../accounts/gitlab';
import {ReverseEngineeringAccount} from '../accounts/stackexchange/reverseengineering';
import {HackerRankAccount} from '../accounts/hackerrank';

const accounts: Account[] = [
  new GitHubAccount('sindresorhus'),
  new StackOverflowAccount(2901002),
  new WakaTimeAccount('shroudedcode'),
  new GitLabAccount('nick.thomas'),
  new ReverseEngineeringAccount(18014),
  new HackerRankAccount('uwi'),
];

export default accounts;
